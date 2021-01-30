export function filterByRelativeDate(objects, relativeDate) {
  if (relativeDate === 'Today') return filterBySameDay(objects);
  if (relativeDate === 'Yesterday') return filterByYesterday(objects);
  if (relativeDate === 'Last 7 Days') return filterByDaysAgo(objects, 7);
  if (relativeDate === 'Last 30 Days') return filterByDaysAgo(objects, 30);
}

function filterByDaysAgo(objects, days) {
  const millis = 60 * 60 * 24 * 1000 * days;
  const today = new Date();
  return objects.filter((o) => Math.abs(today - o.date) <= millis);
}

function filterBySameDay(objects, date = new Date()) {
  return objects.filter((o) => sameDay(date, o.date));
}

function filterByYesterday(objects) {
  const today = new Date();
  today.setDate(today.getDate() - 1); // makes today yesterday
  return filterBySameDay(objects, today);
}

function sameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}
