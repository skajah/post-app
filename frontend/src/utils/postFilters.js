export function filterByRelativeDate(
  objects,
  relativeDate,
  daysFrom = new Date()
) {
  let daysAgo;
  if (relativeDate === 'Today') daysAgo = 0;
  else if (relativeDate === 'Yesterday') daysAgo = 1;
  else if (relativeDate === 'Last 7 Days') daysAgo = 7;
  else if (relativeDate === 'Last 30 Days') daysAgo = 30;
  return filterByDaysAgo(objects, daysAgo, daysFrom, daysAgo === 0);
}

export function filterByDateRange(objects, start, end) {
  // console.log(`Filtering between ${start} and  ${end}`);
  return objects.filter((o) => {
    const clearedTime = clearTime(o.date);
    // console.log(clearedTime);
    return clearedTime >= start && clearedTime <= end;
  });
}

function sameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function excludeToday(objects, startDate = new Date()) {
  return objects.filter((o) => !sameDay(startDate, o.date));
}

function filterByDaysAgo(objects, days, daysFrom, keepFromDate = false) {
  const objectsFixed = keepFromDate ? objects : excludeToday(objects, daysFrom);
  const millis = 60 * 60 * 24 * 1000 * (days + 1);
  const startDate = new Date(daysFrom.getTime());
  startDate.setHours(0, 0, 0, 0);
  return objectsFixed.filter(
    (o) => Math.abs(clearTime(o.date) - startDate) < millis
  );
}

function clearTime(date) {
  const newDate = new Date(date.getTime());
  newDate.setHours(0, 0, 0, 0);
  return newDate;
}
