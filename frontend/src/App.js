import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Choose from "./pages/Choose";
import TextEditor from "./pages/TextEditor";
import FileUpload from "./pages/FileUpload";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/choose" element={<Choose />} />
      <Route path="/text" element={<TextEditor />} />
      <Route path="/file" element={<FileUpload />} />
    </Routes>
  );
}
