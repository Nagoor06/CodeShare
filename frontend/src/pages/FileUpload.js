import { useEffect, useState } from "react";
import api from "../api";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router-dom";

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "text/plain",
];

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [saved, setSaved] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const code = sessionStorage.getItem("code");

  /* 🔥 Load saved file metadata on page load */
  useEffect(() => {
    if (!code) return;

    api
      .post("/share/open", { code })
      .then(res => {
        if (res.data.hasFile) {
          setSaved(res.data);
        }
      })
      .catch(() => {});
  }, [code]);

  /* 🔒 Frontend validation */
  const onFileChange = e => {
    const f = e.target.files[0];
    if (!f) return;

    if (!ALLOWED_TYPES.includes(f.type)) {
      alert("Only PDF, images, or text files are allowed");
      return;
    }

    if (f.size > MAX_SIZE) {
      alert("File size must be 5MB or less");
      return;
    }

    setFile(f);
  };

  /* ⬆️ Upload */
  const save = async () => {
    if (!file) return alert("Select a file");

    setUploading(true);
    try {
      const form = new FormData();
      form.append("code", code);
      form.append("file", file);

      await api.post("/share", form);

      // 🔁 Re-fetch metadata
      const res = await api.post("/share/open", { code });
      setSaved(res.data);

      alert("File uploaded successfully ✅");
    } catch (err) {
      console.error(err);
      alert("Upload failed ❌");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="h-screen bg-gray-100 p-6">
      <h2 className="text-lg font-semibold mb-2">Upload File</h2>

      <p className="text-sm text-gray-500 mb-4">
        Allowed: PDF, PNG, JPG, TXT (Max 5MB)
      </p>

      <input type="file" onChange={onFileChange} />

      {/* 🔽 Existing file */}
      {saved && (
        <div className="mt-4 p-4 bg-white rounded shadow">
          <p className="text-sm font-medium mb-2">
            📎 {saved.fileName}
          </p>

          {/* 🖼️ Image preview via download endpoint */}
          {saved.fileType?.startsWith("image") && (
            <img
              src={`${api.defaults.baseURL}/share/download/${saved.fileId}`}
              alt="preview"
              className="max-h-64 rounded mb-2"
            />
          )}

          <a
            href={`${api.defaults.baseURL}/share/download/${saved.fileId}`}
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded"
          >
            Download
          </a>
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
