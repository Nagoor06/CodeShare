import { useEffect, useState } from "react";
import api from "../api";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router-dom";

const ALLOWED = ".pdf,.png,.jpg,.jpeg,.txt";

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [savedFileUrl, setSavedFileUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const code = sessionStorage.getItem("code");

  // 🔥 Load saved file on page load / refresh
  useEffect(() => {
    if (!code) return;

    api.post("/share/open", { code })
      .then(res => {
        if (res.data.fileUrl) {
          setSavedFileUrl(res.data.fileUrl);
          setPreview(res.data.fileUrl);
        }
      })
      .catch(() => {});
  }, [code]);

  const onFile = e => {
    const f = e.target.files[0];
    setFile(f);

    // Local preview before upload
    if (f && f.type.startsWith("image")) {
      setPreview(URL.createObjectURL(f));
    } else {
      setPreview(null);
    }
  };

  const save = async () => {
    if (!file) return alert("Select a file");

    setUploading(true);
    try {
      const form = new FormData();
      form.append("code", code);
      form.append("file", file);

      await api.post("/share", form);

      // 🔥 Re-fetch saved file from backend
      const res = await api.post("/share/open", { code });
      setSavedFileUrl(res.data.fileUrl);
      setPreview(res.data.fileUrl);

      alert("File uploaded successfully ✅");
    } catch (err) {
      alert("Upload failed ❌");
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async () => {
    if (!window.confirm("Delete this file?")) return;

    await api.post("/share/delete-file", { code });
    setFile(null);
    setPreview(null);
    setSavedFileUrl(null);
  };

  return (
    <div className="h-screen bg-gray-100 p-6">
      <h2 className="text-lg font-semibold mb-2">Upload File</h2>

      <p className="text-sm text-gray-500 mb-4">
        Allowed: {ALLOWED} (Max 5MB)
      </p>

      <input type="file" accept={ALLOWED} onChange={onFile} />

      {/* Preview */}
      {preview && (
        <div className="mt-4">
          {preview.endsWith(".pdf") ? (
            <p className="text-sm text-gray-700">PDF file uploaded</p>
          ) : (
            <img
              src={preview}
              alt="preview"
              className="max-h-64 rounded shadow"
            />
          )}
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <button
          onClick={save}
          disabled={uploading}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          {uploading ? <Spinner text="Uploading" /> : "Save"}
        </button>

        {savedFileUrl && (
          <>
            <a
              href={savedFileUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Download
            </a>

            <button
              onClick={deleteFile}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              Delete
            </button>
          </>
        )}

        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-gray-600 text-white rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}
