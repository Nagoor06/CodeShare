import { Routes, Route } from "react-router-dom";
import CodePage from "./pages/CodePage";
import ActionPage from "./pages/ActionPage";
import SharePage from "./pages/SharePage";
import OpenPage from "./pages/OpenPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<CodePage />} />
      <Route path="/action" element={<ActionPage />} />
      <Route path="/share" element={<SharePage />} />
      <Route path="/open" element={<OpenPage />} />
    </Routes>
  );
}
