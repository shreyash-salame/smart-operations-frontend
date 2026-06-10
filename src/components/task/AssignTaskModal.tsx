import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  TextField,
} from "@mui/material";

import { useState } from "react";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
}

interface Props {
  open: boolean;
  users: User[];
  onClose: () => void;
  onAssign: (
    userId: string
  ) => void;
}

const AssignTaskModal = ({
  open,
  users,
  onClose,
  onAssign,
}: Props) => {
  const [userId, setUserId] =
    useState("");

  const handleAssign = () => {
    onAssign(userId);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
    >
      <DialogTitle>
        Assign Task
      </DialogTitle>

      <DialogContent>
        <TextField
          fullWidth
          select
          margin="normal"
          label="User"
          value={userId}
          onChange={(e) =>
            setUserId(
              e.target.value
            )
          }
        >
          {users.map((user) => (
            <MenuItem
              key={user._id}
              value={user._id}
            >
              {user.firstName}
              {" "}
              {user.lastName}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleAssign}
        >
          Assign
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignTaskModal;