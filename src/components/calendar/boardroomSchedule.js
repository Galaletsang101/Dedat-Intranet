// Powers the sidebar's "Boardroom Schedule" widget: only bookings from
// today onward (the copy says "upcoming", so past bookings shouldn't
// linger in the list forever), sorted chronologically, then grouped by
// day so the UI can show one date heading per day instead of repeating
// the date on every card.

export function getUpcomingBoardroomBookings(events, todayDateString) {
  return events
    .filter((event) => event.category === "Boardroom" && event.date >= todayDateString)
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
}

export function groupBookingsByDay(bookings) {
  const groups = [];

  for (const booking of bookings) {
    const lastGroup = groups[groups.length - 1];

    if (lastGroup && lastGroup.date === booking.date) {
      lastGroup.bookings.push(booking);
    } else {
      groups.push({ date: booking.date, bookings: [booking] });
    }
  }

  return groups;
}
