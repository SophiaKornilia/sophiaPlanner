import { Link, NavLink } from "react-router-dom";
import logo from "../assets/images/SophiaPlanner_logo.jpeg";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

export const Header = () => {
  const { user, token, logout } = useContext(AuthContext);
  // const navigate = useNavigate();

  useEffect(() => {
    console.log("user", user, "token", token);
    return;
  }, [user, token]);

  const handleLogoutClick = async () => {
    await logout();
  };
  return (
    <>
      <header className="h-14 bg-primary px-8">
        <div className="flex items-center justify-between h-full">
          {/* Vänster: Logotyp och rubrik */}
          <div className="flex items-center">
            <img src={logo} alt="logo" className="h-10 w-10" />
            <h3 className="ml-2">SophiaPlanner</h3>
          </div>

          {/* Mitten: Namn */}
          {user ? (
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <p className="font-semibold">Välkommen {user.name}!</p>
            </div>
          ) : null}

          {/* Höger: Logga in/ut */}
          <button className="text-white font-medium hover:text-opacity-80">
            {user ? (
              <h5 onClick={handleLogoutClick}>
                <Link to="/">Logga ut</Link>
              </h5>
            ) : (
              <h5>
                <Link to="/LoginPage">Logga in</Link>
              </h5>
            )}
          </button>
        </div>
      </header>

      {user ? (
        <div className="flex items-center justify-end px-8 bg-primary h-14">
          <nav>
            <ul className="flex space-x-8">
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
              <li>
                <NavLink
                  to={"/HandleAccount"}
                  className={({ isActive }) =>
                    isActive ? " font-semibold underline" : "hover:underline"
                  }
                >
                  Hantera mina konton
                </NavLink>
              </li>
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
                  Home
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      ) : null}
    </>
  );
};
