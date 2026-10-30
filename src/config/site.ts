/**
 * Inkbycaz — site configuration.
 *
 * Every piece of copy, every link and the booking destination lives here.
 * Edit this file (and portfolio.ts) instead of touching components.
 *
 * Only confirmed facts are displayed. Fields in `businessDetails` are
 * intentionally null until the artist confirms them; components never render
 * a null value, so nothing fake appears on the page.
 */

export type ImageAsset = {
  /** Path prefix in /public without width or extension, e.g. "/images/koi-forearm". */
  src: string;
  width: number;
  height: number;
  alt: string;
};

export type HeroMedia =
  | { type: "image"; image: ImageAsset }
  | {
      type: "video";
      /** Self-hosted, muted, short loop (mp4/webm). */
      sources: { src: string; type: string }[];
      /** Shown before playback and to visitors who prefer reduced motion. */
      poster: ImageAsset;
    };

export type InquiryFormConfig = {
  /**
   * Formspree endpoint, built from NEXT_PUBLIC_FORMSPREE_FORM_ID.
   * While it's null the form is not rendered and the section falls back
   * to the Instagram button, so the page never shows a form that can't send.
   */
  endpoint: string | null;
  subject: string;
  heading: string;
  intro: string;
  submit: string;
  submitting: string;
  successHeading: string;
  successBody: string;
  errorBody: string;
  instagramAlternative: string;
};

/**
 * Accepts the bare form ID ("xyzabcd") or a pasted endpoint
 * ("https://formspree.io/f/xyzabcd"), ignoring quotes and whitespace.
 */
