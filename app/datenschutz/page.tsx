import path from "path";
import MarkdownDisplay from "@/components/util/MarkdownDisplay";

export default async function Datenschutz() {
  const filePath = path.join(process.cwd(), "data", "datenschutz.md");

  return (
    <div className="flex flex-col items-center px-4 w-full min-h-screen">
      <div className="max-w-[900px] text-justify">
        <MarkdownDisplay filePath={filePath} />
      </div>
    </div>
  );
}