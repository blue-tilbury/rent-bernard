import { TrashIcon } from "@heroicons/react/24/outline";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";

import { Button } from "./Button";

export default function AlertDialog() {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteAd = () => {
    handleClose();
    // TODO: call delete api
  };

  return (
    <div>
      <TrashIcon onClick={handleClickOpen} className="h-6 w-6 text-red-600" />
      <Dialog fullWidth maxWidth="xs" open={open} onClose={handleClose}>
        <DialogTitle>{"Delete this ad?"}</DialogTitle>
        <DialogActions>
          <Button size="sm" color="secondary" type="button" handleClick={handleClose}>
            Cancel
          </Button>
          <Button size="sm" color="danger" type="button" handleClick={deleteAd}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
