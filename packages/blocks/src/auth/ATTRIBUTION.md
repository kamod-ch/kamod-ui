Ported Preact/Kamod auth catalog blocks take structure and behavior from the
uipkge React catalog (https://uipkge.dev/react/blocks/), which is distributed
under the MIT License.

This directory does not copy React, Next.js, lucide-react, or Radix runtime
code. Layout, copy, and interaction are reimplemented with Preact, Kamod UI
primitives, and Kamod Icons. Existing Kamod login-01..05 and signup-01..05
blocks remain the source of truth for `@kamod-ch/blocks/login` and
`@kamod-ch/blocks/signup`.
