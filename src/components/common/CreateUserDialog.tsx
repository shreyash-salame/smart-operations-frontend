import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Grid, CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { closeCreateUser, showSnackbar } from "@/store/slices/uiSlice";
import { useCreateUserMutation } from "@/store/api/userApi";

const ROLES = ["admin", "manager", "user"];

const defaultForm = {
  firstName: "", lastName: "", email: "", password: "",
  role: "user", department: "",
};

export default function CreateUserDialog() {
  const dispatch = useAppDispatch();
  const open = useAppSelector((s) => s.ui.createUserDialogOpen);
  const [form, setForm] = useState(defaultForm);
  const [createUser, { isLoading }] = useCreateUserMutation();

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    try {
      await createUser(form).unwrap();
      dispatch(showSnackbar({ message: "User created successfully", severity: "success" }));
      dispatch(closeCreateUser());
      setForm(defaultForm);
    } catch {
      dispatch(showSnackbar({ message: "Failed to create user", severity: "error" }));
    }
  };

  const valid = form.firstName && form.lastName && form.email && form.password;

  return (
    <Dialog open={open} onClose={() => dispatch(closeCreateUser())} maxWidth="xs" fullWidth>
      <DialogTitle>Create User</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ pt: 0.5 }}>
          <Grid item xs={6}>
            <TextField label="First Name *" fullWidth size="small" value={form.firstName}
              onChange={(e) => set("firstName", e.target.value)} />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Last Name *" fullWidth size="small" value={form.lastName}
              onChange={(e) => set("lastName", e.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Email *" fullWidth size="small" type="email" value={form.email}
              onChange={(e) => set("email", e.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Password *" fullWidth size="small" type="password" value={form.password}
              onChange={(e) => set("password", e.target.value)} />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Role" select fullWidth size="small" value={form.role}
              onChange={(e) => set("role", e.target.value)}>
              {ROLES.map((r) => (
                <MenuItem key={r} value={r} sx={{ textTransform: "capitalize" }}>{r}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField label="Department" fullWidth size="small" value={form.department}
              onChange={(e) => set("department", e.target.value)} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={() => dispatch(closeCreateUser())} size="small">Cancel</Button>
        <Button variant="contained" size="small" onClick={handleSubmit}
          disabled={isLoading || !valid}
          startIcon={isLoading ? <CircularProgress size={14} color="inherit" /> : null}>
          Create User
        </Button>
      </DialogActions>
    </Dialog>
  );
}