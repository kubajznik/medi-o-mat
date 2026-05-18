import textData from "../data/texte.json";
import { FullpageText } from "@/components/texts/FullpageText";
import HomeClient from "@/components/page/HomeClient";
import header from "@/data/header.json";

/**
 *
 *  Startseite von Medi-o-Mat
 *
 */
export default function Home() {
  return (
    <div className="px-4 w-full h-full">
      <HomeClient
        ersteInformation={textData.ersteInformation} 
        startButton={textData.startButton}
        medienuebersichtButton={textData.medienuebersichtButton}
        nextSectionId="problemstellung"
      />

      <div className="flex flex-col justify-center items-center gap-[clamp(2rem,8vh,5rem)] py-[clamp(3rem,12vh,11rem)]">
        <div className="flex flex-col gap-6 max-w-[900px]">
            <FullpageText 
            header={header.problemstellung}
            headerId="problemstellung"
            filePath="data/md/problemstellung.md"
            nextSectionId="unsere_rolle"
            />
            
            <FullpageText 
            header={header.unsere_rolle}
            headerId="unsere_rolle"
            filePath="data/md/unsere_rolle.md"
            nextSectionId="medienauswahl"
            />

            <FullpageText 
            header={header.medienauswahl}
            headerId="medienauswahl"
            filePath="data/md/medienauswahl.md"
            nextSectionId="und_jetzt"
            >
            <a 
              href="/media" 
              className="bg-accent mx-auto mt-[-2em] sm:p-1 lg:p-3 rounded-md w-fit text-text-negative hover:scale-105 transition-transform duration-200 ease-in-out">
              Zur Medienübersicht
            </a>
            </FullpageText>

            <FullpageText 
            header={header.und_jetzt}
            headerId="und_jetzt"
            filePath="data/md/und_jetzt.md"
            />
        </div>
      </div>
    </div>
  );
}
