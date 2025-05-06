export interface Driver {
  _id?:string;
  id: string;
  name: string;
  avatar?: string; // Already optional
  phone: string;
  license: string;
  experience: number;
  status: 'available' | 'on-trip' | 'off-duty';
  salary?: number;
}

export interface Truck {
  _id?:string;
  id: string;
  plateNumber: string;
  model: string;
  capacity: number;
  status: 'available' | 'on-trip' | 'maintenance';
  fuelLevel?: number; // Already made optional
  lastMaintenance?: string; // Changed from required to optional
  assignedDriverId?: string;
  monthlyExtraCosts?: {
    loadingCosts: number;
    challenge: number;
    otherManagementFees: number;
    otherFees: number;
  };
}

export interface Trip {
  _id?:string,
  id: string;
  truckId: string;
  driverId: string;
  cargoType: 'fuel' | 'diesel' | 'mazout';
  startLocation: string;
  destination: string;
  startDate: string;
  endDate?: string;
  status: 'planned' | 'in-progress' | 'completed' | 'cancelled';
  distance: number;
  revenue: number;
  expenses: {
    fuel: number;
    tolls: number;
    maintenance: number;
    other: number;
  };
  numBL?: number;
  equalization?: number;
  amountET?: number;
  mtqs?: number;
  pricePerLiter?: number;
  mtqsLiters?: number;
  missionFees?: number;
  managementFeesPercent?: number;
  observ?: string; // Ensuring this property exists in the Trip interface
}

export interface DashboardStats {
  activeTrucks: number;
  availableDrivers: number;
  ongoingTrips: number;
  totalRevenue: number;
  totalExpenses: number;
  fuelConsumption: number;
}

export const drivers: Driver[] = [
  {
    id: '1',
    name: 'Ahmed Khalil',
    avatar: '/placeholder.svg',
    phone: '+212 612345678',
    license: 'DL-78945',
    experience: 5,
    status: 'available',
    salary: 1100
  },
  {
    id: '2',
    name: 'Karim Benali',
    avatar: '/placeholder.svg',
    phone: '+212 623456789',
    license: 'DL-12378',
    experience: 7,
    status: 'on-trip',
    salary: 1200
  },
  {
    id: '3',
    name: 'Younes Moussaoui',
    avatar: '/placeholder.svg',
    phone: '+212 634567890',
    license: 'DL-65432',
    experience: 3,
    status: 'available',
    salary: 900
  },
  {
    id: '4',
    name: 'Samir Tazi',
    avatar: '/placeholder.svg',
    phone: '+212 645678901',
    license: 'DL-98765',
    experience: 10,
    status: 'off-duty',
    salary: 1400
  },
  {
    id: '5',
    name: 'Mehdi Belhaj',
    avatar: '/placeholder.svg',
    phone: '+212 656789012',
    license: 'DL-45678',
    experience: 6,
    status: 'available',
    salary: 1050
  },
  {
    id: '6',
    name: 'Rachid Amrani',
    avatar: '/placeholder.svg',
    phone: '+212 667890123',
    license: 'DL-34567',
    experience: 8,
    status: 'on-trip',
    salary: 1300
  },
  {
    id: '7',
    name: 'Jamal Idrissi',
    avatar: '/placeholder.svg',
    phone: '+212 678901234',
    license: 'DL-23456',
    experience: 4,
    status: 'off-duty',
    salary: 920
  },
  {
    id: '8',
    name: 'Omar Lahbabi',
    avatar: '/placeholder.svg',
    phone: '+212 689012345',
    license: 'DL-12345',
    experience: 9,
    status: 'available',
    salary: 1250
  },
  {
    id: '9',
    name: 'Youssef Benjelloun',
    avatar: '/placeholder.svg',
    phone: '+212 690123456',
    license: 'DL-87654',
    experience: 2,
    status: 'available',
    salary: 800
  },
  {
    id: '10',
    name: 'Fouad Zouheir',
    avatar: '/placeholder.svg',
    phone: '+212 601234567',
    license: 'DL-76543',
    experience: 7,
    status: 'on-trip',
    salary: 1180
  }
];

