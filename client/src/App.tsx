import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

interface User {
  id: string;
  name: string | null;
  email: string;
  picture: string | null;
}

function App() {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("reachinbox_user");

    return savedUser ? JSON.parse(savedUser) : null;
  });

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <Dashboard
      user={user}
      onLogout={() => {
        localStorage.removeItem("reachinbox_user");
        setUser(null);
      }}
    />
  );
}

export default App;