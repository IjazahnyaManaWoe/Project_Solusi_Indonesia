import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function LessonMarkdown({ content }: { content: string }) {
  return (
    <div className="lesson-content">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
