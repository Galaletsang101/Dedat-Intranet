import { useEffect, useRef, useState } from "react";
import { computeEventLayout, getCurrentTimePosition } from "./eventLayout";
import {
  GRID_START_HOUR,
  GRID_END_HOUR,
  HOUR_HEIGHT_PX,
  BUSINESS_HOURS_START,
} from "./calendarConstants";
import { formatDate } from "../../utils/dateUtils";

const buildDateString = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;

const isSameCalendarDate = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const HOURS = [];
for (let hour = GRID_START_HOUR; hour < GRID_END_HOUR; hour++) {
  HOURS.push(hour);
}

const TimeGridView = ({ days, getEventsForDate, onEventClick }) => {
  const scrollRef = useRef(null);
  const [, forceTick] = useState(0);

  // Re-render every minute so the current-time line keeps moving.
  useEffect(() => {
    const interval = setInterval(() => forceTick((t) => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  // Open scrolled to business hours rather than midnight, whenever the
  // visible range changes (switching view, or navigating to a new day/week).
  const rangeStart = days[0] ? buildDateString(days[0]) : null;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = BUSINESS_HOURS_START * HOUR_HEIGHT_PX;
    }
  }, [days.length, rangeStart]);

  const now = new Date();
  const gridColumns = `56px repeat(${days.length}, minmax(0, 1fr))`;
  const gridHeight = (GRID_END_HOUR - GRID_START_HOUR) * HOUR_HEIGHT_PX;

  return (
    <div className="timegrid-wrapper">
      <div className="timegrid-day-headers" style={{ gridTemplateColumns: gridColumns }}>
        <div className="timegrid-gutter-label" />

        {days.map((day) => (
          <div
            key={buildDateString(day)}
            className={`timegrid-day-header${
              isSameCalendarDate(day, now) ? " today" : ""
            }`}
          >
            {formatDate(day)}
          </div>
        ))}
      </div>

      <div className="timegrid-scroll" ref={scrollRef}>
        <div
          className="timegrid-body"
          style={{ gridTemplateColumns: gridColumns, height: `${gridHeight}px` }}
        >
          <div className="timegrid-hour-labels">
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="timegrid-hour-label"
                style={{ height: `${HOUR_HEIGHT_PX}px` }}
              >
                {String(hour).padStart(2, "0")}:00
              </div>
            ))}
          </div>

          {days.map((day) => {
            const dateStr = buildDateString(day);
            const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate());
            const dayEnd = new Date(
              dayStart.getFullYear(),
              dayStart.getMonth(),
              dayStart.getDate() + 1
            );

            const timedEvents = getEventsForDate(dateStr)
              .filter((event) => event.time)
              .map((event) => ({
                ...event,
                start: new Date(`${event.date}T${event.time}:00`),
                end: event.endTime
                  ? new Date(`${event.date}T${event.endTime}:00`)
                  : new Date(`${event.date}T${event.time}:00`),
              }));

            const laidOut = computeEventLayout(timedEvents, dayStart, dayEnd);

            return (
              <div
                key={dateStr}
                className="timegrid-day-column"
                onClick={() => onEventClick(dateStr)}
              >
                {HOURS.map((hour) => (
                  <div
                    key={hour}
                    className="timegrid-hour-row"
                    style={{ height: `${HOUR_HEIGHT_PX}px` }}
                  />
                ))}

                {isSameCalendarDate(day, now) && (
                  <div
                    className="timegrid-now-line"
                    style={{ top: `${getCurrentTimePosition(now)}px` }}
                  />
                )}

                {laidOut.map((event, index) => (
                  <div
                    key={index}
                    className={`timegrid-event ${event.category.toLowerCase()}`}
                    style={{
                      top: `${event.top}px`,
                      height: `${event.height}px`,
                      left: `calc((100% / ${event.columnCount}) * ${event.column})`,
                      width: `calc(100% / ${event.columnCount})`,
                    }}
                    onClick={() => onEventClick(dateStr)}
                  >
                    <strong>{event.title}</strong>
                    <small>
                      {event.time}
                      {event.endTime && ` - ${event.endTime}`}
                    </small>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TimeGridView;
