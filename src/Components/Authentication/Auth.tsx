import Background from "./../../Assets/samuel-berner-A5GmtHW3O9k-unsplash.jpg";
import Logo from "./../../Assets/head-of-a-horse-outline-svgrepo-com.png";
import {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";

const Login = ({
  email,
  setEmail,
  password,
  setPassword,
  formRef,
}: {
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
  formRef: RefObject<HTMLFormElement>;
}): React.ReactNode => {
  return (
    <div id="Login">
      <h2>Welcome back</h2>
      <p>Glad to have you back with us</p>
      <form ref={formRef}>
        <label htmlFor="email">Email</label>
        <br />
        <input
          type="text"
          id="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <br />
        <label htmlFor="password">Password</label>
        <br />
        <input
          type="password"
          id="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <br />
        <button type="submit">Sign in</button>
      </form>
    </div>
  );
};

const Signup = ({
  username,
  setUsername,
  email,
  setEmail,
  password,
  setPassword,
  formRef,
}: {
  username: string;
  setUsername: Dispatch<SetStateAction<string>>;
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
  formRef: RefObject<HTMLFormElement>;
}): React.ReactNode => {
  return (
    <div id="Signup">
      <h2>Join In</h2>
      <p>Be able to make orders fast and easy with one account</p>
      <form ref={formRef}>
        <label htmlFor="username">Username</label>
        <br />
        <input
          type="text"
          id="username"
          required
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <br />
        <label htmlFor="email">Email</label>
        <br />
        <input
          type="text"
          id="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <br />
        <label htmlFor="password">Password</label>
        <br />
        <input
          type="password"
          id="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <br />
        <div id="terms">
          <input type="checkbox" required />
          <label>Terms and conditions</label>
        </div>

        <br />
        <button type="submit">Sign up</button>
      </form>
    </div>
  );
};

const Auth = (): React.ReactNode => {
  const [page, currentPage] = useState<"login" | "signup">("signup"),
    [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [_, setError] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const handleSubmit = async (event: Event) => {
      event.preventDefault();

      const isLogin = page === "login";
      const url = isLogin
        ? "https://oop-2-production.up.railway.app/api/users/login"
        : "https://oop-2-production.up.railway.app/api/users/register";

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ username, email, password }),
        });

        const result = await response.text();
        if (!response.ok) {
          setError(true);
          console.error("Auth failed:", result);
          return;
        }

        // ✅ Then fetch the full user object by email
        const userResponse = await fetch(
          `https://oop-2-production.up.railway.app/api/users/user/${email}`
        );
        const user = await userResponse.json();

        if (userResponse.ok && user.id) {
          localStorage.setItem("user", JSON.stringify(user));
          window.location.href = "/orders";
        } else {
          alert("User data incomplete. Try logging in again.");
          console.warn("Incomplete user data:", user);
        }
      } catch (err) {
        setError(true);
        console.error("Fetch error:", err);
      }
    };

    const currentForm = formRef.current;
    currentForm?.addEventListener("submit", handleSubmit);
    return () => currentForm?.removeEventListener("submit", handleSubmit);
  }, [username, email, password, page]);

  return (
    <div id="Auth">
      <div id="sidebar">
        <img src={Background} />
        <div id="text">
          <div id="logo">
            <img src={Logo} />
            <p>High Rise</p>
          </div>
          <div id="motto">
            <p>"Best drinks palour in town"</p>
            <p>Since 1930</p>
          </div>
        </div>
      </div>
      <div id="page">
        {page == "login" ? (
          <Login
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            formRef={formRef}
          />
        ) : (
          <Signup
            username={username}
            setUsername={setUsername}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            formRef={formRef}
          />
        )}
      </div>
      <div id="select">
        {page == "signup" ? (
          <p>
            Already have an account,
            <button onClick={() => currentPage("login")}>Log in</button>
          </p>
        ) : (
          <p>
            No account yet,
            <button onClick={() => currentPage("signup")}>Sign up</button>
          </p>
        )}
      </div>
    </div>
  );
};

export default Auth;
