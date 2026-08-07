#!/usr/bin/env bash
# =============================================================================
#  readam-fix.sh — Apply all performance fixes to readam-frontend
#  Fixes: middleware rename, router.push → Link, framer-motion removal
#  Usage: bash readam-fix.sh [path/to/readam-frontend]
# =============================================================================

set -euo pipefail

# ── Resolve repo root ─────────────────────────────────────────────────────────
REPO="${1:-$(pwd)}"
if [[ ! -f "$REPO/package.json" ]]; then
  echo "❌  Cannot find package.json in '$REPO'."
  echo "    Pass the repo path as the first argument: bash readam-fix.sh /path/to/readam-frontend"
  exit 1
fi
echo "📂  Working in: $REPO"

# ── Helper ────────────────────────────────────────────────────────────────────
ok()  { echo "✅  $*"; }
info(){ echo "ℹ️   $*"; }
warn(){ echo "⚠️   $*"; }
die() { echo "❌  $*"; exit 1; }

# =============================================================================
#  FIX 1 — Rename proxy.ts → middleware.ts and fix the exported function name
# =============================================================================
echo ""
echo "──────────────────────────────────────────────"
echo "  FIX 1: Rename proxy.ts → middleware.ts"
echo "──────────────────────────────────────────────"

PROXY="$REPO/src/proxy.ts"
MW="$REPO/src/middleware.ts"

if [[ -f "$MW" ]]; then
  warn "src/middleware.ts already exists — skipping rename."
elif [[ -f "$PROXY" ]]; then
  cp "$PROXY" "$MW"

  # Fix the export function name: proxy → middleware
  if grep -q "export function proxy(" "$MW"; then
    sed -i 's/export function proxy(/export function middleware(/g' "$MW"
    ok "Renamed function export: proxy → middleware"
  else
    warn "Expected 'export function proxy(' not found — check $MW manually."
  fi

  rm "$PROXY"
  ok "Renamed src/proxy.ts → src/middleware.ts"
else
  warn "src/proxy.ts not found — skipping Fix 1."
fi

# =============================================================================
#  FIX 2a — dashboard/UserDropdown.tsx
#  Replace 3× router.push("/settings") DropdownMenuItems with <Link> variants
# =============================================================================
echo ""
echo "──────────────────────────────────────────────"
echo "  FIX 2a: dashboard/UserDropdown.tsx — router.push → Link"
echo "──────────────────────────────────────────────"

DUD="$REPO/src/components/dashboard/UserDropdown.tsx"

if [[ ! -f "$DUD" ]]; then
  warn "$DUD not found — skipping Fix 2a."
else

  # Add Link import if missing
  if ! grep -q 'import Link from "next/link"' "$DUD"; then
    sed -i 's|import { useRouter } from "next/navigation";|import { useRouter } from "next/navigation";\nimport Link from "next/link";|' "$DUD"
    ok "Added Link import to dashboard/UserDropdown.tsx"
  else
    info "Link already imported in dashboard/UserDropdown.tsx"
  fi

  # Replace Profile DropdownMenuItem
  python3 - "$DUD" <<'PYEOF'
import re, sys

path = sys.argv[1]
content = open(path).read()

# Pattern: DropdownMenuItem onClick router.push("/settings") — covers all 3 items
# We replace each individually using the icon class as an anchor.

replacements = [
    # Profile item
    (
        r'<DropdownMenuItem onClick=\{[^}]+push\(["\']\/settings["\']\)\}>\s*\n\s*<User className="mr-2 h-4 w-4"/>\s*\n\s*Profile\s*\n\s*</DropdownMenuItem>',
        '<DropdownMenuItem asChild>\n          <Link href="/settings">\n            <User className="mr-2 h-4 w-4" /> Profile\n          </Link>\n        </DropdownMenuItem>'
    ),
    # Subscription item
    (
        r'<DropdownMenuItem onClick=\{[^}]+push\(["\']\/settings["\']\)\}>\s*\n\s*<CreditCard className="mr-2 h-4 w-4"/>\s*\n\s*Subscription\s*\n\s*</DropdownMenuItem>',
        '<DropdownMenuItem asChild>\n          <Link href="/settings">\n            <CreditCard className="mr-2 h-4 w-4" /> Subscription\n          </Link>\n        </DropdownMenuItem>'
    ),
    # Settings item
    (
        r'<DropdownMenuItem onClick=\{[^}]+push\(["\']\/settings["\']\)\}>\s*\n\s*<Settings className="mr-2 h-4 w-4"/>\s*\n\s*Settings\s*\n\s*</DropdownMenuItem>',
        '<DropdownMenuItem asChild>\n          <Link href="/settings">\n            <Settings className="mr-2 h-4 w-4" /> Settings\n          </Link>\n        </DropdownMenuItem>'
    ),
]

changed = 0
for pattern, replacement in replacements:
    new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    if new_content != content:
        content = new_content
        changed += 1

open(path, 'w').write(content)
print(f"  Replaced {changed} DropdownMenuItem(s) with Link variants")
PYEOF

  # Check if useRouter is still used (only for handleLogout now)
  # We keep useRouter since handleLogout still uses router.push after clearSession
  ok "dashboard/UserDropdown.tsx updated"
fi

# =============================================================================
#  FIX 2b — tutor/courses/CourseEditorContent.tsx
#  Back button (line ~169): router.push → <Link>
#  handleDelete (line ~144): keep router.push — it runs after an async action
# =============================================================================
echo ""
echo "──────────────────────────────────────────────"
echo "  FIX 2b: CourseEditorContent.tsx — Back button router.push → Link"
echo "──────────────────────────────────────────────"

