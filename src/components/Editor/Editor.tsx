import { useRef, useState } from "react";
import BlotFormatter from "quill-blot-formatter";

import ReactQuill, { Quill } from "react-quill";
import * as Emoji from "quill-emoji";
import { markdownToHtml, htmlToMarkdown } from "./Parser";
import { ImageDrop } from "quill-image-drop-module";
import "react-quill/dist/quill.snow.css";
import "quill-emoji/dist/quill-emoji.css";

Quill.register("modules/blotFormatter", BlotFormatter);
Quill.register("modules/imageDrop", ImageDrop);
Quill.register("modules/emoji", Emoji);
export interface EditorContentChanged {
  html: string;
  markdown: string;
}

export interface EditorProps {
  value?: string;
  onChange?: (changes: EditorContentChanged) => void;
}

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "blockquote"],
  //[{ list: "ordered" }, { list: "bullet" }],
  //[{ indent: "-1" }, { indent: "+1" }],
  // ["link", "image"],
  ["emoji"],
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
        theme='snow'
        modules={{
          toolbar: {
            container: TOOLBAR_OPTIONS,
            editor: "bubble",
          },
          blotFormatter: {},
          imageDrop: true,
          "emoji-toolbar": true,
          "emoji-textarea": false,
          "emoji-shortname": true,
        }}
        value={value}
        onChange={onChange}
        className='min-h-[150px] w-[95%] text-yellow ml-24 mr-4'
      />
    </>
  );
}
