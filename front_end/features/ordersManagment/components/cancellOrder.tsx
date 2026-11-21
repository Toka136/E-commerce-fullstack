import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
type props={
    openDialog:boolean,
    handleCancelConfirmation:()=>void,
    handleConfirmCancellation:()=>void
}
export const CancellOrder = ({openDialog,handleCancelConfirmation,handleConfirmCancellation}:props) => {
    return (
         <Dialog
        open={openDialog}
        onClose={handleCancelConfirmation}
        aria-labelledby="cancel-order-title"
      >
        <DialogTitle id="cancel-order-title">
          Cancel Order?
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            Are you sure you want to cancel this order?
            This action will restore the book stock and coupon usage.
            You won't be able to undo this action.
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleCancelConfirmation}
            color="inherit"
          >
            Keep Order
          </Button>

          <Button
            onClick={handleConfirmCancellation}
            color="error"
            variant="contained"
          >
            Cancel Order
          </Button>
        </DialogActions>
      </Dialog>
    )
};