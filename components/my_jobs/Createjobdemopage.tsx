"use client";

import { useState } from "react";
import CreateJobPage from "./Createjobpage";
import JobService from "../../store/services/job.service";
import { useRouter } from "next/navigation";
export interface CreateJobFormValues {
  employer: string;
  jobTitle: string;
  applicationDeadline: string;
  jdFile: File | null;
}

export default function CreateJobDemoPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(values: CreateJobFormValues) {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("employer", values.employer);
      formData.append("jobTitle", values.jobTitle);
      formData.append("applicationDeadline", values.applicationDeadline);
      if (values.jdFile) formData.append("jdFile", values.jdFile);

      await JobService.createJob(formData);

      console.log("Submitting job:", values);

      router.push("/my_jobs");
    } catch (e) {
      console.log(e);
    } finally {
      setIsSubmitting(false);
    }
  }

  return <CreateJobPage onSubmit={handleSubmit} isSubmitting={isSubmitting} />;
}
