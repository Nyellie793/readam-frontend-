/**
 * The admin login page must NOT be wrapped in the sidebar layout,
 * so we give it its own layout that renders children directly.
 * This overrides the parent /admin/layout.tsx for this segment.
 */
export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
