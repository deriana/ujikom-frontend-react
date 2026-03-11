import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimeClock } from '@mui/x-date-pickers/TimeClock';
import dayjs, { Dayjs } from 'dayjs';
import { ThemeProvider, createTheme } from '@mui/material/styles';

interface AnalogPickerProps {
  value: string; 
  onChange: (time: string) => void;
  label?: string;
  isDarkMode?: boolean;
}

export const AnalogTimePicker = ({ value, onChange, label, isDarkMode = false }: AnalogPickerProps) => {
  const darkTheme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: '#10b981',
      },
    },
  });

const selectedTime = value 
  ? dayjs(`2026-03-10 ${value}`) // Sesuaikan tanggal bebas
  : dayjs().startOf('day');       // Ini otomatis jadi jam 00:00:00

  return (
    <ThemeProvider theme={darkTheme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="flex flex-col gap-2">
          {label && (
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {label}
            </label>
          )}
        <div className="inline-block p-2 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800">
          <TimeClock
            value={selectedTime}
            ampm={false} // Format 24 Jam
            onChange={(newValue: Dayjs | null) => {
              if (newValue) {
                onChange(newValue.format("HH:mm"));
              }
            }}
            sx={{
              // Kustomisasi visual jam
              '& .MuiClock-wrapper': {
                backgroundColor: isDarkMode ? '#111827' : '#f9fafb',
              },
              '& .MuiClockPointer-root, & .MuiClock-pin, & .MuiClockPointer-thumb': {
                backgroundColor: '#10b981', 
              },
              '& .Mui-selected': {
                backgroundColor: '#10b981 !important',
                color: 'white !important',
              },
              '& .MuiClockNumber-root': {
                fontSize: '0.9rem',
                color: isDarkMode ? '#9ca3af' : '#4b5563',
              }
            }}
          />
        </div>
        </div>
      </LocalizationProvider>
    </ThemeProvider>
  );
};