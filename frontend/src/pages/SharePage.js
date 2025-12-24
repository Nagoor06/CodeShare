import { useState } from "react";
import api from "../api";

export default function SharePage() {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);

  const share = async () => {
    const code = sessionStorage.getItem("code");
    if (!code) return alert("Code missing");

    const form = new FormData();
    form.append("code", code);
    if (text) form.append("text", text);
    if (file) form.append("file", file);

    await api.post("/share", form, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    alert("Shared successfully");
  };

  return (
    <div>
      <h2>Share Content</h2>

      <textarea
        placeholder="Enter text (optional)"
        onChange={e => setText(e.target.value)}
      />

      <input type="file" onChange={e => setFile(e.target.files[0])} />

      <button onClick={share}>Upload</button>
    </div>
  );
}
