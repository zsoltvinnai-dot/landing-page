import "./theme";
import { Composition, Folder, staticFile } from "remotion";
import { AnitaPromo } from "./AnitaPromo";
import { CosmeticsScene } from "./CosmeticsScene";
import { IntroScene } from "./IntroScene";
import { OutroScene } from "./OutroScene";
import { PhotoScene } from "./PhotoScene";
import { colors } from "./theme";

// Vertical 9:16 for Instagram Reels, TikTok and Facebook Stories
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="Scenes">
        <Composition
          id="Intro"
          component={IntroScene}
          width={1080}
          height={1920}
          fps={30}
          durationInFrames={90}
        />
        <Composition
          id="PhotoScene"
          component={PhotoScene}
          width={1080}
          height={1920}
          fps={30}
          durationInFrames={90}
          defaultProps={{
            image: staticFile("img/makeup-editorial.webp"),
            kicker: "Szempilla · szemöldök",
            title: "Hangsúlyos tekintet",
            subtitle: "Klasszikus, volume, lifting",
            accentColor: colors.gold,
          }}
        />
        <Composition
          id="Kozmetika"
          component={CosmeticsScene}
          width={1080}
          height={1920}
          fps={30}
          durationInFrames={90}
        />
        <Composition
          id="Idopontkeres"
          component={OutroScene}
          width={1080}
          height={1920}
          fps={30}
          durationInFrames={135}
        />
      </Folder>
      <Composition
        id="AnitaPromo"
        component={AnitaPromo}
        width={1080}
        height={1920}
        fps={30}
        durationInFrames={435}
      />
    </>
  );
};
