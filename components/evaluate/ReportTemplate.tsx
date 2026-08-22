import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Svg,
  Circle,
  Path,
  Image,
  Font,
} from "@react-pdf/renderer";

/**
 * PdfReportDocument
 * ------------------
 * react-pdf replacement for the old html2canvas + jsPDF pipeline.
 * Renders with a real PDF layout engine — no DOM screenshotting,
 * so no SVG-rotation glitches, no font-metric drift, no clipped text.
 *
 * Usage:
 *   import { pdf } from "@react-pdf/renderer";
 *   const blob = await pdf(
 *     <PdfReportDocument
 *       evaluationResult={evaluationResult}
 *       candidateName={cvFile?.name?.replace(/\.[^/.]+$/, "")}
 *     />
 *   ).toBlob();
 *   // then trigger a download of `blob` as Evaluation_Report.pdf
 */

// ---- Optional: register a real font for nicer typography ----
// react-pdf defaults to Helvetica if you skip this. Uncomment and host
// your own .ttf files (Google Fonts links can go stale) if you want a
// closer visual match to the Tailwind "font-sans" stack.
//
// Font.register({
//   family: "Inter",
//   fonts: [
//     { src: "/fonts/Inter-Regular.ttf", fontWeight: 400 },
//     { src: "/fonts/Inter-Bold.ttf", fontWeight: 700 },
//     { src: "/fonts/Inter-Black.ttf", fontWeight: 900 },
//   ],
// });

interface SkillMatch {
  skill: string;
  match_percentage: number;
}

interface EvaluationResult {
  overall_match_percentage?: number;
  selection_probability?: number;
  ats_compatibility_score?: number;
  skill_matching?: SkillMatch[];
  missing_skills?: string[];
  strengths?: string[];
  weaknesses?: string[];
  recruiter_summary?: string;
}

interface PdfReportDocumentProps {
  evaluationResult: EvaluationResult;
  date?: string;
  candidateName?: string;
  jobTitle?: string;
  candidatePhotoUrl?: string;
}

const COLORS = {
  black: "#000000",
  white: "#ffffff",
  gray500: "#6b7280",
  gray400: "#9ca3af",
  gray300: "#d1d5db",
  gray200: "#e5e7eb",
  gray100: "#f3f4f6",
  bgSoft: "#FAFAFA",
  bgSofter: "#F8F9FA",
  border: "#EEEEEE",
  red50: "#fef2f2",
  red300: "#fca5a5",
  text700: "#374151",
  text800: "#1f2937",
  neonGreen: "#39FF14",
};

