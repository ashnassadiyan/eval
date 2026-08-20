import { Metadata } from "next";
import OtherServicesClient from "./OtherServicesClient";

export const metadata: Metadata = {
  title: "Other Services — Small Business Automation & Smart NFC Cards | evalcv.app",
  description:
    "Elevate your small enterprise with custom AI workflow automation, CRM integrations, and smart physical NFC cards for instant social account sharing & 5-star Google review growth.",
  keywords: [
    "Small Enterprise Automation",
    "SME Workflow Automation",
    "NFC Cards for Social Accounts",
    "Smart Business Cards NFC",
    "Google Review Booster Card",
    "Instagram NFC Card",
    "Automated Lead Response",
    "CRM Integration SME",
    "EvalCV Other Services"
  ],
  openGraph: {
    title: "Small Enterprise Automation & Smart NFC Cards | evalcv.app",
    description:
      "Automate manual business processes and grow your social footprint with tap-to-share NFC cards.",
    url: "https://evalcv.app/other-services",
    siteName: "evalcv.app",
    type: "website",
  },
};

export default function OtherServicesPage() {
  return <OtherServicesClient />;
}
