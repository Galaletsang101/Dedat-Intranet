import { forwardRef, useState } from "react";
import { formatDate } from "../../utils/dateUtils";

const DayEventsModal = forwardRef(
  (
    {
      selectedDate,
      isToday,
      events,
      onClose,
      onBookBoardroom,
      isAdmin,
      onCancelEvent,
    },
    ref
  ) => {
    const [confirmCancelId, setConfirmCancelId] = useState(null);

    if (!selectedDate) {
      return null;
    }

    return (
      <div className="calendar-modal-overlay" onClick={onClose}>
        <div
          className="event-modal day-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="day-modal-heading"
          ref={ref}
          tabIndex={-1}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="modal-close-x"
            aria-label="Close"
            onClick={onClose}
          >
            &times;
          </button>

          <h2 id="day-modal-heading">
            {formatDate(selectedDate)}
            {isToday && <span className="today-badge">Today</span>}
          </h2>

          {events.length === 0 ? (
            <p className="day-modal-empty">No events scheduled for this day.</p>
          ) : (
            <div className="day-modal-events">
              {events.map((event, index) => (
                <div
                  className={`day-modal-event ${event.category.toLowerCase()}`}
                  key={index}
                >
                  <div className="day-modal-event-header">
                    <strong>{event.title}</strong>

                    <span className="event-category-badge">{event.category}</span>
                  </div>

                  {event.location && (
                    <p className="day-modal-event-location">{event.location}</p>
                  )}

                  {event.time && (
                    <p className="day-modal-event-time">
                      {event.time}
                      {event.endTime && ` - ${event.endTime}`}
                    </p>
                  )}

                  {event.category === "Boardroom" && event.organiser && (
                    <p className="day-modal-event-meta">
                      Booked by: {event.organiser}
                    </p>
                  )}

                  {event.category === "Boardroom" && event.attendees != null && (
                    <p className="day-modal-event-meta">
                      {event.attendees} attendee{event.attendees === 1 ? "" : "s"}
                    </p>
                  )}

                  {event.category === "Boardroom" && event.requirements && (
                    <p className="day-modal-event-meta">{event.requirements}</p>
                  )}

                  {event.description && (
                    <p className="day-modal-event-description">
                      {event.description}
                    </p>
                  )}

                  {isAdmin && event.id != null && (
                    confirmCancelId === event.id ? (
                      <div className="day-modal-event-cancel-confirm">
                        <span>Cancel this event?</span>

                        <button
                          type="button"
                          className="admin-cancel-btn danger"
                          onClick={() => {
                            onCancelEvent(event.id);
                            setConfirmCancelId(null);
                          }}
                        >
                          Yes, cancel
                        </button>

                        <button
                          type="button"
                          className="admin-cancel-btn"
                          onClick={() => setConfirmCancelId(null)}
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="admin-cancel-btn danger"
                        onClick={() => setConfirmCancelId(event.id)}
                      >
                        Cancel Event
                      </button>
                    )
                  )}
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            className="book-boardroom-btn"
            onClick={onBookBoardroom}
          >
            + Book Boardroom
          </button>

          <button type="button" className="close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    );
  }
);

DayEventsModal.displayName = "DayEventsModal";

export default DayEventsModal;
