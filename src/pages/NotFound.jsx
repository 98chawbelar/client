import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
      <h1 className="text-7xl font-bold text-blue-600">404</h1>

      <p className="text-2xl mt-4 font-semibold">Page Not Found</p>

      <Link
        to="/"
        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
      >
        Back Home
      </Link>
    </div>
  );
};

export default NotFound;
