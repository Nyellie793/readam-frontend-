import { ImageResponse } from "next/og";
import { BRAND_MARK_PATH, BRAND_MARK_VIEWBOX } from "@/lib/brand-mark";

export const alt = "ReadAM — AI-powered exam prep for Cameroonian students";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The card shown when a ReadAM link is shared on WhatsApp, Slack, X or
 * Facebook. Generated at build time rather than kept as a binary in /public,
 * so the copy stays in version control and cannot drift from the brand.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#071B4D",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 68,
              height: 68,
              borderRadius: 20,
              background: "#2563EB",
            }}
          >
            <svg width="40" height="32" viewBox={BRAND_MARK_VIEWBOX} fill="#FFFFFF">
              <path d={BRAND_MARK_PATH} />
            </svg>
          </div>
          <div style={{ display: "flex", fontSize: 46, letterSpacing: -1 }}>
            <span style={{ color: "#FFFFFF" }}>READ</span>
            <span style={{ color: "#F97316" }}>AM</span>
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 66,
              lineHeight: 1.12,
              color: "#FFFFFF",
              letterSpacing: -2,
              maxWidth: 940,
            }}
          >
            Pass the GCE and Bac with an AI tutor that actually explains.
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 26,
              fontSize: 30,
              color: "#94A3C4",
              maxWidth: 880,
            }}
          >
            Step-by-step answers, past questions, and video courses built for
            Cameroonian students.
          </div>
        </div>

        {/* Footer strip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "2px solid #16306B",
            paddingTop: 30,
          }}
        >
          <div style={{ display: "flex", gap: 14 }}>
            {["AI Tutor", "Past Questions", "Video Courses"].map((tag) => (
              <div
                key={tag}
                style={{
                  display: "flex",
                  padding: "10px 22px",
                  borderRadius: 999,
                  background: "#12285C",
                  color: "#C7D3EC",
                  fontSize: 24,
                }}
              >
                {tag}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#F97316" }}>
            readamcm.com
          </div>
        </div>
      </div>
    ),
    size
  );
}