export const trucks: Truck[] = [
  {
    id: '1',
    plateNumber: 'ABC-123',
    model: 'Volvo FH16',
    capacity: 30000,
    status: 'available',
    fuelLevel: 85,
    lastMaintenance: '2025-03-15',
    assignedDriverId: '1'
  },
  {
    id: '2',
    plateNumber: 'DEF-456',
    model: 'Mercedes Actros',
    capacity: 25000,
    status: 'on-trip',
    fuelLevel: 65,
    lastMaintenance: '2025-04-01',
    assignedDriverId: '2'
  },
  {
    id: '3',
    plateNumber: 'GHI-789',
    model: 'Scania R500',
    capacity: 28000,
    status: 'maintenance',
    fuelLevel: 40,
    lastMaintenance: '2025-04-10'
  },
  {
    id: '4',
    plateNumber: 'JKL-012',
    model: 'MAN TGX',
    capacity: 32000,
    status: 'available',
    fuelLevel: 90,
    lastMaintenance: '2025-03-20',
    assignedDriverId: '3'
  },
  {
    id: '5',
    plateNumber: 'MNO-345',
    model: 'DAF XF',
    capacity: 29000,
    status: 'available',
    fuelLevel: 95,
    lastMaintenance: '2025-04-05',
    assignedDriverId: '5'
  },
  {
    id: '6',
    plateNumber: 'PQR-678',
    model: 'Iveco Stralis',
    capacity: 26000,
    status: 'on-trip',
    fuelLevel: 70,
    lastMaintenance: '2025-03-25',
    assignedDriverId: '6'
  },
  {
    id: '7',
    plateNumber: 'STU-901',
    model: 'Renault T High',
    capacity: 27000,
    status: 'maintenance',
    fuelLevel: 35,
    lastMaintenance: '2025-04-12'
  },
  {
    id: '8',
    plateNumber: 'VWX-234',
    model: 'Volvo FMX',
    capacity: 31000,
    status: 'available',
    fuelLevel: 88,
    lastMaintenance: '2025-03-18',
    assignedDriverId: '8'
  },
  {
    id: '9',
    plateNumber: 'YZA-567',
    model: 'Mercedes Arocs',
    capacity: 33000,
    status: 'on-trip',
    fuelLevel: 60,
    lastMaintenance: '2025-04-02',
    assignedDriverId: '10'
  },
  {
    id: '10',
    plateNumber: 'BCD-890',
    model: 'Scania G450',
    capacity: 30000,
    status: 'available',
    fuelLevel: 92,
    lastMaintenance: '2025-03-30',
    assignedDriverId: '9'
  }
];

