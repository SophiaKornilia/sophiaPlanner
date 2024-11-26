import { Header } from "../components/Header";
import "../styles/index.css";
const Login = () => {
  return (
    <div>
      <Header />
      <div className="h-screen items-start bg-background font-sans flex justify-center">
        <form className="h-2/4 w-1/4  bg-secondary mt-[10%] flex flex-col items-center justify-center p-6 rounded-lg shadow-md">
          <label className="mb-2 text-lg font-semibold">Användarnamn:</label>
          <input
            className="mb-4 p-2 w-full max-w-xs border rounded-md"
            type="text"
          ></input>
          <label className="mb-2 text-lg font-semibold">Lösenord:</label>
          <input
            className="mb-4 p-2 w-full max-w-xs border rounded-md"
            type="password"
          ></input>
          <button className="custom-button hover:bg-opacity-80">
            Logga in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
