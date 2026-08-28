"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useFormik } from "formik";
import { AddressFormValues, addressValidationSchema } from "./addressSchema";
import AddressFormFields from "./addressFormFields";
import { AxiosError } from "axios";
import { useAddAddress } from "../hooks/useAddAddress";
import { CreateAddressParams } from "../types/address";


interface AddAddressModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const initialValues: AddressFormValues = {
  title: "",
  addressLine1: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
  mobile: "",
};

export default function AddAddressModal({
  open,
  onClose,
  onSuccess,
}: AddAddressModalProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
 const {mutateAsync:createAddressApi,isPending}=useAddAddress()
  const handleAddAddress=async(values:CreateAddressParams)=>{
    try{
        await createAddressApi(values)
        handleClose()
    }
    catch(err){
      const error = err as AxiosError;
      const message =
        (error.response?.data as { message?: string })?.message ??
        "Failed to update profile. Please try again.";
      setSubmitError(message);
      if (err instanceof AxiosError) {
        console.log("STATUS:", err.response?.status);
        console.log("DATA:", err.response?.data);
        console.log("MESSAGE:", err.response?.data?.message);
    }
    }
      
  }
  const formik = useFormik<AddressFormValues>({
    initialValues,
    validationSchema: addressValidationSchema,
    onSubmit:handleAddAddress
   
  });

  const handleClose = () => {
    formik.resetForm();
    setSubmitError(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper:{
        sx: {
          borderRadius: "16px",
          backgroundColor: "var(--color-surface-container-lowest)",
        },}
      }}
    >
      <form onSubmit={formik.handleSubmit} noValidate>
        <DialogTitle sx={{ fontWeight: 600, color: "var(--color-on-surface)" }}>
          Add New Address
        </DialogTitle>

        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          {submitError && <Alert severity="error">{submitError}</Alert>}
          <AddressFormFields formik={formik} />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleClose}
            disabled={formik.isSubmitting}
            sx={{ color: "var(--color-on-surface-variant)", textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={formik.isSubmitting}
            sx={{
              textTransform: "none",
              bgcolor: "var(--color-primary)",
              color: "var(--color-on-primary)",
              "&:hover": { bgcolor: "var(--color-primary)", opacity: 0.9 },
            }}
          >
            {formik.isSubmitting ? (
              <CircularProgress size={20} sx={{ color: "var(--color-on-primary)" }} />
            ) : (
              "Save Address"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}