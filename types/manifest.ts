export interface ManifestListRow {
  id: string;
  manifestNo: string;
  name: string | null;
  status: string;
  maxPayloadWeightKg: string | null;
  createdAt: string;
  voyage: {
    id: string;
    voyageNo: string;
    status: string;
    departureTime: string | null;
    vehicle: {
      id: string;
      plateNumber: string;
      type: string;
    } | null;
    driver: {
      id: string;
      fullName: string;
    } | null;
    origin: {
      id: string;
      name: string;
    } | null;
    destination: {
      id: string;
      name: string;
    } | null;
  } | null;
}

export interface PaginatedManifests {
  data: ManifestListRow[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
