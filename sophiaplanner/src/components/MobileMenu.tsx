import { motion, Variants } from "framer-motion";
import { NavLink, Link } from "react-router-dom";

type Role = "teacher" | "student";

/* -------- Variants -------- */

const sidebarVariants: Variants = {
  open: {
    clipPath: "inset(0% 0% 0% 0%)",
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 25,
    },
  },
  closed: {
    clipPath: "inset(0% 0% 100% 0%)", // göm hela menyn åt höger
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
    },
  },
};

const navVariants: Variants = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.2 },
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

const itemVariants: Variants = {
  open: {
    opacity: 1,
    x: 0,
    transition: { stiffness: 1000, velocity: -100 },
  },
  closed: {
    opacity: 0,
    x: 20,
    transition: { stiffness: 1000 },
  },
};

const MenuItem: React.FC<React.PropsWithChildren> = ({ children }) => (
  <motion.li
    variants={itemVariants}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="cursor-pointer"
  >
    {children}
  </motion.li>
);

export const MobileMenu = ({
  isOpen,
  handleClose,
  userRole,
  isLoggedIn,
  onLogout,
  onRegister,
}: {
  isOpen: boolean;
  handleClose: () => void;
  userRole?: Role;
  isLoggedIn: boolean;
  onLogout: () => void;
  onRegister: () => void;
}) => {
  return (
    <motion.nav
      initial="closed"
      animate={isOpen ? "open" : "closed"}
      exit="closed"
      variants={sidebarVariants}
      className="fixed top-20 left-0 w-full  bg-white z-30 p-6 "
    >
      <motion.ul
        variants={navVariants}
        className="flex flex-col gap-4 text-lg text-text text-right"
      >
        {isLoggedIn ? (
          <>
            {userRole === "teacher" && (
              <>
                <MenuItem>
                  <NavLink to="/DashboardTeacher" onClick={handleClose}>
                    Översikt
                  </NavLink>
                </MenuItem>
                <MenuItem>
                  <NavLink to="/CreateStudentAccount" onClick={handleClose}>
                    Skapa elevkonto
                  </NavLink>
                </MenuItem>
                <MenuItem>
                  <NavLink to="/CreateLessonPlan" onClick={handleClose}>
                    Skapa elevplaneringar
                  </NavLink>
                </MenuItem>
              </>
            )}

            {/* Elevmeny – just nu endast Logga ut */}
            <MenuItem>
              <button onClick={onLogout} className="text-red-600 font-bold">
                Logga ut
              </button>
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem>
              <Link to="/LoginPage" onClick={handleClose}>
                Logga in
              </Link>
            </MenuItem>
            <MenuItem>
              <button onClick={onRegister}>Registrera</button>
            </MenuItem>
          </>
        )}
      </motion.ul>
    </motion.nav>
  );
};
