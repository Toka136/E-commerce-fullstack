
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";

interface DeleteAddressModalProps {
  open: boolean;
  onClose: () => void;
  addressId: string;
  onDelete: (addressId: string) => void | Promise<void>;
}

export default function DeleteAddressModal({
  open,
  onClose,
  addressId,
  onDelete,
}: DeleteAddressModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setError(null);
    setIsDeleting(true);
    try {
      await onDelete(addressId);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Couldn't delete this address."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (isDeleting) return;
    setError(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
      slotProps={{
        paper: {
        sx: {
          borderRadius: "16px",
          backgroundColor: "var(--color-surface-container-lowest)",
        },}
      }}
    >
      <DialogTitle sx={{ fontWeight: 600, color: "var(--color-on-surface)" }}>
        Delete Address
      </DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {error && <Alert severity="error">{error}</Alert>}
        <DialogContentText sx={{ color: "var(--color-on-surface-variant)" }}>
          Are you sure you want to delete this address? This action can't be
          undone.
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={handleClose}
          disabled={isDeleting}
          sx={{ color: "var(--color-on-surface-variant)", textTransform: "none" }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={isDeleting}
          sx={{
            textTransform: "none",
            bgcolor: "var(--color-error)",
            color: "var(--color-on-error)",
            "&:hover": { bgcolor: "var(--color-error)", opacity: 0.9 },
          }}
        >
          {isDeleting ? (
            <CircularProgress size={20} sx={{ color: "var(--color-on-error)" }} />
          ) : (
            "Delete"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}