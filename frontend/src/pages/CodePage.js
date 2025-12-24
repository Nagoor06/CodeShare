import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CodePage() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const next = () => {
    if (!code) return alert("Enter a code");
    sessionStorage.setItem("code", code);
    navigate("/action");
  };

  return (
    <div>
      <h2>Enter Secret Code</h2>
      <input onChange={e => setCode(e.target.value)} />
      <button onClick={next}>Continue</button>
    </div>
  );
}
