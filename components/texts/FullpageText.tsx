import MarkdownDisplay from "../util/MarkdownDisplay";
import ScrollToButton from "../buttons/ScrollToButton";

interface FullpageTextProps {
    header?: string;
    filePath: string;
    headerId?: string;
    nextSectionId?: string;
    children?: React.ReactNode;
}

export const FullpageText = ({ header, filePath, headerId, nextSectionId, children }: FullpageTextProps) => {
  return (
    <div className="flex flex-col justify-center ms-center max-w-[800px] min-h-screen text-justify" id ={headerId}> 
      {header && <h1 className="mb-4 pt-16 font-bold text-2xl text-left">{header}</h1>}
      <MarkdownDisplay filePath={filePath}/>
      { nextSectionId && (
        <div className="flex justify-center">
          <ScrollToButton targetId={nextSectionId} />
        </div>
      )}
      {children}
    </div>
  );
};