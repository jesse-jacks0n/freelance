import './App.css';
import './tailwind.css'; 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AdminHomePage from "./pages/AdminHomePage";
import Translation from "./pages/jobs/Translation";
import Retyping from "./pages/jobs/Retyping";
import DocumentConversion from "./pages/jobs/DocumentConversion";
import LogoDesign from "./pages/jobs/LogoDesign";
import SignupPage from "./auth/SignupPage";
import LoginPage from "./auth/Login";
import FreelancerDash from "./freelancer/tabs/freelancerDash";
import Workers from "./pages/tabs/Workers";
import FreelancerHomePage from "./freelancer/FreelancerHomePage";
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<LoginPage />} />
          <Route exact path="signup" element={<SignupPage />} />
          <Route exact path="adminHomePage" element={<AdminHomePage />} />
          <Route exact path="freelancerDash" element={<FreelancerDash />} />
          <Route exact path="freelancerHomePage" element={<FreelancerHomePage />} />
          <Route exact path="applicants" element={<Workers />} />
          <Route exact path="translation" element={<Translation />} />
          <Route exact path="retyping" element={<Retyping />} />
          <Route exact path="documentconversion" element={<DocumentConversion />} />
          <Route exact path="logodesign" element={<LogoDesign />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
