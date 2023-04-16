import ReactMarkdown from "react-markdown";

export interface ViewerProps {
  value: string;
}

export default function Viewer(props: ViewerProps) {
  //return <div>{props.value}</div>;
  return <ReactMarkdown>{props.value}</ReactMarkdown>;
}
