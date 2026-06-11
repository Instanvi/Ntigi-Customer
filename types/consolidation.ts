/** Consolidation domain (aligns with mobile + POST /consolidations). */

export type TransitMode =
  | "all"
  | "ocean"
  | "bus_train"
  | "last_mile"
  | "door_to_door";

export type ConsolidationStatus =
  | "planning"
  | "in_transit"
  | "delayed"
  | "completed"
  | "cancelled";

export type VehicleType = "boat" | "plane" | "truck" | "train";

export type ConsolidationStop = {
  type: string;
  countryCode: string;
  countryName: string;
  address: string;
};

export type Consolidation = {
  id: string;
  /** @deprecated Prefer consolidation `id` for shipment links. */
  manifestId?: string | null;
  vehicleType: VehicleType;
  transitMode: TransitMode;
  origin: ConsolidationStop;
  destination: ConsolidationStop;
  carrier?: string;
  coCarrier?: string;
  carrierId?: string;
  cutOffDate?: string;
  departureTime?: string;
  arrivalTime?: string;
  status: ConsolidationStatus;
  flightNumber?: string;
  airwayBillNo?: string;
  consolidationNumber?: string;
  billOfLadingNo?: string;
  containerNumber?: string;
  vehiclePlateNo?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateConsolidationPayload = {
  vehicleType: VehicleType;
  transitMode: TransitMode;
  origin: ConsolidationStop;
  destination: ConsolidationStop;
  carrier?: string;
  coCarrier?: string;
  carrierId?: string;
  cutOffDate?: string;
  departureTime?: string;
  arrivalTime?: string;
  status?: ConsolidationStatus;
  flightNumber?: string;
  airwayBillNo?: string;
  consolidationNumber?: string;
  billOfLadingNo?: string;
  containerNumber?: string;
  vehiclePlateNo?: string;
  originStopId?: string;
  destinationStopId?: string;
  routeId?: string;
  vehicleId?: string;
  driverId?: string;
  /** Optional manifest payload cap (kg); overrides vehicle default when set. */
  maxPayloadWeightKg?: string;
};
