import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
  const { selectedUser, setSelectedUser } = useAuth();

  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    setSelectedUser(null);
    setMenuOpen(false);
    navigate("/");
  };

  const navLinkClass = ({ isActive }) =>
    isActive
      ? "text-blue-600 font-semibold"
      : "text-gray-700 hover:text-blue-600 transition";

  return (
    <header className="bg-white border-b  top-0 z-50 shadow-sm relative">
      <div className="max-w-7xl mx-auto px-5">
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold cursor-pointer text-blue-600 hover:text-blue-800"
          >
            MRBS
          </Link>

          {/* Desktop Menu */}
          {selectedUser && (
            <nav className="hidden md:flex items-center gap-6">
              <NavLink to="/" className={navLinkClass}>
                Home
              </NavLink>

              <NavLink to="/bookings" className={navLinkClass}>
                Bookings
              </NavLink>

              {(selectedUser.role === "OWNER" ||
                selectedUser.role === "ADMIN") && (
                <NavLink to="/summary" className={navLinkClass}>
                  Summary
                </NavLink>
              )}

              {selectedUser.role === "ADMIN" && (
                <NavLink to="/users" className={navLinkClass}>
                  Users
                </NavLink>
              )}
            </nav>
          )}

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-4">
            {selectedUser ? (
              <>
                <div className="text-right">
                  <h3 className="font-semibold">{selectedUser.name}</h3>

                  <p className="text-sm text-blue-600">{selectedUser.role}</p>
                </div>

                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                >
                  Switch User
                </button>
              </>
            ) : (
              <p className="text-gray-500 text-sm">Select User From Home</p>
            )}
          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-2xl cursor-pointer"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden absolute top-full mt-.5 px-2 py-4 right-4  w-40  text-center bg-gray-400 rounded-xl border-0 shadow-xl p-5 animate-up fade-out">
            {selectedUser ? (
              <>
                <div className="mb-4 pb-4 border-b">
                  <h3 className="font-semibold text-lg">{selectedUser.name}</h3>

                  <p className="text-blue-600 text-sm">{selectedUser.role}</p>
                </div>

                <nav className="flex flex-col gap-4">
                  <NavLink
                    to="/"
                    className={navLinkClass}
                    onClick={() => setMenuOpen(false)}
                  >
                    Home
                  </NavLink>

                  <NavLink
                    to="/bookings"
                    className={navLinkClass}
                    onClick={() => setMenuOpen(false)}
                  >
                    Bookings
                  </NavLink>

                  {(selectedUser.role === "OWNER" ||
                    selectedUser.role === "ADMIN") && (
                    <NavLink
                      to="/summary"
                      className={navLinkClass}
                      onClick={() => setMenuOpen(false)}
                    >
                      Summary
                    </NavLink>
                  )}

                  {selectedUser.role === "ADMIN" && (
                    <NavLink
                      to="/users"
                      className={navLinkClass}
                      onClick={() => setMenuOpen(false)}
                    >
                      Users
                    </NavLink>
                  )}

                  <button
                    onClick={handleLogout}
                    className="mt-2 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
                  >
                    Switch User
                  </button>
                </nav>
              </>
            ) : (
              <p className="text-gray-500">Select User From Home</p>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
