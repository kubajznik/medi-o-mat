import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import { readFile } from "fs/promises"

interface MarkdownDisplayProps {
    filePath: string;
}

export default async function MarkdownDisplay({ filePath }: MarkdownDisplayProps) {
    const content = await readFile(filePath, "utf8");
    const normalizedContent = content.replace(/\n{3,}/g, (match) => {
        const extraBreaks = Math.max(0, match.length - 2);
        return "\n\n" + Array(extraBreaks).fill("<br />\n\n").join("");
    });

    return (
        <ReactMarkdown
            remarkPlugins={[remarkBreaks]}
            rehypePlugins={[rehypeRaw]}
            components={{
                h1: ({ ...props }) => (
                    <h1 className="mt-8 mb-1 font-semibold text-2xl" {...props} />
                ),
                h2: ({ ...props }) => (
                    <h2 className="mt-6 mb-0 font-semibold text-1xl" {...props} />
                ),
                h3: ({ ...props }) => (
                    <h3 className="mt-4 font-semibold text-md" {...props} />
                ),
                p: ({ children, ...props }) => {
                    const isEmpty =
                        !children ||
                        (Array.isArray(children) &&
                            children.every((child) =>
                                typeof child === "string" && child.trim() === ""
                            ));

                    return (
                        <p className="leading-relaxed mb-4" {...props}>
                            {isEmpty ? "\u00A0" : children}
                        </p>
                    );
                },
                ul: ({ ...props }) => (
                    <ul className="pl-6 list-disc" {...props} />
                ),
                ol: ({ ...props }) => (
                    <ol className="pl-6 list-decimal" {...props} />
                ),
            }}
        >
            {normalizedContent}
        </ReactMarkdown>
    );
}