// src/Components/User/UserSettings.tsx
import React, { useEffect, useState } from "react";

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  balance?: number;
}

const UserSettings: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [balance, setBalance] = useState("");

  useEffect(() => {
    const localUser = localStorage.getItem("user");

    if (!localUser) {
      setError("User not logged in.");
      setLoading(false);
      return;
    }

    const parsedUser: User = JSON.parse(localUser);
    const userId = parsedUser.id;

    fetch(`https://oop-2-production.up.railway.app/api/users/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch user.");
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setName(data.username);
        setEmail(data.email);
        setBalance(data.balance?.toString() || "");
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch user data.");
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    window.location.href = "/auth"; // or navigate("/auth");
  };

  const handleUpdate = async () => {
    if (!user) return;

    setSuccess("");
    setError("");

    try {
      const response = await fetch(
        `https://oop-2-production.up.railway.app/api/users/${user.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: name,
            email: email,
            password: password || undefined,
            balance: balance ? parseFloat(balance) : undefined,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update user.");

      localStorage.setItem("user", JSON.stringify(await response.json()));

      setSuccess("User updated successfully.");
      setPassword(""); // clear password field
    } catch (err) {
      setError("Failed to update user.");
    }
  };

  if (loading)
    return (
      <div className="UserSettingsPage loading">
        <button
          className="back-button"
          onClick={() => (window.location.href = "/")}
        >
          ← Back
        </button>
        <p>Loading user settings...</p>
      </div>
    );

  if (error)
    return (
      <div className="UserSettingsPage error">
        <button
          className="back-button"
          onClick={() => (window.location.href = "/")}
        >
          ← Back
        </button>
        <p>{error}</p>
      </div>
    );

  return (
    <div className="UserSettingsPage">
      <div className="header">
        <h1>User Settings</h1>
        <button
          className="back-button"
          onClick={() => (window.location.href = "/")}
        >
          ← Back
        </button>
      </div>

      <div className="info">
        <p>
          <strong>Name:</strong> {user?.username}
        </p>
        <p>
          <strong>Email:</strong> {user?.email}
        </p>
        <p>
          <strong>Role:</strong> {user?.role}
        </p>
        {user?.balance !== undefined && (
          <p>
            <strong>Balance:</strong> KES {user.balance.toFixed(2)}
          </p>
        )}
        <button className="logout-button" onClick={handleLogout}>
          Log Out
        </button>
      </div>

      <div className="update-form">
        <h2>Update Account</h2>

        <label>
          Name:
          <input placeholder={name} onChange={(e) => setName(e.target.value)} />
        </label>

        <label>
          Email:
          <input
            type="email"
            placeholder={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label>
          Password:
          <input
            type="password"
            placeholder="Leave blank to keep unchanged"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <label>
          Balance:
          <input
            type="number"
            placeholder={balance}
            onChange={(e) => setBalance(e.target.value)}
          />
        </label>

        <button onClick={handleUpdate}>Update</button>

        {success && <p className="success">{success}</p>}
        {error && <p className="error-msg">{error}</p>}
      </div>
    </div>
  );
};

export default UserSettings;
