
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import TripForm from "@/components/trips/TripForm";
import { z } from "zod";
import { tripFormSchema } from "@/lib/form-schemas";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppSelector";
import { createTrip, updateTrip, fetchTripById } from "@/store/tripsSlice";
import { fetchTrucks } from "@/store/trucksSlice"; 
import { fetchDrivers } from "@/store/driversSlice";
import { useEffect } from "react";
import { Trip } from "@/lib/data";

const AddEditTrip = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { selectedTrip, trips, loading, error } = useAppSelector(state => state.trips);

  useEffect(() => {
    // Fetch trucks and drivers data
    dispatch(fetchTrucks());
    dispatch(fetchDrivers());
    
    if (id) {
      dispatch(fetchTripById(id))
        .unwrap()
        .catch((err) => {
          toast({
            title: t("Error"),
            description: err,
            variant: "destructive",
          });
        });
    }
  }, [id, dispatch, toast, t, trips]);

  // Here we're converting between the form schema's Date objects and the API's string dates
  const handleSubmit = async (values: z.infer<typeof tripFormSchema>) => {
    try {
      console.log("Form submitted with data:", values);
      
      if (!values.truckId || !values.driverId || !values.startLocation || !values.destination || !values.cargoType) {
        toast({
          title: t("ValidationError"),
          description: t("PleaseCompleteAllRequiredFields"),
          variant: "destructive",
        });
        return;
      }
      
      // Convert Date objects to ISO strings for the API
      const tripData = {
        startLocation: values.startLocation,
        destination: values.destination,
        startDate: values.startDate,
        endDate: values.endDate,
        truckId: values.truckId,
        driverId: values.driverId,
        distance: Number(values.distance) || 0,
        cargoType: values.cargoType as 'fuel' | 'diesel' | 'mazout',
        status: values.status as 'planned' | 'in-progress' | 'completed' | 'cancelled',
        revenue: Number(values.revenue) || 0,
        expenses: {
          fuel: Number(values.expenses.fuel) || 0,
          tolls: Number(values.expenses.tolls) || 0,
          maintenance: Number(values.expenses.maintenance) || 0,
          other: Number(values.expenses.other) || 0,
        },
        numBL: Number(values.numBL) || 0,
        equalization: Number(values.equalization) || 0,
        amountET: Number(values.amountET) || 0,
        mtqs: Number(values.mtqs) || 0,
        pricePerLiter: Number(values.pricePerLiter) || 0,
        mtqsLiters: Number(values.mtqsLiters) || 0,
        missionFees: Number(values.missionFees) || 0,
        managementFeesPercent: Number(values.managementFeesPercent) || 0,
        observ: values.observ || "",
      };

      console.log("Processed trip data:", tripData);

      if (id) {
        await dispatch(updateTrip({ id, ...tripData })).unwrap();
        toast({
          title: t("TripUpdated"),
          description: t("TripUpdatedDesc", {
            startLocation: values.startLocation,
            destination: values.destination
          }),
        });
      } else {
        console.log("Creating new trip with data:", tripData);
        await dispatch(createTrip(tripData as any)).unwrap();
        toast({
          title: t("TripCreated"),
          description: t("TripCreatedDesc", {
            startLocation: values.startLocation,
            destination: values.destination
          }),
        });
      }
      navigate("/trips");
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast({
        title: t("Error"),
        description: error.message || t("ErrorOccurred"),
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          <span className="ml-3">{t("Loading")}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-4">{t("Error")}</h1>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (id && !selectedTrip) {
    return (
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-4">{t("TripNotFound")}</h1>
        <p className="text-muted-foreground">{t("BackToTrips")}</p>
      </div>
    );
  }

  // Convert selectedTrip to Trip interface with proper type safety
  const tripForForm: Trip | undefined = id && selectedTrip ? {
    id: selectedTrip.id,
    truckId: selectedTrip.truckId,
    driverId: selectedTrip.driverId,
    cargoType: selectedTrip.cargoType,
    startLocation: selectedTrip.startLocation,
    destination: selectedTrip.destination,
    startDate: selectedTrip.startDate,
    endDate: selectedTrip.endDate,
    status: selectedTrip.status,
    distance: selectedTrip.distance,
    revenue: selectedTrip.revenue || 0,
    expenses: {
      fuel: selectedTrip.expenses.fuel || 0,
      tolls: selectedTrip.expenses.tolls || 0,
      maintenance: selectedTrip.expenses.maintenance || 0,
      other: selectedTrip.expenses.other || 0,
    },
    numBL: selectedTrip.numBL || 0,
    equalization: selectedTrip.equalization || 0,
    amountET: selectedTrip.amountET || 0,
    mtqs: selectedTrip.mtqs || 0,
    pricePerLiter: selectedTrip.pricePerLiter || 0,
    mtqsLiters: selectedTrip.mtqsLiters || 0,
    missionFees: selectedTrip.missionFees || 0,
    managementFeesPercent: selectedTrip.managementFeesPercent || 0,
    observ: selectedTrip.observ || "",
  } : undefined;

  return (
    <div className="md:container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          {t(id ? "EditTrip" : "AddNewTrip")}
        </h1>
        <p className="text-muted-foreground">
          {t(id ? "UpdateTripInfo" : "AddNewTransportTrip")}
        </p>
      </div>
      
      <div className="bg-card rounded-lg border p-6 shadow-sm">
        <TripForm trip={tripForForm} onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default AddEditTrip;
