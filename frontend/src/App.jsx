import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup"; 
import Login from "./pages/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/api/user/signup" element={<Signup />} />
        <Route path="/api/user/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
