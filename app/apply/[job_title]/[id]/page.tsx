import type { Metadata } from "next";
import { JobPostingView } from "@/components/apply/job-posting-view";
import jobService from "@/store/services/job.service";

interface JobDetails {
  id: string;
  job_title: string;
  jd_text?: string;
  jd_link?: string;
  created?: string;
  deadline?: string | null;
  status?: boolean;
  user?: number;
}

interface PageProps {
  params: Promise<{
    job_name: string;
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id, job_name } = await params;

  try {
    const response = await jobService.getJobDetails(id);
    const job: JobDetails | null = response?.data ?? null;

    console.log(response.data.job_details.job_title, "generateMetadata");

    if (!job) {
      return {
        title: response.data.job_details.job_title,
        description: "This job posting could not be found.",
      };
    }

    const title = `${response.data.job_details.job_title} | Apply Now`;

    const description =
      response.data.jd_text?.replace(/\s+/g, " ").trim().slice(0, 160) ??
      `Apply for ${response.data.job_details.job_title}`;

    return {
      title,
      description,

      openGraph: {
        title,
        description,
        type: "website",
        url: `https://recroot.app/apply/${encodeURIComponent(
          job.job_title
        )}/${id}`,
      },

      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
    };
  } catch (error) {
    console.error("Failed to fetch job details:", error);

    return {
      title: "Job Not Found",
      description: "This job posting could not be found.",
    };
  }
}

export default async function JobPage({ params }: PageProps) {
  const { id, job_name } = await params;

  try {
    const response = await jobService.getJobDetails(id);
    const job: JobDetails | null = response?.data ?? null;

    if (!job) {
      return <div>Job not found.</div>;
    }

    return <JobPostingView job={job} />;
  } catch (error) {
    console.error("Failed to fetch job details:", error);
    return <div>Job not found.</div>;
  }
}
