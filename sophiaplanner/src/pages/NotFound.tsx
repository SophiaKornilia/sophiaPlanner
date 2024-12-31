import { Link } from "react-router-dom";

// Visas när användaren navigerar till en sida som inte finns.
const NotFound = () => {
  return (
    <div>
      <h1>404 NOT FOUND</h1>
      <Link to="/">
        <button>Tillbaka till startsidan</button>
      </Link>
    </div>
  );
};

export default NotFound;
