export interface IResponse<DT> {
  success: boolean;
  error: string[];
  data: DT;
  currentPage?: number;
  perPage?: number;
  totalPage?: number;
  total?: number;
}
