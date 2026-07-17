import api from "@/lib/axios";

class UserService {
  getUserInsigts() {
    console.log("iwas called");
    return api.get("/auth/user_insights");
  }
}

export default new UserService();
