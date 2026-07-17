"use client";

import { useEffect, useState } from "react";
import { JobsPipelinePage } from "./JobsPipelinePage";
import jobService from "@/store/services/job.service";

export default function JobsDemoPage() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response: any = await jobService.getMyJobs(page, search);

        console.log("response", response);

        setData(response.data.jobs);
        setPage(response.data.page);
        setTotal(response.data.total);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [page, search]);

  console.log("page-1", page);

  return (
    <JobsPipelinePage
      jobs={data}
      search={search}
      setSearch={setSearch}
      page={page}
      setPage={setPage}
      pageSize={10}
      total={total}
      loading={loading}
    />
  );
}
