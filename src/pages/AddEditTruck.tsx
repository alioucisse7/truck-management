
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { TruckForm } from "@/components/trucks/TruckForm";
import { z } from "zod";
import { truckFormSchema } from "@/lib/form-schemas";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppSelector";
import { fetchTruckById, createTruck, updateTruck } from "@/store/trucksSlice";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const AddEditTruck = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  
  const { selectedTruck, loading, error } = useAppSelector(state => state.trucks);

  useEffect(() => {
    if (id) {
      dispatch(fetchTruckById(id))
        .unwrap()
        .catch((err) => {
          toast({
            variant: "destructive",
            title: t("Error"),
            description: err || t("ErrorOccurred"),
          });
          navigate("/trucks");
        });
    }
  }, [id, dispatch, navigate, toast, t]);

  const handleSubmit = async (data: z.infer<typeof truckFormSchema>) => {
    try {
      // Process driver assignment
      const assignedDriverId = data.assignedDriverId === "none" ? null : data.assignedDriverId;
      
      if (id) {
        // Make sure all required fields are included when updating
        await dispatch(updateTruck({
          id,
          model: data.model,
          plateNumber: data.plateNumber,
          capacity: data.capacity,
          status: data.status,
          fuelLevel: data.fuelLevel,
          lastMaintenance: data.lastMaintenance,
          assignedDriverId,
          monthlyExtraCosts: {
            loadingCosts: Number(data.monthlyExtraCosts.loadingCosts) || 0,
            challenge: Number(data.monthlyExtraCosts.challenge) || 0,
            otherManagementFees: Number(data.monthlyExtraCosts.otherManagementFees) || 0,
            otherFees: Number(data.monthlyExtraCosts.otherFees) || 0,
          },
        })).unwrap();
        
        toast({
          title: t("TruckUpdated"),
          description: t("TruckUpdatedDesc", { plateNumber: data.plateNumber }),
        });
      } else {
        // Make sure all required fields are included when creating
        await dispatch(createTruck({
          model: data.model,
          plateNumber: data.plateNumber,
          capacity: data.capacity,
          status: data.status,
          fuelLevel: data.fuelLevel,
          lastMaintenance: data.lastMaintenance,
          assignedDriverId,
          monthlyExtraCosts: {
            loadingCosts: Number(data.monthlyExtraCosts.loadingCosts) || 0,
            challenge: Number(data.monthlyExtraCosts.challenge) || 0,
            otherManagementFees: Number(data.monthlyExtraCosts.otherManagementFees) || 0,
            otherFees: Number(data.monthlyExtraCosts.otherFees) || 0,
          },
        })).unwrap();
        
        toast({
          title: t("TruckCreated"),
          description: t("TruckCreatedDesc", { plateNumber: data.plateNumber }),
        });
      }
      navigate("/trucks");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t("Error"),
        description: error.message || t("ErrorOccurred"),
      });
    }
  };

  if (id && !selectedTruck && loading) {
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
    <div className="md:container mx-auto py-6">
      <div className="flex items-center justify-between">
        
                    <div className="flex items-center gap-4">
               
                      <Button variant="ghost" onClick={() => navigate('/trucks')}>
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        {t("Back")}
                      </Button>
                      <div><h1 className="text-3xl font-bold">
          {id ? t("EditTruck") : t("AddNewTruck")}
        </h1>
        <p className="text-muted-foreground">
          {id ? t("UpdateTruckInfo") : t("AddNewTruckFleet")}
        </p></div>
                     
                    </div>
            </div>
      
      <div className="bg-card rounded-lg border p-6 shadow-sm">
        <TruckForm truck={id && selectedTruck || undefined} onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default AddEditTruck;
