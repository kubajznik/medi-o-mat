import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import { readFile } from "fs/promises";
import path from "path";

export default async function Impressum() {
  const filePath = path.join(process.cwd(), "data", "impressum.md");
  const content = await readFile(filePath, "utf8");

  return (
    <div className="min-h-screen w-full px-4 text-dark">
      <div className="flex flex-col items-start text-left pt-8 pl-4">
        <h1 className="text-4xl font-semibold text-dark">Impressum</h1>
        <div className="text-dark my-8 max-w-[800px]">
          <ReactMarkdown
            remarkPlugins={[remarkBreaks]}
            components={{
              h1: ({ ...props }) => (
                <h1 className="text-2xl font-semibold mt-8 mb-1" {...props} />
              ),
              h2: ({ ...props }) => (
                <h2 className="text-1xl font-semibold mt-6 mb-0" {...props} />
              ),
              h3: ({ ...props }) => (
                <h3 className="text-md font-semibold mt-4" {...props} />
              ),
              p: ({ ...props }) => <p className="leading-relaxed" {...props} />,
              ul: ({ ...props }) => (
                <ul className="list-disc pl-6" {...props} />
              ),
              ol: ({ ...props }) => (
                <ol className="list-decimal pl-6" {...props} />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}