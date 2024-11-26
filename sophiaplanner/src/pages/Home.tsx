import { Header } from "../components/Header";

const Home = () => {
  return (
    <div>
      <Header />
      <div className="h-screen flex justify-center items-center bg-background font-sans  ">
        <form className="w-full max-w-md bg-secondary p-6 runded-lg shadow-md flex flex-col items-center space-y-4">
          <label className="text-lg font-semibold">
            Registrera dig som lärare
          </label>
          <label className="mb-2 text-lg font-semibold">Namn:</label>
          <input
            className="mb-4 p-2 w-full max-w-xs border rounded-md"
            type="text"
          ></input>
          <label className="mb-2 text-lg font-semibold">Email:</label>
          <input
            className="mb-4 p-2 w-full max-w-xs border rounded-md"
            type="text"
          ></input>
          <label className="mb-2 text-lg font-semibold">Lösenord:</label>
          <input
            className="mb-4 p-2 w-full max-w-xs border rounded-md"
            type="password"
          ></input>
          <label className="mb-2 text-lg font-semibold">
            Upprepa lösenord:
          </label>
          <input
            className="mb-4 p-2 w-full max-w-xs border rounded-md"
            type="password"
          ></input>
          <button className="custom-button hover:bg-opacity-80">
            Registrera
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;
