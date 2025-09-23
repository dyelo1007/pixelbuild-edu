import { useState } from "react";
import { Squash as Hamburger } from "hamburger-react";
import { useAuth } from "../../auth/context/AuthContext";
import NavLinksGroup from "./NavLinksGroup";
import AuthButtons from "./AuthButtons";
import MobileMenu from "./MobileMenu";
import NavbarBrand from "./NavbarBrand";
import { ModeToggle } from "../mode-toggle";

const Navbar = () => {
  const { user, token } = useAuth();
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <div className="pt-5">
        <nav className="bg-lightbg  border-b-4 border-neonblue px-6 py-4 mx-5  rounded-[10px] relative z-50 dark:bg-darkbg">
          <div className="flex justify-between items-center">
            <NavbarBrand />
            {token && user && (
              <div className="hidden md:flex justify-center space-x-6">
                <NavLinksGroup />
              </div>
            )}

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center space-x-4">
                <ModeToggle />
                <AuthButtons />
              </div>
              <div className="md:hidden">
                <Hamburger toggled={isOpen} toggle={setOpen} color="#51ab91" />
              </div>
            </div>
          </div>
          {isOpen && (
            <div className="absolute top-full left-0 w-full z-40 border-b-4 border-neonblue bg-[#212121]/95 backdrop-blur-md shadow-lg rounded-b-[10px] px-6 py-4 mt-[-25px] ">
              <MobileMenu onClose={() => setOpen(false)} />
            </div>
          )}
        </nav>
      </div>
    </>
  );
};

export default Navbar;
