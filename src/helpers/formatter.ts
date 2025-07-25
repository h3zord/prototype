import { CustomerType } from "../types/models/customer";

export const stringFloatToFloat = (value: string) => {
  return Number(value.replace(",", "."));
};

export const floatToString = (price: any) => {
  return price ? String(price).replace(".", ",") : "";
};

export function formatPhone(phone?: string, alternative = "-") {
  if (!phone) return alternative;

  if (phone.length === 10) {
    // Format as (xx) xxxx-xxxx
    return phone.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
  } else if (phone.length === 11) {
    // Format as (xx) xxxxx-xxxx
    return phone.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
  }
  return phone; // Return as is if length is not 10 or 11
}

export function formatCNPJ(cnpj?: string, alternative = "-") {
  return (
    cnpj?.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5") ??
    alternative
  );
}

export function formatCPF(cpf?: string, alternative = "-") {
  return (
    cpf?.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4") ?? alternative
  );
}

export function formatCpfOrCnpj(value?: string, alternative = "-") {
  if (!value) return alternative;
  const cleanValue = value.replace(/\D/g, "");

  if (cleanValue.length === 11) {
    return formatCPF(cleanValue, alternative);
  } else if (cleanValue.length === 14) {
    return formatCNPJ(cleanValue, alternative);
  }

  return alternative;
}

interface FormatPriceProps {
  price: number | undefined;
  alternative?: string;
  digits?: number;
}

export function formatPrice({
  price,
  alternative = "-",
  digits = 2,
}: FormatPriceProps) {
  if (
    price === undefined ||
    price === null ||
    typeof price !== "number" ||
    isNaN(price)
  ) {
    return alternative;
  }

  return price.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: digits,
  });
}

export const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) {
    return "-";
  }

  if (typeof date === "string") {
    date = new Date(date);
  }
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Mês começa do zero
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export function formatCustomerType(type: CustomerType) {
  if (type === CustomerType.EXTERNAL) return "Externo";
  if (type === CustomerType.STANDARD) return "Padrão";
  if (type === CustomerType.FLEXOGRAV) return "Flexograv";
  return "-";
}
