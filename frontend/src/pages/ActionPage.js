import { useNavigate } from "react-router-dom";

export default function ActionPage() {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Choose Action</h2>
      <button onClick={() => navigate("/share")}>Share</button>
      <button onClick={() => navigate("/open")}>Open</button>
    </div>
  );
}
