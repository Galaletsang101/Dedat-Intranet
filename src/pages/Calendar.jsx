import { useState, useEffect, useRef } from "react";
import "../styles/calendar.css";
import { holidays } from "../data/holidays";
import { authFetch, parseJsonResponse } from "../services/apiClient";
import { isAdmin, getCurrentUser } from "../services/authService";
import {
  addDays,
  getWeekStart,
} from "../components/calendar/calendarConstants";
import MonthGrid from "../components/calendar/MonthGrid";
import CalendarSidebar from "../components/calendar/CalendarSidebar";
import TimeGridView from "../components/calendar/TimeGridView";
import CalendarNav from "../components/calendar/CalendarNav";
import DayEventsModal from "../components/calendar/DayEventsModal";
import BookingModal from "../components/calendar/BookingModal";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const [view, setView] = useState("Month");

  const [events, setEvents] = useState([]);

  const [selectedDate, setSelectedDate] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const [showDayModal, setShowDayModal] = useState(false);

  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);

  const [bookingError, setBookingError] = useState(null);

  const [editingEventId, setEditingEventId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [filters, setFilters] = useState({
    Meeting: true,
    Training: true,
    Leave: true,
    Deadline: true,
    Boardroom: true,
    Holiday: true,
  });

  const [bookingForm, setBookingForm] = useState({
    date: "",
    title: "",
    description: "",
    location: "",
    time: "",
    endTime: "",
    attendees: "",
    requirements: "",
  });

  // ============================================================
  // LOAD CALENDAR EVENTS
  // ============================================================

  useEffect(() => {
    loadEvents();
  }, []);

  // ============================================================
  // CLOSE OPEN MODAL ON ESCAPE
  // ============================================================

  useEffect(() => {
    if (!showModal && !showDayModal) {
      return undefined;
    }

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowModal(false);
        setShowDayModal(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showModal, showDayModal]);

  // ============================================================
  // MOVE FOCUS INTO AN OPENED MODAL
  // ============================================================

  const dayModalRef = useRef(null);

  const bookingModalRef = useRef(null);

  useEffect(() => {
    if (showDayModal && dayModalRef.current) {
      dayModalRef.current.focus();
    }
  }, [showDayModal]);

  useEffect(() => {
    if (showModal && bookingModalRef.current) {
      bookingModalRef.current.focus();
    }
  }, [showModal]);

  const loadEvents = async () => {
    try {
      const response = await authFetch("/calendar-events");

      const data = await parseJsonResponse(
        response,
        "Failed to fetch calendar events",
      );

      const loadedEvents = data.map((event) => {
        const startDate = new Date(event.start_time);

        const endDate = event.end_time ? new Date(event.end_time) : null;

        return {
          id: event.id,

          date: startDate.toISOString().split("T")[0],

          title: event.title,

          description: event.description || "",

          time: startDate.toTimeString().slice(0, 5),

          endTime: endDate ? endDate.toTimeString().slice(0, 5) : "",

          category: event.category,

          quarter: event.quarter,

          location: event.location || "",

          organiser: event.organiser || "",

          attendees: event.attendees ?? null,

          requirements: event.requirements || "",

          createdBy: event.created_by ?? null,
        };
      });

      setEvents(loadedEvents);
    } catch (error) {
      console.error("Error loading calendar events:", error);
    }
  };

  // ============================================================
  // CALENDAR DATA
  // ============================================================

  const year = currentDate.getFullYear();

  const month = currentDate.getMonth();

  // ============================================================
  // DATE STRING HELPERS
  // ============================================================

  const buildDateString = (day) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const now = new Date();

  const todayDateString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const isToday = (day) => buildDateString(day) === todayDateString;

  // ============================================================
  // OPEN "WHAT'S ON THIS DAY" MODAL
  // ============================================================

  const openDayModal = (day) => {
    setSelectedDate(buildDateString(day));

    setShowDayModal(true);
  };

  const openDayModalForDateString = (dateStr) => {
    setSelectedDate(dateStr);

    setShowDayModal(true);
  };

  // ============================================================
  // OPEN BOARDROOM BOOKING MODAL
  // ============================================================

  const openBookingModal = () => {
    setEditingEventId(null);

    setBookingForm({
      date: selectedDate || "",

      title: "",

      description: "",

      location: "",

      time: "",

      endTime: "",

      attendees: "",

      requirements: "",
    });

    setBookingError(null);

    setShowDayModal(false);

    setShowModal(true);
  };

  // ============================================================
  // OPEN BOARDROOM BOOKING MODAL - EDIT MODE
  // ============================================================

  const openEditBookingModal = (event) => {
    setEditingEventId(event.id);

    setBookingForm({
      date: event.date,

      title: event.title,

      description: event.description || "",

      location: event.location || "",

      time: event.time,

      endTime: event.endTime,

      attendees: event.attendees == null ? "" : String(event.attendees),

      requirements: event.requirements || "",
    });

    setBookingError(null);

    setShowDayModal(false);

    setShowModal(true);
  };

  // ============================================================
  // SAVE BOARDROOM BOOKING
  // ============================================================

  const saveEvent = async () => {
    // Field-level validation already happened in BookingModal before it
    // called this handler - this only talks to the backend and surfaces
    // whatever the server itself rejects (e.g. a room double-booking).

    setIsSubmittingBooking(true);

    setBookingError(null);

    try {
      // ======================================================
      // CREATE DATE/TIME VALUES
      // ======================================================

      const startTime = `${bookingForm.date} ${bookingForm.time}:00`;

      const endTime = `${bookingForm.date} ${bookingForm.endTime}:00`;

      const isEditing = editingEventId !== null;

      // ======================================================
      // SEND TO BACKEND
      // ======================================================

      const response = await authFetch(
        isEditing ? `/calendar-events/${editingEventId}` : "/calendar-events",
        {
          method: isEditing ? "PUT" : "POST",

          body: JSON.stringify({
            title: bookingForm.title.trim(),

            description: bookingForm.description,

            start_time: startTime,

            end_time: endTime,

            category: "Boardroom",

            location: bookingForm.location,

            attendees:
              bookingForm.attendees === "" ? null : Number(bookingForm.attendees),

            requirements: bookingForm.requirements || null,
          }),
        },
      );

      // ======================================================
      // READ BACKEND RESPONSE
      // ======================================================

      const savedEvent = await parseJsonResponse(
        response,
        isEditing
          ? "Failed to update boardroom booking"
          : "Failed to save boardroom booking",
      );

      // ======================================================
      // SUCCESS
      // ======================================================

      const startDate = new Date(savedEvent.start_time);

      const endDate = savedEvent.end_time
        ? new Date(savedEvent.end_time)
        : null;

      const newEvent = {
        id: savedEvent.id,

        date: startDate.toISOString().split("T")[0],

        title: savedEvent.title,

        description: savedEvent.description || "",

        time: startDate.toTimeString().slice(0, 5),

        endTime: endDate ? endDate.toTimeString().slice(0, 5) : "",

        category: savedEvent.category,

        quarter: savedEvent.quarter,

        location: savedEvent.location || "",

        organiser: savedEvent.organiser || "",

        attendees: savedEvent.attendees ?? null,

        requirements: savedEvent.requirements || "",

        createdBy: savedEvent.created_by ?? null,
      };

      // ======================================================
      // ADD OR REPLACE THE EVENT IN LOCAL STATE
      // ======================================================

      setEvents((prevEvents) =>
        isEditing
          ? prevEvents.map((event) => (event.id === newEvent.id ? newEvent : event))
          : [...prevEvents, newEvent],
      );

      // ======================================================
      // RESET FORM
      // ======================================================

      setEditingEventId(null);

      setBookingForm({
        date: "",

        title: "",

        description: "",

        location: "",

        time: "",

        endTime: "",

        attendees: "",

        requirements: "",
      });

      setShowModal(false);

      alert(
        isEditing ? "Boardroom booking updated" : "Boardroom booked successfully",
        savedEvent.emailNotificationSent
          ? "Boardroom booked successfully. The admin has been notified by email."
          : "Boardroom booked successfully, but the admin notification email could not be sent. Please contact an administrator."
      );
    } catch (error) {
      console.error("Error saving boardroom booking:", error);

      setBookingError(error.message || "Failed to save boardroom booking");
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  // ============================================================
  // CANCEL EVENT - ADMIN, OR THE PERSON WHO CREATED A BOARDROOM BOOKING.
  // BACKEND RE-CHECKS BOTH ROLE AND OWNERSHIP ON EVERY REQUEST.
  // ============================================================

  const cancelEvent = async (id) => {
    try {
      const response = await authFetch(`/calendar-events/${id}`, {
        method: "DELETE",
      });

      await parseJsonResponse(response, "Failed to cancel event");

      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
    } catch (error) {
      console.error("Error cancelling event:", error);

      alert(error.message || "Failed to cancel event");
    }
  };

  // ============================================================
  // GET EVENTS FOR A DATE STRING ("YYYY-MM-DD")
  // ============================================================

  const getEventsForDate = (dateStr) => [
    ...events.filter((event) => event.date === dateStr),

    ...holidays.filter((holiday) => holiday.date === dateStr),
  ];

  const filterEventsForDate = (dateStr) => {
    return getEventsForDate(dateStr).filter((event) => {
      const searchMatch =
        searchTerm === "" ||
        event.title.toLowerCase().includes(searchTerm.toLowerCase());

      const categoryMatch = filters[event.category];

      return searchMatch && categoryMatch;
    });
  };

  // ============================================================
  // EVENTS FOR THE DAY MODAL
  // ============================================================

  const dayModalEvents = selectedDate ? filterEventsForDate(selectedDate) : [];

  const isSelectedDateToday = selectedDate === todayDateString;

  // ============================================================
  // CURRENT USER / ORGANISER DISPLAY
  // ============================================================

  const currentUser = getCurrentUser();

  const currentUserId = currentUser?.id;

  const editingEvent =
    editingEventId !== null
      ? events.find((event) => event.id === editingEventId)
      : null;

  const organiserName = editingEvent
    ? editingEvent.organiser
    : currentUser
      ? `${currentUser.first_name} ${currentUser.surname}`
      : "";

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <div className="calendar-page">
      {/* SEARCH */}

      <div className="calendar-search">
        <input
          type="text"
          placeholder="Search calendar events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="calendar-layout">
        {/* SIDEBAR */}

        <CalendarSidebar
          filters={filters}
          onFilterChange={(category, checked) =>
            setFilters((prev) => ({ ...prev, [category]: checked }))
          }
          events={events}
          todayDateString={todayDateString}
        />

        {/* CALENDAR */}

        <div className="calendar-content">
          <CalendarNav
            currentDate={currentDate}
            view={view}
            onViewChange={setView}
            onDateChange={setCurrentDate}
          />

          {view === "Month" ? (
            <MonthGrid
              year={year}
              month={month}
              isToday={isToday}
              getEventsForDate={filterEventsForDate}
              onDayClick={openDayModal}
            />
          ) : (
            <TimeGridView
              days={
                view === "Week"
                  ? Array.from({ length: 7 }, (_, i) =>
                      addDays(getWeekStart(currentDate), i),
                    )
                  : [currentDate]
              }
              getEventsForDate={filterEventsForDate}
              onEventClick={openDayModalForDateString}
            />
          )}
        </div>
      </div>

      {showDayModal && (
        <DayEventsModal
          selectedDate={selectedDate}
          isToday={isSelectedDateToday}
          events={dayModalEvents}
          onClose={() => setShowDayModal(false)}
          onBookBoardroom={openBookingModal}
          isAdmin={isAdmin()}
          currentUserId={currentUserId}
          onCancelEvent={cancelEvent}
          onEditEvent={openEditBookingModal}
          ref={dayModalRef}
        />
      )}

      {showModal && (
        <BookingModal
          value={bookingForm}
          onFieldChange={(field, fieldValue) =>
            setBookingForm({
              ...bookingForm,
              [field]: fieldValue,
            })
          }
          onSubmit={saveEvent}
          onCancel={() => setShowModal(false)}
          isSubmitting={isSubmittingBooking}
          error={bookingError}
          isEditing={editingEventId !== null}
          organiserName={organiserName}
          ref={bookingModalRef}
        />
      )}
    </div>
  );
};

export default Calendar;