const styles = StyleSheet.create({
  page: {
    width: 794,
    height: 1123,
    backgroundColor: COLORS.white,
    paddingHorizontal: 64,
    paddingVertical: 56,
    fontFamily: "Helvetica",
    color: COLORS.black,
  },

  // Header
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: 28,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.black,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: 900,
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    marginTop: 6,
    fontSize: 10,
    color: COLORS.gray500,
    letterSpacing: 2,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  reportTitle: {
    fontSize: 15,
    fontWeight: 700,
  },
  confidentialPill: {
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: COLORS.red50,
  },
  confidentialText: {
    fontSize: 9,
    fontWeight: 700,
    color: COLORS.red300,
    letterSpacing: 1.2,
  },
  dateText: {
    marginTop: 8,
    fontSize: 9,
    fontWeight: 700,
    color: COLORS.gray500,
  },

  // Circles
  circleRow: {
    flexDirection: "row",
    gap: 24,
    marginTop: 40,
    marginBottom: 32,
  },
  circleCard: {
    flex: 1,
    backgroundColor: COLORS.bgSoft,
    borderWidth: 1,
    borderColor: COLORS.border,
    height: 168,
    alignItems: "center",
    justifyContent: "center",
  },
  circleWrap: {
    width: 96,
    height: 96,
    alignItems: "center",
    justifyContent: "center",
  },
  circleValueWrap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  circleValueText: {
    fontSize: 30,
    fontWeight: 900,
  },
  circleValuePct: {
    fontSize: 13,
  },
  circleLabel: {
    marginTop: 14,
    fontSize: 9,
    letterSpacing: 1.2,
    color: COLORS.gray500,
    fontWeight: 700,
  },

  divider: {
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
    marginBottom: 26,
  },

  // Main content
  mainRow: {
    flexDirection: "row",
    gap: 32,
    flexGrow: 1,
  },
  leftCol: {
    width: 220,
  },
  rightCol: {
    flex: 1,
  },

  sectionHeading: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: 1.4,
    paddingBottom: 4,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray300,
    alignSelf: "flex-start",
  },

  skillBlock: {
    marginBottom: 16,
  },
  skillRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  skillName: {
    fontSize: 9,
    fontWeight: 700,
    maxWidth: 140,
  },
  skillPct: {
    fontSize: 9,
    fontWeight: 700,
  },
  skillTrack: {
    height: 4,
    width: "100%",
    backgroundColor: COLORS.gray200,
  },
  skillFill: {
    height: 4,
    backgroundColor: COLORS.black,
  },

  missingList: {
    marginTop: 4,
  },
  missingItem: {
    flexDirection: "row",
    marginBottom: 6,
  },
  missingX: {
    fontSize: 9,
    fontWeight: 700,
    color: COLORS.gray300,
    marginRight: 6,
  },
  missingText: {
    fontSize: 9,
    color: COLORS.text700,
    flex: 1,
  },

  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  sectionHeaderText: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: 1.4,
  },

  strengthsBox: {
    backgroundColor: COLORS.bgSofter,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.black,
  },
  weaknessesBox: {
    backgroundColor: COLORS.bgSofter,
    padding: 14,
  },
  bulletItem: {
    flexDirection: "row",
    marginBottom: 10,
    gap: 6,
  },
  bulletDot: {
    fontSize: 11,
    fontWeight: 700,
  },
  bulletText: {
    fontSize: 10,
    lineHeight: 1.5,
    color: COLORS.text800,
    flex: 1,
  },

  recommendationBox: {
    backgroundColor: COLORS.black,
    padding: 24,
    marginTop: 18,
  },
  recommendationHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  recommendationHeaderText: {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: 1.4,
    color: COLORS.white,
  },
  recommendationText: {
    fontSize: 10,
    lineHeight: 1.6,
    fontStyle: "italic",
    color: COLORS.gray300,
  },

  // Footer
  footerRow: {
    marginTop: 34,
    borderTopWidth: 2,
    borderTopColor: COLORS.black,
    paddingTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
  },
  footerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarBox: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.gray200,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImg: {
    width: 40,
    height: 40,
    objectFit: "cover",
  },
  evalIdText: {
    fontSize: 11,
    fontWeight: 700,
  },
  subjectText: {
    fontSize: 9,
    color: COLORS.gray500,
    marginTop: 2,
  },

  stampWrap: {
    position: "absolute",
    right: 36,
    bottom: 6,
    width: 120,
    opacity: 0.25,
    transform: "rotate(-12deg)",
    borderWidth: 2,
    borderColor: COLORS.gray400,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  stampText: {
    fontSize: 13,
    fontWeight: 900,
    color: COLORS.gray400,
    letterSpacing: 1.5,
    textAlign: "center",
    lineHeight: 1.3,
  },

  pageFooterRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  pageFooterText: {
    fontSize: 8,
    color: COLORS.gray400,
    letterSpacing: 0.8,
  },
  pageFooterBold: {
    fontSize: 8,
    fontWeight: 700,
    color: COLORS.black,
  },
});

/** Builds an SVG arc path for a progress ring, starting at 12 o'clock
 *  and sweeping clockwise. Avoids relying on strokeDashoffset (not part
 *  of react-pdf's Circle prop types) by drawing an actual arc Path —
 *  this is the most reliable way to render a partial ring in react-pdf. */
function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngleDeg: number,
  endAngleDeg: number
) {
  const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180;
  const start = {
    x: cx + r * Math.cos(toRad(startAngleDeg)),
    y: cy + r * Math.sin(toRad(startAngleDeg)),
  };
  const end = {
    x: cx + r * Math.cos(toRad(endAngleDeg)),
    y: cy + r * Math.sin(toRad(endAngleDeg)),
  };
  const largeArcFlag = endAngleDeg - startAngleDeg <= 180 ? 0 : 1;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
}

