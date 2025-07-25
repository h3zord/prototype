export const mapToSelectOptions = (
  items: any[] = [],
  labelKey: string,
  valueKey: string,
  excludeOption?: string,
) => {
  if (items.length === 0) {
    return [];
  }

  if (excludeOption) {
    return items
      .filter((item) => item[labelKey] !== excludeOption)
      .map((item) => ({
        label: item[labelKey],
        value: item[valueKey],
      }));
  }

  return items.map((item) => ({
    label: item[labelKey],
    value: item[valueKey],
  }));
};
