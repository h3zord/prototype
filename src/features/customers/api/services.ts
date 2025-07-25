import { ColumnSort, PaginationState } from "@tanstack/react-table";
import { api } from "../../../config/api";
import { Customer, CustomerType } from "../../../types/models/customer";

export type UpsertStandardCustomerBody = {
  id?: number;
  cpfCnpj: string;
  ie: string;
  name: string;
  fantasyName: string;
  purposeOfPurchase: string;
  phone: string;
  nfeEmail: string;
  financialEmail: string;
  generalEmail: string;

  postalCode: string;
  street: string;
  neighborhood: string;
  number: string;
  complement: string;
  city: string;
  state: string;

  company: string;
  unit: string;
  creditAnalysis: string;
  isVerified: boolean;
  notes: string;
  classification: string;
  hasOwnStock: string;
  clicheCorrugatedPrice: number;

  // clicheReformPrice: number;
  // clicheReformMinimum: number;

  clicheRepairPrice: number;
  clicheReAssemblyPrice: number;
  dieCutBlockNationalPrice: number;
  dieCutBlockImportedPrice: number;
  easyflowPrice: number;
  printingPrice: number;
  profileProofIccPrice: number;
  finalArtPrice: number;
  imageProcessingPrice: number;
  procedure: string;
  transportId: number | undefined;
  secondaryTransportIds: number[];
  representativeId: number | undefined;
  operatorClicheId: number | undefined;
  operatorDieCutBlockId: number | undefined;
  operatorImageId: number | undefined;
  operatorReviewerId: number | undefined;
  customerSegment: string[];
  products: string[];
  type: CustomerType;

  paymentTerm: number[];
};

export type UpsertExternalCustomerBody = {
  id?: number;
  cpfCnpj: string;
  ie?: string;
  name: string;
  fantasyName: string;
  purposeOfPurchase: string;
  phone: string;
  nfeEmail: string;
  financialEmail: string;

  postalCode: string;
  street: string;
  neighborhood: string;
  number: string;
  complement: string;
  city: string;
  state: string;

  clicheCorrugatedPrice: number;
  clicheRepairPrice: number;

  // clicheReformPrice: number;
  // clicheReformMinimum: number;

  clicheReAssemblyPrice: number;
  dieCutBlockNationalPrice: number;
  dieCutBlockImportedPrice: number;
  easyflowPrice: number;
  printingPrice: number;
  profileProofIccPrice: number;
  finalArtPrice: number;
  imageProcessingPrice: number;
  products: string[];
  type: CustomerType;
  standardCustomers: number[];
};

export const createCustomer = async (
  body: UpsertStandardCustomerBody,
): Promise<Customer> => {
  const response = await api.post("customer", body);

  return response.data;
};

export const createExternalCustomer = async (
  body: UpsertExternalCustomerBody,
): Promise<Customer> => {
  const response = await api.post("customer/external", body);

  return response.data;
};

export type EditCustomerRequest = {
  id: number;
  body: UpsertStandardCustomerBody;
};

export const editCustomer = async ({
  id,
  body,
}: EditCustomerRequest): Promise<Customer> => {
  const response = await api.put(`customer/${id}`, body);

  return response.data;
};

export type EditExternalCustomerRequest = {
  id: number;
  body: UpsertExternalCustomerBody;
};

export const editExternalCustomer = async ({
  id,
  body,
}: EditExternalCustomerRequest): Promise<Customer> => {
  const response = await api.put(`customer/external/${id}`, body);

  return response.data;
};

export type DeleteCustomerRequest = { id: number };

export const deleteCustomer = async ({
  id,
}: DeleteCustomerRequest): Promise<void> => {
  const response = await api.delete(`customer/${id}`);

  return response.data;
};

export type GetCustomersParams = {
  pagination: PaginationState;
  sorting: ColumnSort | undefined;
  search: string;
};

export type GetCustomersResponse = {
  data: Customer[];
  page: number;
  totalCount: number;
};

export const getCustomers = async ({
  pagination,
  search,
  sorting,
}: GetCustomersParams): Promise<GetCustomersResponse> => {
  const response = await api.get("customer", {
    params: {
      page: pagination.pageIndex,
      limit: pagination.pageSize,
      search: search || undefined,
      sortKey: sorting?.id,
      sortValue:
        sorting?.desc === undefined ? undefined : sorting.desc ? "desc" : "asc",
    },
  });

  return response.data;
};

export type GetCustomersListResponse = Customer[];

export const getCustomersList = async (query?: {
  type: string;
}): Promise<GetCustomersListResponse> => {
  const response = await api.get("customer/list", {
    params: query?.type
      ? {
          type: query?.type,
        }
      : {},
  });
  return response.data;
};

export const getCustomerById = async (id: number): Promise<Customer> => {
  const response = await api.get(`customer/${id}`);

  return response.data;
};
