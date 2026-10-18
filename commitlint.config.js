export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Commit messages must not have a scope, e.g. "fix: …" not "fix(group): …".
    "scope-empty": [2, "always"],
  },
  // Dependabot writes its own commit bodies (long release notes and URLs).
  ignores: [(message) => message.includes("Signed-off-by: dependabot[bot]")],
};
