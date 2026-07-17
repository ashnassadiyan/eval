import api from "@/lib/axios";

class CreditService{
    getUserCredit(){
        return api.get("/credit/get_user_credits");
    }
}

export default new CreditService();