interface Option {
  label: string;
  value: string;
}

export function findOptionByValue(
  array: Option[],
  searchValue: string,
): Option | undefined {
  return array.find((option) => option.value === searchValue);
}

export const createOptions = (name: string) => {
  return {
    value: name,
    label: name,
  };
};

export const createOptionsLabelValue = (
  label: string,
  value: string | number,
) => {
  return {
    value: value,
    label: label,
  };
};

type CurvesObject = Record<string, string[]>;

export const createLabels = <T extends CurvesObject>(options: T) => {
  const labelsCurves = Object.keys(options) as Array<keyof typeof options>;

  const option = labelsCurves.map((name) => ({
    label: name,
    options: options[name].map((curve: string) => createOptions(curve)),
  }));

  return option;
};
