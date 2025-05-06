
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  DollarSign, 
  Download,
  Calendar,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCurrency, currencySymbols } from '@/components/layout/CurrencySettings';
import { useQuery } from '@tanstack/react-query';
import { financeService } from '@/services/financeService';
import { dashboardService } from '@/services/dashboardService';

const MONTHS = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

const YEARS = [2024, 2025];

const EXPENSE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#C026D3', '#525252'];

function formatAbbrevNumber(num: number): string {
  if (Math.abs(num) >= 1e9) {
    return (num / 1e9).toFixed(2).replace(/\.00$/, '') + 'B';
  }
  if (Math.abs(num) >= 1e6) {
    return (num / 1e6).toFixed(2).replace(/\.00$/, '') + 'M';
  }
  if (Math.abs(num) >= 1e3) {
    return (num / 1e3).toFixed(2).replace(/\.00$/, '') + 'K';
  }
  return num.toString();
}

function safeNumber(val: any): number {
  return isFinite(val) && !isNaN(val) ? val : 0;
}

const Finances = () => {
  const today = new Date();
  const defaultMonth = String(today.getMonth() + 1).padStart(2, '0');
  const defaultYear = today.getFullYear() > 2025 ? 2025 : today.getFullYear();
  const { t } = useTranslation();

  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
  const [selectedYear, setSelectedYear] = useState(defaultYear);

  const { currency } = useCurrency();
  const currencySymbol = currencySymbols[currency];

  // Format date range filters
  const startDate = useMemo(() => {
    return `${selectedYear}-${selectedMonth}-01`;
  }, [selectedYear, selectedMonth]);
  
  const endDate = useMemo(() => {
    // Last day of the month
    const lastDay = new Date(Number(selectedYear), Number(selectedMonth), 0).getDate();
    return `${selectedYear}-${selectedMonth}-${lastDay}`;
  }, [selectedYear, selectedMonth]);
  
  // Query for financial summary
  const { data: summaryData, isLoading: isLoadingSummary } = useQuery({
    queryKey: ['financeSummary', startDate, endDate],
    queryFn: () => financeService.getFinanceSummary({ startDate, endDate }),
  });
  
  // Query for finance categories breakdown
  const { data: categoriesData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['financeCategories', startDate, endDate],
    queryFn: () => financeService.getFinanceCategories({ startDate, endDate }),
  });
  
  // Query for yearly revenue overview
  const { data: yearlyData, isLoading: isLoadingYearly } = useQuery({
    queryKey: ['revenueOverview', selectedYear],
    queryFn: () => dashboardService.getRevenueOverview(selectedYear),
  });
  
  // Query for recent trips/transactions
  const { data: recentTrips, isLoading: isLoadingTrips } = useQuery({
    queryKey: ['dashboardRecentTrips'],
    queryFn: dashboardService.getRecentTrips,
  });

  // Format expenses by category data for pie chart
  const expenseData = useMemo(() => {
    if (!categoriesData) {
      return [];
    }
    
    // Group and transform data for pie chart
    return categoriesData
      .filter(item => item._id && item._id.type === 'expense')
      .map(item => ({
        name: item._id.category,
        value: item.total
      }));
  }, [categoriesData]);

  const totalExpenses = safeNumber(summaryData?.expenses);
  const totalRevenue = safeNumber(summaryData?.income);
  const netProfit = safeNumber(summaryData?.profit);
  const profitMargin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : '0.0';

  // Calculate management fees (assuming it's in the categories breakdown)
  const managementFeesTotal = useMemo(() => {
    if (!categoriesData) return 0;
    
    const managementFeeItem = categoriesData.find(
      item => item._id && item._id.type === 'expense' && item._id.category === 'Management Fees'
    );
    
    return safeNumber(managementFeeItem?.total);
  }, [categoriesData]);

  // Format monthly data from the yearly overview
  const monthlyData = useMemo(() => {
    if (!yearlyData) {
      return [];
    }
    
    return yearlyData.map(item => ({
      name: item.name.slice(0, 3),
      revenue: safeNumber(item.revenue),
      expenses: safeNumber(item.expense),
      profit: safeNumber(item.profit)
    }));
  }, [yearlyData]);

  // Format legend values
  const formatAmountLegend = (entry: { value: number }) => {
    return `${safeNumber(entry.value).toLocaleString()} ${currencySymbol}`;
  };

  // Filter trips for the selected month
  const filteredTrips = useMemo(() => {
    if (!recentTrips) return [];
    
    return recentTrips.filter(trip => {
      const tripDate = new Date(trip.startDate);
      const tripMonth = String(tripDate.getMonth() + 1).padStart(2, '0');
      const tripYear = tripDate.getFullYear();
      
      return tripMonth === selectedMonth && tripYear === selectedYear;
    });
  }, [recentTrips, selectedMonth, selectedYear]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t("FinancialOverview")}</h2>
          <p className="text-muted-foreground">
            {t("TrackFinances")}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="flex w-full sm:w-auto gap-2">
            <Select value={selectedYear.toString()} onValueChange={v => setSelectedYear(Number(v))}>
              <SelectTrigger className="w-full sm:w-[120px]">
                <SelectValue placeholder={t("SelectYear")} />
              </SelectTrigger>
              <SelectContent>
                {YEARS.map(year => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedMonth} onValueChange={v => setSelectedMonth(v)}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder={t("SelectMonth")} />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>{label} {selectedYear}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" className="flex items-center gap-1 w-full sm:w-auto">
            <Download className="h-4 w-4" />
            {t("Export")}
          </Button>
        </div>
      </div>

      {(isLoadingSummary) ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("TotalRevenue")}</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRevenue.toLocaleString()} {currencySymbol}</div>
              <p className="text-xs text-muted-foreground">
                {t("CalculatedAs")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("TotalExpenses")}</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalExpenses.toLocaleString()} {currencySymbol}</div>
              <p className="text-xs text-muted-foreground">
                {t("IncludingFees")}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("NetProfit")}</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{netProfit.toLocaleString()} {currencySymbol}</div>
              <p className="text-xs text-muted-foreground">
                {profitMargin}% {t("ProfitMargin")}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("TotalManagementFees")}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{managementFeesTotal.toLocaleString()} {currencySymbol}</div>
            <p className="text-xs text-muted-foreground">
              Read-only, calculated as {`Amount ET × % Management Fees`} (default 15%)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("AmountETCalculation")}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRevenue.toLocaleString()} {currencySymbol}</div>
            <p className="text-xs text-muted-foreground">
              Sum of (Truck capacity × Equalization) — read-only for all trips.
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Revenue vs Expenses</CardTitle>
            <CardDescription>
              Monthly financial performance ({selectedYear})
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            {isLoadingYearly ? (
              <div className="flex justify-center items-center h-[220px] sm:h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="h-[220px] sm:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    barCategoryGap="10%"
                    maxBarSize={36}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis 
                      tickFormatter={formatAbbrevNumber}
                      domain={[
                        0,
                        (dataMax: number) => Math.ceil(Number(dataMax) * 1.1)
                      ]}
                    />
                    <Tooltip 
                      formatter={(value: number) => `${safeNumber(value).toLocaleString()} ${currencySymbol}`}
                      labelFormatter={label => `${label}`}
                    />
                    <Legend 
                      formatter={(value: string) => {
                        if (monthlyData.length === 0) return value;
                        let legendVal = 0;
                        for (const row of monthlyData) {
                          legendVal += safeNumber(row[value as keyof typeof row] as number);
                        }
                        if (legendVal === 0) {
                          return <span>{value}</span>;
                        }
                        return (
                          <span>
                            {value}
                            {" "}
                            (<span className="font-mono">{formatAbbrevNumber(legendVal)}</span>)
                          </span>
                        );
                      }}
                    />
                    <Bar dataKey="revenue" fill="#3b82f6" name="Amount ET" />
                    <Bar dataKey="expenses" fill="#ef4444" name="Expenses (inc. fees)" />
                    <Bar dataKey="profit" fill="#10b981" name="Profit" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-4 grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
          <Card className="flex-1 min-w-0">
            <CardHeader>
              <CardTitle>Expense Breakdown</CardTitle>
              <CardDescription>Operational expenses by category (inc. all fees)</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingCategories ? (
                <div className="flex justify-center items-center h-[220px]">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="flex flex-col items-center w-full gap-4">
                  <div className="flex justify-center items-center w-full">
                    <ResponsiveContainer width="100%" height={180}>
                      <PieChart>
                        <Pie
                          data={expenseData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={70}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {expenseData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value, name, props) => {
                            const total = expenseData.reduce((a, b) => a + safeNumber(b.value), 0) || 1;
                            const percent = value ? (Number(value) / total) * 100 : 0;
                            return [
                              `${safeNumber(value).toLocaleString()} ${currencySymbol} (${percent.toFixed(0)}%)`,
                              name
                            ];
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-full flex flex-wrap justify-center gap-2 mt-2">
                    {expenseData.map((entry, index) => (
                      <div
                        key={entry.name}
                        className="flex items-center gap-2 px-2 py-1 rounded-md bg-muted/40 text-xs mb-1"
                        style={{ minWidth: "120px" }}
                      >
                        <span
                          className="inline-block w-3 h-3 rounded-full"
                          style={{ backgroundColor: EXPENSE_COLORS[index % EXPENSE_COLORS.length] }}
                          aria-label={entry.name}
                        />
                        <span className="font-medium truncate flex-1">{entry.name}</span>
                        <span className="text-muted-foreground tabular-nums font-mono">
                          {formatAmountLegend(entry)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          <Card className="flex-1 min-w-0">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest trips with calculated values</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingTrips ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTrips
                    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
                    .slice(0, 3)
                    .map(trip => {
                      // Calculate management fee (assuming 15% if not specified)
                      const managementFeePercent = trip.managementFeesPercent || 15;
                      const managementFee = (trip.revenue || 0) * (managementFeePercent / 100);
                      return (
                        <div key={trip._id || trip.id} className="flex flex-col sm:flex-row sm:items-center justify-between border-b last:border-0 pb-3 last:pb-0 gap-2">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              trip.status === 'completed' ? 'bg-green-100 text-green-600' :
                              trip.status === 'in-progress' ? 'bg-blue-100 text-blue-600' :
                              'bg-purple-100 text-purple-600'
                            }`}>
                              <Calendar className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="font-medium">{trip.startLocation} - {trip.destination}</div>
                              <div className="text-sm text-muted-foreground">
                                {new Date(trip.startDate).toLocaleDateString()}
                                <br />
                                <span>
                                  <span className="font-bold">Revenue:</span> {trip.revenue?.toLocaleString()} {currencySymbol}&nbsp;
                                  <span className="ml-2 font-bold">Mgmt Fee:</span> {managementFee.toLocaleString()} {currencySymbol}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{trip.revenue?.toLocaleString()} {currencySymbol}</div>
                            <div className="text-sm text-muted-foreground">
                              Revenue
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  {filteredTrips.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                      No transactions for this period.
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Finances;
