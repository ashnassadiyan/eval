import api from "@/lib/axios";

class CreditService{
    getUserCredit(){
        return api.get("/credit/get_user_credits");
    }

    addCredit(data){
        return api.post("/credit/add_credit", data);
    }
}

export default new CreditService();