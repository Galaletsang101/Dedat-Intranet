import { MONTH_NAMES, addDays, getWeekStart } from "./calendarConstants";
import { formatDate } from "../../utils/dateUtils";

const VIEWS = ["Month", "Week", "Day"];

function getHeading(currentDate, view) {
  if (view === "Month") {
    return `${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
  }

  if (view === "Week") {
    const weekStart = getWeekStart(currentDate);
    const weekEnd = addDays(weekStart, 6);
    return `${formatDate(weekStart)} – ${formatDate(weekEnd)}`;
  }

  return formatDate(currentDate);
}

function stepDate(currentDate, view, direction) {
  if (view === "Month") {
    return new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + direction,
      1
    );
  }

  if (view === "Week") {
    return addDays(currentDate, direction * 7);
  }

  return addDays(currentDate, direction);
}

const CalendarNav = ({ currentDate, view, onViewChange, onDateChange }) => {
  const handlePrev = () => onDateChange(stepDate(currentDate, view, -1));
  const handleNext = () => onDateChange(stepDate(currentDate, view, 1));
  const handleToday = () => onDateChange(new Date());

  return (
    <div className="calendar-header">
      <div className="calendar-nav-controls">
        <button
          type="button"
          className="nav-btn"
          onClick={handlePrev}
          aria-label="Previous"
        >
          ‹
        </button>

        <button type="button" className="today-btn" onClick={handleToday}>
          Today
        </button>

        <button
          type="button"
          className="nav-btn"
          onClick={handleNext}
          aria-label="Next"
        >
          ›
        </button>
      </div>

      <h1>{getHeading(currentDate, view)}</h1>

      <div className="view-switcher" role="tablist" aria-label="Calendar view">
        {VIEWS.map((v) => (
          <button
            key={v}
            type="button"
            role="tab"
            aria-selected={view === v}
            className={`view-tab${view === v ? " active" : ""}`}
            onClick={() => onViewChange(v)}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CalendarNav;
