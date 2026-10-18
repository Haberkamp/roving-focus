export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Commit messages must not have a scope, e.g. "fix: …" not "fix(group): …".
    "scope-empty": [2, "always"],
    // Dependabot bodies contain long release-note lines and URLs.
    "body-max-line-length": [0],
    "footer-max-line-length": [0],
  },
};
