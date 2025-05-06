
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const { t } = useTranslation();
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      // Error is handled in the auth context
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form
        onSubmit={handleSubmit}
        className="bg-card border rounded-lg p-8 w-full max-w-sm shadow space-y-6"
      >
        <h2 className="text-2xl font-bold text-center">{t("Login")}</h2>
        <div>
          <label htmlFor="email" className="block mb-1 font-medium">
            {t("Email")}
          </label>
          <Input
            id="email"
            type="email"
            placeholder={t("Email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1 font-medium">
            {t("Password")}
          </label>
          <Input
            id="password"
            type="password"
            placeholder={t("Password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? t("LoggingIn") + "..." : t("Login")}
        </Button>
        <p className="text-center text-sm">
          {t("SignupPrompt")}{" "}
          <Link to="/signup" className="text-primary underline">
            {t("SignupNow")}
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
