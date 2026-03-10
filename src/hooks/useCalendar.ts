import { formatDateToParam, generateDaysArray } from "@/utils/calenderHelper";
import { useState, useMemo } from "react";

export const useCalendar = (initialDate: Date = new Date()) => {
  const [viewDate, setViewDate] = useState(initialDate);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const today = new Date();

  const daysArray = useMemo(() => generateDaysArray(viewDate), [viewDate]);
  
  const dateParam = useMemo(() => formatDateToParam(selectedDate), [selectedDate]);

  const changeMonth = (offset: number) => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
  };

  const selectDate = (day: number) => {
    if (day <= 0) return; // Abaikan jika klik padding hari bulan lain
    setSelectedDate(new Date(viewDate.getFullYear(), viewDate.getMonth(), day));
  };

  const setManualViewDate = (date: Date) => {
    setViewDate(date);
  };  

  return {
    viewDate,
    setViewDate: setManualViewDate,
    selectedDate,
    today,
    daysArray,
    dateParam,
    changeMonth,
    selectDate,
  };
};