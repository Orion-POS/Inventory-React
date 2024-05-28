export interface Option<T> {
  label: T;
  value: T;
}

export default function getUniqueOptions<T, K extends keyof T>(data: T[], key: K): Option<T[K]>[] {
  const uniqueValues = data
    .map(item => item[key])
    .filter((value, index, self) => self.indexOf(value) === index);

  return uniqueValues.map(value => ({
    label: value,
    value: value
  }));
}
