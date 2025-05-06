
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";

const Signup = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signup, loading } = useAuth();
  
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!companyName.trim() || !name.trim() || !phone.trim()) {
        throw new Error("All fields are required");
      }
      
      await signup(email, password, name, companyName, phone);
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
        <h2 className="text-2xl font-bold text-center">{t("Signup")}</h2>
        <div>
          <label htmlFor="companyName" className="block mb-1 font-medium">
            {t("Company Name")}
          </label>
          <Input
            id="companyName"
            type="text"
            placeholder={t("Company Name")}
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="name" className="block mb-1 font-medium">
            {t("Name")}
          </label>
          <Input
            id="name"
            type="text"
            placeholder={t("Name")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="phone" className="block mb-1 font-medium">
            {t("Phone Number")}
          </label>
          <Input
            id="phone"
            type="tel"
            placeholder={t("Phone Number")}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
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
            autoComplete="new-password"
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading ? t("Signup") + "..." : t("Signup")}
        </Button>
        <p className="text-center text-sm">
          {t("AlreadyHaveAccount")}{" "}
          <Link to="/login" className="text-primary underline">
            {t("Login")}
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
