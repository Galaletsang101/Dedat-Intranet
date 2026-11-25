import { HOUR_HEIGHT_PX } from "./calendarConstants";

const PX_PER_MINUTE = HOUR_HEIGHT_PX / 60;
const MIN_EVENT_HEIGHT_PX = 18;

export function minutesSinceMidnight(date) {
  return date.getHours() * 60 + date.getMinutes();
}

// Minutes elapsed since dayStart, computed from the actual elapsed time
// rather than `date`'s own hour/minute - a date clipped to the END of a
// visible range (midnight of the NEXT day) reports getHours() === 0,
// which would otherwise be indistinguishable from the day's own start.
function minutesFromDayStart(date, dayStart) {
  return (date - dayStart) / 60000;
}

/**
 * Positions events on a single day's vertical timeline.
 *
 * - Clips each event to [dayStart, dayEnd).
 * - Groups mutually-overlapping events into clusters, then greedily
 *   assigns each a column within its cluster (reusing a column once its
 *   previous occupant has ended), so overlapping events render side by
 *   side instead of stacking on top of each other.
 *
 * Returns the input events (preserving all original fields) annotated
 * with pixel `top`/`height` and `column`/`columnCount` for rendering.
 */
export function computeEventLayout(events, dayStart, dayEnd) {
  const clipped = events
    .map((event) => ({
      ...event,
      start: event.start < dayStart ? dayStart : event.start,
      end: event.end > dayEnd ? dayEnd : event.end,
    }))
    .filter((event) => event.end > event.start)
    .sort((a, b) => a.start - b.start || a.end - b.end);

  const clusters = [];
  let current = [];
  let clusterEnd = null;

  for (const event of clipped) {
    if (current.length === 0 || event.start < clusterEnd) {
      current.push(event);
      clusterEnd = clusterEnd ? new Date(Math.max(clusterEnd, event.end)) : event.end;
    } else {
      clusters.push(current);
      current = [event];
      clusterEnd = event.end;
    }
  }

  if (current.length > 0) {
    clusters.push(current);
  }

  const laidOut = [];

  for (const cluster of clusters) {
    const columnEndTimes = [];

    const positioned = cluster.map((event) => {
      let column = columnEndTimes.findIndex((end) => end <= event.start);

      if (column === -1) {
        column = columnEndTimes.length;
        columnEndTimes.push(event.end);
      } else {
        columnEndTimes[column] = event.end;
      }

      return { ...event, column };
    });

    const columnCount = columnEndTimes.length;

    for (const event of positioned) {
      const startMin = minutesFromDayStart(event.start, dayStart);
      const endMin = minutesFromDayStart(event.end, dayStart);

      laidOut.push({
        ...event,
        top: startMin * PX_PER_MINUTE,
        height: Math.max((endMin - startMin) * PX_PER_MINUTE, MIN_EVENT_HEIGHT_PX),
        columnCount,
      });
    }
  }

  return laidOut;
}

export function getCurrentTimePosition(now = new Date()) {
  return minutesSinceMidnight(now) * PX_PER_MINUTE;
}
