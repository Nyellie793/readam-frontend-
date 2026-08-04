import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      /**
       * Downgraded from error to warning, deliberately.
       *
       * Every remaining occurrence is one of two correct idioms:
       *
       *   1. `setLoading(true)` immediately before an async fetch, so that a
       *      refetch (period toggle, search change, route param change) shows
       *      its loading state. Initial-mount cases already use useState(true).
       *
       *   2. Resetting a dialog's local state when it opens, e.g. LessonPicker
       *      and SubjectPicker clearing a previous selection.
       *
       * The rule exists to catch cascading render loops. Neither pattern loops:
       * both set state once per intentional trigger. The idiomatic alternatives
       * are a data-fetching library or key-based remounts, and both are larger
       * refactors than the problem currently warrants.
       *
       * Kept as a warning so genuinely new violations still surface.
       */
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
