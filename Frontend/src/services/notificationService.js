import { NOTIFICATION_WRAPPER_URL } from "../config/constants.js";

/**
 * POST /notify
 * Scenario 2 – emergency incident: notify a hiker's emergency contacts + nearby hikers via SMS.
 * @param {{
 *   hikerId: string,
 *   lat: number,
 *   lng: number,
 *   emergencyContacts: Array<{ name: string, phone: string }>,
 *   nearbyHikers: Array<{ userId: string, phone: string }>,
 *   message: string
 * }} data
 */
export async function sendEmergencyNotifications(data) {
  const res = await fetch(`${NOTIFICATION_WRAPPER_URL}/notify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Emergency notification failed");
  return res.json();
}

/**
 * POST /broadcast
 * Scenario 3 – hazard broadcast: notify all active hikers on an affected trail via SMS.
 * @param {{
 *   userIds: string[],
 *   phones: string[],
 *   trailId: string,
 *   operationalStatus: "CAUTION" | "CLOSED",
 *   hazardType: string,
 *   severity: number
 * }} data
 */
export async function broadcastTrailAlert(data) {
  const res = await fetch(`${NOTIFICATION_WRAPPER_URL}/broadcast`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Trail alert broadcast failed");
  return res.json();
}
