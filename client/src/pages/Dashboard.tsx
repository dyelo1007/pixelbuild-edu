import { useAuth } from "../auth/context/AuthContext";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";

{
  /**
  PRE BUILT PC PICTUES */
}
import pc1Img from "../assets/landing-page-imgs/pb-budgetpc.png";
import pc2Img from "../assets/landing-page-imgs/pb-midend.png";
import pc3Img from "../assets/landing-page-imgs/pb-whitethemed.png";

const linkClass =
  "relative px-3 py-2 transition-all duration-200 text-white hover:text-primary";
const activeClass =
  "after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-primary";

const Dashboard = () => {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  {
    /*} const handleLogout = () => {
    logout();
    navigate("/");
  }; */
  }

  return (
    <div className="px-4 py-10 text-white">
      {/* WILKAM BOX */}
      <motion.div
        className="max-w-5xl mx-auto border-2 border-primary rounded-md p-8 mb-10 bg-darkgray border-dashed"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold mb-4 font-pixelfy">
          Welcome back, <span className="text-primary">@{user?.username}</span>!
        </h1>
        <p className="text-lg mb-6">Continue building [Build Name]?</p>

        {/**
         *
         * HELLO PO PA HELP PO PAAYOS SA BACKEND NUNG SAVED BUILDS NAME
         */}

        <NavLink
          to="/build"
          className="inline-block bg-neonblue hover:bg-hoverprimary text-white px-6 py-2 rounded-3xl transition"
        >
          Continue Building
        </NavLink>
      </motion.div>

      {/* LEARN MORE */}
      <motion.section
        className="max-w-5xl mx-auto mb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-xl font-bold mb-6">
          Learn more about Pixel Build and Computer Parts!
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* GUIDES */}
          <NavLink
            to="/guide"
            className={({ isActive }) =>
              `border-2 border-primary rounded-xl p-4 text-left bg-darkgray hover:bg-darkblue transition block ${
                isActive ? activeClass : ""
              }`
            }
          >
            <h3 className="text-lg font-semibold text-white mb-2">Guides</h3>
            <p className="text-sm text-gray-300">
              Confused about something about Pixel Build? Check out the Guides
              page if you're feeling lost!
            </p>
          </NavLink>

          {/* COMPONENTS */}
          <NavLink
            to="/components"
            className={({ isActive }) =>
              `border-2 border-primary rounded-xl p-4 text-left bg-darkgray hover:bg-darkblue transition block ${
                isActive ? activeClass : ""
              }`
            }
          >
            <h3 className="text-lg font-semibold text-white mb-2">
              Components
            </h3>
            <p className="text-sm text-gray-300">
              Learn more about computer parts and how to install them yourself.
            </p>
          </NavLink>

          {/* SAVED BUILDS */}
          <NavLink
            to="/builds"
            className={({ isActive }) =>
              `border-2 border-primary rounded-xl p-4 text-left bg-darkgray hover:bg-darkblue transition block ${
                isActive ? activeClass : ""
              }`
            }
          >
            <h3 className="text-lg font-semibold text-white mb-2">
              Saved Builds
            </h3>
            <p className="text-sm text-gray-300">
              Access and modify your saved computer builds in here!
            </p>
          </NavLink>
        </div>
      </motion.section>

      {/* Prebuilt PCs 
      GAGAWIN PANG BUTTONS YUNG CARDS*/}
      <motion.section
        className="max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-xl font-bold mb-6">Check out our Pre-Built PCs!</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* PC 1 */}
          <NavLink
            to="" // INPUT NAVLINK WHEN PRE BUILT IS DONE
            className="border-2 border-primary rounded-xl p-4 text-center bg-darkgray hover:bg-darkblue transition block"
          >
            <img src={pc1Img} alt="Budget PC" className="mx-auto mb-2" />
            <p className="text-white font-semibold">Budget PC</p>
          </NavLink>

          {/* PC 2 */}
          <NavLink
            to="" // INPUT NAVLINK WHEN PRE BUILT IS DONE
            className="border-2 border-primary rounded-xl p-4 text-center bg-darkgray hover:bg-darkblue transition block"
          >
            <img src={pc2Img} alt="Mid-End PC" className="mx-auto mb-2" />
            <p className="text-white font-semibold">Mid-End PC</p>
          </NavLink>

          {/* PC 3 */}
          <NavLink
            to="" // INPUT NAVLINK WHEN PRE BUILT IS DONE
            className="border-2 border-primary rounded-xl p-4 text-center bg-darkgray hover:bg-darkblue transition block"
          >
            <img src={pc3Img} alt="White-Themed PC" className="mx-auto mb-2" />
            <p className="text-white font-semibold">White-Themed PC</p>
          </NavLink>
        </div>
      </motion.section>
    </div>
  );
};

export default Dashboard;
