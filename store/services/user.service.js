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
}

export default new UserService();
