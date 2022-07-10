import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import { useRef } from "react";
import Button from "../button/Button";
import toast from "react-hot-toast";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface IProps {
  body: string;
  setBody: (value: string) => void;
  callback:(body: string) => void
}

const LiteQuill: React.FC<IProps> = ({ body, setBody, callback }) => {
  const modules = { toolbar: { container } };
  const divRef = useRef<HTMLDivElement>(null);

  const handleSubmit = () =>{
    const div = divRef.current;
    const text = div?.innerText as string;
    if(!text.trim()) return toast.error("Comment is require");
    callback(body);
    setBody("")
  }

  return (
    <>
      <ReactQuill
        theme="snow"
        modules={modules}
        placeholder="Write comment...."
        onChange={(e) => setBody(e)}
        value={body}
      />

      <div
        style={{
          display: "none",
        }}
        ref={divRef}
        dangerouslySetInnerHTML={{
          __html: body,
        }}
      />

      <Button
        type="button"
        className="app_btn"
        style={{
          marginTop: "1em",
        }}
        onClick={handleSubmit}
      >
        Send
      </Button>
    </>
  );
};

let container = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],

  ["clean", "link"], // remove formatting button
];

export default LiteQuill;
