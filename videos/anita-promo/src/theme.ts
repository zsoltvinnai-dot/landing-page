import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Brand colors from the landing page (frontend/frontend/styles.css)
export const colors = {
  ink: "#0b0a08",
  cream: "#f7f0e6",
  paper: "#fffdfa",
  beige: "#d9c4aa",
  pink: "#d78bab",
  gold: "#d9ae4b",
  goldLight: "#f4d785",
};

export const displayFont = "Bodoni Moda";
export const bodyFont = "Manrope";

const LATIN =
  "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD";
const LATIN_EXT =
  "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF";

const faces: { family: string; file: string; weight: string }[] = [
  { family: displayFont, file: "bodoni-moda", weight: "400" },
  { family: displayFont, file: "bodoni-moda", weight: "500" },
  { family: bodyFont, file: "manrope", weight: "400" },
  { family: bodyFont, file: "manrope", weight: "600" },
];

// Latin-ext is needed for Hungarian ő and ű
for (const face of faces) {
  loadFont({
    family: face.family,
    url: staticFile(`fonts/${face.file}-latin-${face.weight}-normal.woff2`),
    weight: face.weight,
    unicodeRange: LATIN,
  });
  loadFont({
    family: face.family,
    url: staticFile(`fonts/${face.file}-latin-ext-${face.weight}-normal.woff2`),
    weight: face.weight,
    unicodeRange: LATIN_EXT,
  });
}
