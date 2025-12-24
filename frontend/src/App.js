import { useState } from "react";
import api from "./api";

export default function App() {
  const [code, setCode] = useState("");
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const share = async () => {
    const form = new FormData();
    form.append("code", code);
    if (text) form.append("text", text);
    if (file) form.append("file", file);

    await api.post("/share", form);
    alert("Shared");
  };

  const open = async () => {
    const res = await api.post("/share/open", { code });
    setResult(res.data);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Secure Share</h2>
      <input placeholder="Secret Code" onChange={e => setCode(e.target.value)} />
      <textarea onChange={e => setText(e.target.value)} />
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <button onClick={share}>Share</button>
      <button onClick={open}>Open</button>

      {result?.text && <pre>{result.text}</pre>}
      {result?.fileUrl && <a href={result.fileUrl}>Download</a>}
    </div>
  );
}
