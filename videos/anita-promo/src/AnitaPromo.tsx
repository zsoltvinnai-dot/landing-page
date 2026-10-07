import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { staticFile, useVideoConfig } from "remotion";
import { CosmeticsScene } from "./CosmeticsScene";
import { IntroScene } from "./IntroScene";
import { OutroScene } from "./OutroScene";
import { PhotoScene } from "./PhotoScene";
import { colors } from "./theme";

export const AnitaPromo: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <TransitionSeries style={{ backgroundColor: colors.ink }}>
      <TransitionSeries.Sequence name="Intro" durationInFrames={3 * fps} premountFor={fps}>
        <IntroScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 0.5 * fps })}
      />
      <TransitionSeries.Sequence name="Szempilla" durationInFrames={3 * fps} premountFor={fps}>
        <PhotoScene
          image={staticFile("img/makeup-editorial.webp")}
          kicker="Szempilla · szemöldök"
          title="Hangsúlyos tekintet"
          subtitle="Klasszikus, volume, lifting"
          accentColor={colors.gold}
          shade={1}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 0.5 * fps })}
      />
      <TransitionSeries.Sequence name="Smink" durationInFrames={3 * fps} premountFor={fps}>
        <PhotoScene
          image={staticFile("img/bridal.jpg")}
          kicker="Smink"
          title="Minden alkalomra"
          subtitle="Nappali, alkalmi, menyasszonyi"
          accentColor={colors.pink}
          shade={1}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 0.5 * fps })}
      />
      <TransitionSeries.Sequence name="Kozmetika" durationInFrames={3 * fps} premountFor={fps}>
        <CosmeticsScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 0.5 * fps })}
      />
      <TransitionSeries.Sequence name="Időpontkérés" durationInFrames={4.5 * fps} premountFor={fps}>
        <OutroScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
