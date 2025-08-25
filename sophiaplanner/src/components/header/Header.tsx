import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/SophiaPlanner_logo.png";
import { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Register from "../Register";
import { MobileMenu } from "../MobileMenu";
import { AnimatePresence, motion } from "framer-motion";
import { NavMenu } from "./NavMenu";
import { Logo } from "./Logo";
import { TeacherNavMenu } from "./TeacherMenu";

export const Header = () => {
  const { logout, user } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false); // Hanterar hamburgermenyn
  const [showRegister, setShowRegister] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 640);
  const navigate = useNavigate();

  // Dynamisk höjd på headern beroende på användarroll och vy
  const isLargeHeader =
    !user ||
    user.role === "student" ||
    (user.role === "teacher" && isMobileView);

  // Effekt för att uppdatera `isMobileView` vid ändring av skärmstorlek
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 639px)");

    const handleResize = (e: MediaQueryListEvent) => {
      setIsMobileView(e.matches);
    };

    setIsMobileView(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleResize);

    return () => {
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, []);

  // useEffect(() => {
  //   const handleResize = () => {
  //     setIsMobileView(window.innerWidth < 640);
  //   };

  //   window.addEventListener("resize", handleResize);
  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, []);

  // Hantera utloggning
  const handleLogoutClick = useCallback(async () => {
    await logout();
    setMenuOpen(false); // Stäng menyn vid utloggning
    navigate("/");
  }, [logout, navigate]);

  // Hantera visning av registreringskomponenten
  const handleShowRegister = useCallback(() => {
    setShowRegister(true); // Visa Register-komponenten
    setMenuOpen(false);
  }, []);

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  const handleCloseRegister = useCallback(() => {
    setShowRegister(false);
  }, []);

  return (
    <>
      {/* Header */}
      <header
        className={`relative bg-primary px-4 sm:px-8 ${isLargeHeader ? "h-20" : "h-14"}`}
      >
        <div className="flex items-center justify-between h-full">
          {/* Vänster: Logotyp */}
          <div className="flex items-center space-x-2">
            {/* Klickbar logotyp som navigerar till Home om man inte är inloggad*/}
            <Logo
              src={logo}
              alt="SophiaPlanner logotyp"
              to={user ? "#" : "/"}
            />
            {/* <Link to={user ? "#" : "/"} className="flex items-center">
              <img
                src={logo}
                alt="SophiaPlanner logotyp"
                className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 transition-transform duration-200 hover:scale-110"
              />
            </Link> */}
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
              onClick={toggleMenu}
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
                  {/* <Link
                    to="/LoginPage"
                    className="bg-accent text-white px-4 py-2 rounded-md hover:bg-opacity-80 "
                    onClick={closeMenu}
                  >
                    Logga in
                  </Link> */}
                  <NavMenu
                    isLoggedIn={!!user}
                    onRegister={handleShowRegister}
                    onLogout={handleLogoutClick}
                  />

                  {/* <button
                    className="bg-secondary text-white px-4 py-2 rounded-md hover:bg-opacity-80 contrast-more:text-highContrastText"
                    onClick={handleShowRegister}
                  >
                    Registrera
                  </button> */}
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobilmeny */}
      <AnimatePresence>
        {menuOpen && isMobileView && (
          <MobileMenu
            isOpen={menuOpen}
            handleClose={closeMenu}
            userRole={user?.role as "teacher" | "student" | undefined}
            isLoggedIn={!!user}
            onLogout={handleLogoutClick}
            onRegister={handleShowRegister}
          />
        )}
      </AnimatePresence>

      {/* Meny för lärare */}
      {
        user?.role === "teacher" && <TeacherNavMenu />
        // <div className="hidden sm:flex items-center justify-end px-8 bg-primary h-14">
        //   <nav>
        //     <ul className="flex space-x-8 text-text">
        //       <li>
        //         <NavLink
        //           to={"/CreateStudentAccount"}
        //           className={({ isActive }) =>
        //             isActive ? " font-semibold underline" : "hover:underline"
        //           }
        //         >
        //           Skapa elevkonto
        //         </NavLink>
        //       </li>
        //       {/* <li>
        //         <NavLink
        //           to={"/HandleAccount"}
        //           className={({ isActive }) =>
        //             isActive ? " font-semibold underline" : "hover:underline"
        //           }
        //         >
        //           Hantera mina konton
        //         </NavLink>
        //       </li> */}
        //       <li>
        //         <NavLink
        //           to={"/CreateLessonPlan"}
        //           className={({ isActive }) =>
        //             isActive ? " font-semibold underline" : "hover:underline"
        //           }
        //         >
        //           Skapa elevplaneringar
        //         </NavLink>
        //       </li>
        //       <li>
        //         <NavLink
        //           to={"/DashboardTeacher"}
        //           className={({ isActive }) =>
        //             isActive ? " font-semibold underline" : "hover:underline"
        //           }
        //         >
        //           Översikt
        //         </NavLink>
        //       </li>
        //     </ul>
        //   </nav>
        // </div>
      }

      {/* Visa registrera-komponenten */}
      {showRegister && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.5,
            ease: [0, 0.71, 0.2, 1.01],
          }}
          className="fixed inset-0 z-50 grid place-items-center bg-black/40 backdrop-blur-sm"
          aria-modal="true"
          role="dialog"
          onClick={handleCloseRegister}
        >
          <div
            className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl backdrop-blur-sm p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <Register setShowRegister={setShowRegister} />
          </div>
          {/* <button
            className="absolute top-4 right-4 bg-primary text-white px-4 py-2 rounded-md"
            onClick={handleCloseRegister}
          >
            Stäng
          </button> */}
        </motion.div>
      )}
    </>
  );
};
