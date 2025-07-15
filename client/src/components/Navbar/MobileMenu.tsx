import NavLinksGroup from "./NavLinksGroup";
import AuthButtons from "./AuthButtons";
import { useAuth } from "../../auth/context/AuthContext";

type MobileMenuProps = {
  onClose: () => void;
};

const MobileMenu = ({ onClose }: MobileMenuProps) => {
  const { user, token } = useAuth();

  return (
    <div className="md:hidden mt-4 flex flex-col gap-3">
      {token && user ? (
        <>
          <NavLinksGroup onClick={onClose} />
          <AuthButtons isMobile onClose={onClose} />
        </>
      ) : (
        <AuthButtons isMobile onClose={onClose} />
      )}
    </div>
  );
};

export default MobileMenu;
