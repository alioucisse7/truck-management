
import * as z from "zod";

// Truck form schema
export const truckFormSchema = z.object({
  plateNumber: z.string().min(1, "Plate number is required"),
  model: z.string().min(1, "Model is required"),
  capacity: z.coerce.number().min(1, "Capacity must be greater than 0"),
  status: z.enum(["available", "on-trip", "maintenance"]),
  fuelLevel: z.coerce.number().min(0, "Fuel level must be between 0 and 100").max(100, "Fuel level must be between 0 and 100"),
  lastMaintenance: z.string().min(1, "Last maintenance date is required"),
  assignedDriverId: z.string(), // This accepts any non-empty string including "none"
  monthlyExtraCosts: z.object({
    loadingCosts: z.coerce.number().min(0, "loading cost must be a valid number").default(0),
    challenge: z.coerce.number().min(0, "Tolls expense must be a valid number").default(0),
    otherManagementFees: z.coerce.number().min(0, "Other Management fees must be a valid number").default(0),
    otherFees: z.coerce.number().min(0, "Other expenses must be a valid number").default(0),
  }).default({
    loadingCosts: 0,
    challenge: 0,
    otherManagementFees: 0,
    otherFees: 0
  }),
});

// Driver form schema
export const driverFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(1, "Phone is required"),
  license: z.string().min(1, "License is required"),
  // Fix: Ensure experience is always a number
  experience: z.coerce
    .number({ invalid_type_error: "Must be a number" })
    .min(0, "Experience must be at least 0"),
  status: z.enum(["available", "on-trip", "off-duty"]),
  // Fix: Properly handle salary as a number or undefined
  salary: z.coerce
    .number({ invalid_type_error: "Must be a number" })
    .min(0, "Salary must be at least 0")
    .optional(),
});

// Trip form schema
export const tripFormSchema = z.object({
  truckId: z.string().min(1, "Truck is required"),
  driverId: z.string().min(1, "Driver is required"),
  cargoType: z.enum(["fuel", "diesel", "mazout"]),
  startLocation: z.string().min(1, "Start location is required"),
  destination: z.string().min(1, "Destination is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  status: z.enum(["planned", "in-progress", "completed", "cancelled"]),
  distance: z.coerce.number().min(1, "Distance must be greater than 0"),
  revenue: z.coerce.number().min(0, "Revenue must be a valid number"),
  expenses: z.object({
    // Fix: Ensure all expense fields default to 0
    fuel: z.coerce.number().min(0, "Fuel expense must be a valid number").default(0),
    tolls: z.coerce.number().min(0, "Tolls expense must be a valid number").default(0),
    maintenance: z.coerce.number().min(0, "Maintenance expense must be a valid number").default(0),
    other: z.coerce.number().min(0, "Other expenses must be a valid number").default(0),
  }).default({
    fuel: 0,
    tolls: 0,
    maintenance: 0,
    other: 0
  }),
  numBL: z.coerce.number().min(0, "Num of BL must be a valid number").default(0),
  equalization: z.coerce.number().min(0, "Equalization must be a valid number").default(0),
  amountET: z.coerce.number().min(0, "Amount E.T must be a valid number").default(0),
  mtqs: z.coerce.number().min(0, "Mtqs must be a valid number").default(0),
  pricePerLiter: z.coerce.number().min(0, "Mtqs must be a valid number").default(0),
  mtqsLiters: z.coerce.number().min(0, "Mtqs must be a valid number").default(0),
  missionFees: z.coerce.number().min(0, "Mission fees must be a valid number").default(0),
  // New field for management fees percentage
  managementFeesPercent: z.coerce.number().min(0, "Pourcentage must be valid").max(100, "Max 100%").default(0).optional(),
  observ: z.string().optional(),
});
