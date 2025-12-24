import { useState } from "react";
import api from "../api";

export default function OpenPage() {
  const [result, setResult] = useState(null);

  const open = async () => {
    const code = sessionStorage.getItem("code");
    if (!code) return alert("Code missing");

    const res = await api.post("/share/open", { code });
    setResult(res.data);
  };

  return (
    <div>
      <h2>Open Shared Content</h2>
      <button onClick={open}>Open</button>

      {result?.text && <pre>{result.text}</pre>}
      {result?.fileUrl && (
        <a href={result.fileUrl} target="_blank">Download File</a>
      )}
    </div>
  );
}
