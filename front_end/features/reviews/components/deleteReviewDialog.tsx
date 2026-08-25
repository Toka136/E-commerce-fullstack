import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
type DeleteReviewDialogProps={
    deleteDialogOpen: boolean;
    setDeleteDialogOpen: (open: boolean) => void;
    handleDelete: () => void;
    isDeleting: boolean;
}
export const DeleteReviewDialog =({deleteDialogOpen,setDeleteDialogOpen,handleDelete,isDeleting}:DeleteReviewDialogProps)=>{
    return(
         <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        sx={{
          "& .MuiPaper-root": {
            borderRadius: '1rem',
          },
        }}
      >
        <DialogTitle className="pb-2! text-lg! font-semibold!">
          Delete review?
        </DialogTitle>

        <DialogContent>
          <DialogContentText className="text-sm! text-gray-500!">
            Are you sure you want to delete this review? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>

        <DialogActions className="px-6! pb-5!">
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            className="rounded-lg! px-4! py-2! text-sm! normal-case! text-gray-600!"
          >
            Cancel
          </Button>

          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            variant="contained"
            color="error"
            className="rounded-lg! px-4! py-2! text-sm! normal-case!"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    )
}