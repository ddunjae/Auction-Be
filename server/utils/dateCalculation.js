export function provideDate() {
  const date = new Date();
  if (date.getDate() < 15) {
    date.setMonth(date.getMonth() - 1);
  }
  const current_start = `${date.getFullYear() - 1}-${date.getMonth() + 1}-1`;
  const previous_start = `${date.getFullYear() - 2}-${date.getMonth() + 1}-1`;
  date.setDate(0);
  const current_end = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;
  const previous_end = `${date.getFullYear() - 1}-${
    date.getMonth() + 1
  }-${date.getDate()}`;
  return {
    current_end: current_end,
    current_start: current_start,
    previous_end: previous_end,
    previous_start: previous_start,
  };
}
