"use client";

import { useMemo, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Avatar, IconButton, CircularProgress, Alert,
} from "@mui/material";
import { Pencil, User as UserIcon } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { userProfile, userProfileBase } from "../types/profile";
import { updateProfileApi } from "../api/updateProfile";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { AxiosError } from "axios";

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
  user: userProfile;
  onSuccess?: () => void;
}

const validationSchema = Yup.object({
  userName: Yup.string().trim().min(2, "Name must be at least 2 characters").required("Full name is required"),
  email: Yup.string().trim().email("Enter a valid email address").required("Email is required"),
  phoneNumber: Yup.string().trim() .matches(/^\+?[0-9\s-]{7,15}$/, "Enter a valid phone number")
    .notRequired(),
  image: Yup.mixed<File>().nullable().test("fileSize", "Image must be smaller than 5MB", (file) =>
      !file || file.size <= 5 * 1024 * 1024
    )
    .test("fileType", "Only JPG, PNG or WEBP images are allowed", (file) =>
      !file || ["image/jpeg", "image/png", "image/webp"].includes(file.type)
    ),
});

export default function EditProfileModal({
  open,
  onClose,
  user,
  onSuccess,
}: EditProfileModalProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const existingAvatarUrl = useMemo(() => (user.image ? `http://localhost:4000/api/Uploads/${user.image}` : undefined), [user.image]);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(existingAvatarUrl);
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile();

  const handleSubmit = async (values: userProfileBase) => {
    try {
      setSubmitError(null);
      await updateProfile(values);
      onSuccess?.();
      onClose();
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

  const formik = useFormik({
    initialValues: {
      userName: user.userName ?? "",
      email: user.email ?? "",
      phoneNumber: user.phoneNumber ?? "",
      image: null as File | null,
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    formik.setFieldValue("image", file);
    if (file) setPreviewUrl(URL.createObjectURL(file));
  };

  const handleClose = () => {
    formik.resetForm();
    setSubmitError(null);
    setPreviewUrl(existingAvatarUrl);
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
          },
        },
      }}
    >
      <form onSubmit={formik.handleSubmit} noValidate>
        <DialogTitle
          sx={{ fontWeight: 600, color: "var(--color-on-surface)" }}
        >
          Edit Profile
        </DialogTitle>

        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          {submitError && <Alert severity="error">{submitError}</Alert>}

          {/* Avatar upload */}
          <div className="flex flex-col items-center gap-2 pt-1">
            <div className="relative">
              <Avatar
                src={previewUrl}
                sx={{
                  width: 88,
                  height: 88,
                  bgcolor: "var(--color-surface-container)",
                  color: "var(--color-on-surface-variant)",
                }}
              >
                {!previewUrl && <UserIcon size={32} />}
              </Avatar>
              <IconButton
                component="label"
                size="small"
                sx={{
                  position: "absolute",
                  bottom: -2,
                  right: -2,
                  bgcolor: "var(--color-secondary)",
                  color: "var(--color-on-secondary)",
                  border: "2px solid var(--color-surface-container-lowest)",
                  "&:hover": { bgcolor: "var(--color-secondary)", opacity: 0.9 },
                }}
              >
                <Pencil size={14} />
                <input
                  type="file"
                  hidden
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleImageChange}
                />
              </IconButton>
            </div>
            {formik.touched.image && formik.errors.image && (
              <p className="text-xs text-error">{formik.errors.image}</p>
            )}
          </div>

          <TextField
            name="userName"
            label="Full Name"
            value={formik.values.userName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.userName && Boolean(formik.errors.userName)}
            helperText={formik.touched.userName && formik.errors.userName}
            fullWidth
          />

          <TextField
            name="email"
            label="Email Address"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            fullWidth
          />

          <TextField
            name="phoneNumber"
            label="Phone Number"
            value={formik.values.phoneNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
            helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
            placeholder="+1 (555) 0123-4567"
            fullWidth
          />
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
              "Save Changes"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}