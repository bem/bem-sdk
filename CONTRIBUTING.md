# Contributing

When contributing to this repository, please first discuss the change you wish to make via issue,
email, or any other method with the owners of this repository before making a change.

Please note we have a code of conduct, please follow it in all your interactions with the project.

## Local development

Requirements:

- **Node.js >= 20** (CI matrix: 20, 22, 24).
- **pnpm 11**, installed via [Corepack](https://nodejs.org/api/corepack.html):

  ```sh
  corepack enable
  ```

Setup:

```sh
pnpm install
pnpm typecheck    # tsc --build (production) + tsc on test files
pnpm lint         # ESLint 10 flat config
pnpm test         # Mocha 11 + Chai 6 + tsx (TypeScript ESM)
pnpm test:cover   # c8 coverage
```

Project layout:

- `packages/*` — independent published packages, each ESM-only TypeScript.
- `pnpm-workspace.yaml` — workspace + version catalog.
- `tsconfig.base.json` — strict TS baseline (NodeNext, ES2023, composite).
- `eslint.config.js` — flat config.
- `.mocharc.json` — mocha config rooted at `packages/*/src/**/*.test.ts`.
- `.changeset/` — pending changesets (each one PR-able).
- `.github/workflows/` — CI (Node 20/22/24 matrix) and changesets-driven release.

## Pull Request Process

1. Add a changeset describing your change:

   ```sh
   pnpm changeset
   ```

   Pick the affected package(s), the bump level (major/minor/patch) and write a
   one-paragraph explanation of the user-visible change. The file lands under
   `.changeset/` and gets committed together with your code.

2. Make sure `pnpm typecheck`, `pnpm lint` and `pnpm test` are all green
   locally — these are the same checks CI runs.

3. Update the package's README if the public API changed (entry name, options,
   types, etc.).

4. Open the PR. CI is required to pass before merge. Releases are produced
   automatically by the `changesets/action` workflow when the changeset PR
   is merged into `master`.

## Code of Conduct

### Our Pledge

In the interest of fostering an open and welcoming environment, we as
contributors and maintainers pledge to making participation in our project and
our community a harassment-free experience for everyone, regardless of age, body
size, disability, ethnicity, gender identity and expression, level of experience,
nationality, personal appearance, race, religion, or sexual identity and
orientation.

### Our Standards

Examples of behavior that contributes to creating a positive environment
include:

* Using welcoming and inclusive language
* Being respectful of differing viewpoints and experiences
* Gracefully accepting constructive criticism
* Focusing on what is best for the community
* Showing empathy towards other community members

Examples of unacceptable behavior by participants include:

* The use of sexualized language or imagery and unwelcome sexual attention or
advances
* Trolling, insulting/derogatory comments, and personal or political attacks
* Public or private harassment
* Publishing others' private information, such as a physical or electronic
  address, without explicit permission
* Other conduct which could reasonably be considered inappropriate in a
  professional setting

### Our Responsibilities

Project maintainers are responsible for clarifying the standards of acceptable
behavior and are expected to take appropriate and fair corrective action in
response to any instances of unacceptable behavior.

Project maintainers have the right and responsibility to remove, edit, or
reject comments, commits, code, wiki edits, issues, and other contributions
that are not aligned to this Code of Conduct, or to ban temporarily or
permanently any contributor for other behaviors that they deem inappropriate,
threatening, offensive, or harmful.

### Scope

This Code of Conduct applies both within project spaces and in public spaces
when an individual is representing the project or its community. Examples of
representing a project or community include using an official project e-mail
address, posting via an official social media account, or acting as an appointed
representative at an online or offline event. Representation of a project may be
further defined and clarified by project maintainers.

### Enforcement

Instances of abusive, harassing, or otherwise unacceptable behavior may be
reported by contacting the project team at [info@bem.info](). All
complaints will be reviewed and investigated and will result in a response that
is deemed necessary and appropriate to the circumstances. The project team is
obligated to maintain confidentiality with regard to the reporter of an incident.
Further details of specific enforcement policies may be posted separately.

Project maintainers who do not follow or enforce the Code of Conduct in good
faith may face temporary or permanent repercussions as determined by other
members of the project's leadership.

### Attribution

This Code of Conduct is adapted from the [Contributor Covenant][homepage], version 1.4,
available at [http://contributor-covenant.org/version/1/4][version]

[homepage]: http://contributor-covenant.org
[version]: http://contributor-covenant.org/version/1/4/
