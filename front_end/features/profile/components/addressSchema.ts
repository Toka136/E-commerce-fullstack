import * as Yup from "yup";

export interface AddressFormValues {
  title: string;
  addressLine1: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  mobile: string;
}

export const addressValidationSchema = Yup.object({
  title: Yup.string().trim().required("Label is required (e.g. Home, Work)"),
  addressLine1: Yup.string().trim().required("Address is required"),
  city: Yup.string().trim().required("City is required"),
  state: Yup.string().trim().required("State is required"),
  country: Yup.string().trim().required("Country is required"),
  postalCode: Yup.string().trim().required("Postal code is required"),
  mobile: Yup.string()
    .trim()
    .matches(/^\+?[0-9\s-]{7,15}$/, "Enter a valid phone number")
    .required("Phone number is required"),
  isDefault: Yup.boolean(),
});