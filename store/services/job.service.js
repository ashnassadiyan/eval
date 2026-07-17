import api from "@/lib/axios";

class JobService {
  createJob(formData) {
    return api.post("/jobs/create_job", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
  getMyJobs(page = 1, search = "", limit = 10) {
    return api.get(
      `/jobs/get_jobs?page=${page}&search=${search}&limit=${limit}`
    );
  }
  getJobDetails(id) {
    return api.get(`/jobs/get_job_details/${id}`);
  }

  updateJobDetails(id, job_stats, end_date) {
    return api.put(`/jobs/update_job/${id}`, { job_stats, end_date });
  }
}

export default new JobService();
