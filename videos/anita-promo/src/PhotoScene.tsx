import {
  AbsoluteFill,
  CanvasImage,
  Easing,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  type InteractivitySchema,
} from "remotion";
import { bodyFont, colors, displayFont } from "./theme";

type PhotoSceneProps = {
  readonly image: string;
  readonly kicker: string;
  readonly title: string;
  readonly subtitle: string;
  readonly accentColor: string;
  readonly shade: number;
  readonly style?: React.CSSProperties;
};

const PhotoSceneInner: React.FC<PhotoSceneProps> = ({
  image,
  kicker,
  title,
  subtitle,
  accentColor,
  shade,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: colors.ink, ...style }}>
      <CanvasImage
        name="Photo"
        src={image}
        premountFor={fps}
        width={1080}
        height={1920}
        fit="cover"
        style={{
          position: "absolute",
          scale: interpolate(frame, [0, durationInFrames], [1.12, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            output: "perceptual-scale",
          }),
        }}
      />
      <AbsoluteFill
        style={{
          background:
            `linear-gradient(180deg, rgba(11,10,8,0) 45%, rgba(11,10,8,${0.85 * shade}) 75%, rgba(11,10,8,${0.95 * shade}) 100%)`,
        }}
      />
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          padding: "0 90px 200px",
        }}
      >
        <Interactive.Div
          name="Kicker"
          style={{
            color: accentColor,
            fontFamily: bodyFont,
            fontWeight: 600,
            fontSize: 40,
            letterSpacing: 6,
            textTransform: "uppercase",
            opacity: interpolate(frame, [0.3 * fps, 1 * fps], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {kicker}
        </Interactive.Div>
        <Interactive.Div
          name="Title"
          style={{
            marginTop: 20,
            color: colors.paper,
            fontFamily: displayFont,
            fontWeight: 500,
            fontSize: 120,
            lineHeight: 1.05,
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
          {title}
        </Interactive.Div>
        <Interactive.Div
          name="Subtitle"
          style={{
            marginTop: 28,
            color: colors.cream,
            fontFamily: bodyFont,
            fontWeight: 400,
            fontSize: 48,
            opacity: interpolate(frame, [0.8 * fps, 1.6 * fps], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          {subtitle}
        </Interactive.Div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const photoSceneSchema = {
  image: {
    type: "asset",
    assetType: "image",
    default: staticFile("img/makeup-editorial.webp"),
    description: "Photo",
  },
  kicker: { type: "text-content", default: "", description: "Kicker" },
  title: { type: "text-content", default: "", description: "Title" },
  subtitle: { type: "text-content", default: "", description: "Subtitle" },
  accentColor: {
    type: "color",
    default: colors.gold,
    description: "Accent color",
  },
  shade: {
    type: "number",
    default: 1,
    min: 0,
    max: 1,
    step: 0.05,
    description: "Text shade strength",
    hiddenFromList: false,
  },
} as const satisfies InteractivitySchema;

export const PhotoScene = Interactive.withSchema({
  Component: PhotoSceneInner,
  componentName: "<PhotoScene>",
  schema: photoSceneSchema,
  wrapInSequence: true,
});
