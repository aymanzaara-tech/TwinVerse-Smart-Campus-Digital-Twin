import { BrowserRouter, Routes, Route } from "react-router-dom";
import ThreeScene from "./pages/ThreeScene";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/3d" element={<ThreeScene />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;