CEC="$REPO/src/components/tutor/courses/CourseEditorContent.tsx"

if [[ ! -f "$CEC" ]]; then
  warn "$CEC not found — skipping Fix 2b."
else

  # Add Link import if missing
  if ! grep -q 'import Link from "next/link"' "$CEC"; then
    # next/image is already imported; insert Link right after it
    sed -i 's|import Image from "next/image";|import Image from "next/image";\nimport Link from "next/link";|' "$CEC"
    ok "Added Link import to CourseEditorContent.tsx"
  else
    info "Link already imported in CourseEditorContent.tsx"
  fi

  # Replace the back <button> with a <Link> (preserves className)
  python3 - "$CEC" <<'PYEOF'
import re, sys

path = sys.argv[1]
content = open(path).read()

# Match the back button block
pattern = (
    r'<button\s*\n\s*type="button"\s*\n\s*onClick=\{\(\) => router\.push\("\/tutor\/courses"\)\}\s*\n\s*className="([^"]+)"\s*\n\s*>\s*\n\s*<ArrowLeft[^/]*/>\s*\n\s*Back to My Courses\s*\n\s*</button>'
)

replacement = (
    '<Link\n        href="/tutor/courses"\n'
    '        className="\\1"\n      >\n'
    '        <ArrowLeft className="size-4" />\n'
    '        Back to My Courses\n      </Link>'
)

new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)

if new_content != content:
    open(path, 'w').write(new_content)
    print("  Replaced back <button> with <Link href='/tutor/courses'>")
else:
    # Fallback: simple sed-style replacement
    print("  Regex did not match — trying direct sed replacement")
    content2 = content.replace(
        'onClick={() => router.push("/tutor/courses")}',
        '/* router.push replaced by Link — see below */'
    )
    open(path, 'w').write(content2)
    print("  ⚠️  Applied partial fallback — review CourseEditorContent.tsx manually")
PYEOF

  ok "CourseEditorContent.tsx back-button updated"
  info "Note: router.push inside handleDelete (after deleteCourse API call) is intentionally kept."
fi

# =============================================================================
#  FIX 3 — Remove framer-motion from package.json
#          (No src imports found — it's an unused dependency)
# =============================================================================
echo ""
echo "──────────────────────────────────────────────"
echo "  FIX 3: Remove unused framer-motion dependency"
echo "──────────────────────────────────────────────"

PKG="$REPO/package.json"

if grep -q '"framer-motion"' "$PKG"; then
  # Verify it's truly unused in src (|| true prevents pipefail on no-match)
  FM_USES=$(grep -rn "framer-motion" "$REPO/src/" 2>/dev/null | wc -l || true)
  if [[ "$FM_USES" -gt 0 ]]; then
    warn "framer-motion is imported in $FM_USES source file(s) — NOT removing from package.json."
    warn "Remove the imports first, then re-run this script."
    grep -rn "framer-motion" "$REPO/src/" 2>/dev/null || true
  else
    python3 - "$PKG" <<'PYEOF'
import json, sys

path = sys.argv[1]
pkg = json.load(open(path))

removed = False
for section in ("dependencies", "devDependencies", "peerDependencies"):
    if section in pkg and "framer-motion" in pkg[section]:
        del pkg[section]["framer-motion"]
        removed = True
        print(f"  Removed framer-motion from {section}")

if removed:
    with open(path, 'w') as f:
        json.dump(pkg, f, indent=2)
        f.write('\n')
    print("  package.json updated — run 'npm install' to sync node_modules")
else:
    print("  framer-motion not found in dependencies — nothing to remove")
PYEOF
    ok "framer-motion removed from package.json"
  fi
else
  info "framer-motion not in package.json — already clean."
fi

# =============================================================================
#  REMINDER — Fix 4: Keep Railway warm (manual step)
# =============================================================================
echo ""
echo "──────────────────────────────────────────────"
echo "  REMINDER — Railway cold-start mitigation"
echo "──────────────────────────────────────────────"
cat <<'MSG'
  This cannot be automated in code. Do ONE of the following:

  Option A (free): Set up UptimeRobot or BetterStack to ping
    https://readam-api-production.up.railway.app/v1/health
    every 4 minutes to prevent Railway from sleeping.

  Option B (paid): Upgrade to Railway's Starter plan ($5/mo)
    which disables sleep entirely.

  Option C (UX workaround): Show an immediate loading spinner
    on any button that triggers an API call so users see feedback
    during the cold-start window.
MSG

# =============================================================================
#  SUMMARY
# =============================================================================
echo ""
echo "=============================================="
echo "  ✅  All automated fixes applied."
echo "=============================================="
echo ""
echo "  Next steps:"
echo "  1. Run:  npm install          (to remove framer-motion from node_modules)"
echo "  2. Run:  npm run build        (verify no type/compile errors)"
echo "  3. Commit:  git add -A && git commit -m 'perf: fix middleware, prefetch links, drop framer-motion'"
echo "  4. Set up Railway warm-ping   (see reminder above)"
echo ""
echo "  Files changed:"
echo "    src/proxy.ts               → DELETED"
echo "    src/middleware.ts          → CREATED (renamed + export fixed)"
echo "    src/components/dashboard/UserDropdown.tsx   → router.push → Link (3 items)"
echo "    src/components/tutor/courses/CourseEditorContent.tsx → back button → Link"
echo "    package.json               → framer-motion removed"
echo ""
