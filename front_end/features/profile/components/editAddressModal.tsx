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
import { useEditAddress } from "../hooks/usEditAddress";
import { Address, editAddressParams } from "../types/address";
import { AxiosError } from "axios";


interface EditAddressModalProps {
  open: boolean;
  onClose: () => void;
  address: Address;
  onSuccess?: () => void;
}

export default function EditAddressModal({
  open,
  onClose,
  address,
  onSuccess,
}: EditAddressModalProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { mutateAsync: editAddressApi, isPending } = useEditAddress();

  const handleEditAddress = async (values: AddressFormValues) => {
    try {
      const payload: editAddressParams = {
        ...values,
        addressId: address._id,
      };

      await editAddressApi(payload);
      handleClose();
    } catch (err) {
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
  };

  const formik = useFormik<AddressFormValues>({
    // enableReinitialize keeps the form in sync if `address` changes while
    // the modal is mounted (e.g. switching which card is being edited).
    enableReinitialize: true,
    initialValues: {
      title: address.title,
      addressLine1: address.addressLine1,
      city: address.city,
      state: address.state,
      country: address.country,
      postalCode: address.postalCode,
      mobile: address.mobile,
    },
    validationSchema: addressValidationSchema,
    onSubmit: handleEditAddress,
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
        paper: {
        sx: {
          borderRadius: "16px",
          backgroundColor: "var(--color-surface-container-lowest)",
        },}
      }}
    >
      <form onSubmit={formik.handleSubmit} noValidate>
        <DialogTitle sx={{ fontWeight: 600, color: "var(--color-on-surface)" }}>
          Edit Address
        </DialogTitle>

        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          {submitError && <p>{submitError}</p>}
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
            disabled={formik.isSubmitting || !formik.dirty}
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
              "Save Changes"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}