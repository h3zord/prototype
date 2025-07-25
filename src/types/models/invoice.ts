export interface Invoice {
  id: number;
  nfNumber: string;
  serialNumber: string;
  invoiceDate: string;
  billingDate: string;
  shippingPrice: number;
  otherPrice: number;
  discount: number;
  purchaseOrder: string[];
  isDraft: boolean;
  serviceOrders: any[];
}
