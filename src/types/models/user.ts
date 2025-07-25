export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  group: {
    id: number;
    name: string;
  };
  customer: {
    id: number;
    name: string;
  };
  isApprover: boolean;
};
