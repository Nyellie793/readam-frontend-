"use client";

/**
 * Last-resort boundary for errors thrown in the root layout itself. It replaces
 * the entire document, so it must render its own <html> and <body> and cannot
 * rely on global styles being applied.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F4F6FA",
          fontFamily:
            "ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          color: "#12161F",
          padding: "1.5rem",
        }}
      >
        <div
          style={{
            maxWidth: "26rem",
            width: "100%",
            background: "#FFFFFF",
            border: "1px solid #E7EBF2",
            borderRadius: "1rem",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: "1.25rem", fontWeight: 800, margin: "0 0 0.75rem" }}>
            ReadAM could not start
          </h1>
          <p style={{ fontSize: "0.875rem", lineHeight: 1.6, color: "#5F6878", margin: 0 }}>
            Something failed while loading the application. Reloading usually
            fixes it.
          </p>
          {error.digest && (
            <p style={{ fontSize: "0.6875rem", color: "#9AA3B2", marginTop: "1rem" }}>
              Reference: {error.digest}
            </p>
          )}
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "1.5rem",
              background: "#1D4ED8",
              color: "#FFFFFF",
              border: 0,
              borderRadius: "0.75rem",
              padding: "0.7rem 1.4rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
