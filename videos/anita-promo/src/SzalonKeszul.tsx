import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { staticFile, useVideoConfig } from "remotion";
import { OpeningOutro } from "./OpeningOutro";
import { PhotoScene } from "./PhotoScene";
import { colors } from "./theme";

// Renovation story: old salon -> white rooms -> cream paint -> opening call to action
export const SzalonKeszul: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <TransitionSeries style={{ backgroundColor: colors.ink }}>
      <TransitionSeries.Sequence name="Előtte" durationInFrames={2.5 * fps} premountFor={fps}>
        <PhotoScene
          image={staticFile("img/szalon/elotte.jpg")}
          kicker="Előtte"
          title="Így kezdtük…"
          subtitle="Fő utca 17., Mosonmagyaróvár"
          accentColor={colors.gold}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 0.4 * fps })}
      />
      <TransitionSeries.Sequence name="Átalakítás 1" durationInFrames={2 * fps} premountFor={fps}>
        <PhotoScene
          image={staticFile("img/szalon/feher-ablak.jpg")}
          kicker="Átalakítás"
          title="Új tervek"
          subtitle="Kiürült, kitisztult"
          accentColor={colors.gold}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 0.4 * fps })}
      />
      <TransitionSeries.Sequence name="Átalakítás 2" durationInFrames={2 * fps} premountFor={fps}>
        <PhotoScene
          image={staticFile("img/szalon/feher-terem.jpg")}
          kicker="Átalakítás"
          title="Lépésről lépésre"
          subtitle="Kezelőágy, lámpák, paravánok"
          accentColor={colors.gold}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 0.4 * fps })}
      />
      <TransitionSeries.Sequence name="Új szín" durationInFrames={2.5 * fps} premountFor={fps}>
        <PhotoScene
          image={staticFile("img/szalon/krem-1.jpg")}
          kicker="Most"
          title="Új színt kapott"
          subtitle="Meleg krém falak, boltíves mennyezet"
          accentColor={colors.gold}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 0.4 * fps })}
      />
      <TransitionSeries.Sequence name="Hamarosan" durationInFrames={2 * fps} premountFor={fps}>
        <PhotoScene
          image={staticFile("img/szalon/krem-2.jpg")}
          kicker="Hamarosan"
          title="Már csak a berendezés…"
          subtitle="Készül az új szalon"
          accentColor={colors.pink}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: 0.4 * fps })}
      />
      <TransitionSeries.Sequence name="Nyitás" durationInFrames={3.5 * fps} premountFor={fps}>
        <OpeningOutro />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
