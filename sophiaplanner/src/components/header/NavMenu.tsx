import { Link } from "react-router-dom";

export type NavItem = {
  label: string;
  href?: string;
  onClick?: () => void;
};
export const NavMenu = ({
  isLoggedIn,
  onRegister,
  onLogout,
}: {
  isLoggedIn: boolean;
  onRegister: () => void;
  onLogout: () => void;
}) => {
  const mainNav: NavItem[] = [
    { label: "Logga in", href: "/LoginPage" },
    { label: "Registrera", onClick: onRegister },
  ];

  const userNav: NavItem[] = [{ label: "Logga ut", onClick: onLogout }];

  const activeNav = isLoggedIn ? userNav : mainNav;

  return (
    <nav className="flex items-center space-x-4">
      {activeNav.map((item) =>
        item.href ? (
          <Link
            key={item.label}
            to={item.href}
            className="bg-accent text-white px-4 py-2 rounded-md hover:bg-opacity-80"
          >
            {item.label}
          </Link>
        ) : (
          <button
            key={item.label}
            onClick={item.onClick}
            className="bg-secondary text-white px-4 py-2 rounded-md hover:bg-opacity-80 contrast-more:text-highContrastText"
          >
            {item.label}
          </button>
        )
      )}
    </nav>
  );
};
