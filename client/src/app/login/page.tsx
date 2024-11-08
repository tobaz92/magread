"use client";

import React, { useContext, useState } from "react";
import AuthContext from "../../context/AuthContext";
import PublicRoute from "../../components/PublicRoute";

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("test@test.com");
  const [password, setPassword] = useState("password123");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <PublicRoute>
      <div>
        <h1>Connexion</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </PublicRoute>
  );
};

export default LoginPage;