function parseFormspreeId(raw: string | undefined) {
  if (!raw) return null;
  const cleaned = raw.trim().replace(/^["']|["']$/g, "").trim();
  const id = cleaned.match(/\/f\/([A-Za-z0-9]+)/)?.[1] ?? cleaned;
  return /^[A-Za-z0-9]+$/.test(id) ? id : null;
}

const formspreeId = parseFormspreeId(process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID);

export type SiteConfig = {
  brand: string;
  location: string;
  instagram: { handle: string; url: string };
  /**
   * Single source of truth for every "Start an Inquiry" / "Message" button.
   * Swap for a verified booking platform URL later; all buttons follow.
   */
  bookingUrl: string;
  /** Production URL, used for canonical + Open Graph. Set NEXT_PUBLIC_SITE_URL. */
  siteUrl: string | null;
  seo: { title: string; description: string; ogImageAlt: string };
  nav: { label: string; href: `#${string}` }[];
  hero: {
    eyebrow: string;
    headline: [string, string];
    supporting: string;
    primaryCta: string;
    secondaryCta: string;
    label: string;
    media: HeroMedia;
    caption: string;
  };
  work: {
    label: string;
    heading: [string, string];
    intro: string;
    moreLabel: string;
  };
  artist: {
    label: string;
    heading: string;
    body: string;
    portrait: ImageAsset;
    facts: { term: string; detail: string }[];
  };
  inquire: {
    label: string;
    heading: string;
    steps: { title: string; body: string }[];
    supporting: string;
    /** Used instead of `supporting` when the form is switched on. */
    supportingWithForm: string;
    note: string;
    cta: string;
    form: InquiryFormConfig;
  };
  finalCta: { lines: [string, string]; cta: string };
  footer: { showAgencyCredit: boolean; agencyName: string; agencyUrl: string };
  /** Pending — not displayed anywhere until filled in and wired up. */
  businessDetails: {
    artistDisplayName: string | null;
    studioName: string | null;
    streetAddress: string | null;
    hours: string | null;
    email: string | null;
    phone: string | null;
    bookingPolicy: string | null;
  };
};

const instagramUrl = "https://www.instagram.com/ink.by.caz/";

export const site: SiteConfig = {
  brand: "INKBYCAZ",
  location: "Las Vegas, Nevada",
  instagram: { handle: "@ink.by.caz", url: instagramUrl },
  bookingUrl: instagramUrl,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? null,

  seo: {
    title: "Inkbycaz | Las Vegas Tattoo Artist",
    description:
      "Selected tattoo work by Inkbycaz, a Las Vegas tattoo artist — floral, ornamental, script and illustrative black-and-gray pieces. Start an inquiry on Instagram.",
    ogImageAlt: "“Your story. In ink.” beside a black-and-gray phoenix tattoo by Inkbycaz",
  },

  nav: [
    { label: "Work", href: "#work" },
    { label: "The Artist", href: "#artist" },
    { label: "Inquire", href: "#inquire" },
  ],

  hero: {
    eyebrow: "Las Vegas, Nevada",
    headline: ["Your story.", "In ink."],
    supporting: "Explore the work. Bring your next idea.",
    primaryCta: "Start an Inquiry",
    secondaryCta: "Explore the Work",
    label: "Inkbycaz / Selected work",
    media: {
      type: "image",
      image: {
        src: "/images/phoenix-blossoms-thigh",
        width: 1126,
        height: 1500,
        alt: "Black-and-gray phoenix with open blossoms, its long tail feathers flowing down the outer thigh",
      },
    },
    caption: "Phoenix and blossoms",
  },

  work: {
    label: "Selected work",
    heading: ["Selected", "work."],
    intro:
      "A curated look at recent pieces — floral, ornamental, script and illustrative work in black and gray. Select any image to see it in full.",
    moreLabel: "More work on Instagram",
  },

  artist: {
    label: "The artist",
    heading: "The artist behind the ink.",
    body: "Inkbycaz is a Las Vegas tattoo artist. Explore the selected work and connect directly to discuss your next piece.",
    portrait: {
      src: "/images/artist-street-portrait",
      width: 1126,
      height: 1500,
      alt: "Portrait of the artist standing in a narrow residential street, wearing a dark tee, denim and boots",
    },
    facts: [
      { term: "Based in", detail: "Las Vegas, Nevada" },
      { term: "In the portfolio", detail: "Floral, ornamental, script, illustrative" },
      { term: "Inquiries", detail: "Direct message on Instagram" },
    ],
  },

  inquire: {
    label: "Inquire",
    heading: "Have something in mind?",
    steps: [
      { title: "Your idea", body: "The subject, inspiration, or direction." },
      { title: "Placement and size", body: "Where it will go and approximate dimensions." },
      { title: "Reference images", body: "Examples that help communicate your vision." },
    ],
    supporting:
      "Send your idea, placement, approximate size, and reference images on Instagram to start the conversation.",
    supportingWithForm:
      "Send your idea, placement, approximate size, and any references with the form, or message on Instagram if you prefer.",
    note: "A message opens the conversation. Details and scheduling are worked out directly with the artist.",
    cta: "Message @ink.by.caz",
    form: {
      endpoint: formspreeId ? `https://formspree.io/f/${formspreeId}` : null,
      subject: "New tattoo inquiry — Inkbycaz",
      heading: "Send an inquiry",
      intro: "Share the details of your piece. Fields marked * are required.",
      submit: "Send inquiry",
      submitting: "Sending…",
      successHeading: "Inquiry sent.",
      successBody:
        "Thanks for sharing your idea. This isn’t a booking confirmation — the artist will reply directly to talk through the details.",
      errorBody: "Your inquiry didn’t send. Check your connection and try again, or message on Instagram instead.",
      instagramAlternative: "Prefer Instagram? Message @ink.by.caz",
    },
  },

  finalCta: {
    lines: ["Let’s make", "your next piece."],
    cta: "Start an Inquiry",
  },

  footer: {
    showAgencyCredit: false,
    agencyName: "Forward Theory",
    agencyUrl: "",
  },

  businessDetails: {
    artistDisplayName: null,
    studioName: null,
    streetAddress: null,
    hours: null,
    email: null,
    phone: null,
    bookingPolicy: null,
  },
};

/**
 * Where "Start an Inquiry" buttons go: the on-page form when Formspree is
 * configured, otherwise the booking URL (Instagram) in a new tab.
 */
export const primaryInquiry = site.inquire.form.endpoint
  ? { href: "#inquire", external: false }
  : { href: site.bookingUrl, external: true };
