// Set EXPO_PUBLIC_API_BASE_URL in .env to point at the web app.
// Use your Mac's local IP (e.g. http://192.168.x.x:3000) when testing on a physical device—localhost won't work.
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:3000"
