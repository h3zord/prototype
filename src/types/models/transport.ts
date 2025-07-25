import { Unit } from "./customer";

export type Transport = {
  unit: Unit;
  id: number;
  cpfCnpj: string;
  ie: string;
  name: string;
  fantasyName: string;
  phone: string;
  typeTransport: string;
  financialEmail: string;
  personType: PersonType;
  postalCode: string;
  street: string;
  neighborhood: string;
  number: string;
  complement: string;
  city: string;
  state: string;
};

export enum PersonType {
  INDIVIDUAL = "INDIVIDUAL",
  COMPANY = "COMPANY",
}
