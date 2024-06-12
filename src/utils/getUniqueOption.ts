export interface OptionType<T> {
  label: T;
  value: T;
}

export default function getUniqueOptions<T, K extends keyof T>(
  data: T[],
  key: K
): OptionType<string>[] {
  const uniqueValues = data
    .map(item => item[key])
    .filter((value, index, self) => self.indexOf(value) === index);

  return uniqueValues.map(value => ({
    label: String(value),
    value: String(value)
  }));
}
