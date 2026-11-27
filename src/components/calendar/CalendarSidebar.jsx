import { formatRelative } from "../../utils/dateUtils";
import { getUpcomingBoardroomBookings, groupBookingsByDay } from "./boardroomSchedule";

const CalendarSidebar = ({ filters, onFilterChange, events, todayDateString }) => {
  const upcoming = getUpcomingBoardroomBookings(events, todayDateString);
  const dayGroups = groupBookingsByDay(upcoming);

  return (
    <div className="calendar-sidebar">
      <h3>Event Filter</h3>

      {Object.keys(filters).map((category) => (
        <label key={category}>
          <input
            type="checkbox"
            checked={filters[category]}
            onChange={(e) => onFilterChange(category, e.target.checked)}
          />

          {category}
        </label>
      ))}

      <div className="boardroom-status">
        <h3>Boardroom Schedule</h3>

        {dayGroups.length === 0 ? (
          <p>No upcoming boardroom bookings</p>
        ) : (
          dayGroups.map((group) => (
            <div className="boardroom-day-group" key={group.date}>
              <h4 className="boardroom-day-heading">{formatRelative(group.date)}</h4>

              {group.bookings.map((booking, index) => (
                <div key={index} className="boardroom-slot booked">
                  <strong>{booking.location || "Boardroom"}</strong>

                  <p>
                    {booking.time}
                    {" - "}
                    {booking.endTime}
                    <br />
                    <span>{booking.title}</span>
                  </p>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CalendarSidebar;
