import { useState } from "react";
import api from "../api";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router-dom";

const ALLOWED = ".pdf,.png,.jpg,.jpeg,.txt";

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const code = sessionStorage.getItem("code");

  const onFile = e => {
    const f = e.target.files[0];
    setFile(f);

    if (f && f.type.startsWith("image")) {
      setPreview(URL.createObjectURL(f));
    } else {
      setPreview(null);
    }
  };

  const save = async () => {
    if (!file) return alert("Select a file");

    setUploading(true);
    const form = new FormData();
    form.append("code", code);
    form.append("file", file);

    await api.post("/share", form, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    setUploading(false);
    alert("File uploaded successfully");
  };

  return (
    <div className="h-screen bg-gray-100 p-6">
      <h2 className="text-lg font-semibold mb-2">Upload File</h2>

      <p className="text-sm text-gray-500 mb-4">
        Allowed: {ALLOWED} (Max 5MB)
      </p>

      <input type="file" accept={ALLOWED} onChange={onFile} />

      {preview && (
        <img
          src={preview}
          alt="preview"
          className="mt-4 max-h-64 rounded shadow"
        />
      )}

      <div className="mt-4 flex gap-2">
        <button
          onClick={save}
          disabled={uploading}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          {uploading ? <Spinner text="Uploading" /> : "Save"}
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
    </div>
  );
}
