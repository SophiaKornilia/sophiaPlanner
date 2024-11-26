import { Link } from "react-router-dom";
import logo from "../assets/images/SophiaPlanner_logo.jpeg";

export const Header = () => {
  return (
    <header className="h-14 bg-primary px-8">
      <div className="flex items-center justify-between h-full">
        <div className="flex items-center">
          <img src={logo} alt="logo" className="h-10 w-10" />
          <h3>SophiaPlanner</h3>
        </div>
        <button className="text-white font-medium hover:text-opacity-80">
          <h5>
            <Link to="/LoginPage">Logga in</Link>
          </h5>
        </button>
      </div>
    </header>
  );
};
