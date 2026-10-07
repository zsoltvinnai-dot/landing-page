import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { bodyFont, colors, displayFont } from "./theme";

export const CosmeticsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.cream,
        justifyContent: "center",
        padding: "0 90px",
      }}
    >
      <Interactive.Div
        name="Badge"
        style={{
          alignSelf: "flex-start",
          padding: "16px 32px",
          border: `3px solid ${colors.gold}`,
          color: colors.ink,
          fontFamily: bodyFont,
          fontWeight: 600,
          fontSize: 40,
          letterSpacing: 6,
          textTransform: "uppercase",
          opacity: interpolate(frame, [0.2 * fps, 0.8 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Új · 2026 októberétől
      </Interactive.Div>
      <Interactive.Div
        name="Title"
        style={{
          marginTop: 48,
          color: colors.ink,
          fontFamily: displayFont,
          fontWeight: 500,
          fontSize: 136,
          lineHeight: 1.02,
          opacity: interpolate(frame, [0.4 * fps, 1.2 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [0.4 * fps, 1.2 * fps], ["0px 40px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        Kozmetikai kezelések
      </Interactive.Div>
      <Interactive.Div
        name="Gold line"
        style={{
          width: 300,
          height: 4,
          marginTop: 48,
          backgroundColor: colors.gold,
          transformOrigin: "left center",
          scale: interpolate(frame, [0.8 * fps, 1.6 * fps], ["0 1", "1 1"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      />
      <Interactive.Div
        name="Treatments"
        style={{
          marginTop: 48,
          color: "#3a332b",
          fontFamily: bodyFont,
          fontWeight: 400,
          fontSize: 50,
          lineHeight: 1.5,
          opacity: interpolate(frame, [1 * fps, 1.8 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Arckezelés · arcmasszázs
        <br />
        ugyanott: Fő utca 17.
      </Interactive.Div>
    </AbsoluteFill>
  );
};
