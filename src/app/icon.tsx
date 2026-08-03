import { ImageResponse } from "next/og";
import { BRAND_MARK_PATH, BRAND_MARK_VIEWBOX } from "@/lib/brand-mark";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * Browser tab and link-preview icon. Replaces the default create-next-app
 * favicon, and uses the same graduation-cap mark the UI draws via react-icons.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#2563EB",
          borderRadius: 7,
        }}
      >
        <svg width="19" height="15" viewBox={BRAND_MARK_VIEWBOX} fill="#FFFFFF">
          <path d={BRAND_MARK_PATH} />
        </svg>
      </div>
    ),
    size
  );
}
