"use client";

import { Truck, ChevronDown } from "lucide-react";
import { FormikProps } from "formik";
import { ShippingFormValues } from "../types/orders";



const inputClass =
  "w-full rounded-md border border-outline-variant/40 bg-surface-container-low px-3 py-2.5 text-sm text-on-surface placeholder:text-outline focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition";

const labelClass =
  "mb-1.5 block text-xs font-medium text-on-surface";

const errorClass =
  "mt-1 text-xs text-error";

export default function ShippingDetailsForm({
  formik,
}: {
  formik: FormikProps<ShippingFormValues>;
}) {
  const getInputClass = (field: keyof ShippingFormValues) => {
    const hasError = Boolean(
      formik.touched[field] && formik.errors[field]
    );

    return `${inputClass} ${
      hasError ? "border-error focus:border-error focus:ring-error/20" : ""
    }`;
  };

  return (
    <section>
      {/* Section Header */}
      <div className="mb-3 flex items-center gap-2">
        <Truck className="h-4 w-4 text-primary" />

        <h2 className="text-base font-semibold text-on-surface">
          Shipping Details
        </h2>
      </div>

      {/* Form Container */}
      <div className="rounded-xl border border-outline-variant/30 bg-surface-container-low/40 p-4">
        <div className="flex flex-col gap-4">


          {/* Address Line 1 */}
          <div>
            <label
              htmlFor="addressLine1"
              className={labelClass}
            >
              Address Line 1
            </label>

            <input
              id="addressLine1"
              name="addressLine1"
              type="text"
              placeholder="Street address"
              value={formik.values.addressLine1}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={getInputClass("addressLine1")}
            />

            {formik.touched.addressLine1 &&
              formik.errors.addressLine1 && (
                <p className={errorClass}>
                  {formik.errors.addressLine1}
                </p>
              )}
          </div>

          {/* Address Line 2 */}
          <div>
            <label
              htmlFor="addressLine2"
              className={labelClass}
            >
              Address Line 2{" "}
              <span className="font-normal text-outline">
                (Optional)
              </span>
            </label>

            <input
              id="addressLine2"
              name="addressLine2"
              type="text"
              placeholder="Apartment, suite, unit, etc."
              value={formik.values.addressLine2}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={getInputClass("addressLine2")}
            />

            {formik.touched.addressLine2 &&
              formik.errors.addressLine2 && (
                <p className={errorClass}>
                  {formik.errors.addressLine2}
                </p>
              )}
          </div>

          {/* City / State */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* City */}
            <div>
              <label
                htmlFor="city"
                className={labelClass}
              >
                City
              </label>

              <input
                id="city"
                name="city"
                type="text"
                placeholder="New York"
                value={formik.values.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={getInputClass("city")}
              />

              {formik.touched.city &&
                formik.errors.city && (
                  <p className={errorClass}>
                    {formik.errors.city}
                  </p>
                )}
            </div>

            {/* State */}
            <div>
              <label
                htmlFor="state"
                className={labelClass}
              >
                State
              </label>

              <input
                id="state"
                name="state"
                type="text"
                placeholder="New York"
                value={formik.values.state}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={getInputClass("state")}
              />

              {formik.touched.state &&
                formik.errors.state && (
                  <p className={errorClass}>
                    {formik.errors.state}
                  </p>
                )}
            </div>
          </div>

          {/* Postal Code / Country */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Postal Code */}
            <div>
              <label
                htmlFor="postalCode"
                className={labelClass}
              >
                Postal Code
              </label>

              <input
                id="postalCode"
                name="postalCode"
                type="text"
                placeholder="10001"
                value={formik.values.postalCode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={getInputClass("postalCode")}
              />

              {formik.touched.postalCode &&
                formik.errors.postalCode && (
                  <p className={errorClass}>
                    {formik.errors.postalCode}
                  </p>
                )}
            </div>

            {/* Country */}
            <div>
              <label
                htmlFor="country"
                className={labelClass}
              >
                Country
              </label>

              <div className="relative">
               
                 <input
                id="country"
                name="country"
                type="text"
                placeholder="10001"
                value={formik.values.country}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={getInputClass("country")}
              />
              </div>

              {formik.touched.country &&
                formik.errors.country && (
                  <p className={errorClass}>
                    {formik.errors.country}
                  </p>
                )}
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label
              htmlFor="phoneNumber"
              className={labelClass}
            >
              Phone Number
            </label>

            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              placeholder="+20 100 000 0000"
              value={formik.values.mobile}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={getInputClass("mobile")}
            />

            {formik.touched.mobile &&
              formik.errors.mobile && (
                <p className={errorClass}>
                  {formik.errors.mobile}
                </p>
              )}
          </div>

        </div>
      </div>
    </section>
  );
}