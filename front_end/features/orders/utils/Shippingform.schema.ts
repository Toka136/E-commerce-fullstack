import * as Yup from "yup";
import { ShippingFormValues } from "../types/orders";



export const shippingValidationSchema = Yup.object({
 
  addressLine1: Yup.string()
    .trim()
    .required("Address line 1 is required"),

  addressLine2: Yup.string()
    .trim()
    .optional(),

  city: Yup.string()
    .trim()
    .required("City is required"),

  state: Yup.string()
    .trim()
    .required("State is required"),

  postalCode: Yup.string()
    .trim()
    .required("Postal code is required"),

  country: Yup.string()
    .trim()
    .required("Country is required"),

  mobile: Yup.string()
    .trim()
    .matches(
      /^\+?[0-9\s-]{7,15}$/,
      "Enter a valid phone number"
    )
    .required("Phone number is required"),
});

export const shippingInitialValues: ShippingFormValues = {
 
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
  mobile: "",
};