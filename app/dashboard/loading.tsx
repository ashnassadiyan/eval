import { PageLoader } from "@/components/ui/PageLoader";

export default function DashboardLoading() {
  return (
    <PageLoader
      message="Loading Dashboard..."
      subtext="Fetching candidate evaluations, jobs, and credits"
      fullScreen={false}
    />
  );
}
