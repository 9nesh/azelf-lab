# Azelf landing page — design QA

final result: passed

## Evidence

- Source visual: `artifacts/reference.png` (1086 × 1448 pixels).
- Final desktop: `artifacts/desktop.jpg` (1086 × 1448 pixels).
- Full-view comparison: `artifacts/comparison-final.jpg`.
- Focused comparisons: `artifacts/comparison-typography.jpg` and `artifacts/comparison-repair.jpg`.
- Mobile: `artifacts/mobile.jpg` (389 × 2585 pixels, full page).
- Desktop state: initial landing page, dialogs closed, Repair illustration selected, details collapsed, top of page.
- Browser: Codex in-app browser. CSS viewports checked: 1086 × 1448, 769 × 1024, 389 × 843, and 358 × 848. No horizontal overflow at these sizes.
- Density normalization: this browser reports devicePixelRatio 0.67 and adds unused right/bottom space to captures. Desktop raw image was 1621 × 2160; content occupied the top-left 1086 × 1448 region matching the measured CSS viewport. The comparison crops unused capture space without rescaling the actual page. Mobile similarly crops to the measured CSS document width and height. Original captures are retained locally.

## Comparison history

1. First desktop review found a heavier, narrower headline, compressed process-column spacing, and undersized auxiliary text (P2). Reduced the headline weight, adjusted tracking, spread the three process columns to match the reference, and raised navigation to 16px. The final paired comparison verifies the correction.
2. User requested clearer hierarchy and readable small text. Established display headlines, 38px secondary headings, 25px feature headings, 16–18px body text, 16px primary actions, 12–14px labels, and 13px form notes. Mobile keeps 16px body text and actions, 14px code, and at least 12px labels; code wraps instead of shrinking to fit.
3. Mobile review found the decorative connector crossing the first code line (P2). Adjusted its path and height to connect the removed-line area to the logo. Final mobile screenshot records the revised state.

## Required fidelity surfaces

- **Fonts and typography:** Helvetica Neue with Arial/Helvetica fallbacks. Oversized, tightly spaced two-line hero; secondary text visibly separated by size and weight. Reference's exact font file is unavailable, so minor glyph differences are an accepted P3 limitation. Enlarged navigation and supporting labels intentionally follow the user's readability feedback.
- **Spacing and layout:** Preserved the 56px desktop page inset, airy header, code/mark pairing, three process columns, centered verification statement, pill CTA, and large closing headline. The rest of the page extends below the supplied crop using the same layout language. Mobile stacks the illustration and code and allows text wrapping.
- **Colors and tokens:** Warm white #fdfcfb, near-black #080808, red #ff353c, muted grays, pale red removed lines, and pale neutral/green added lines. The source's subtle raster grain is not reproduced; the page uses a clean background.
- **Image quality and asset fidelity:** Standalone SVG mark and SVG wordmark supplied as explicitly requested by the user. The mark remains sharp at favicon, header, and hero sizes. Handcrafted vector implementation is an explicit user-requested exception to the skill's default raster-asset rule. The wordmark retains editable system-font text; README documents the font dependency.
- **Copy and content:** Hero, subtitle, code example, process names, verification line, main CTAs, and closing statement follow the reference. Added developer content reflects the supplied Azelf architecture. No invented customer logos, testimonials, or performance statistics. Forms and repair execution are explicitly previews.

## Interaction checks

- Detect/Repair/Verify controls update the code state and reveal the relevant description; collapse works.
- Watch it work opens a modal; Run the demo progresses through all four states, displays four checks, and reaches Replay demo.
- Repository CTA opens the early-access preview with optional repository URL.
- Invalid email blocks submission and focuses the invalid field.
- Valid synthetic email completes the preview and explicitly confirms that no registration was created or email sent.
- Back to Azelf closes the completed preview; dialog close button and Escape both work.
- Mobile demo opens and closes successfully.
- Native dialog provides focus containment; visible focus outlines and reduced-motion styles are present.
- Browser console checked after interactions: no warnings or errors.
- Logo assets pass XML parsing. Production build and four existing Sites runtime tests pass.

## Remaining limitations

- Early access, repository authorization, and repair execution need real services before launch. Current forms neither transmit nor persist personal data.
- Exact reference font and subtle paper texture remain P3 differences.
- The browser's minimum viewport prevented a true 320px CSS capture; the narrowest measured browser check was 358px. The CSS supports a 320px minimum and wraps code text.

## Implementation checklist

- [x] Create vector mark and logo lockup.
- [x] Build the responsive reference-based landing page.
- [x] Increase small text and establish the requested font hierarchy.
- [x] Compare full page and focused regions against the reference.
- [x] Check desktop, tablet, and mobile layouts and primary interactions.
- [x] Verify production build and runtime tests.
- [x] Keep the local preview open.
