import { forwardRef, useState } from "react";
import { getCurrentUser } from "../../services/authService";
import { formatDate } from "../../utils/dateUtils";
import { BOARDROOM_LOCATIONS } from "./calendarConstants";

function validate(value) {
  const errors = {};

  if (!value.title || value.title.trim() === "") {
    errors.title = "Title is required.";
  }

  if (!value.location) {
    errors.location = "Please select a boardroom.";
  }

  if (!value.date) {
    errors.date = "Booking date is required.";
  }

  if (!value.time) {
    errors.time = "Start time is required.";
  }

  if (!value.endTime) {
    errors.endTime = "End time is required.";
  }

  if (value.time && value.endTime && value.endTime <= value.time) {
    errors.endTime = "End time must be after start time.";
  }

  if (value.attendees !== "") {
    const attendeesNumber = Number(value.attendees);

    if (
      !Number.isInteger(attendeesNumber) ||
      attendeesNumber < 1 ||
      attendeesNumber > 100
    ) {
      errors.attendees =
        "Number of attendees must be a whole number between 1 and 100.";
    }
  }

  return errors;
}

const BookingModal = forwardRef(
  ({ value, onFieldChange, onSubmit, onCancel, isSubmitting, error }, ref) => {
    const [fieldErrors, setFieldErrors] = useState({});

    const organiser = getCurrentUser();
    const organiserName = organiser
      ? `${organiser.first_name} ${organiser.surname}`
      : "";

    const handleSubmit = () => {
      const errors = validate(value);

      setFieldErrors(errors);

      if (Object.keys(errors).length === 0) {
        onSubmit();
      }
    };

    return (
      <div className="calendar-modal-overlay" onClick={onCancel}>
        <div
          className="event-modal booking-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-modal-heading"
          ref={ref}
          tabIndex={-1}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className="modal-close-x"
            aria-label="Close"
            onClick={onCancel}
          >
            &times;
          </button>

          <h2 id="booking-modal-heading">Book Boardroom</h2>

          {error && <p className="booking-form-error">{error}</p>}

          <div className="booking-form-section">
            <h3>Booking Information</h3>

            <label htmlFor="booking-title">Meeting Title</label>
            <input
              id="booking-title"
              type="text"
              placeholder="e.g. Budget Planning"
              value={value.title}
              onChange={(e) => onFieldChange("title", e.target.value)}
            />
            {fieldErrors.title && (
              <p className="field-error">{fieldErrors.title}</p>
            )}

            <label htmlFor="booking-description">
              Meeting Description (optional)
            </label>
            <textarea
              id="booking-description"
              placeholder="Agenda, attendees, or other details"
              value={value.description}
              onChange={(e) => onFieldChange("description", e.target.value)}
            />

            <label>Organiser</label>
            <p className="booking-organiser">Booked by: {organiserName}</p>
          </div>

          <div className="booking-form-section">
            <h3>Date &amp; Time</h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="booking-date">Booking Date</label>
                <input
                  id="booking-date"
                  type="date"
                  value={value.date}
                  onChange={(e) => onFieldChange("date", e.target.value)}
                />
                {fieldErrors.date && (
                  <p className="field-error">{fieldErrors.date}</p>
                )}
              </div>

              <div className="form-group">
                {value.date && (
                  <p className="booking-date-display">
                    {formatDate(value.date)}
                  </p>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="booking-start-time">Start Time</label>
                <input
                  id="booking-start-time"
                  type="time"
                  value={value.time}
                  onChange={(e) => onFieldChange("time", e.target.value)}
                />
                {fieldErrors.time && (
                  <p className="field-error">{fieldErrors.time}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="booking-end-time">End Time</label>
                <input
                  id="booking-end-time"
                  type="time"
                  value={value.endTime}
                  onChange={(e) => onFieldChange("endTime", e.target.value)}
                />
                {fieldErrors.endTime && (
                  <p className="field-error">{fieldErrors.endTime}</p>
                )}
              </div>
            </div>
          </div>

          <div className="booking-form-section">
            <h3>Boardroom Details</h3>

            <label htmlFor="boardroom-select">Boardroom</label>
            <select
              id="boardroom-select"
              value={value.location}
              onChange={(e) => onFieldChange("location", e.target.value)}
            >
              <option value="">Select a boardroom...</option>
              {BOARDROOM_LOCATIONS.map((room) => (
                <option key={room} value={room}>
                  {room}
                </option>
              ))}
            </select>
            {fieldErrors.location && (
              <p className="field-error">{fieldErrors.location}</p>
            )}

            <label htmlFor="booking-attendees">
              Number of Attendees (optional)
            </label>
            <input
              id="booking-attendees"
              type="number"
              min="1"
              max="100"
              placeholder="e.g. 8"
              value={value.attendees}
              onChange={(e) => onFieldChange("attendees", e.target.value)}
            />
            {fieldErrors.attendees && (
              <p className="field-error">{fieldErrors.attendees}</p>
            )}

            <label htmlFor="booking-requirements">
              Additional Requirements (optional)
            </label>
            <textarea
              id="booking-requirements"
              placeholder="Projector, catering, video conferencing..."
              value={value.requirements}
              onChange={(e) => onFieldChange("requirements", e.target.value)}
            />
          </div>

          <div className="booking-form-actions">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Booking..." : "Confirm Booking"}
            </button>

            <button
              type="button"
              className="close-btn"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }
);

BookingModal.displayName = "BookingModal";

export default BookingModal;
