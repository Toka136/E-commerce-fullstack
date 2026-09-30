"use client";

import { TextField, FormControlLabel, Switch } from "@mui/material";
import { FormikProps } from "formik";
import { AddressFormValues } from "./addressSchema";

export default function AddressFormFields({
  formik,
}: {
  formik: FormikProps<AddressFormValues>;
}) {
  return (
    <>
      <TextField
        name="title"
        label="Label"
        placeholder="Home, Work, etc."
        value={formik.values.title}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.title && Boolean(formik.errors.title)}
        helperText={formik.touched.title && formik.errors.title}
        fullWidth
      />

      <TextField
        name="addressLine1"
        label="Address"
        value={formik.values.addressLine1}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.addressLine1 && Boolean(formik.errors.addressLine1)}
        helperText={formik.touched.addressLine1 && formik.errors.addressLine1}
        fullWidth
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField
          name="city"
          label="City"
          value={formik.values.city}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.city && Boolean(formik.errors.city)}
          helperText={formik.touched.city && formik.errors.city}
          fullWidth
        />
        <TextField
          name="state"
          label="State"
          value={formik.values.state}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.state && Boolean(formik.errors.state)}
          helperText={formik.touched.state && formik.errors.state}
          fullWidth
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField
          name="country"
          label="Country"
          value={formik.values.country}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.country && Boolean(formik.errors.country)}
          helperText={formik.touched.country && formik.errors.country}
          fullWidth
        />
        <TextField
          name="postalCode"
          label="Postal Code"
          value={formik.values.postalCode}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.postalCode && Boolean(formik.errors.postalCode)}
          helperText={formik.touched.postalCode && formik.errors.postalCode}
          fullWidth
        />
      </div>

      <TextField
        name="mobile"
        label="Phone Number"
        placeholder="+1 (555) 0123-4567"
        value={formik.values.mobile}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.mobile && Boolean(formik.errors.mobile)}
        helperText={formik.touched.mobile && formik.errors.mobile}
        fullWidth
      />
      
    </>
  );
}