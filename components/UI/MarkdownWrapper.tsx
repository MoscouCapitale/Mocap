import Markdown from "react-markdown";

type MarkdownWrapperProps = {
  content: string;
};

export default function MarkdownWrapper({ content }: MarkdownWrapperProps) {
  return (
    <Markdown
      components={{
        a(props) {
          // Style links as underlined
          return <a className={"underline"} {...props} />;
        },
      }}
    >
      {content}
    </Markdown>
  );
}
