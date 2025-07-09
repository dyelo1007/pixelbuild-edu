import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";

const Landing = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <button
          className="bg-primary text-white px-6 py-3 rounded-lg text-lg"
          onClick={handleGetStarted}
        >
          Get Started
        </button>
      </div>
    </>
  );
};

export default Landing;
