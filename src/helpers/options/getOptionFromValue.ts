// type Value = number | string;
// type Option = { label: string; value: number | string };

type Value = any;
type Option = any;

export const getOptionFromValue = (
  value: Value,
  options: Option[],
): Option | null => {
  const option = options.find((option: Option) => option.value === value);
  return option ?? null;
};

export const getLabelFromValue = (value: Value, options: Option[]) => {
  const option = options.find((option: Option) => option.value === value);
  return option?.label ?? "";
};
