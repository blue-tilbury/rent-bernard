import { TrashIcon } from "@heroicons/react/24/outline";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "./Button";
import { useDeleteRoom } from "../hooks/useAxios";
import { Id } from "../types/common.type";

export default function AlertDialog({ id }: Id) {
  const [open, setOpen] = useState(false);
  const { triggerDeleteRoom } = useDeleteRoom();
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(!open);
  };

  const deleteAd = async (e: React.MouseEvent) => {
    handleClick(e);
    await triggerDeleteRoom(id).catch(() => {
      navigate("/error");
    });
  };

  return (
    <div>
      <TrashIcon onClick={handleClick} className="h-4 w-4 text-red-600 md:h-6 md:w-6" />
      <Dialog fullWidth maxWidth="xs" open={open} onClick={handleClick}>
        <DialogTitle>{"Delete this ad?"}</DialogTitle>
        <DialogActions>
          <Button size="sm" color="secondary" type="button" handleClick={handleClick}>
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
