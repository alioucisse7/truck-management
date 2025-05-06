
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { DriverForm } from "@/components/drivers/DriverForm";
import { z } from "zod";
import { driverFormSchema } from "@/lib/form-schemas";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppSelector";
import { createDriver, updateDriver, fetchDriverById } from "@/store/driversSlice";

const AddEditDriver = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  
  const { selectedDriver, loading, error } = useAppSelector(state => state.drivers);

  useEffect(() => {
    if (id) {
      dispatch(fetchDriverById(id))
        .unwrap()
        .catch((err) => {
          toast({
            variant: "destructive",
            title: t("Error"),
            description: err || t("ErrorOccurred"),
          });
          navigate("/drivers");
        });
    }
  }, [id, dispatch, navigate, toast, t]);

  const handleSubmit = async (data: z.infer<typeof driverFormSchema>) => {
    try {
      if (id) {
        // Make sure all required fields are included when updating
        await dispatch(updateDriver({
          id,
          name: data.name,
          phone: data.phone,
          license: data.license,
          experience: data.experience,
          status: data.status,
          salary: data.salary
        })).unwrap();

        toast({
          title: t("DriverUpdated"),
          description: t("DriverUpdatedDesc", { name: data.name }),
        });
      } else {
        // Make sure all required fields are included when creating
        await dispatch(createDriver({
          name: data.name,
          phone: data.phone,
          license: data.license,
          experience: data.experience,
          status: data.status,
          salary: data.salary
        })).unwrap();

        toast({
          title: t("DriverCreated"),
          description: t("DriverCreatedDesc", { name: data.name }),
        });
      }
      navigate("/drivers");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t("Error"),
        description: error.message || t("ErrorOccurred"),
      });
    }
  };

  if (id && !selectedDriver && loading) {
    return <div className="container mx-auto py-6 flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      <span className="ml-3">{t("Loading")}...</span>
    </div>;
  }

  if (error) {
    return <div className="container mx-auto py-6">
      <div className="bg-destructive/10 p-4 rounded-md text-destructive">
        {error}
      </div>
    </div>;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          {id ? t("EditDriver") : t("AddNewDriver")}
        </h1>
        <p className="text-muted-foreground">
          {id ? t("UpdateDriverInfo") : t("AddNewDriverTeam")}
        </p>
      </div>
      
      <div className="bg-card rounded-lg border p-6 shadow-sm">
        <DriverForm driver={id && selectedDriver || undefined} onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default AddEditDriver;
