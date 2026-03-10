import { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput, EventClickArg } from "@fullcalendar/core";

import PageMeta from "@/components/common/PageMeta";
import { Modal } from "../components/ui/modal";
import { useModal } from "../hooks/useModal";

import { useHolidays } from "@/hooks/useHoliday";
import { Holiday } from "@/types";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { CalendarDays, Clock, User, Info } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarEvent extends EventInput {
  extendedProps: {
    calendar: string;
    creator?: string;
  };
}

// --- Skeleton Component (Local) ---
const CalendarMobileSkeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="flex justify-between items-center mb-6">
      <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded-lg" />
      <div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded-lg" />
    </div>
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded-2xl" />
    ))}
  </div>
);

const Calendar: React.FC = () => {
  const calendarRef = useRef<FullCalendar>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { data: holidays = [], isLoading } = useHolidays();
  const isMobile = useIsMobile()

  const { isOpen, openModal, closeModal } = useModal();

  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );

  /**
   * Convert Holiday → Calendar Event
   */
  const events: CalendarEvent[] = holidays.map((holiday: Holiday) => ({
    id: holiday.uuid,
    title: holiday.name,
    start: holiday.start_date,
    end: holiday.end_date ?? holiday.start_date,
    allDay: true,
    extendedProps: {
      calendar: holiday.is_recurring ? "Warning" : "Success",
      creator: holiday.creator?.name,
    },
  }));

  /** Generate Payday events for the 26th of every month (±12 months) */
  const paydayEvents: CalendarEvent[] = (() => {
    const result: CalendarEvent[] = [];
    const today = new Date();
    for (let offset = -12; offset <= 12; offset++) {
      const d = new Date(today.getFullYear(), today.getMonth() + offset, 26);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-26`;
      result.push({
        id: `payday-${dateStr}`,
        title: "Payday",
        start: dateStr,
        allDay: true,
        extendedProps: { calendar: "Payday" },
      });
    }
    return result;
  })();

  const allEvents = [...events, ...paydayEvents];

  const upcomingEvents = allEvents
    .sort((a, b) => new Date(a.start as string).getTime() - new Date(b.start as string).getTime())
    .filter(e => new Date(e.start as string) >= new Date());

  const totalPages = Math.ceil(upcomingEvents.length / itemsPerPage);
  const paginatedEvents = upcomingEvents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  /**
   * Click Event → Open Detail Modal
   */
  const handleEventClick = (clickInfo: EventClickArg) => {
    const { event } = clickInfo;
    
    // Map FullCalendar object back to our CalendarEvent interface
    const eventData: CalendarEvent = {
      id: event.id,
      title: event.title,
      start: event.startStr,
      end: event.endStr || event.startStr,
      extendedProps: event.extendedProps as CalendarEvent["extendedProps"],
    };

    setSelectedEvent(eventData);
    openModal();
  };

  return (
    <>
      <PageMeta title="Calendar" />
      <PageBreadcrumb pageTitle="Calendar" />

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
        {isLoading && isMobile ? (
          <CalendarMobileSkeleton />
        ) : isMobile ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">Upcoming Events</h3>
              <span className="text-xs text-gray-500">Mobile View</span>
            </div>
            <div className="space-y-3">
              {paginatedEvents.map((event) => (
                <div 
                  key={event.id}
                  onClick={() => {
                    setSelectedEvent(event);
                    openModal();
                  }}
                  className="relative overflow-hidden rounded-xl border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-700 dark:bg-gray-800/50 active:scale-95 transition-transform"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center justify-center min-w-15 rounded-lg bg-white py-2 shadow-sm dark:bg-gray-900">
                      <span className="text-[10px] font-bold uppercase text-gray-400">
                        {new Date(event.start as string).toLocaleString('default', { month: 'short' })}
                      </span>
                      <span className="text-xl font-black text-brand-600 dark:text-brand-400">
                        {new Date(event.start as string).getDate()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 dark:text-white">{event.title}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {event.extendedProps.calendar === "Payday" ? "Monthly Disbursement" : "Holiday Event"}
                      </p>
                    </div>
                    <div className={`h-2 w-2 rounded-full ${event.extendedProps.calendar === "Payday" ? "bg-emerald-500" : "bg-amber-500"}`} />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
              <p className="text-xs text-gray-500">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 disabled:opacity-30 text-gray-600 dark:text-gray-400"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 disabled:opacity-30 text-gray-600 dark:text-gray-400"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="custom-calendar">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: "prev,next",
                center: "title",
                right: "",
              }}
              events={allEvents}
              eventClick={handleEventClick}
              eventContent={renderEventContent}
              dayCellContent={(args) => {
                const isPayday = args.date.getDate() === 26;
                return (
                  <div className="flex justify-center w-full pt-1.5 h-full">
                    <span
                      className={`
                        inline-flex items-center justify-center w-7 h-7 text-xs font-bold transition-all duration-300
                        ${isPayday 
                          ? "rounded-full bg-yellow-400 text-yellow-950 shadow-lg shadow-yellow-400/40 ring-4 ring-yellow-200 dark:bg-yellow-500 dark:text-yellow-950 dark:ring-yellow-900/40 scale-110 z-10" 
                          : "text-gray-700 dark:text-gray-300"}
                      `}
                    >
                      {args.dayNumberText}
                    </span>
                  </div>
                );
              }}
              height="auto"
            />
          </div>
        )}

        {/* EVENT DETAIL MODAL */}
        <Modal
          isOpen={isOpen}
          onClose={closeModal} 
          className="max-w-md m-4"
        >
          {selectedEvent && (
            <div className="relative w-full rounded-3xl bg-white p-8 dark:bg-gray-900 shadow-2xl">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-1">
                  <div className="p-2 bg-brand-100 dark:bg-brand-900/30 rounded-lg text-brand-600 dark:text-brand-400">
                    <CalendarDays size={22} />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Holiday Details
                  </h4>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 ml-12">
                  Detailed information about this holiday event.
                </p>
              </div>

              <div className="space-y-5">
                {/* Event Name */}
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 block mb-1">
                    Holiday Name
                  </span>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {selectedEvent.title}
                  </span>
                </div>

                {/* Date Info */}
                <div className="flex items-start gap-4 px-2">
                  <Clock className="text-brand-500 mt-1" size={18} />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Date Range</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {String(selectedEvent.start)} {selectedEvent.end && selectedEvent.end !== selectedEvent.start ? ` — ${String(selectedEvent.end)}` : ""}
                    </p>
                  </div>
                </div>

                {/* Type Info */}
                <div className="flex items-start gap-4 px-2">
                  <Info className="text-brand-500 mt-1" size={18} />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Holiday Type</p>
                    <span className={`mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${selectedEvent.extendedProps.calendar === "Warning" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"}`}>
                      {selectedEvent.extendedProps.calendar === "Warning" ? "Recurring Yearly" : "One-time Event"}
                    </span>
                  </div>
                </div>

                {/* Creator Info */}
                <div className="flex items-start gap-4 px-2">
                  <User className="text-brand-500 mt-1" size={18} />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Created By</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedEvent.extendedProps.creator || "System Administrator"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <button
                  onClick={closeModal}
                  className="w-full rounded-lg bg-brand-500 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-600"
                > 
                  Close
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </>
  );
};

/**
 * Custom Event UI
 */
const renderEventContent = (eventInfo: any) => {
  const calendarType = eventInfo.event.extendedProps.calendar;

  if (calendarType === "Payday") {
    return (
      <div className="group relative flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-linear-to-br from-emerald-500 via-emerald-600 to-teal-600 dark:from-emerald-600 dark:via-emerald-700 dark:to-teal-700 shadow-sm border border-emerald-400/50 dark:border-emerald-500/30 text-white font-bold text-[10px] ring-1 ring-emerald-400/20 dark:ring-emerald-500/20 animate-in fade-in slide-in-from-top-1 duration-500 hover:scale-[1.02] transition-transform overflow-hidden cursor-pointer">
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="shrink-0 text-xs drop-shadow-sm">💰</span>
        <span className="truncate uppercase tracking-widest drop-shadow-sm font-black">
          {eventInfo.event.title}
        </span>
      </div>
    );
  }

  const colorClass = `fc-bg-${calendarType.toLowerCase()}`;

  return (
    <div
      className={`event-fc-color flex fc-event-main ${colorClass} p-1 rounded-sm cursor-pointer border-none shadow-sm`}
    >
      <div className="fc-daygrid-event-dot"></div>
      <div className="fc-event-title font-medium">{eventInfo.event.title}</div>
    </div>
  );
};

export default Calendar;