import { useState } from "react";
import { submitIncidentReport } from "../services/emergencyService.js";
import { sendEmergencyNotifications } from "../services/notificationService.js";

export function useEmergency() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function submitReport(incidentData) {
    setLoading(true);
    setError(null);
    try {
      // Fire SMS notification directly via notification wrapper
      const { contactName, contactPhone, trailId, injuryType, severity } = incidentData;
      if (contactPhone) {
        const message = `TRAILGUARD SOS: ${injuryType} (severity ${severity}/5) reported on ${trailId || "trail"}. Please respond immediately.`;
        await sendEmergencyNotifications({
          hikerId: "web-user",
          lat: 0, lng: 0,
          emergencyContacts: [{ name: contactName || "Emergency Contact", phone: contactPhone }],
          nearbyHikers: [],
          message,
        });
      }

      // Also attempt the orchestrator (may not be running locally)
      try {
        const data = await submitIncidentReport(incidentData);
        setReport(data);
        return data;
      } catch {
        // Orchestrator not available — treat SMS-only as a success for demo
        setReport({ status: "notified" });
        return { status: "notified" };
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return { report, loading, error, submitReport };
}
