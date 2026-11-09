import { apiRequest } from "./api.js";

export const getCalendarEvents = () => apiRequest("/calendar-events");

export const createCalendarEvent = (event) =>
  apiRequest("/calendar-events", {
    method: "POST",
    body: JSON.stringify(event),
  });
