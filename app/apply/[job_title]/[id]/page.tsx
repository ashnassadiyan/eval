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

    const title = `${response.data.job_details?.job_title || "Job Opportunity"} | Apply Now`;

    const description =
      response.data.jd_text?.replace(/\s+/g, " ").trim().slice(0, 160) ??
      `Apply for ${response.data.job_details?.job_title || "this position"} on evalcv.app`;

    const canonicalUrl = `https://evalcv.app/apply/${encodeURIComponent(
      response.data.job_details?.job_title || "job"
    )}/${id}`;

    return {
      metadataBase: new URL("https://evalcv.app"),
      title,
      description,
      alternates: {
        canonical: canonicalUrl,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
      openGraph: {
        title,
        description,
        type: "website",
        url: canonicalUrl,
        siteName: "evalcv.app",
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
      title: "Job Application — evalcv.app",
      description: "Apply for job positions directly with instant CV matching.",
    };
  }
}

export default async function JobPage({ params }: PageProps) {
  const { id } = await params;

  try {
    const response = await jobService.getJobDetails(id);
    const job: JobDetails | null = response?.data ?? null;

    if (!job) {
      return <div className="p-12 text-center text-zinc-500 font-medium">Job posting not found.</div>;
    }

    const jobTitle = response.data.job_details?.job_title || "Open Role";

    const jobPostingJsonLd = {
      "@context": "https://schema.org",
      "@type": "JobPosting",
      title: jobTitle,
      description: response.data.jd_text || `Job application posting for ${jobTitle}`,
      datePosted: response.data.created || new Date().toISOString(),
      hiringOrganization: {
        "@type": "Organization",
        name: response.data.company || "evalcv Partner Network",
        sameAs: "https://evalcv.app",
      },
      employmentType: "FULL_TIME",
      directApply: true,
      url: `https://evalcv.app/apply/${encodeURIComponent(jobTitle)}/${id}`,
    };

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jobPostingJsonLd),
          }}
        />
        <JobPostingView job={job} />
      </>
    );
  } catch (error) {
    console.error("Failed to fetch job details:", error);
    return <div className="p-12 text-center text-zinc-500 font-medium">Job posting not found.</div>;
  }
}
