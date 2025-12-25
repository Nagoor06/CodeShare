import { useEffect, useState } from "react";
import api from "../api";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router-dom";

const LIMIT = 1_000_000;

export default function TextEditor() {
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const code = sessionStorage.getItem("code");

  useEffect(() => {
    api.post("/share/open", { code })
      .then(res => setText(res.data.text || ""))
      .finally(() => setLoading(false));
  }, [code]);

  const save = async () => {
    if (text.length > LIMIT) return alert("Text limit exceeded");

    setSaving(true);
    const form = new FormData();
    form.append("code", code);
    form.append("text", text);

    await api.post("/share", form);
    setTimeout(() => setSaving(false), 600);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <Spinner text="Loading saved text..." />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100 p-4">
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        className="flex-1 p-4 rounded border resize-none"
      />

      <div className="flex justify-between items-center mt-3">
        <div className="flex gap-2">
          <button
            onClick={save}
            className="px-4 py-2 rounded bg-green-600 text-white"
            disabled={saving}
          >
            {saving ? <Spinner text="Saving" /> : "Save"}
          </button>

          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-yellow-500 text-white rounded"
          >
            Refresh
          </button>

          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Close
          </button>
        </div>

        <span className="text-sm text-gray-600">
          {text.length} / {LIMIT}
        </span>
      </div>
    </div>
  );
}
