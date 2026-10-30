import type { ImageAsset } from "./site";

export type PortfolioItem = ImageAsset & {
  id: string;
  /** Short, visible caption describing the subject (not a style claim). */
  caption: string;
  /** Optional placement note shown after the caption. */
  placement?: string;
};

/**
 * Selected work, in display order. The gallery layout is designed around
 * eight pieces; add or remove entries freely — the rhythm repeats.
 * After adding a photo to assets/originals, run scripts/optimize-images.py.
 */
export const portfolio: PortfolioItem[] = [
  {
    id: "rose",
    src: "/images/rose-forearm-elbow",
    width: 1126,
    height: 1500,
    caption: "Rose and leaves",
    placement: "Forearm to elbow",
    alt: "Black-and-gray rose with shaded leaves wrapping the elbow, joining existing arm work",
  },
  {
    id: "lilies",
    src: "/images/lilies-upper-arm",
    width: 1126,
    height: 1500,
    caption: "Lilies in bloom",
    placement: "Upper arm",
    alt: "Two soft-shaded lilies with buds and stems climbing the outer upper arm",
  },
  {
    id: "script",
    src: "/images/script-hands",
    width: 1126,
    height: 1500,
    caption: "“Gods Will” script",
    placement: "Across both hands",
    alt: "Flowing script lettering reading “Gods Will” spread across the backs of two clenched fists",
  },
  {
    id: "cherub",
    src: "/images/cherub-chest",
    width: 1126,
    height: 1500,
    caption: "Resting cherub",
    placement: "Chest",
    alt: "Realistic black-and-gray cherub with closed eyes and open wings, resting its chin on its hands across the upper chest",
  },
  {
    id: "sword",
    src: "/images/sword-roses-calf",
    width: 1126,
    height: 1500,
    caption: "Sword and roses",
    placement: "Calf",
    alt: "Detailed sword with an engraved crossguard running down the calf through two roses and leaves",
  },
  {
    id: "koi",
    src: "/images/koi-forearm",
    width: 1122,
    height: 1496,
    caption: "Koi pair",
    placement: "Forearm",
    alt: "Two koi with flowing fins circling the forearm from the inner elbow to the wrist",
  },
  {
    id: "crosses",
    src: "/images/ornamental-crosses-leg",
    width: 1126,
    height: 1500,
    caption: "Ornamental crosses",
    alt: "Three ornamental crosses, one smooth and shaded, two sharp and filigreed, grouped above existing work",
  },
  {
    id: "vegas",
    src: "/images/las-vegas-sign-leg",
    width: 1126,
    height: 1500,
    caption: "Welcome to Fabulous Las Vegas",
    placement: "Back of the knee",
    alt: "Black-and-gray tattoo of the Welcome to Fabulous Las Vegas sign with its star and bulb border on the back of the leg",
  },
];
