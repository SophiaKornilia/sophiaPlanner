import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/images/SophiaPlanner_logo.png";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Register from "./Register";

export const Header = () => {
  const { logout, user } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false); // Hanterar hamburgermenyn
  const [showRegister, setShowRegister] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 640);
  const navigate = useNavigate();

  const isLargeHeader =
    !user ||
    user.role === "student" ||
    (user.role === "teacher" && isMobileView); // Dynamisk höjd

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 640);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleLogoutClick = async () => {
    await logout();
    setMenuOpen(false); // Stäng menyn vid utloggning
    navigate("/");
  };

  const handleShowRegister = () => {
    setShowRegister(true); // Visa Register-komponenten
    setMenuOpen(false); // Stäng menyn
  };

  return (
    <>
      {/* Header */}
      <header
        className={`relative bg-primary px-4 sm:px-8 ${isLargeHeader ? "h-20" : "h-14"}`}
      >
        <div className="flex items-center justify-between h-full">
          {/* Vänster: Logotyp */}
          <div className="flex items-center space-x-2">
            {/* Klickbar logotyp som navigerar till Home */}
            <Link to={user ? "#" : "/"} className="flex items-center">
              <img
                src={logo}
                alt="SophiaPlanner logotyp"
                className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 transition-transform duration-200 hover:scale-110"
              />
            </Link>
            {/* Text som syns bara på större skärmar */}
            <h3 className="ml-2 text-sm sm:text-lg hidden sm:block text-text">
              SophiaPlanner
            </h3>
          </div>

          {/* Mitten: Välkomstmeddelande */}
          {user && (
            <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:block">
              <p className="font-semibold text-text">Välkommen {user.name}!</p>
            </div>
          )}

          {/* Höger: Hamburgermeny eller länkar */}
          <div className="flex items-center space-x-4">
            {/* Hamburgermeny för mobil */}
            <button
              className="sm:hidden focus:outline-none"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <span className="block w-6 h-1 bg-text mb-1"></span>
              <span className="block w-6 h-1 bg-text mb-1"></span>
              <span className="block w-6 h-1 bg-text"></span>
            </button>

            {/* Länkar för större skärmar */}
            <div className="hidden sm:flex items-center space-x-4">
              {user ? (
                <button
                  className="text-white font-medium hover:underline contrast-more:text-highContrastText"
                  onClick={handleLogoutClick}
                >
                  Logga ut
                </button>
              ) : (
                <>
                  <Link
                    to="/LoginPage"
                    className="bg-accent text-white px-4 py-2 rounded-md hover:bg-opacity-80 "
                    onClick={() => setMenuOpen(false)}
                  >
                    Logga in
                  </Link>
                  <button
                    className="bg-secondary text-white px-4 py-2 rounded-md hover:bg-opacity-80 contrast-more:text-highContrastText"
                    onClick={handleShowRegister}
                  >
                    Registrera
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobilmeny */}
      {menuOpen && (
        <nav className="fixed top-20 left-0 w-full bg-white text-text shadow-md sm:hidden z-20">
          <ul className="flex flex-col space-y-2 p-4">
            {user ? (
              user.role === "teacher" ? (
                // Lärare-meny
                <>
                  <li>
                    <NavLink
                      to="/DashboardTeacher"
                      className="block w-full text-left"
                      onClick={() => setMenuOpen(false)}
                    >
                      Hem
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/CreateStudentAccount"
                      className="block w-full text-left"
                      onClick={() => setMenuOpen(false)}
                    >
                      Skapa elevkonto
                    </NavLink>
                  </li>
                  {/* <li>
                    <NavLink
                      to="/HandleAccount"
                      className="block w-full text-left"
                      onClick={() => setMenuOpen(false)}
                    >
                      Hantera mina konton
                    </NavLink>
                  </li> */}
                  <li>
                    <NavLink
                      to="/CreateLessonPlan"
                      className="block w-full text-left"
                      onClick={() => setMenuOpen(false)}
                    >
                      Skapa elevplaneringar
                    </NavLink>
                  </li>
                  <li>
                    <button
                      className="block w-full text-left text-red-600 font-bold"
                      onClick={handleLogoutClick}
                    >
                      Logga ut
                    </button>
                  </li>
                </>
              ) : (
                //student user
                <li>
                  <button
                    className="block w-full text-left text-red-600 font-bold"
                    onClick={handleLogoutClick}
                  >
                    Logga ut
                  </button>
                </li>
              )
            ) : (
              <>
                <li>
                  <Link
                    to="/LoginPage"
                    className="block w-full text-left"
                    onClick={() => setMenuOpen(false)}
                  >
                    Logga in
                  </Link>
                </li>
                <li>
                  <button
                    className="block w-full text-left contrast-more:text-highContrastText"
                    onClick={handleShowRegister}
                  >
                    Registrera
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
      )}

      {user?.role === "teacher" && (
        <div className="hidden sm:flex items-center justify-end px-8 bg-primary h-14">
          <nav>
            <ul className="flex space-x-8 text-text">
              <li>
                <NavLink
                  to={"/CreateStudentAccount"}
                  className={({ isActive }) =>
                    isActive ? " font-semibold underline" : "hover:underline"
                  }
                >
                  Skapa elevkonto
                </NavLink>
              </li>
              {/* <li>
                <NavLink
                  to={"/HandleAccount"}
                  className={({ isActive }) =>
                    isActive ? " font-semibold underline" : "hover:underline"
                  }
                >
                  Hantera mina konton
                </NavLink>
              </li> */}
              <li>
                <NavLink
                  to={"/CreateLessonPlan"}
                  className={({ isActive }) =>
                    isActive ? " font-semibold underline" : "hover:underline"
                  }
                >
                  Skapa elevplaneringar
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={"/DashboardTeacher"}
                  className={({ isActive }) =>
                    isActive ? " font-semibold underline" : "hover:underline"
                  }
                >
                  Hem
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* Visa Register-komponenten */}
      {showRegister && (
        <div className="fixed top-0 left-0 w-full h-full bg-white z-50 overflow-auto">
          <Register setShowRegister={setShowRegister} />
          <button
            className="absolute top-4 right-4 bg-primary text-white px-4 py-2 rounded-md"
            onClick={() => setShowRegister(false)}
          >
            Stäng
          </button>
        </div>
      )}
    </>
  );
};
