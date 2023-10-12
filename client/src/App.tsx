import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./Page/LoginPage";
import Home from "./Page/Home";
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { Auth } from "./firebase/FirebaseConfig";
function App() {
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  console.log(userData);

  useEffect(() => {
    onAuthStateChanged(Auth, (user) => {
      
      setUserData(user);
      setLoading(false);
    });
  }, []);
  if (loading) {
    return <div>Loading</div>;
  }
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<LoginPage setUserData={setUserData} />} />
          <Route
            path="/home"
            element={
              userData ? <Home userData={userData} setUserData={setUserData} /> : <Navigate to="/" />
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
