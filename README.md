# Inkbycaz — portfolio landing page

A single-page editorial portfolio for **Inkbycaz**, a Las Vegas tattoo artist.
Primary action: start an inquiry on Instagram. Secondary: explore the work.

Built by Forward Theory with Next.js (App Router), TypeScript and Tailwind CSS v4.
No backend, no tracking, no form. Every inquiry button opens Instagram in a new tab.

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm start            # serve the production build
npm run lint
npm run typecheck
```

Node 20+ is recommended (built and tested on Node 22).

## Where to edit things

| What | File |
|---|---|
| All copy, links, SEO text, booking destination | `src/config/site.ts` |
| Portfolio pieces (order, captions, alt text) | `src/config/portfolio.ts` |
| Colours, type utilities, motion | `src/app/globals.css` |
| Gallery layout rhythm | `slots` in `src/components/Gallery.tsx` |

**Booking link.** `site.bookingUrl` drives every "Start an Inquiry" / "Message" button.
It currently points to `https://www.instagram.com/ink.by.caz/`. Replace it with a verified
booking platform URL later and every button follows.

**Inquiry form (Formspree).** The Inquire section has a built-in form that stays hidden until
you set `NEXT_PUBLIC_FORMSPREE_FORM_ID` (see "Connecting Formspree" below). Until then every
inquiry button opens Instagram. Once it's set, the "Start an Inquiry" buttons scroll to the form
and Instagram remains as a secondary option.

**Pending business details.** `site.businessDetails` holds fields that are not confirmed yet
(display name, studio, address, hours, email, phone, booking policy). They are all `null`
and nothing renders them. Add the content and wire it into a component once confirmed.

**Agency credit** is off (`site.footer.showAgencyCredit: false`). To turn it on, set it to
`true` and fill in `agencyUrl`.

## Photos

- Untouched originals live in `assets/originals/` (not served). Files prefixed `unused-`
  are kept for reference but not processed: the studio headshot, and two photos that
  show more than one person, where the artist hasn't been identified.
- `npm run images` (requires `pip install pillow fonttools brotli`) creates WebP derivatives
  at 480, 800 and 1200px in `public/images/`, plus the Open Graph card and favicons in `src/app/`.
  It applies EXIF orientation and resizes only: no filters, colour changes or cropping.
- To add a piece: drop a JPG in `assets/originals/`, run `npm run images`, then add an entry
  to `src/config/portfolio.ts` with `src: "/images/<file-name-without-extension>"`.
- `next/image` uses a static loader (`src/lib/image-loader.ts`) that serves those files,
  so no runtime image service is needed.

## Connecting Formspree

1. In Formspree, create a form and copy its ID: the part after `/f/` in the endpoint,
   e.g. `https://formspree.io/f/xyzabcd` → `xyzabcd`.
2. Add it as an environment variable:
   - locally: create `.env.local` with `NEXT_PUBLIC_FORMSPREE_FORM_ID=xyzabcd`
   - on Vercel: Project → Settings → Environment Variables, then redeploy
3. Submit one test inquiry and confirm it reaches the Formspree inbox and notification email.
   (The first submission may ask you to confirm the form by email.)

What the form sends: `name`, `email`, `instagram`, `placement`, `size`, `idea`, `references`,
plus `_subject` (email subject line). `_gotcha` is a hidden honeypot that Formspree uses to drop
bot submissions; the form also refuses to send when it's filled in.

Behaviour: client-side validation with inline errors (focus moves to the first problem),
the button disables and reads "Sending…" during submission so it can't be sent twice,
Formspree's own error messages are shown if it rejects a submission, and the success message
states clearly that it isn't a booking confirmation. For extra spam protection, turn on
reCAPTCHA or Formspree's spam filtering in the form's settings; no code change is needed.

Image uploads aren't included because Formspree only accepts files on paid plans. The form asks
for reference links and points people to Instagram for images. Field labels and copy live in
`src/components/InquiryForm.tsx` (fields) and `site.inquire.form` (copy).

## Hero video (later)

`site.hero.media` accepts `{ type: "video", sources: [{ src, type }], poster }`. The poster
stays the LCP image; the muted loop never mounts for visitors who prefer reduced motion, and
it gets a pause button. Keep the file short and compressed, served from `/public`.

## Deployment (Vercel)

1. Push this folder to a Git repository and import it in Vercel (framework: Next.js; defaults are fine).
2. Add the environment variable `NEXT_PUBLIC_SITE_URL` = the final domain, e.g. `https://inkbycaz.com`.
   This enables the canonical URL and absolute Open Graph image URLs. Redeploy after setting it.
3. Connect the custom domain in Vercel → Domains.

Any static host also works: `STATIC_EXPORT=1 npm run build` writes a fully static site to `out/`
(served from the domain root).

`npm run preview:build` writes a path-independent snapshot to `preview/` for review links on
sandboxed hosts. It swaps the React runtime for `scripts/preview/preview.js`, which mirrors the
menu, gallery viewer and reveal behaviour. Don't deploy it as the production site.

## Accessibility and motion

- Skip link, landmarks, one `h1`, labelled navigation, visible focus outlines.
- Mobile menu: `aria-expanded`, focus moves in, Escape closes, focus returns to the toggle,
  page behind is inert, anchors offset for the fixed header.
- Gallery viewer: native modal `<dialog>`, focus kept inside, Escape / arrow keys / swipe,
  48px controls, focus restored to the image that was last viewed.
- Reveals are progressive: content is visible by default and only animates when the visitor
  hasn't asked for reduced motion. A timeout removes the animation class if scripts fail.
