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
import { bodyFont, colors } from "./theme";

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.ink,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CanvasImage
        name="Logo"
        src={staticFile("img/logo.png")}
        premountFor={fps}
        width={880}
        height={491}
        fit="contain"
        style={{
          opacity: interpolate(frame, [0, 1 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          scale: interpolate(frame, [0, 3 * fps], [1.08, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
            output: "perceptual-scale",
          }),
        }}
      />
      <Interactive.Div
        name="Gold line"
        style={{
          width: 520,
          height: 3,
          marginTop: 56,
          backgroundColor: colors.gold,
          scale: interpolate(frame, [0.5 * fps, 1.5 * fps], ["0 1", "1 1"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      />
      <Interactive.Div
        name="Location"
        style={{
          marginTop: 48,
          color: colors.cream,
          fontFamily: bodyFont,
          fontWeight: 400,
          fontSize: 46,
          letterSpacing: 6,
          textTransform: "uppercase",
          opacity: interpolate(frame, [1 * fps, 2 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          translate: interpolate(frame, [1 * fps, 2 * fps], ["0px 30px", "0px 0px"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        Mosonmagyaróvár
      </Interactive.Div>
    </AbsoluteFill>
  );
};
