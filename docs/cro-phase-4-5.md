# CRO Phase 4 & 5 Consolidation (Blog Assisted Conversion + Playbook)

## Phase 4 goals (implemented)
1. Turn blog intent into coupon intent with contextual CTA blocks.
2. Replace generic sidebar CTA with direct value CTA focused on WhatsApp + coupon discovery.
3. Strengthen internal linking path from Blog -> Cupons/Category pages.

## Phase 4 changes
- Blog list now computes selected category metadata and exposes a contextual CTA:
  - primary CTA: "Ver cupons de <categoria>"
  - secondary CTA: "Receber cupons no WhatsApp"
- CTA links route users to `/cupons` with category-focused query to encourage assisted conversion.
- WhatsApp CTA in blog now supports context/source tracking payload.

## Phase 5 goals (implemented)
1. Consolidate winning patterns into reusable copy/CTA guidelines.
2. Provide a practical next-round backlog with ICE-style prioritization.
3. Define staging validation checklist and acceptance criteria before release.

## Phase 5 playbook
### Copy/CTA standards
- Primary commercial CTA uses action + value: "Copiar cupom" / "Ver cupons de X".
- Secondary retention CTA uses channel + speed benefit: "Receber cupons no WhatsApp".
- Empty states must always include at least one guided next action.

### Next-round backlog (prioritized)
1. Add category-aware CTA block to BlogPost article template.
2. Track blog->coupon assisted conversion as dedicated event.
3. Add experiment to compare CTA order (coupon first vs WhatsApp first).
4. Add sticky mobile CTA on long blog posts.

### Staging validation checklist (port 3006)
- Blog list category selected -> contextual coupon CTA reflects category text.
- CTA click opens /cupons with expected query in URL.
- WhatsApp CTA tracks and opens link in new tab.
- No layout regressions on mobile widths.
