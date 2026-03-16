export const getDaysInMonth = (year: number, month: number) => 
  new Date(year, month + 1, 0).getDate();

export const getFirstDayOfMonth = (year: number, month: number) => 
  new Date(year, month, 1).getDay();

export const formatDateToParam = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const generateDaysArray = (viewDate: Date) => {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  
  const daysInMonth = getDaysInMonth(year, month);
  const daysInPrevMonth = getDaysInMonth(year, month - 1);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonthDays = Array.from(
    { length: firstDay },
    (_, i) => -(daysInPrevMonth - (firstDay - i - 1))
  );

  const currentDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const totalSoFar = prevMonthDays.length + currentDays.length;
  const nextMonthCount = totalSoFar % 7 === 0 ? 0 : 7 - (totalSoFar % 7);
  const nextMonthDays = Array.from({ length: nextMonthCount }, (_, i) => -(i + 1 + 100));

  return [...prevMonthDays, ...currentDays, ...nextMonthDays];
};