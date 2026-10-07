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

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: colors.ink }}>
      {/* Scaled from the bottom so the text baked into the top of the photo stays out of frame */}
      <CanvasImage
        name="Anita"
        src={staticFile("img/anita.jpeg")}
        premountFor={fps}
        width={1080}
        height={1920}
        fit="cover"
        style={{
          position: "absolute",
          transformOrigin: "50% 100%",
          scale: interpolate(frame, [0, 4 * fps], [1.3, 1.22], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            output: "perceptual-scale",
          }),
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(11,10,8,0) 35%, rgba(11,10,8,0.88) 62%, rgba(11,10,8,0.97) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          padding: "0 90px 180px",
          textAlign: "center",
        }}
      >
        <Interactive.Div
          name="Headline"
          style={{
            color: colors.paper,
            fontFamily: displayFont,
            fontWeight: 500,
            fontSize: 112,
            lineHeight: 1.05,
            opacity: interpolate(frame, [0.3 * fps, 1.1 * fps], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            translate: interpolate(frame, [0.3 * fps, 1.1 * fps], ["0px 40px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          Kérj időpontot Anitától!
        </Interactive.Div>
        <Interactive.Div
          name="Phone"
          style={{
            marginTop: 56,
            padding: "26px 56px",
            borderRadius: 999,
            backgroundColor: colors.gold,
            color: colors.ink,
            fontFamily: bodyFont,
            fontWeight: 600,
            fontSize: 56,
            opacity: interpolate(frame, [0.9 * fps, 1.5 * fps], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            scale: interpolate(frame, [0.9 * fps, 1.5 * fps], [0.9, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.spring({ damping: 12 }),
              output: "perceptual-scale",
            }),
          }}
        >
          +36 30 922 3271
        </Interactive.Div>
        <Interactive.Div
          name="Channels"
          style={{
            marginTop: 44,
            color: colors.cream,
            fontFamily: bodyFont,
            fontWeight: 400,
            fontSize: 44,
            lineHeight: 1.45,
            opacity: interpolate(frame, [1.4 * fps, 2 * fps], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          Messenger · Instagram: @brattengeieranita
          <br />
          Mosonmagyaróvár, Fő utca 17.
        </Interactive.Div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
