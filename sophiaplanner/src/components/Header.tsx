import { Link, NavLink } from "react-router-dom";
import logo from "../assets/images/SophiaPlanner_logo.jpeg";
import { useEffect, useState } from "react";
import { auth, db } from "../../config/firebas-config";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export const Header = () => {
  const [user, setUser] = useState<User | null>(null); // Håll koll på användaren
  const [userRole, setUserRole] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        console.log("Användare är inloggad:", currentUser.email);
        setUser(currentUser); // Uppdatera användarstatus

        //Hämta user role från Firestore
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const role = userDocSnap.data().role;
          const name = userDocSnap.data().name;
          setUserRole(role);
          setName(name);
          console.log("Användarroll:", role);
        } else {
          console.log("Ingen roll hittades för användaren i Firestore.");
          setUserRole(null);
        }
      } else {
        console.log("Ingen användare är inloggad.");
        setUser(null);
        setUserRole(null);
      }
    });

    // Rensa upp lyssnaren när komponenten avmonteras
    return () => unsubscribe();
  }, []);

  const handleLogoutClick = async () => {
    try {
      await signOut(auth);
      console.log("Utloggning lyckades! ");
    } catch (error) {
      console.error("Ett fel inträffade vid utloggning:", error);
    }
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
          {user && (
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <p className="font-semibold">Välkommen {name}!</p>
            </div>
          )}

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
            </ul>
          </nav>
        </div>
      ) : null}
    </>
  );
};
