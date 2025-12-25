import { useNavigate } from "react-router-dom";

export default function Choose() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow w-96 text-center">
        <h2 className="text-lg font-semibold mb-6">Choose Option</h2>

        <button
          className="w-full mb-4 bg-green-600 text-white py-2 rounded"
          onClick={() => navigate("/text")}
        >
          Text
        </button>

        <button
          className="w-full bg-purple-600 text-white py-2 rounded"
          onClick={() => navigate("/file")}
        >
          File
        </button>
      </div>
    </div>
  );
}
