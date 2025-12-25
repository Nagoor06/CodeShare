import { useEffect, useState } from "react";
import api from "../api";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router-dom";

const ALLOWED = ".pdf,.png,.jpg,.jpeg,.txt";

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [saved, setSaved] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const code = sessionStorage.getItem("code");

  // 🔥 Load saved file on page load
  useEffect(() => {
    if (!code) return;

    api.post("/share/open", { code }).then(res => {
      if (res.data.fileUrl) {
        setSaved(res.data);
      }
    });
  }, [code]);

  const save = async () => {
    if (!file) return alert("Select a file");

    setUploading(true);
    try {
      const form = new FormData();
      form.append("code", code);
      form.append("file", file);

      await api.post("/share", form);

      const res = await api.post("/share/open", { code });
      setSaved(res.data);

      alert("File uploaded successfully ✅");
    } catch {
      alert("Upload failed ❌");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="h-screen bg-gray-100 p-6">
      <h2 className="text-lg font-semibold mb-2">Upload File</h2>

      <p className="text-sm text-gray-500 mb-4">
        Allowed: {ALLOWED} (Max 5MB)
      </p>

      <input
        type="file"
        accept={ALLOWED}
        onChange={e => setFile(e.target.files[0])}
      />

      {/* Existing file */}
      {saved && (
        <div className="mt-4 p-3 bg-white rounded shadow">
          <p className="text-sm font-medium">
            📎 {saved.fileName}
          </p>

          {saved.fileType?.startsWith("image") && (
            <img
              src={saved.fileUrl}
              alt="preview"
              className="mt-2 max-h-64 rounded"
            />
          )}

          <div className="mt-2 flex gap-2">
            <a
              href={saved.fileUrl}
              download={saved.fileName}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1 bg-blue-600 text-white rounded"
            >
              Download
            </a>
          </div>
        </div>
      )}

      <div className="mt-4">
        <button
          onClick={save}
          disabled={uploading}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          {uploading ? <Spinner text="Uploading" /> : "Save"}
        </button>

        <button
          onClick={() => navigate("/")}
          className="ml-2 px-4 py-2 bg-gray-600 text-white rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}