export const trips: Trip[] = [
  {
    id: '1',
    truckId: '2',
    driverId: '2',
    cargoType: 'diesel',
    startLocation: 'Casablanca',
    destination: 'Marrakech',
    startDate: '2025-04-15T08:00:00',
    status: 'in-progress',
    distance: 240,
    revenue: 25000,
    expenses: {
      fuel: 3500,
      tolls: 750,
      maintenance: 0,
      other: 500
    },
    numBL: 0,
    equalization: 0,
    amountET: 0,
    mtqs: 0,
    missionFees: 0,
    managementFeesPercent: 0
  },
  {
    id: '2',
    truckId: '1',
    driverId: '1',
    cargoType: 'fuel',
    startLocation: 'Tangier',
    destination: 'Rabat',
    startDate: '2025-04-14T09:30:00',
    endDate: '2025-04-14T16:30:00',
    status: 'completed',
    distance: 250,
    revenue: 27000,
    expenses: {
      fuel: 3800,
      tolls: 800,
      maintenance: 1200,
      other: 300
    },
    numBL: 0,
    equalization: 0,
    amountET: 0,
    mtqs: 0,
    missionFees: 0,
    managementFeesPercent: 0
  },
  {
    id: '3',
    truckId: '4',
    driverId: '3',
    cargoType: 'mazout',
    startLocation: 'Agadir',
    destination: 'Casablanca',
    startDate: '2025-04-16T07:00:00',
    status: 'planned',
    distance: 460,
    revenue: 42000,
    expenses: {
      fuel: 6000,
      tolls: 1200,
      maintenance: 0,
      other: 800
    },
    numBL: 0,
    equalization: 0,
    amountET: 0,
    mtqs: 0,
    missionFees: 0,
    managementFeesPercent: 0
  },
  {
    id: '4',
    truckId: '6',
    driverId: '6',
    cargoType: 'fuel',
    startLocation: 'Fes',
    destination: 'Oujda',
    startDate: '2025-04-15T10:00:00',
    status: 'in-progress',
    distance: 320,
    revenue: 30000,
    expenses: {
      fuel: 4200,
      tolls: 900,
      maintenance: 0,
      other: 600
    },
    numBL: 0,
    equalization: 0,
    amountET: 0,
    mtqs: 0,
    missionFees: 0,
    managementFeesPercent: 0
  },
  {
    id: '5',
    truckId: '9',
    driverId: '10',
    cargoType: 'diesel',
    startLocation: 'Rabat',
    destination: 'Tangier',
    startDate: '2025-04-15T09:00:00',
    status: 'in-progress',
    distance: 250,
    revenue: 28000,
    expenses: {
      fuel: 3700,
      tolls: 850,
      maintenance: 0,
      other: 450
    },
    numBL: 0,
    equalization: 0,
    amountET: 0,
    mtqs: 0,
    missionFees: 0,
    managementFeesPercent: 0
  },
  {
    id: '6',
    truckId: '5',
    driverId: '5',
    cargoType: 'fuel',
    startLocation: 'Casablanca',
    destination: 'Agadir',
    startDate: '2025-04-12T08:30:00',
    endDate: '2025-04-13T17:30:00',
    status: 'completed',
    distance: 460,
    revenue: 45000,
    expenses: {
      fuel: 6500,
      tolls: 1300,
      maintenance: 800,
      other: 700
    },
    numBL: 0,
    equalization: 0,
    amountET: 0,
    mtqs: 0,
    missionFees: 0,
    managementFeesPercent: 0
  },
  {
    id: '7',
    truckId: '8',
    driverId: '8',
    cargoType: 'mazout',
    startLocation: 'Marrakech',
    destination: 'Tangier',
    startDate: '2025-04-17T07:30:00',
    status: 'planned',
    distance: 550,
    revenue: 52000,
    expenses: {
      fuel: 7200,
      tolls: 1500,
      maintenance: 0,
      other: 900
    },
    numBL: 0,
    equalization: 0,
    amountET: 0,
    mtqs: 0,
    missionFees: 0,
    managementFeesPercent: 0
  },
  {
    id: '8',
    truckId: '10',
    driverId: '9',
    cargoType: 'diesel',
    startLocation: 'Oujda',
    destination: 'Casablanca',
    startDate: '2025-04-18T06:00:00',
    status: 'planned',
    distance: 480,
    revenue: 44000,
    expenses: {
      fuel: 6300,
      tolls: 1100,
      maintenance: 0,
      other: 750
    },
    numBL: 0,
    equalization: 0,
    amountET: 0,
    mtqs: 0,
    missionFees: 0,
    managementFeesPercent: 0
  },
  {
    id: '9',
    truckId: '3',
    driverId: '4',
    cargoType: 'fuel',
    startLocation: 'Rabat',
    destination: 'Fes',
    startDate: '2025-04-10T09:00:00',
    endDate: '2025-04-10T16:00:00',
    status: 'completed',
    distance: 200,
    revenue: 22000,
    expenses: {
      fuel: 3000,
      tolls: 650,
      maintenance: 0,
      other: 400
    },
    numBL: 0,
    equalization: 0,
    amountET: 0,
    mtqs: 0,
    missionFees: 0,
    managementFeesPercent: 0
  },
  {
    id: '10',
    truckId: '7',
    driverId: '7',
    cargoType: 'mazout',
    startLocation: 'Tangier',
    destination: 'Marrakech',
    startDate: '2025-04-08T08:00:00',
    endDate: '2025-04-09T18:00:00',
    status: 'completed',
    distance: 520,
    revenue: 50000,
    expenses: {
      fuel: 7000,
      tolls: 1400,
      maintenance: 1500,
      other: 800
    },
    numBL: 0,
    equalization: 0,
    amountET: 0,
    mtqs: 0,
    missionFees: 0,
    managementFeesPercent: 0
  },
  {
    id: '11',
    truckId: '1',
    driverId: '1',
    cargoType: 'diesel',
    startLocation: 'Casablanca',
    destination: 'Fes',
    startDate: '2025-04-19T07:30:00',
    status: 'planned',
    distance: 280,
    revenue: 31000,
    expenses: {
      fuel: 4100,
      tolls: 850,
      maintenance: 0,
      other: 550
    },
    numBL: 0,
    equalization: 0,
    amountET: 0,
    mtqs: 0,
    missionFees: 0,
    managementFeesPercent: 0
  },
  {
    id: '12',
    truckId: '4',
    driverId: '3',
    cargoType: 'fuel',
    startLocation: 'Marrakech',
    destination: 'Rabat',
    startDate: '2025-04-20T08:00:00',
    status: 'planned',
    distance: 330,
    revenue: 33000,
    expenses: {
      fuel: 4500,
      tolls: 950,
      maintenance: 0,
      other: 600
    },
    numBL: 0,
    equalization: 0,
    amountET: 0,
    mtqs: 0,
    missionFees: 0,
    managementFeesPercent: 0
  }
];

/**
 * Monthly extra costs mock data for each truck and month key.
 * Key structure: `${truckId}-${YYYY}-${MM}`
 */
