import { createContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [selectedUser, setSelectedUser] = useState(() => {
    const savedUser = localStorage.getItem("selectedUser");

    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (selectedUser) {
      localStorage.setItem("selectedUser", JSON.stringify(selectedUser));
    } else {
      localStorage.removeItem("selectedUser");
    }
  }, [selectedUser]);

  return (
    <AuthContext.Provider
      value={{
        selectedUser,
        setSelectedUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
