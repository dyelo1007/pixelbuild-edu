import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative w-full mt-40">
      {/* Overlay Top Section */}
      <div className="absolute -top-28 left-1/2 transform -translate-x-1/2 w-full max-w-2xl">
        <div className="bg-neonblue rounded-2xl p-8 md:p-10 text-center shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
            Not sure where to start?
          </h2>
          <p className="text-sm md:text-base text-white/90 leading-relaxed mb-6">
            Your dream rig starts here. From picking the right parts to expert
            tips, PixelBuild has you covered. Head over to our guides to begin
            your build today.
          </p>
          <Link
            to="/guide"
            className="px-6 py-3 bg-white text-neonblue font-semibold rounded-full shadow-md hover:bg-gray-200 transition"
          >
            Building Guides
          </Link>
        </div>
      </div>

      {/* Main Footer Section */}
      <div className="bg-darkbg border-t-4 border-neonblue w-full text-white">
        <div className="px-6 md:px-12 lg:px-20 pt-40 pb-12 grid md:grid-cols-2 gap-10 items-start">
          {/* Left side */}
          <div className="text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-bold text-neonblue mb-4">
              Let’s build something great together
            </h3>
            <Link
              to="/signup" // fixed: should go to signup
              className="inline-block px-6 py-3 bg-neonblue text-white font-medium rounded-full shadow-md hover:bg-hoverprimary transition"
            >
              Sign up now!
            </Link>
          </div>

          {/* Right side */}
          <div className="flex flex-col items-center md:items-end text-center md:text-right">
            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-4 md:mb-6">
              We help you choose PC parts, simulate builds, and learn more about
              its parts.
            </p>

            {/* Socials */}
            <div className="flex gap-4 justify-center md:justify-end">
              <button className="px-6 py-2 border border-neonblue text-neonblue rounded-full hover:bg-darkblue transition">
                Facebook
              </button>
              <button className="px-6 py-2 border border-neonblue text-neonblue rounded-full hover:bg-darkblue transition">
                Twitter
              </button>
              <button className="px-6 py-2 border border-neonblue text-neonblue rounded-full hover:bg-darkblue transition">
                Gmail
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 px-6 md:px-12 lg:px-20 w-full">
          <div className="flex flex-col md:flex-row justify-between items-center py-6 text-sm w-full">
            {/* Nav links */}
            <div className="flex gap-6 mb-4 md:mb-0">
              <Link to="/dashboard" className="hover:text-neonblue transition">
                Home
              </Link>
              <Link to="/build" className="hover:text-neonblue transition">
                Builds
              </Link>
              <Link to="/guide" className="hover:text-neonblue transition">
                Guides
              </Link>
              <Link to="/about" className="hover:text-neonblue transition">
                About
              </Link>
            </div>

            {/* Copyright */}
            <div className="text-gray-400 text-smm md:text-sm">
              © 2025{" "}
              <span className="text-neonblue font-medium">PixelBuild</span>. All
              Rights Reserved
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
