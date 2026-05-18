import { readFile } from "fs/promises";
import path from "path";
import MarkdownDisplay from "@/components/util/MarkdownDisplay";

export default async function Impressum() {
  const filePath = path.join(process.cwd(), "data", "impressum.md");
  const content = await readFile(filePath, "utf8");

  return (
    <div className="flex flex-col items-center px-4 w-full py-8">
      <div className="max-w-[900px] text-justify">
        <MarkdownDisplay filePath={filePath} />
      </div>
    </div>
  );
}