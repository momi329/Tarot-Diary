import BlotFormatter from "quill-blot-formatter";
import { useRef, useState } from "react";

import { ImageDrop } from "quill-image-drop-module";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { htmlToMarkdown, markdownToHtml } from "./Parser";

Quill.register("modules/blotFormatter", BlotFormatter);
Quill.register("modules/imageDrop", ImageDrop);
export type EditorContentChanged = {
  html: string;
  markdown: string;
};

export type EditorProps = {
  value?: string;
  onChange?: (changes: EditorContentChanged) => void;
};

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "blockquote"],
];

export default function Editor(props: EditorProps) {
  const [value, setValue] = useState<string>(markdownToHtml(props.value || ""));
  const reactQuillRef = useRef<ReactQuill>(null);

  const onChange = (content: string) => {
    setValue(content);

    if (props.onChange) {
      props.onChange({
        html: content,
        markdown: htmlToMarkdown(content),
      });
    }
  };

  return (
    <>
      <ReactQuill
        ref={reactQuillRef}
        modules={{
          toolbar: {
            container: TOOLBAR_OPTIONS,
            editor: "bubble",
          },
          blotFormatter: {},
          imageDrop: true,
        }}
        value={value}
        onChange={onChange}
        className="min-h-[130px] w-[95%] text-yellow  mr-4"
      />
    </>
  );
}
