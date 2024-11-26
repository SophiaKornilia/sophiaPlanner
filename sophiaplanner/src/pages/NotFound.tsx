import {Link} from 'react-router-dom';

const NotFound = () => {
    return (
      <div>
        <h1>404 NOT FOUND</h1>
        <Link to='/'>Tillbaka till startsidan</Link>
      </div>
    );
  };
  
  export default NotFound;
  