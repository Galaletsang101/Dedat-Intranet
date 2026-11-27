// Keep in sync with BOARDROOM_LOCATIONS in backend/server.js.
export const BOARDROOM_LOCATIONS = [
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

export const MONTH_NAMES = [
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
  "December",
];

export const WEEKDAY_LABELS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Shown instead of the full names on narrow screens, where 7 full
// weekday names crowd and overlap each other.
export const WEEKDAY_LABELS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Month-grid cells beyond this many events show a "+N more" indicator
// instead of overflowing the cell.
export const MAX_VISIBLE_EVENTS_PER_CELL = 2;

// Time-grid (Day/Week view) layout.
export const HOUR_HEIGHT_PX = 60;
export const GRID_START_HOUR = 0;
export const GRID_END_HOUR = 24;
export const BUSINESS_HOURS_START = 7;

export function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function getWeekStart(date) {
  return addDays(date, -date.getDay());
}
