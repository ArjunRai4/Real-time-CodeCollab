import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup"; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/api/user/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
