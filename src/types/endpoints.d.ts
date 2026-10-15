interface IResponse<T = unknown> {
  status: 'success' | 'error' | 'info' | 'warning';
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string[]>;
  pagination?: IPagination;
}

interface IPagination {
  perPage: number;
  total: number;
  page: number;
  lastPage: number;
  hasMorePages: boolean;
}
