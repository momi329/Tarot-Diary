import ReactMarkdown from "react-markdown";

export interface ViewerProps {
  value: string;
}

export default function Viewer(props: ViewerProps) {
  //return <div>{props.value}</div>;
  return (
    <ReactMarkdown className='ml-3 mb-4 text-sm font-notoSansJP leading-6 text-gray'>
      {props.value}
    </ReactMarkdown>
  );
}
