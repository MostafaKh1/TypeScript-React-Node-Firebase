import { useState, Dispatch, SetStateAction } from "react";
import { Auth, analytics } from "../../firebase/FirebaseConfig";
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { logEvent } from "firebase/analytics";
import { useNavigate } from "react-router-dom";

interface LoginPageProps {
  setUserData: Dispatch<SetStateAction<User | null>>;
}

function LoginPage({ setUserData }: LoginPageProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<string>("Register");

  const navigate = useNavigate();

  const RestForm = () => {
    setEmail("");
    setPassword("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (currentPage === "Register") {
      createUserWithEmailAndPassword(Auth, email, password)
        .then(() => {
          logEvent(analytics, "registration_success", {
            email: email,
          });
          RestForm();
          setCurrentPage("Login");
        })
        .catch((error) => {
          logEvent(analytics, "registration_error", {
            email: email,
            error_message: error.message,
          });
          alert(error.code);
        });
    } else {
      signInWithEmailAndPassword(Auth, email, password)
        .then((userData) => {
          logEvent(analytics, "login_success", {
            email: email,
          });
          setUserData(userData.user);
          navigate("/home");
          RestForm();
        })
        .catch((error) => {
          logEvent(analytics, "login_error", {
            email: email,
            error_message: error.message,
          });

          alert(error.code);
        });
    }
  };

  const changePage = () => {
    if (currentPage === "Register") {
      setCurrentPage("Login");
    } else {
      setCurrentPage("Register");
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div className="bg-stone-100 h-screen flex justify-center ">
      <div className="flex justify-center items-center flex-col">
        <div className="bg-white p-12 rounded-lg shadow-lg">
          <h1 className="mb-6 text-3xl text-center pb-4 pt-2 text-zinc-800 font-bold">
            {currentPage === "Register" ? "Register" : "Login"}
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col w-[25rem] gap-y-4">
              <div>
                <label id="email">Email</label>
                <input
                  id="email"
                  onChange={handleEmailChange}
                  type="email"
                  value={email}
                  name="email"
                  placeholder="example@gmail.com"
                />
              </div>
              <div>
                <label id="password">Password</label>
                <input
                  onChange={handlePasswordChange}
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  placeholder="*********"
                />
              </div>
            </div>
            <div className="py-3 mt-2">
              <button
                className="w-full py-3 text-white font-semibold bg-green-500 rounded-lg "
                type="submit"
              >
                {currentPage === "Register" ? "Register" : "Login"}
              </button>
            </div>
          </form>

          <div className="w-full mt-4 text-end">
            <a
              className="py-2 cursor-pointer text-white px-3 rounded-full bg-blue-500"
              onClick={changePage}
            >
              {currentPage === "Register"
                ? "already have account?"
                : "Register Now"}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
