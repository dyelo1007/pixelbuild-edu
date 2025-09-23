import { NavLink } from "react-router-dom";

type NavLinksGroupProps = {
  onClick?: () => void;
};

const links = [
  { label: "Home", path: "/home" },
  { label: "Build", path: "/build" },
  { label: "About", path: "/about" },
  { label: "Guide", path: "/guide" },
];

const linkClass =
  "relative px-3 py-2 transition-all duration-200 text-neonblue hover:text-primary";
const activeClass =
  "after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-neonblue";

const NavLinksGroup = ({ onClick }: NavLinksGroupProps) => {
  return (
    <>
      {links.map(({ label, path }) => (
        <NavLink
          key={label}
          to={path}
          onClick={onClick}
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
        >
          {label}
        </NavLink>
      ))}
    </>
  );
};

export default NavLinksGroup;
