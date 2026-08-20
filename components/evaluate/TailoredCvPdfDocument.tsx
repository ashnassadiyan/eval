import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";

export interface TailoredCvData {
  full_name?: string;
  professional_title?: string;
  contact?: {
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
  };
  executive_summary?: string;
  core_competencies?: string[];
  work_experience?: Array<{
    job_title?: string;
    company?: string;
    period?: string;
    key_achievements?: string[];
  }>;
  education?: Array<{
    degree?: string;
    institution?: string;
    year?: string;
  }>;
}

const styles = StyleSheet.create({
  page: {
    padding: 36,
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
    color: "#18181b",
    fontSize: 10,
    lineHeight: 1.4,
  },
  header: {
    borderBottomWidth: 2,
    borderBottomColor: "#000000",
    paddingBottom: 12,
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000000",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  title: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#27272a",
    marginBottom: 6,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    fontSize: 9,
    color: "#52525b",
  },
  contactItem: {
    marginRight: 10,
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#000000",
    borderBottomWidth: 1,
    borderBottomColor: "#e4e4e7",
    paddingBottom: 4,
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 9.5,
    color: "#27272a",
    lineHeight: 1.5,
  },
  skillsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  skillPill: {
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    fontSize: 8.5,
    fontWeight: "bold",
    color: "#18181b",
    marginBottom: 4,
    marginRight: 4,
  },
  jobBlock: {
    marginBottom: 10,
  },
  jobHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 3,
  },
  jobTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#000000",
  },
  companyPeriod: {
    fontSize: 9,
    color: "#52525b",
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 3,
    paddingLeft: 4,
  },
  bulletDot: {
    width: 10,
    fontSize: 10,
    color: "#000000",
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    color: "#27272a",
    lineHeight: 1.4,
  },
  eduBlock: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  eduDegree: {
    fontSize: 9.5,
    fontWeight: "bold",
    color: "#000000",
  },
  eduInst: {
    fontSize: 9,
    color: "#52525b",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 36,
    right: 36,
    textAlign: "center",
    fontSize: 8,
    color: "#a1a1aa",
    borderTopWidth: 1,
    borderTopColor: "#f4f4f5",
    paddingTop: 6,
  },
});

export default function TailoredCvPdfDocument({ data }: { data: TailoredCvData }) {
  const contact = data.contact || {};
  const contactItems = [
    contact.email,
    contact.phone,
    contact.location,
    contact.linkedin,
  ].filter(Boolean);

  return (
    <Document title={`Tailored_CV_${data.full_name || "Candidate"}`}>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.full_name || "CANDIDATE NAME"}</Text>
          {data.professional_title && (
            <Text style={styles.title}>{data.professional_title}</Text>
          )}
          {contactItems.length > 0 && (
            <View style={styles.contactRow}>
              {contactItems.map((item, idx) => (
                <Text key={idx} style={styles.contactItem}>
                  {item} {idx < contactItems.length - 1 ? "•" : ""}
                </Text>
              ))}
            </View>
          )}
        </View>

        {/* EXECUTIVE SUMMARY */}
        {data.executive_summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Executive Summary</Text>
            <Text style={styles.summaryText}>{data.executive_summary}</Text>
          </View>
        )}

        {/* CORE COMPETENCIES */}
        {data.core_competencies && data.core_competencies.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Core Competencies & Key Skills</Text>
            <View style={styles.skillsGrid}>
              {data.core_competencies.map((skill, idx) => (
                <Text key={idx} style={styles.skillPill}>
                  {skill}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* WORK EXPERIENCE */}
        {data.work_experience && data.work_experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Work Experience</Text>
            {data.work_experience.map((job, idx) => (
              <View key={idx} style={styles.jobBlock}>
                <View style={styles.jobHeaderRow}>
                  <Text style={styles.jobTitle}>{job.job_title || "Position"}</Text>
                  <Text style={styles.companyPeriod}>
                    {job.company ? `${job.company}  |  ` : ""}
                    {job.period || ""}
                  </Text>
                </View>
                {job.key_achievements &&
                  job.key_achievements.map((ach, aIdx) => (
                    <View key={aIdx} style={styles.bulletRow}>
                      <Text style={styles.bulletDot}>•</Text>
                      <Text style={styles.bulletText}>{ach}</Text>
                    </View>
                  ))}
              </View>
            ))}
          </View>
        )}

        {/* EDUCATION */}
        {data.education && data.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education & Qualifications</Text>
            {data.education.map((edu, idx) => (
              <View key={idx} style={styles.eduBlock}>
                <Text style={styles.eduDegree}>{edu.degree || "Degree"}</Text>
                <Text style={styles.eduInst}>
                  {edu.institution ? `${edu.institution} ` : ""}
                  {edu.year ? `(${edu.year})` : ""}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* FOOTER */}
        <Text style={styles.footer}>
          Generated with evalcv.app AI Engine — Tailored ATS Resume Document
        </Text>
      </Page>
    </Document>
  );
}
