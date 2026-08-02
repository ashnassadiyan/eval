import api from "@/lib/axios";

class NotificationService {
  /**
   * Send notification to user(s) via admin API
   * POST /notification/send_notification
   */
  sendNotification(payload) {
    return api.post("/notification/send_notification", payload);
  }
}

export default new NotificationService();
