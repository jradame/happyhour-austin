import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Submit from "./pages/Submit";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <div style={{ height: "100vh", overflow: "hidden", background: "#0D0D0D", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/submit" element={<ProtectedRoute><Submit /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/about" element={<About />} />
<Route path="/contact" element={<Contact />} />
      </Routes>
    </div>
  );
}