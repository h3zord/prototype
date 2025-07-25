import { Unit } from "../../../../types/models/customer";

// src/features/dashboard/components/DashboardViewer/options.ts
export interface OptionType {
  label: string | JSX.Element;
  value: number | string;
  icon?: JSX.Element;
}

export const clientOptions: OptionType[] = [
  { value: "all", label: "Todos os Clientes" },
  { value: "client1", label: "Cliente A" },
  { value: "client2", label: "Cliente B" },
  { value: "client3", label: "Cliente C" },
];

export const productOptions: OptionType[] = [
  { value: "all", label: "Todos os Produtos" },
  { value: "prod1", label: "Produto 1" },
  { value: "prod2", label: "Produto 2" },
  { value: "prod3", label: "Produto 3" },
];

export const operatorOptions: OptionType[] = [
  { value: "all", label: "Todos os Operadores" },
  { value: "operator1", label: "Operador 1" },
  { value: "operator2", label: "Operador 2" },
  { value: "operator3", label: "Operador 3" },
];

export const espessuraOptions: OptionType[] = [
  { value: "all", label: "Todas as Espessuras" },
  { value: "1.14", label: "1.14 mm" },
  { value: "1.70", label: "1.70 mm" },
  { value: "2.84", label: "2.84 mm" },
];

export const unitOptions: OptionType[] = [
  { value: "all", label: "Todas Unidades" },
  { value: Unit.RS_PORTO_ALEGRE, label: "(POA) Porto Alegre" },
  { value: Unit.SP_INDAIATUBA, label: "(IND) Indaiatuba" },
  { value: Unit.RS_FARROUPILHA, label: "(FRR) Farroupilha" },
];

export const statusOptions: OptionType[] = [
  { value: "all", label: "Todos os Status" },
  { value: "pending", label: "Pendente" },
  { value: "approved", label: "Aprovado" },
  { value: "rejected", label: "Recusado" },
  { value: "in-progress", label: "Em Análise" },
];
