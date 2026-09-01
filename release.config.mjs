export default {
  packages: ["packages/core"],
  tagPackage: "packages/core",
  qaCommand: "pnpm release:check",
  syncLockfile: true,
  commitMessage: (version) => `chore(core): release v${version}`,
};
