export interface ConfigurationItem {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  code?: string;
  accountCode?: string;
  metadata?: string | null;
  [key: string]: unknown;
}

export interface ConfigurationResponse {
  data: ConfigurationItem[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
