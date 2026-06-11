import { ConfigurationItem } from "./configuration";

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export interface ApiErrorResponse {
  success: false;
  error: string;
  errorCode: string;
  details?: {
    statusCode: number;
    errorCode: string;
    details: unknown;
    isOperational: boolean;
  } | null;
  stack?: string;
}

export interface AuthUser {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string | null;
  role: UserRole;
  agencyId: string | null;
  agencyName: string | null;
  agencyLogo?: string | null;
  avatarUrl?: string | null;
  branchId: string | null;
  branchName: string | null;
  /** Branch-scoped permission bundle (`branch_roles`). */
  branchRoleId?: string | null;
  /** Effective permission codes from login / refresh. */
  permissions?: string[];
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface CheckUserResponse {
  exists: boolean;
  hasPassword: boolean;
  role: UserRole;
  id?: string;
  fullName?: string;
  phoneNumber?: string;
  email?: string | null;
  branchId?: string | null;
  branchName?: string | null;
  agencyId?: string | null;
  agencyName?: string | null;
  agencyLogo?: string | null;
}

export type ApiPaginatedResponse<T> = {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export interface Client {
  id: string;
  agencyId: string;
  fullName: string;
  phoneNumber: string;
  email: string | null;
  secondaryPhone?: string | null;
  website?: string | null;
  /** Trade receivables sub-ledger (`chart_of_accounts`). */
  ledgerAccountId?: string | null;
  address: string | null;
  postalCode?: string | null;
  companyName?: string | null;
  city?: string | null;
  region?: string | null;
  countryCode?: string | null;
  taxId?: string | null;
  notes?: string | null;
  customerCategoryId?: string | null;
  clientType?: "INDIVIDUAL" | "BUSINESS";
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Shipment {
  id: string;
  trackingNo: string;
  senderId: string;
  receiverId: string;
  originId: string;
  destinationId: string;
  /** Branch where the shipment was created (may differ from origin stop). */
  branchId?: string | null;
  createdById: string;
  totalCost: string;
  totalWeight: string | null;
  isNetworkBooking: boolean;
  description: string | null;
  status:
    | "PENDING"
    | "PICKED_UP"
    | "IN_TRANSIT"
    | "ARRIVED"
    | "DELIVERED"
    | "CANCELLED"
    | "RETURNED";
  category?: "ORDER" | "CONSOLIDATION" | "DIRECT";
  /** @deprecated Legacy; links use `consolidationId` / `manifest.consolidation`. */
  manifestId?: string | null;
  consolidationId?: string | null;
  /** Clearing sub-ledger (`chart_of_accounts`) for GL / journals. */
  ledgerAccountId?: string | null;

  // Advanced fields
  typeOfShipment?: string;
  courier?: string;
  mode?: "MARITIME" | "AIR" | "LAND" | "SEA" | "BIKE" | "MULTIMODAL";
  product?: string;
  quantity?: string;
  paymentMode?: string;
  /** Agency that owns the booking (for network / reporting). */
  senderAgencyId?: string | null;
  senderAgency?: Agency | null;
  /** Linehaul / vessel label from `manifest.consolidation.carrier` when the shipment is on a manifest (API convenience). */
  carrier?: string;
  /** Reference from `manifest.consolidation.carrier` when present. */
  carrierRefNo?: string;
  carrierType?: "LAND" | "AIR" | "SEA";
  trackingProvider?: string;
  driverName?: string;
  driverCardNo?: string;
  vehiclePlateNo?: string;
  flightNumber?: string;
  airwayBillNo?: string;
  billOfLadingNo?: string;
  consolidationNumber?: string;
  containerNumber?: string;
  departureTime?: Date | string;
  pickupTime?: string;
  pickupDate?: Date | string;
  pickupAddress?: string | null;
  expectedDeliveryDate?: Date | string;
  comments?: string;
  overallValue?: string;

  /** Last-mile add-on (door delivery after destination branch). */
  lastMileEnabled?: boolean;
  /** FK to configuration `delivery_modes`. */
  lastMileDeliveryModeId?: string | null;
  lastMileStopId?: string | null;
  lastMileAddress?: string | null;
  lastMileLat?: string | null;
  lastMileLng?: string | null;
  lastMileAudioUrl?: string | null;
  lastMileAudioText?: string | null;

  // Soft delete tracking
  isDeleted?: boolean;
  deletedById?: string;
  deletedAt?: Date | string;

  // Clearance fields
  processTemplateId?: string | null;
  clearedAt?: Date | string | null;
  clearedById?: string | null;

  createdAt: Date;
  updatedAt: Date;
}

export interface ShipmentCarrierProfile {
  id: string;
  shipmentId: string;
  carrierType: "LAND" | "AIR" | "SEA";
  carrierName: string;
  referenceNo: string;
  trackingProvider?: string | null;
  driverName?: string | null;
  driverCardNo?: string | null;
  vehiclePlateNo?: string | null;
  flightNumber?: string | null;
  airwayBillNo?: string | null;
  billOfLadingNo?: string | null;
  consolidationNumber?: string | null;
  containerNumber?: string | null;
  trackingStatus?: string | null;
  trackingLastSyncAt?: string | Date | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Package {
  id: string;
  shipmentId: string;
  packageNo?: string | null;
  /** No per-package status — use the parent {@link Shipment.status}. */
  description: string;
  imageUrl?: string | null;
  packageImageUrl?: string | null;
  qty?: string | null;
  pieceType?: string | null;
  length?: string | null;
  width?: string | null;
  height?: string | null;
  weight?: string | null;
  category?: string | null;
  value?: string | null;
  cost?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShipmentWithRelations extends Shipment {
  sender: Client;
  receiver: Client;
  origin: Stop;
  destination: Stop;
  packages?: Package[];
  transactions?: Transaction[];
  manifest?: (Record<string, JsonValue> & { consolidation: ConsolidationWithRelations }) | null;
  createdBy?: User;
  clearedBy?: User | null;
  /** Populated when `routeId` is set; corridor may still be resolved for quotes when null. */
  route?: Route | null;
  packageType?: PackageType | null;
  carrierProfiles?: ShipmentCarrierProfile[];
  /** Populated when shipment is assigned to a voyage. */
  voyage?: {
    id?: string;
    voyageNo?: string;
    name?: string;
    arrivalTime?: string | Date | null;
    departureTime?: string | Date | null;
    carrier?: ShipmentCarrierProfile | null;
    trackingLogs?: unknown[];
  } | null;
  currentHolder?: {
    type: "BRANCH" | "VEHICLE" | "CLIENT";
    data: Record<string, JsonValue>;
  };
}

export interface Vehicle {
  id: string;
  agencyId: string;
  plateNumber: string;
  imei: string | null;
  type: "BIKE" | "VAN" | "BUS" | "TRUCK";
  status: "AVAILABLE" | "IN_TRANSIT" | "MAINTENANCE";
  isTrackable: boolean;
  /** Fleet-configured payload cap (kg); when null, UI/API use defaults by `type`. */
  maxPayloadWeightKg?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole =
  | "SYSTEM_ADMIN"
  | "GENERAL_MANAGER"
  | "MANAGER"
  | "AGENT"
  | "DRIVER"
  | "CUSTOMS_AGENT"
  | "CLIENT";

export interface Manifest {
  id: string;
  manifestNo: string;
  expiresAt?: string | Date | null;
  consolidation: {
    vehicle: { plateNumber: string; type: string } | null;
    driver: { fullName: string } | null;
    origin: { name: string } | null;
    destination: { name: string } | null;
    departureTime: string | null;
    arrivalTime: string | null;
  } | null;
  createdAt: string;
}

export interface User {
  id: string;
  branchId: string | null;
  agencyId: string | null;
  fullName: string;
  phoneNumber: string;
  email: string | null;
  role: UserRole;
  branchRoleId?: string | null;
  licenseNumber: string | null;
  suspendedAt: string | Date | null;
  lastLoginAt: string | Date | null;
  lastLoginLocation: string | null;
  branch?: {
    id: string;
    name: string;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Agency {
  id: string;
  name: string;
  slug: string;
  taxId: string;
  logoUrl: string | null;
  baseCurrency: string;
  fiscalAddress: string;
  phoneNumber: string | null;
  email: string | null;
  status?: "ACTIVE" | "SUSPENDED" | "INACTIVE" | "PENDING";
  notificationApiKey: string | null;
  notificationApiSecret: string | null;
  paymentApiKey: string | null;
  paymentApiSecret: string | null;
  createdAt: Date;
  updatedAt: Date;
  rating?: number;
  totalRatings?: number;
}

export interface Stop {
  id: string;
  agencyId: string;
  name: string;
  slug: string;
  city: string;
  country?: string | null;
  countryCode?: string | null;
  region?: string | null;
  latitude: string | null;
  longitude: string | null;
  phoneNumber: string | null;
  email: string | null;
  /** Matches backend `stop_type` enum (optional for older cached payloads). */
  stopType?: "BRANCH" | "STOP" | "AIRPORT" | "SEAPORT" | "WAREHOUSE";
  /** IATA (3) or ICAO (4) when `stopType` is AIRPORT. */
  airportCode?: string | null;
  /** UN/LOCODE when `stopType` is SEAPORT. */
  seaportLocode?: string | null;
  agency?: Agency;
  addresses?: StopAddress[];
  currencyId?: string | null;
  currency?: LocationCurrency | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface LocationCurrency {
  id: string;
  agencyId: string;
  branchId: string | null;
  name: string;
  description: string | null;
  code: string;
  symbol: string | null;
  exchangeRateToBase: string | null;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface StopAddress {
  id: string;
  stopId: string;
  name: string;
  address: string;
  city: string | null;
  latitude: string | null;
  longitude: string | null;
  phoneNumber: string | null;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Consolidation {
  id: string;
  agencyId?: string;
  branchId?: string | null;
  /** Stable public code for lists and tracking (e.g. TRP-20260415-A1B2C3). */
  consolidationNo: string;
  /** Human-friendly title; may mirror route or vessel. */
  name: string | null;
  routeId?: string | null;
  /** Null for linehaul / consolidation consolidations with no fleet vehicle (carrier on `consolidation_carriers`). */
  vehicleId: string | null;
  driverId: string;
  trackerDeviceId?: string | null;
  originId: string | null;
  destinationId: string | null;
  departureTime: Date | string | null;
  arrivalTime: Date | string | null;
  /** Consolidation booking cut-off. */
  cutOffAt?: Date | string | null;
  /** Mobile consolidation lifecycle: planning | in_transit | delayed | completed | cancelled. */
  consolidationStatus?: string | null;
  /** Optional per-consolidation payload cap (kg). */
  maxPayloadWeightKg?: string | null;
  /** ShipsGo (air/ocean) — set when consolidation is created with AWB or BOL/container. */
  externalTrackingProvider?: string | null;
  externalTrackingReference?: string | null;
  externalTrackingShipmentId?: number | null;
  externalTrackingPayload?: Record<string, unknown> | null;
  externalTrackingSyncedAt?: Date | string | null;
  /** Linehaul refs from voyage_carriers (list/detail). */
  flightNumber?: string | null;
  airwayBillNo?: string | null;
  voyageNumber?: string | null;
  billOfLadingNo?: string | null;
  containerNumber?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ConsolidationWithRelations extends Consolidation {
  vehicle?: Vehicle | null;
  driver: User;
  route?: Route | null;
  origin?: Stop | null;
  destination?: Stop | null;
  manifests?: Array<{
    id: string;
    manifestNo: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    shipments?: Array<{
      id: string;
      trackingNo: string;
      status?: string;
    }>;
  }>;
}

export interface Route {
  id: string;
  agencyId: string;
  name: string;
  description?: string | null;
  originId: string;
  destinationId: string;
  isReversible?: boolean;
  /** Auto-created return corridor (paired with a forward save). */
  isReversed?: boolean;
  /** When false, corridor is paused (hidden from network search; quotes blocked). */
  isActive?: boolean;
  defaultPrice: string;
  /** Optional corridor labels (ISO 3166-1 alpha-2 for *CountryCode). */
  originCountry?: string | null;
  originCountryCode?: string | null;
  originCounty?: string | null;
  destinationCountry?: string | null;
  destinationCountryCode?: string | null;
  destinationCounty?: string | null;
  durationMinutes?: number | null;
  transportMode?:
    | "MARITIME"
    | "AIR"
    | "LAND"
    | "SEA"
    | "BIKE"
    | "MULTIMODAL"
    | null;
  /** Terms and conditions for this specific corridor. */
  terms?: string | null;
  /** L×W×H(cm)÷divisor — null uses default by transport mode */
  volumetricDivisor?: number | null;
  fuelSurchargeRate?: string | null;
  handlingFeeFlat?: string | null;
  localitySurchargeFlat?: string | null;
  /** Routes saved together in one pricing batch (main corridor + linked route legs). */
  pricingPathGroupId?: string | null;
  /** Pricing validity start (ISO date string). */
  validFrom?: string | null;
  /** Pricing expiry date (ISO date string). */
  validUntil?: string | null;
  origin?: Stop;
  destination?: Stop;
  agency?: Agency;
  routeLegs?: RouteLeg[];
  /** Present on GET /routes/search — published rated pricing snapshot */
  ratedPricingSummary?: RouteRatedPricingSearchSummary | null;
  /**
   * Present on GET /routes/search — per-leg overrides (package rates, leg-scoped weight tiers, terms).
   * Join to `routeLegs` by `routeLegId`.
   */
  legRatedPricing?: RouteSearchLegRatedPricing | null;
  /** Present when row came from `GET /pricing/models/quote/search` with segment pricing. */
  networkPathQuote?: NetworkPathQuote | null;
  /**
   * Active consolidations on this corridor from the same quote/search response
   * (not completed/cancelled, arrival not in the past).
   */
  networkActiveConsolidations?: NetworkActiveConsolidation[] | null;
  /** Present on quote/search — ShipsGo / active voyage verification. */
  trackingVerification?: "verified" | "unverified" | "none";
  createdAt: Date;
  updatedAt: Date;
}

/** GET /routes/search — per-leg rated stack (mirrors backend bundle). */
export interface RouteSearchLegRatedPricing {
  packageRates: Array<{
    routeLegId: string;
    packageTypeId: string;
    packageTypeLabel: string;
    unitType: string;
    pricePerUnit: string;
    minimumCharge: string | null;
    currency: string;
    fuelSurchargeRate: string | null;
    handlingFeeFlat: string | null;
    localitySurchargeFlat: string | null;
    ratePricingEntries: Array<{
      rateClassId: string | null;
      price: string;
    }>;
  }>;
  terms: Array<{
    id: string;
    routeLegId: string;
    title: string | null;
    termsText: string;
  }>;
}

/** Mirrors backend `RouteRatedPricingSearchSummary` (route search enrichment). */
export interface RouteRatedPricingSearchSummary {
  packages: Array<{
    packageTypeId: string;
    packageTypeLabel: string;
    unitType: string;
    pricePerUnit: string;
    minimumCharge: string | null;
    currency: string;
    ratePricingCount: number;
    ratePricingEntries?: Array<{
      rateClassId: string | null;
      price: string;
    }>;
  }>;
  /** JSON key name is historical; values are corridor fee rules from `route_fee_rules` (agency-defined codes/labels). */
  stackingFees?: Array<{
    code: string;
    label: string | null;
    calcType: string;
    value: string;
    currency: string;
    applyTo: string;
    enabled: boolean;
    sortOrder: number;
  }>;
  perLegPackageRateCount: number;
  legTermsCount: number;
}

export interface PackageType {
  id: string;
  agencyId: string;
  label: string;
  unitType: "WEIGHT" | "VOLUME" | "FLAT_RATE";
  pricePerUnit: string;
  handlingNotes: string | null;
  defaultLength?: string | null;
  defaultWidth?: string | null;
  defaultHeight?: string | null;
  volumetricDivisor?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  shipmentId: string;
  method: "CASH" | "CASH_ON_DELIVERY" | "MOBILE_MONEY";
  amount: string;
  taxAmount: string;
  provider: "MTN" | "ORANGE" | null;
  paymentPhone: string | null;
  status: "PENDING" | "COMPLETED" | "FAILED";
  shipmentInvoiceId?: string | null;
  /** Present when joined from `shipment_invoices` (list endpoint). */
  invoiceNo?: string | null;
  paymentAllocation?: string | null;
  /** Classifies the transaction as a payment, refund, or adjustment. Defaults to PAYMENT when absent. */
  entryKind?: "PAYMENT" | "REFUND" | "ADJUSTMENT" | null;
  memo?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/** GET /shipments/:trackingNo/payment-summary */
export interface ShipmentInvoiceSummaryRow {
  id: string;
  invoiceNo: string;
  status: string;
  currency: string;
  totalAmount: string;
  paidAmount: string;
  outstandingAmount: string;
  dueDate: string | Date | null;
  issuedAt: string | Date | null;
  installmentPlan: unknown;
  notes: string | null;
  createdAt: string | Date;
}

export interface ShipmentPaymentSummary {
  shipmentId: string;
  trackingNo: string;
  totalCost: string;
  paymentMode: string | null;
  paidTotal: string;
  balanceOutstanding: string;
  invoices: ShipmentInvoiceSummaryRow[];
}

export interface ProcessTemplate {
  id: string;
  name: string;
  description: string | null;
}

export interface ProcessNode {
  id: string;
  type: "GROUP" | "DOCUMENT" | "PAYMENT" | "TASK";
  title: string;
  description?: string | null;
  orderSequence: number;
  parentId?: string | null;
  documentTypeId?: string | null;
  documentType?: {
    id?: string;
    name: string;
    documentStatuses: Array<{ id: string; name: string }>;
  } | null;
}

export interface ClearanceStepHistoryEntry {
  nodeId: string;
  completedAt: string;
  completedBy?: string | null;
}

export interface ShipmentClearanceProcess {
  id: string | null;
  currentStage: string | null;
  stepHistory: ClearanceStepHistoryEntry[];
  completedNodeIds: string[];
}

export interface ShipmentClearance {
  template: ProcessTemplate | null;
  nodes: ProcessNode[];
  process?: ShipmentClearanceProcess;
  authority: ConfigurationItem | null;
  status: ConfigurationItem | null;
  municipalityStatus: ConfigurationItem | null;
  inspectionTypes: ConfigurationItem[];
  customerCategories: ConfigurationItem[];
  rawComments: string;
}

export interface ShipmentCustomTab {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  metadata?: string | null;
  documentTypeId?: string | null;
  kind: "particular" | "shipment_type" | "incoterm" | "process_template" | "inspection" | "last_mile" | "consolidation" | "other";
}

/** GET /shipments/invoices — agency-scoped commercial invoices. */
export interface ShipmentInvoiceListRow {
  id: string;
  shipmentId: string;
  trackingNo: string;
  invoiceNo: string;
  currency: string;
  totalAmount: string;
  status: string;
  dueDate: string | Date | null;
  issuedAt: string | Date | null;
  createdAt: string | Date;
  paidAmount: string;
  outstandingAmount: string;
  notes?: string | null;
  /** Sender (customer) display name when available */
  customerName?: string | null;
}

export interface ShipmentPhoto {
  id: string;
  shipmentId: string;
  imageUrl: string;
  stage: "INTAKE" | "DELIVERY";
  createdAt: Date;
  updatedAt: Date;
}

export interface TrackingLog {
  id: number;
  vehicleId: string;
  consolidationId: string | null;
  latitude: string;
  longitude: string;
  timestamp: Date;
}

export interface Notification {
  id: string;
  type: "SYSTEM" | "AGENCY" | "BRANCH" | "USER";
  title: string;
  content: string;
  agencyId: string | null;
  branchId: string | null;
  userId: string | null;
  metadata: unknown;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Paginated<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page?: string;
  limit?: string;
}

export interface SearchParams extends PaginationParams {
  search?: string;
  /** Filter stops/branches by ISO country code (e.g. CM) */
  countryCode?: string;
  /** Filter by region (partial match) */
  region?: string;
  [key: string]: string | string[] | undefined;
}
export interface RouteLeg {
  id: string;
  routeId: string;
  originId: string;
  destinationId: string;
  transportMode: "MARITIME" | "AIR" | "LAND" | "SEA" | "BIKE" | "MULTIMODAL";
  order: number;
  estDurationMins?: number | null;
  estDurationValue?: number | string | null;
  estDurationUnit?: string | null;
  origin?: Stop;
  destination?: Stop;
  createdAt: Date;
  updatedAt: Date;
}

/** Active consolidations linked to a corridor from network quote search (ISO date strings). */
export interface NetworkActiveConsolidation {
  id: string;
  consolidationNo: string;
  name: string | null;
  /** Consolidation booking cut-off — primary “expiry” for the consolidation. */
  cutOffAt: string | null;
  departureTime: string | null;
  arrivalTime: string | null;
  consolidationStatus: string | null;
  createdAt: string;
  carrier?: string | null;
  carrierType?: string | null;
  flightNumber?: string | null;
  airwayBillNo?: string | null;
  voyageNumber?: string | null;
  billOfLadingNo?: string | null;
  containerNumber?: string | null;
  externalTrackingProvider?: string | null;
  externalTrackingShipmentId?: number | null;
}

/** Per-leg rows from quote/search (includes surcharges + weight band when API sends them). */
export type NetworkPathQuoteLegRow = {
  legId: string;
  sequence: number;
  originName: string | null;
  destinationName: string | null;
  mode: string | null;
  base: number;
  fees: number;
  subtotal: number;
  surchargeLines?: Array<{
    name: string;
    type: string;
    value: string;
    amount: number;
  }>;
  ratePricing?: {
    rateClassId: string | null;
    price: string;
  } | null;
  estDurationValue?: number | null;
  estDurationUnit?: string | null;
};

/** Server-computed quote for a matched origin→destination segment on a corridor (network explorer). */
export interface NetworkPathQuote {
  startSeq: number;
  endSeq: number;
  quotedWeightKg: number;
  grandTotal: number;
  currency: string;
  legBreakdown: Array<{
    leg: string;
    mode?: string;
    base: number;
    fees: number;
    subtotal: number;
  }>;
  /** Full `pathLegs` from quote/search (surcharge lines + weight bracket). */
  pathLegs?: NetworkPathQuoteLegRow[];
  /** Synthetic legs for the matched segment (itinerary + per-hop amounts). */
  segmentLegs: RouteLeg[];
}

export interface ShipmentLeg {
  id: string;
  shipmentId: string;
  manifestId: string;
  order: number;
  departureTime?: Date | string | null;
  arrivalTime?: Date | string | null;
  manifest?: Manifest;
  createdAt: Date;
  updatedAt: Date;
}

export type LostParcelStatus = "OPEN" | "CLAIMED" | "DISPOSED";

export interface LostParcel {
  id: string;
  agencyId: string;
  branchId: string;
  referenceNo: string;
  description: string;
  imageUrls: string[];
  length: string | null;
  width: string | null;
  height: string | null;
  weight: string | null;
  color: string | null;
  markings: string | null;
  foundAt: string;
  status: LostParcelStatus;
  claimedAt: string | null;
  claimedNote: string | null;
  branchName: string | null;
  branchCity: string | null;
  createdAt: string;
  updatedAt: string;
}

export * from "./configuration";
