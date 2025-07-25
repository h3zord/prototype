interface FormatComparedToDateProps {
  month: number;
  year: number;
}

export function formatComparedToDate({
  month,
  year,
}: FormatComparedToDateProps): string {
  const shortMonthNames = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];

  const monthName = shortMonthNames[month - 1];

  return `${monthName}/${year}`;
}
