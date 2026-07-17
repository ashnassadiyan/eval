export interface JobPosting {
  id: string;
  title: string;
  company: string;
  roleId: string;
  documentId: string;
  location: string;
  department: string;
  reportingTo: string;
  status: string;
  deadline: string; // human readable, e.g. "Oct 24, 2024"
  pdfUrl: string; // URL to the JD PDF, rendered in the viewer
  description?: string; // used for SEO meta description
}
