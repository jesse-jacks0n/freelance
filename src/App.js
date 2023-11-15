import logo from './logo.svg';
import './App.css';
import './tailwind.css'; 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          {/* <Route exact path="/signup" element={<SignupPage />} />
          <Route exact path="/home" element={<Home />} /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
