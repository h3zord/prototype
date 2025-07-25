export interface PurchaseOrder {
  id: number;
  purchaseOrder: string;
  serviceOrders: any[];
  invoices: any[];
  customer: {
    id: number;
    name: string;
  };
}
