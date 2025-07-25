export function convertStringToNumber(value: string | number): number {
  const toNumber = (val: number) => {
    const str = val.toString();
    const [intPart, decimalPart = ""] = str.split(".");
    const limitedDecimal = decimalPart.slice(0, 3);
    return parseFloat(`${intPart}.${limitedDecimal}`);
  };

  if (typeof value === "string") {
    const cleanedValue = value.replace(/\./g, "").replace(",", ".");
    const numberValue = parseFloat(cleanedValue);
    return isNaN(numberValue) ? 0 : toNumber(numberValue);
  }

  if (typeof value === "number") {
    return toNumber(value);
  }

  return 0;
}
