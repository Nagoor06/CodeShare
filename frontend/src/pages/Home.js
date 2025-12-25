import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const next = () => {
    if (!code.trim()) return alert("Enter secret code");
    sessionStorage.setItem("code", code);
    navigate("/choose");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow w-96">
        <h1 className="text-xl font-semibold mb-4">Enter Secret Code</h1>
        <input
          className="w-full border p-2 rounded mb-4"
          placeholder="Secret code"
          onChange={e => setCode(e.target.value)}
        />
        <button
          onClick={next}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
