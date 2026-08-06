import api from "@/lib/axios";

class UserService {
  getUserInsigts() {
    console.log("iwas called");
    return api.get("/auth/user_insights");
  }

  getAllUsers(params = {}) {
    return api.get("/auth/all_users", { params });
  }

  updateUserStatus(data) {
    return api.put("/auth/update_active", data);
  }

  forgotPassword(email) {
    return api.post("/auth/forgot_password", { email });
  }

  verifyResetOtp(data) {
    return api.post("/auth/verify_reset_otp", data);
  }

  resetPassword(data) {
    return api.post("/auth/reset_password", data);
  }

  resendOtp(email) {
    return api.post("/auth/resend_otp", { email });
  }
}

export default new UserService();
