import ReactMarkdown from "react-markdown";

export interface ViewerProps {
  value: string;
}

export default function Viewer(props: ViewerProps) {
  return (
    <ReactMarkdown
      className="ml-3 mb-4 text-sm font-notoSansJP leading-6 
    text-gray whitespace-normal  break-words w-[100%]"
    >
      {props.value}
    </ReactMarkdown>
  );
}
