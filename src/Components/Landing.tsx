import { useNavigate } from "react-router";
import Logo from "./../Assets/head-of-a-horse-outline-svgrepo-com.png";

const Landing = (): React.ReactNode => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    const user = localStorage.getItem("user");
    if (user) navigate("/orders");
    else navigate("/auth");
  };

  const handleUserSettings = () => {
    const user = localStorage.getItem("user");
    if (user) navigate(`/management/user/${(user as any).id}`);
    else navigate("/auth");
  };

  return (
    <div id="Landing">
      {/* ✅ Small top-right navbar */}
      <div className="top-navbar">
        <button className="user-settings" onClick={() => handleUserSettings()}>
          <i className="fa-solid fa-user"></i>
        </button>
      </div>

      <div className="left">
        <h1>Welcome to High Rise</h1>
        <p>Your one-stop liquor and drinks stock management solution</p>
        <ul>
          <li>Track Inventory in Real-time</li>
          <li>Process Orders Efficiently</li>
          <li>Manage Branch Transactions</li>
        </ul>
        <div className="buttons">
          <button className="getStarted" onClick={handleGetStarted}>
            Get Started
          </button>
          <button
            className="adminBtn"
            onClick={() => navigate("/management/admin")}
          >
            Admin HQ
          </button>

          <div className="branches">
            <button
              onClick={() =>
                navigate(
                  "/management/branch/ba2ca26e-9b6e-4495-a514-1043b2d88f24"
                )
              }
            >
              Machakos
            </button>
            <button
              onClick={() =>
                navigate(
                  "/management/branch/cf64d5fd-8422-474e-8b9f-f61ac77b8ae0"
                )
              }
            >
              Mombasa
            </button>
            <button
              onClick={() =>
                navigate(
                  "/management/branch/133ea6d2-44de-4149-9896-43e308874f79"
                )
              }
            >
              Kisumu
            </button>
          </div>
        </div>
      </div>
      <div className="right">
        <img src={Logo} alt="High Rise Logo" />
      </div>
    </div>
  );
};

export default Landing;
