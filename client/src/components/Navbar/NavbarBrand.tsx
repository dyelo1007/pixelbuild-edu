import { NavLink } from "react-router-dom";
import TitleLogo from "/pb-titlelogo.png";

const NavbarBrand = () => (
  <NavLink to="/" className="text-xl font-bold text-white">
    <img src={TitleLogo} alt="Logo" className="w-40 h-14" />
  </NavLink>
);

export default NavbarBrand;
