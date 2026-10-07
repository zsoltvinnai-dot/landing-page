import {
  AbsoluteFill,
  CanvasImage,
  Easing,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { bodyFont, colors, displayFont } from "./theme";

export const OpeningOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.ink,
        justifyContent: "center",
        alignItems: "center",
        padding: "0 90px",
        textAlign: "center",
      }}
    >
      <CanvasImage
        name="Logo"
        src={staticFile("img/logo.png")}
        premountFor={fps}
        width={760}
        height={424}
        fit="contain"
        style={{
          opacity: interpolate(frame, [0, 0.8 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
      <Interactive.Div
        name="Headline"
        style={{
          marginTop: 80,
          color: colors.paper,
          fontFamily: displayFont,
          fontWeight: 500,
          fontSize: 100,
          lineHeight: 1.1,
          opacity: interpolate(frame, [0.5 * fps, 1.3 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [0.5 * fps, 1.3 * fps], ["0px 40px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        Októbertől
        <br />a Fő utca 17. alatt
      </Interactive.Div>
      <Interactive.Div
        name="Phone"
        style={{
          marginTop: 72,
          padding: "26px 56px",
          borderRadius: 999,
          backgroundColor: colors.gold,
          color: colors.ink,
          fontFamily: bodyFont,
          fontWeight: 600,
          fontSize: 52,
          opacity: interpolate(frame, [1.2 * fps, 1.8 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          scale: interpolate(frame, [1.2 * fps, 1.8 * fps], [0.9, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 12 }),
            output: "perceptual-scale",
          }),
        }}
      >
        Időpont: +36 30 922 3271
      </Interactive.Div>
      <Interactive.Div
        name="Location"
        style={{
          marginTop: 44,
          color: colors.cream,
          fontFamily: bodyFont,
          fontWeight: 400,
          fontSize: 44,
          letterSpacing: 4,
          textTransform: "uppercase",
          opacity: interpolate(frame, [1.6 * fps, 2.2 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Mosonmagyaróvár
      </Interactive.Div>
    </AbsoluteFill>
  );
};
