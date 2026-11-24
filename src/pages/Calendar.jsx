import { useState, useEffect, useRef } from "react";
import "../styles/calendar.css";
import { holidays } from "../data/holidays";
import { authFetch } from "../services/apiClient";
import { formatDate } from "../utils/dateUtils";

// Keep in sync with BOARDROOM_LOCATIONS in backend/server.js.
const BOARDROOM_LOCATIONS = [
  "Augrabies",
  "Credo Mutwa",
  "Flamingo",
  "Kokerboom",
  "Metlife 13th Floor Boardroom",
  "Namakwa Daisies",
  "Tshepe",
  "Khaya La Bantu Boardroom",
  "Policy & Planning Boardroom",
];

const Calendar = () => {

  const [currentDate, setCurrentDate] = useState(new Date());

  const [events, setEvents] = useState([]);

  const [selectedDate, setSelectedDate] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const [showDayModal, setShowDayModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");


  const [filters, setFilters] = useState({
    Meeting: true,
    Training: true,
    Leave: true,
    Deadline: true,
    Boardroom: true,
    Holiday: true,
  });


  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    time: "",
    endTime: "",
    category: "Meeting",
    quarter: "Q1",
    location: "",
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

      const response = await fetch(
        "http://localhost:5000/api/calendar-events"
      );


      if (!response.ok) {

        throw new Error(
          "Failed to fetch calendar events"
        );

      }


      const data = await response.json();


      const loadedEvents = data.map((event) => {

        const startDate =
          new Date(event.start_time);

        const endDate =
          event.end_time
            ? new Date(event.end_time)
            : null;


        return {

          id: event.id,

          date:
            startDate
              .toISOString()
              .split("T")[0],

          title:
            event.title,

          description:
            event.description || "",

          time:
            startDate
              .toTimeString()
              .slice(0, 5),

          endTime:
            endDate
              ? endDate
                  .toTimeString()
                  .slice(0, 5)
              : "",

          category:
            event.category,

          quarter:
            event.quarter,

          location:
            event.location || "",

        };

      });


      setEvents(loadedEvents);


    } catch (error) {

      console.error(
        "Error loading calendar events:",
        error
      );

    }

  };


  // ============================================================
  // CALENDAR DATA
  // ============================================================

  const monthNames = [

    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"

  ];


  const days = [

    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"

  ];


  const year =
    currentDate.getFullYear();


  const month =
    currentDate.getMonth();


  const firstDay =
    new Date(
      year,
      month,
      1
    ).getDay();


  const totalDays =
    new Date(
      year,
      month + 1,
      0
    ).getDate();


  // ============================================================
  // DATE STRING HELPERS
  // ============================================================

  const buildDateString = (day) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const now = new Date();

  const todayDateString =
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const isToday = (day) => buildDateString(day) === todayDateString;


  // ============================================================
  // MONTH NAVIGATION
  // ============================================================

  const previousMonth = () => {

    setCurrentDate(
      new Date(
        year,
        month - 1,
        1
      )
    );

  };


  const nextMonth = () => {

    setCurrentDate(
      new Date(
        year,
        month + 1,
        1
      )
    );

  };


  const today = () => {

    setCurrentDate(
      new Date()
    );

  };


  // ============================================================
  // OPEN "WHAT'S ON THIS DAY" MODAL
  // ============================================================

  const openDayModal = (day) => {

    setSelectedDate(buildDateString(day));

    setShowDayModal(true);

  };


  // ============================================================
  // OPEN BOARDROOM BOOKING MODAL
  // ============================================================

  const openBookingModal = () => {

    setEventData({

      title: "",

      description: "",

      time: "",

      endTime: "",

      category: "Boardroom",

      quarter: "Q1",

      location: "",

    });


    setShowDayModal(false);

    setShowModal(true);

  };


  // ============================================================
  // SAVE BOARDROOM BOOKING
  // ============================================================

  const saveEvent = async () => {

    console.log(
      "BOOKING FORM DATA:",
      eventData
    );

    console.log(
      "TITLE:",
      eventData.title
    );

    console.log(
      "START TIME:",
      eventData.time
    );

    console.log(
      "END TIME:",
      eventData.endTime
    );

    console.log(
      "SELECTED DATE:",
      selectedDate
    );


    // ========================================================
    // CHECK TITLE
    // ========================================================

    if (
      !eventData.title ||
      eventData.title.trim() === ""
    ) {

      alert(
        "Booking title is missing"
      );

      return;

    }


    // ========================================================
    // CHECK BOARDROOM
    // ========================================================

    if (!eventData.location) {

      alert(
        "Please select a boardroom"
      );

      return;

    }


    // ========================================================
    // CHECK START TIME
    // ========================================================

    if (!eventData.time) {

      alert(
        "Start time is missing"
      );

      return;

    }


    // ========================================================
    // CHECK END TIME
    // ========================================================

    if (!eventData.endTime) {

      alert(
        "End time is missing"
      );

      return;

    }


    // ========================================================
    // CHECK DATE
    // ========================================================

    if (!selectedDate) {

      alert(
        "Booking date is missing"
      );

      return;

    }


    // ========================================================
    // CHECK TIME ORDER
    // ========================================================

    if (
      eventData.endTime <=
      eventData.time
    ) {

      alert(
        "End time must be after start time"
      );

      return;

    }


    try {

      // ======================================================
      // CREATE DATE/TIME VALUES
      // ======================================================

      const startTime =
        `${selectedDate} ${eventData.time}:00`;


      const endTime =
        `${selectedDate} ${eventData.endTime}:00`;


      console.log(
        "SENDING START TIME:",
        startTime
      );

      console.log(
        "SENDING END TIME:",
        endTime
      );


      // ======================================================
      // SEND TO BACKEND
      // ======================================================

      const response =
        await authFetch(
          "/calendar-events",
          {

            method: "POST",

            body:
              JSON.stringify({

                title:
                  eventData.title.trim(),

                description:
                  eventData.description,

                start_time:
                  startTime,

                end_time:
                  endTime,

                category:
                  "Boardroom",

                quarter:
                  eventData.quarter,

                location:
                  eventData.location,

              }),

          }
        );


      // ======================================================
      // READ BACKEND RESPONSE
      // ======================================================

      const responseData =
        await response.json();


      console.log(
        "BACKEND RESPONSE:",
        responseData
      );


      // ======================================================
      // HANDLE ERROR
      // ======================================================

      if (!response.ok) {

        throw new Error(

          responseData.error ||
          "Failed to save boardroom booking"

        );

      }


      // ======================================================
      // SUCCESS
      // ======================================================

      const savedEvent =
        responseData;


      const startDate =
        new Date(
          savedEvent.start_time
        );


      const endDate =
        savedEvent.end_time
          ? new Date(
              savedEvent.end_time
            )
          : null;


      const newEvent = {

        id:
          savedEvent.id,

        date:
          startDate
            .toISOString()
            .split("T")[0],

        title:
          savedEvent.title,

        description:
          savedEvent.description ||
          "",

        time:
          startDate
            .toTimeString()
            .slice(0, 5),

        endTime:
          endDate
            ? endDate
                .toTimeString()
                .slice(0, 5)
            : "",

        category:
          savedEvent.category,

        quarter:
          savedEvent.quarter,

        location:
          savedEvent.location || "",

      };


      // ======================================================
      // ADD EVENT TO CALENDAR
      // ======================================================

      setEvents(
        (prevEvents) => [
          ...prevEvents,
          newEvent
        ]
      );


      // ======================================================
      // RESET FORM
      // ======================================================

      setEventData({

        title: "",

        description: "",

        time: "",

        endTime: "",

        category:
          "Boardroom",

        quarter:
          "Q1",

        location: "",

      });


      setShowModal(false);


      alert(
        "Boardroom booked successfully"
      );


    } catch (error) {

      console.error(
        "Error saving boardroom booking:",
        error
      );


      alert(
        error.message ||
        "Failed to save boardroom booking"
      );

    }

  };


  // ============================================================
  // GET EVENTS FOR A DATE STRING ("YYYY-MM-DD")
  // ============================================================

  const getEventsForDate = (dateStr) => [

    ...events.filter(
      (event) =>
        event.date === dateStr
    ),

    ...holidays.filter(
      (holiday) =>
        holiday.date === dateStr
    ),

  ];


  const filterEventsForDate = (dateStr) => {

    return getEventsForDate(dateStr).filter(
      (event) => {

        const searchMatch =
          searchTerm === "" ||
          event.title
            .toLowerCase()
            .includes(
              searchTerm.toLowerCase()
            );


        const categoryMatch =
          filters[event.category];


        return (
          searchMatch &&
          categoryMatch
        );

      }
    );

  };


  // ============================================================
  // FILTER EVENTS FOR A DAY-OF-MONTH (GRID CELLS)
  // ============================================================

  const filteredEvents = (day) =>
    filterEventsForDate(buildDateString(day));


  // ============================================================
  // EVENTS FOR THE DAY MODAL
  // ============================================================

  const dayModalEvents =
    selectedDate
      ? filterEventsForDate(selectedDate)
      : [];


  const isSelectedDateToday =
    selectedDate === todayDateString;


  // ============================================================
  // BOARDROOM BOOKINGS
  // ============================================================

  const boardroomBookings =
    events
      .filter(
        (event) =>
          event.category ===
          "Boardroom"
      )
      .sort(
        (a, b) =>
          new Date(a.date) -
          new Date(b.date)
      );


  // ============================================================
  // CREATE CALENDAR DAYS
  // ============================================================

  const calendarDays = [];


  for (
    let i = 0;
    i < firstDay;
    i++
  ) {

    calendarDays.push(

      <div
        className="calendar-box empty"
        key={`empty-${i}`}
      ></div>

    );

  }


  for (
    let day = 1;
    day <= totalDays;
    day++
  ) {

    const dayEvents =
      filteredEvents(day);


    calendarDays.push(

      <div
        className={
          `calendar-box${isToday(day) ? " today" : ""}`
        }
        key={day}
        onClick={() =>
          openDayModal(day)
        }
      >

        <span className="date-number">

          {day}

        </span>


        <div className="events-container">

          {

            dayEvents.map(
              (event, index) => (

                <div
                  className={
                    `event-card ${event.category.toLowerCase()}`
                  }
                  key={index}
                >

                  <strong>

                    {event.title}

                  </strong>


                  {

                    event.location && (

                      <small className="event-card-location">

                        {event.location}

                      </small>

                    )

                  }


                  <small>

                    {event.time}

                  </small>

                </div>

              )
            )

          }

        </div>

      </div>

    );

  }


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

          onChange={(e) =>
            setSearchTerm(
              e.target.value
            )
          }

        />

      </div>


      <div className="calendar-layout">


        {/* SIDEBAR */}

        <div className="calendar-sidebar">


          <h3>
            Event Filter
          </h3>


          {

            Object.keys(filters).map(
              (category) => (

                <label
                  key={category}
                >

                  <input

                    type="checkbox"

                    checked={
                      filters[category]
                    }

                    onChange={(e) =>

                      setFilters(
                        prev => ({
                          ...prev,

                          [category]:
                            e.target.checked

                        })
                      )

                    }

                  />

                  {category}

                </label>

              )
            )

          }


          {/* BOARDROOM */}

          <div className="boardroom-status">


            <h3>
              Boardroom Schedule
            </h3>


            {

              boardroomBookings.length === 0
                ? (

                  <p>
                    No upcoming boardroom bookings
                  </p>

                )
                : (

                  boardroomBookings.map(
                    (booking, index) => (

                      <div

                        key={index}

                        className={
                          "boardroom-slot booked"
                        }

                      >

                        <strong>

                          {booking.location || "Boardroom"}

                        </strong>


                        <p>

                          {formatDate(booking.date)}

                          {" · "}

                          {booking.time}

                          {" - "}

                          {booking.endTime}

                          <br />

                          {booking.title}

                        </p>

                      </div>

                    )
                  )

                )

            }


          </div>


        </div>


        {/* CALENDAR */}

        <div className="calendar-content">


          <div className="calendar-header">


            <button
              onClick={
                previousMonth
              }
            >

              ‹

            </button>


            <h1>

              {monthNames[month]}
              {" "}
              {year}

            </h1>


            <button
              onClick={
                nextMonth
              }
            >

              ›

            </button>


          </div>


          <button

            className="today-btn"

            onClick={today}

          >

            Today

          </button>


          <div className="weekdays">

            {

              days.map(
                (day) => (

                  <div
                    key={day}
                  >

                    {day}

                  </div>

                )
              )

            }

          </div>


          <div className="calendar-grid">

            {calendarDays}

          </div>


        </div>


      </div>


      {/* ======================================================
          DAY EVENTS MODAL ("what's on this day")
      ====================================================== */}

      {

        showDayModal && selectedDate && (

          <div
            className="modal-overlay"
            onClick={() => setShowDayModal(false)}
          >

            <div

              className="event-modal day-modal"

              role="dialog"

              aria-modal="true"

              aria-labelledby="day-modal-heading"

              ref={dayModalRef}

              tabIndex={-1}

              onClick={(e) => e.stopPropagation()}

            >

              <button

                type="button"

                className="modal-close-x"

                aria-label="Close"

                onClick={() => setShowDayModal(false)}

              >

                &times;

              </button>


              <h2 id="day-modal-heading">

                {formatDate(selectedDate)}

                {

                  isSelectedDateToday && (

                    <span className="today-badge">

                      Today

                    </span>

                  )

                }

              </h2>


              {

                dayModalEvents.length === 0 ? (

                  <p className="day-modal-empty">

                    No events scheduled for this day.

                  </p>

                ) : (

                  <div className="day-modal-events">

                    {

                      dayModalEvents.map(
                        (event, index) => (

                          <div

                            className={
                              `day-modal-event ${event.category.toLowerCase()}`
                            }

                            key={index}

                          >

                            <div className="day-modal-event-header">

                              <strong>

                                {event.title}

                              </strong>


                              <span className="event-category-badge">

                                {event.category}

                              </span>

                            </div>


                            {

                              event.location && (

                                <p className="day-modal-event-location">

                                  {event.location}

                                </p>

                              )

                            }


                            {

                              event.time && (

                                <p className="day-modal-event-time">

                                  {event.time}

                                  {
                                    event.endTime &&
                                    ` - ${event.endTime}`
                                  }

                                </p>

                              )

                            }


                            {

                              event.description && (

                                <p className="day-modal-event-description">

                                  {event.description}

                                </p>

                              )

                            }

                          </div>

                        )
                      )

                    }

                  </div>

                )

              }


              <button

                type="button"

                className="book-boardroom-btn"

                onClick={openBookingModal}

              >

                + Book Boardroom

              </button>


              <button

                type="button"

                className="close-btn"

                onClick={() => setShowDayModal(false)}

              >

                Close

              </button>


            </div>

          </div>

        )

      }


      {/* ======================================================
          BOARDROOM BOOKING MODAL
      ====================================================== */}

      {

        showModal && (

          <div
            className="modal-overlay"
            onClick={() => setShowModal(false)}
          >

            <div
              className="event-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="booking-modal-heading"
              ref={bookingModalRef}
              tabIndex={-1}
              onClick={(e) => e.stopPropagation()}
            >

              <button

                type="button"

                className="modal-close-x"

                aria-label="Close"

                onClick={() => setShowModal(false)}

              >

                &times;

              </button>


              <h2 id="booking-modal-heading">

                Book Boardroom

              </h2>


              {

                selectedDate && (

                  <p className="booking-modal-date">

                    {formatDate(selectedDate)}

                  </p>

                )

              }


              {/* BOARDROOM */}

              <label htmlFor="boardroom-select">

                Boardroom

              </label>


              <select

                id="boardroom-select"

                value={
                  eventData.location
                }

                onChange={(e) =>

                  setEventData({

                    ...eventData,

                    location:
                      e.target.value,

                  })

                }

              >

                <option value="">

                  Select a boardroom...

                </option>

                {

                  BOARDROOM_LOCATIONS.map(
                    (room) => (

                      <option
                        key={room}
                        value={room}
                      >

                        {room}

                      </option>

                    )
                  )

                }

              </select>


              {/* TITLE */}

              <label htmlFor="booking-title">

                Booking Title

              </label>


              <input

                id="booking-title"

                type="text"

                placeholder="e.g. Budget Planning"

                value={
                  eventData.title
                }

                onChange={(e) =>

                  setEventData({

                    ...eventData,

                    title:
                      e.target.value,

                  })

                }

              />


              {/* DESCRIPTION */}

              <label htmlFor="booking-description">

                Description (optional)

              </label>


              <textarea

                id="booking-description"

                placeholder="Agenda, attendees, or other details"

                value={
                  eventData.description
                }

                onChange={(e) =>

                  setEventData({

                    ...eventData,

                    description:
                      e.target.value,

                  })

                }

              />


              {/* START TIME */}

              <label htmlFor="booking-start-time">

                Start Time

              </label>


              <input

                id="booking-start-time"

                type="time"

                value={
                  eventData.time
                }

                onChange={(e) =>

                  setEventData({

                    ...eventData,

                    time:
                      e.target.value,

                  })

                }

              />


              {/* END TIME */}

              <label htmlFor="booking-end-time">

                End Time

              </label>


              <input

                id="booking-end-time"

                type="time"

                value={
                  eventData.endTime
                }

                onChange={(e) =>

                  setEventData({

                    ...eventData,

                    endTime:
                      e.target.value,

                  })

                }

              />


              {/* BOOK */}

              <button
                onClick={saveEvent}
              >

                Book Boardroom

              </button>


              {/* CANCEL */}

              <button

                className="close-btn"

                onClick={() =>
                  setShowModal(false)
                }

              >

                Cancel

              </button>


            </div>

          </div>

        )

      }


    </div>

  );

};


export default Calendar;