/** Circular progress ring drawn with real PDF vector primitives.
 *  No CSS transforms involved, so no html2canvas rotation artifacts. */
const ProgressCircle: React.FC<{ value: number; label: string }> = ({
  value,
  label,
}) => {
  const size = 96;
  const center = size / 2;
  const radius = 38;
  const strokeWidth = 7;
  const clamped = Math.max(0, Math.min(100, value || 0));
  // 99.999 instead of 100 avoids a degenerate zero-length arc when value === 100
  const sweepDeg = (Math.min(clamped, 99.999) / 100) * 360;

  return (
    <View style={styles.circleCard}>
      <View style={styles.circleWrap}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Track (full circle) */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={COLORS.gray200}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress arc, starting at 12 o'clock, sweeping clockwise */}
          {clamped > 0 && (
            <Path
              d={describeArc(center, center, radius, 0, sweepDeg)}
              stroke={COLORS.black}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
            />
          )}
        </Svg>
        <View style={styles.circleValueWrap}>
          <Text style={styles.circleValueText}>
            {clamped}
            <Text style={styles.circleValuePct}>%</Text>
          </Text>
        </View>
      </View>
      <Text style={styles.circleLabel}>{label.toUpperCase()}</Text>
    </View>
  );
};

const ShieldCheckIcon = () => (
  <Svg width={12} height={12} viewBox="0 0 24 24">
    <Path
      d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
      stroke={COLORS.black}
      strokeWidth={2}
      fill="none"
    />
    <Path d="m9 12 2 2 4-4" stroke={COLORS.black} strokeWidth={2} fill="none" />
  </Svg>
);

const AlertTriangleIcon = () => (
  <Svg width={12} height={12} viewBox="0 0 24 24">
    <Path
      d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"
      stroke={COLORS.black}
      strokeWidth={2}
      fill="none"
    />
    <Path d="M12 9v4" stroke={COLORS.black} strokeWidth={2} fill="none" />
    <Path d="M12 17h.01" stroke={COLORS.black} strokeWidth={2} fill="none" />
  </Svg>
);

const BulbIcon = () => (
  <Svg width={12} height={12} viewBox="0 0 24 24">
    <Path
      d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5"
      stroke={COLORS.neonGreen}
      strokeWidth={2}
      fill="none"
    />
    <Path d="M9 18h6" stroke={COLORS.neonGreen} strokeWidth={2} fill="none" />
    <Path d="M10 22h4" stroke={COLORS.neonGreen} strokeWidth={2} fill="none" />
  </Svg>
);

const PersonIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24">
    <Path
      d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"
      stroke={COLORS.gray400}
      strokeWidth={2}
      fill="none"
    />
    <Circle
      cx={12}
      cy={7}
      r={4}
      stroke={COLORS.gray400}
      strokeWidth={2}
      fill="none"
    />
  </Svg>
);

