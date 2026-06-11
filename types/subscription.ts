export interface SubscriptionPlanRow {
  id: string;
  code: string;
  name: string;
  currency: string;
  /** PER_SHIPMENT: meter each shipment. MONTHLY_FLAT: recurring fee per `billingCycle`. */
  billingModel?: "PER_SHIPMENT" | "MONTHLY_FLAT";
  billingCycle: "MONTH" | "YEAR";
  includedBranches: number;
  priceBase: string;
  /** Platform fee per shipment (waybill) for this plan tier. */
  pricePerWaybill?: string;
  /** International per-waybill fee; when null/omitted, international uses `pricePerWaybill`. */
  pricePerWaybillInternational?: string | null;
  pricePerBranchOverage: string | null;
  features: unknown;
  trialDays: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AgencySubscriptionRow {
  id: string;
  agencyId: string;
  planId: string;
  status:
    | "TRIALING"
    | "ACTIVE"
    | "PAST_DUE"
    | "SUSPENDED"
    | "CANCELED";
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  trialEndsAt: string | null;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
  plan?: SubscriptionPlanRow;
}

export interface SubscriptionPaymentRow {
  id: string;
  invoiceId: string;
  agencyId: string;
  amount: string;
  currency: string;
  method: string;
  paidAt: string | null;
  reference: string | null;
  payerPhone: string | null;
  instanviPayCollectionStatus: string | null;
  clientReference: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionInvoiceRow {
  id: string;
  agencyId: string;
  subscriptionId: string | null;
  invoiceNo: string;
  amount: string;
  currency: string;
  dueAt: string;
  status: string;
  lineItems: unknown;
  periodStart: string | null;
  periodEnd: string | null;
  createdAt: string;
  updatedAt: string;
  payments?: SubscriptionPaymentRow[];
}

export interface AdminAgencySubscriptionPayload {
  subscription: AgencySubscriptionRow | null;
  invoices: SubscriptionInvoiceRow[];
}
