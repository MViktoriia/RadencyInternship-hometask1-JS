export function dateParse(string) {
  const regEx = /(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[012])\/((19|20)\d\d)/g;
  const result = string.match(regEx) || [];
  return result.join(',');
}
