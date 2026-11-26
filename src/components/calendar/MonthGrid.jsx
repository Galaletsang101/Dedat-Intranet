import {
  MAX_VISIBLE_EVENTS_PER_CELL,
  WEEKDAY_LABELS,
  WEEKDAY_LABELS_SHORT,
} from "./calendarConstants";

const buildDateString = (year, month, day) =>
  `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

const MonthGrid = ({ year, month, isToday, getEventsForDate, onDayClick }) => {
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const cells = [];

  for (let i = 0; i < firstDay; i++) {
    cells.push(
      <div className="calendar-box empty" key={`empty-${i}`}></div>
    );
  }

  for (let day = 1; day <= totalDays; day++) {
    const dateStr = buildDateString(year, month, day);
    const dayEvents = [...getEventsForDate(dateStr)].sort((a, b) =>
      (a.time || "").localeCompare(b.time || "")
    );

    const visibleEvents = dayEvents.slice(0, MAX_VISIBLE_EVENTS_PER_CELL);
    const hiddenCount = dayEvents.length - visibleEvents.length;

    cells.push(
      <div
        className={`calendar-box${isToday(day) ? " today" : ""}`}
        key={day}
        onClick={() => onDayClick(day)}
      >
        <span className="date-number">{day}</span>

        <div className="events-container">
          {visibleEvents.map((event, index) => (
            <div
              className={`event-card ${event.category.toLowerCase()}`}
              key={index}
            >
              <strong>{event.title}</strong>

              {event.location && (
                <small className="event-card-location">{event.location}</small>
              )}

              <small>{event.time}</small>
            </div>
          ))}

          {hiddenCount > 0 && (
            <div className="event-card more-indicator">
              +{hiddenCount} more
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="weekdays">
        {WEEKDAY_LABELS.map((day, index) => (
          <div key={day}>
            <span className="weekday-full">{day}</span>
            <span className="weekday-short">{WEEKDAY_LABELS_SHORT[index]}</span>
          </div>
        ))}
      </div>

      <div className="calendar-grid">{cells}</div>
    </>
  );
};

export default MonthGrid;