export const PdfReportDocument: React.FC<PdfReportDocumentProps> = ({
  evaluationResult,
  date,
  candidateName,
  jobTitle,
  candidatePhotoUrl,
}) => {
  const today =
    date ||
    new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  const cName = candidateName || "Candidate Application";
  const jTitle = jobTitle || "Evaluation";
  const evalId = `PR-${new Date().getFullYear()}-${
    Math.floor(Math.random() * 9000) + 1000
  }`;

  const skillMatching = (evaluationResult.skill_matching || []).slice(0, 5);
  const missingSkills = evaluationResult.missing_skills || [];
  const strengths = evaluationResult.strengths || [];
  const weaknesses = evaluationResult.weaknesses || [];

  return (
    <Document>
      <Page size={[794, 1123]} style={styles.page}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.brandTitle}>EVALCV.app</Text>
            <Text style={styles.brandSubtitle}>EVALCV AI SOLUTIONS</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.reportTitle}>CV EVALUATION DETAILS</Text>
            <View style={styles.confidentialPill}>
              <Text style={styles.confidentialText}>CONFIDENTIAL</Text>
            </View>
            <Text style={styles.dateText}>Date: {today}</Text>
          </View>
        </View>

        {/* Circles */}
        <View style={styles.circleRow}>
          <ProgressCircle
            value={evaluationResult.overall_match_percentage || 0}
            label="Overall Match"
          />
          <ProgressCircle
            value={evaluationResult.selection_probability || 0}
            label="Selection Prob."
          />
          <ProgressCircle
            value={evaluationResult.ats_compatibility_score || 0}
            label="ATS Compatibility"
          />
        </View>

        <View style={styles.divider} />

        {/* Main content */}
        <View style={styles.mainRow}>
          {/* Left column */}
          <View style={styles.leftCol}>
            <Text style={styles.sectionHeading}>TECHNICAL MATCH</Text>
            <View>
              {skillMatching.map((skill, i) => (
                <View style={styles.skillBlock} key={i}>
                  <View style={styles.skillRow}>
                    <Text style={styles.skillName}>{skill.skill}</Text>
                    <Text style={styles.skillPct}>
                      {skill.match_percentage}%
                    </Text>
                  </View>
                  <View style={styles.skillTrack}>
                    <View
                      style={[
                        styles.skillFill,
                        {
                          width: `${Math.max(
                            0,
                            Math.min(100, skill.match_percentage || 0)
                          )}%`,
                        },
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>

            <Text style={[styles.sectionHeading, { marginTop: 22 }]}>
              MISSING SKILLS
            </Text>
            <View style={styles.missingList}>
              {missingSkills.map((skill, i) => (
                <View style={styles.missingItem} key={i}>
                  <Text style={styles.missingX}>×</Text>
                  <Text style={styles.missingText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Right column */}
          <View style={styles.rightCol}>
            <View style={styles.sectionHeaderRow}>
              <ShieldCheckIcon />
              <Text style={styles.sectionHeaderText}>STRENGTHS</Text>
            </View>
            <View style={styles.strengthsBox}>
              {strengths.map((str, i) => (
                <View style={styles.bulletItem} key={i}>
                  <Text style={styles.bulletDot}>•</Text>
                  <Text style={styles.bulletText}>{str}</Text>
                </View>
              ))}
            </View>

            <View style={[styles.sectionHeaderRow, { marginTop: 22 }]}>
              <AlertTriangleIcon />
              <Text style={styles.sectionHeaderText}>WEAKNESSES</Text>
            </View>
            <View style={styles.weaknessesBox}>
              {weaknesses.map((wk, i) => (
                <View style={styles.bulletItem} key={i}>
                  <Text style={styles.bulletDot}>•</Text>
                  <Text style={styles.bulletText}>{wk}</Text>
                </View>
              ))}
            </View>

            <View style={styles.recommendationBox}>
              <View style={styles.recommendationHeaderRow}>
                <BulbIcon />
                <Text style={styles.recommendationHeaderText}>
                  AI RECOMMENDATION
                </Text>
              </View>
              <Text style={styles.recommendationText}>
                &quot;{evaluationResult.recruiter_summary}&quot;
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footerRow}>
          <View style={styles.footerLeft}>
            <View style={styles.avatarBox}>
              {candidatePhotoUrl ? (
                <Image src={candidatePhotoUrl} style={styles.avatarImg} />
              ) : (
                <PersonIcon />
              )}
            </View>
            <View>
              <Text style={styles.evalIdText}>Evaluation ID: {evalId}</Text>
              <Text style={styles.subjectText}>
                Subject: {cName} - {jTitle}
              </Text>
            </View>
          </View>

          <View style={styles.stampWrap}>
            <Text style={styles.stampText}>VERIFIED{"\n"}PRECISION AI</Text>
          </View>
        </View>

        {/* Page footer */}
        <View style={styles.pageFooterRow}>
          <Text style={styles.pageFooterText}>
            EVALCV.app AI - CANDIDATE DETAIL REPORT
          </Text>
          <Text style={styles.pageFooterBold}>PAGE 1 OF 1</Text>
        </View>
      </Page>
    </Document>
  );
};

export default PdfReportDocument;
