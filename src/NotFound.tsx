// src/pages/NotFound.tsx
import React from "react";
import { useNavigate } from "react-router";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found">
      <h1>404 - Page Not Found</h1>
      <button onClick={() => navigate(-1)}>⬅️ Go Back</button>
      <button onClick={() => navigate("/")}>🏠 Go Home</button>
    </div>
  );
};

export default NotFound;
