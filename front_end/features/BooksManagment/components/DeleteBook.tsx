"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
  Box,
} from "@mui/material";
import { Delete, X } from "lucide-react";
import { DeleteModalPropsT } from "../types/Books";
import { UseDeleteBook } from "../hooks/useDeleteBook";



export default function DeleteBookModal({open,fetchBooks,onClose,id,title = "Delete Item",itemName = "this item",loading = false,
}:  DeleteModalPropsT) {
    const handleDelete = async () => {
      try {
        const res = await UseDeleteBook(id);
        if(res){
         await fetchBooks();
        onClose();
        }
       
      } catch (error) {
        console.error(error);
      }
    }
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      aria-labelledby="delete-dialog-title"
    >
      {/* Top Close Button */}
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <X />
      </IconButton>

      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 4 }}>
        {/* Warning Icon Visual */}
        <Box 
          sx={{ 
            backgroundColor: 'error.lighter', // Or '#ffebee' if lighter isn't in palette
            color: 'error.main', 
            borderRadius: '50%', 
            p: 2, 
            mb: 2 
          }}
        >
          <Delete fontSize="large" />
        </Box>

        <DialogTitle id="delete-dialog-title" sx={{ p: 0, mb: 1, fontWeight: 'bold' }}>
          {title}
        </DialogTitle>

        <DialogContent sx={{ p: 0, textAlign: 'center' }}>
          <DialogContentText>
            Are you sure you want to delete <strong>{itemName}</strong>? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
      </Box>

      <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'space-between' }}>
        <Button 
          variant="outlined" 
          color="inherit" 
          onClick={onClose}
          disabled={loading}
          fullWidth
          sx={{ mr: 1 }}
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          color="error" 
          onClick={handleDelete}
          loading={loading} // MUI v5 requires Lab/LoadingButton, MUI v6 supports loading directly on Button
          fullWidth
          sx={{ ml: 1 }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}