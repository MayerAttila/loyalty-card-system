export const getNotificationColor = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }

  // Use a deterministic RGB color derived from the hash (much larger color
  // space than a small palette/HSL buckets) to reduce visible collisions.
  const normalizeChannel = (value: number) =>
    Math.round(64 + (value / 255) * 156); // 64..220 (visible on dark bg)

  let r = normalizeChannel(hash & 0xff);
  let g = normalizeChannel((hash >>> 8) & 0xff);
  let b = normalizeChannel((hash >>> 16) & 0xff);

  // Avoid gray-ish dots by boosting one channel when the spread is too low.
  const spread = Math.max(r, g, b) - Math.min(r, g, b);
  if (spread < 36) {
    const boostIndex = (hash >>> 24) % 3;
    if (boostIndex === 0) r = Math.min(235, r + 44);
    if (boostIndex === 1) g = Math.min(235, g + 44);
    if (boostIndex === 2) b = Math.min(235, b + 44);
  }

  return `rgb(${r}, ${g}, ${b})`;
};

export const notificationWeekdayToJsDay = (day: string) => {
  switch (day) {
    case "sun":
      return 0;
    case "mon":
      return 1;
    case "tue":
      return 2;
    case "wed":
      return 3;
    case "thu":
      return 4;
    case "fri":
      return 5;
    case "sat":
      return 6;
    default:
      return null;
  }
};