export const monthlyExtraCosts: Record<string, {
  escortFees: number;
  loadingCosts: number;
  challenge: number;
  otherManagementFees: number;
  otherFees: number;
}> = {};

// --- MOCK DATA for April 2025 for each truck (example) ---
trucks.forEach(truck => {
  monthlyExtraCosts[`${truck.id}-2025-04`] = {
    escortFees: 1200 + Number(truck.id) * 10,
    loadingCosts: 900 + Number(truck.id) * 5,
    challenge: 700 + Number(truck.id) * 2,
    otherManagementFees: 500 + Number(truck.id) * 3,
    otherFees: 300 + Number(truck.id) * 4,
  };
});

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomIntFuel(min: number = 12000000, max: number = 20000000): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

trips.forEach(trip => {
  trip.numBL = getRandomInt(120000, 300000);
  trip.equalization = getRandomInt(2000, 10000);
  const truck = trucks.find(t => t.id === trip.truckId);
  trip.amountET = truck && trip.equalization ? truck.capacity * trip.equalization : 0;
  trip.mtqs = 0;
  trip.missionFees = 1000000;
  trip.managementFeesPercent = 15;
  if (trip.expenses && typeof trip.expenses.fuel === "number") {
    trip.expenses.fuel = getRandomIntFuel();
  }
});

const totalAmountET = trips.reduce((sum, trip) => sum + (trip.amountET ?? 0), 0);

const totalManagementFees = trips.reduce(
  (sum, trip) => sum + ((Number(trip.amountET) * (Number(trip.managementFeesPercent) || 0)) / 100), 0
);

const totalMissionFees = trips.reduce((sum, trip) => sum + (trip.missionFees || 0), 0);
const totalMtqs = trips.reduce((sum, trip) => sum + (trip.mtqs || 0), 0);

const totalExpenses =
  trips.reduce(
    (sum, trip) =>
      sum +
      (trip.expenses.fuel || 0) +
      (trip.expenses.tolls || 0) +
      (trip.expenses.maintenance || 0) +
      (trip.expenses.other || 0),
    0
  ) +
  totalManagementFees +
  totalMissionFees +
  totalMtqs;

const netProfit = totalAmountET - totalExpenses;

export const dashboardStats: DashboardStats = {
  activeTrucks: trucks.filter(truck => truck.status !== 'maintenance').length,
  availableDrivers: drivers.filter(driver => driver.status === 'available').length,
  ongoingTrips: trips.filter(trip => trip.status === 'in-progress').length,
  totalRevenue: totalAmountET,         // Amount ET (capacity × equalization)
  totalExpenses: totalExpenses,        // All expenses as accounting in Finances
  fuelConsumption: trips.reduce((sum, trip) => sum + trip.expenses.fuel, 0)
};

export const dashboardNetProfit = netProfit;

export const getDriver = (id: string): Driver | undefined => {
  return drivers.find(driver => driver.id === id);
};

export const getTruck = (id: string): Truck | undefined => {
  return trucks.find(truck => truck.id === id);
};

export const getDriverName = (id: string): string => {
  const driver = getDriver(id);
  return driver ? driver.name : 'Unassigned';
};

export const getAvailableDrivers = (): Driver[] => {
  return drivers.filter(driver => driver.status === 'available');
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'available':
      return 'bg-green-500';
    case 'on-trip':
      return 'bg-blue-500';
    case 'maintenance':
      return 'bg-yellow-500';
    case 'off-duty':
      return 'bg-gray-500';
    case 'planned':
      return 'bg-purple-500';
    case 'in-progress':
      return 'bg-blue-500';
    case 'completed':
      return 'bg-green-500';
    case 'cancelled':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

export const getCargoTypeIcon = (type: string): string => {
  switch (type) {
    case 'fuel':
      return '⛽';
    case 'diesel':
      return '🛢️';
    case 'mazout':
      return '💧';
    default:
      return '📦';
  }
};

export const getTripsByTruckAndMonth = (truckId: string, month: Date): Trip[] => {
  return trips.filter(trip => {
    const tripDate = new Date(trip.startDate);
    return trip.truckId === truckId && 
           tripDate.getMonth() === month.getMonth() &&
           tripDate.getFullYear() === month.getFullYear();
  });
};

export const getTripsByDriver = (driverId: string): Trip[] => {
  return trips.filter(trip => trip.driverId === driverId);
};

export const updateTripDriver = (tripId: string, driverId: string): Trip | undefined => {
  const tripIndex = trips.findIndex(t => t.id === tripId);
  if (tripIndex >= 0) {
    trips[tripIndex] = { ...trips[tripIndex], driverId };
    return trips[tripIndex];
  }
  return undefined;
};
