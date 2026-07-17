import api from "@/lib/axios";

class Candidate {
  createCandidate(formData, id) {
    return api.post(`/candidates/evaluate_candidate/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  getCandidates(id, page = 1, limit = 10, ats, pro, match, status) {
    return api.get(
      `/candidates/get_candidates/${id}?page=${page}&limit=${limit}&ats=${ats}&pro=${pro}&match=${match}&status=${status}`
    );
  }
  getCv(id) {
    return api.post(`/candidates/get_cv`, {
      file_path: id,
    });
  }
}

export default new Candidate();
