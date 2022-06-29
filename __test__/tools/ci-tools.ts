export function generateRandomLatLon(): { lat: string; lon: string } {
  const lat = (Math.round((Math.random() * 180 - 90) * 100) / 100).toString();
  const lon = (Math.round((Math.random() * 360 - 180) * 100) / 100).toString();
  return { lat, lon };
}
