Ported Preact/Kamod commerce catalog blocks take structure and behavior from the
uipkge React catalog (https://uipkge.dev/react/blocks/), which is distributed
under the MIT License.

This directory does not copy React, Next.js, lucide-react, or Radix runtime
code. Card PAN/CVC are validated with pure functions and passed only to callbacks.
The blocks do not make an application PCI compliant; use PSP-hosted fields or
tokenization in production.
