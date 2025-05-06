
import React from "react";
import CreateMemberForm from "../components/company/CreateMemberForm";
import { useTranslation } from "react-i18next";
import { Users } from "lucide-react";

const CompanyInvites = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-lg mx-auto mt-12 p-6 bg-card border rounded shadow">
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <Users className="w-6 h-6" /> {t("Company User Management")}
      </h2>
      <div className="mb-6 text-lg font-medium">
        {t("Add a new member to your company")}
      </div>
      <CreateMemberForm />
    </div>
  );
};

export default CompanyInvites;

