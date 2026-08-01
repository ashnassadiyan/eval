import { PageLoader } from "@/components/ui/PageLoader";

export default function Loading() {
  return (
    <PageLoader
      message="Loading Page..."
      subtext="Preparing AI evaluation and candidate intelligence"
      fullScreen={true}
    />
  );
}
