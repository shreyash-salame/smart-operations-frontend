import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Grid, Autocomplete,
  Chip, CircularProgress, Box, Typography,
} from "@mui/material";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { closeCreateTask } from "@/store/slices/uiSlice";
import { showSnackbar } from "@/store/slices/uiSlice";
import { useCreateTaskMutation } from "@/store/api/taskApi";
import { useListUsersMutation } from "@/store/api/userApi";
import type { CreateTaskPayload, TaskPriority } from "@/types";
import type { User } from "@/types";
import { useEffect } from "react";

const PRIORITIES: TaskPriority[] = ["low", "medium", "high", "critical"];

const defaultForm: CreateTaskPayload = {
  title: "", description: "", priority: "medium",
  assignedTo: "", project: "", department: "",
  tags: [], dueDate: "", estimatedHours: undefined,
};

export default function CreateTaskDialog() {
  const dispatch = useAppDispatch();
  const open = useAppSelector((s) => s.ui.createTaskDialogOpen);
  const [form, setForm] = useState<CreateTaskPayload>(defaultForm);
  const [tagInput, setTagInput] = useState("");
  const [users, setUsers] = useState<User[]>([]);

  const [createTask, { isLoading }] = useCreateTaskMutation();
  const [listUsers] = useListUsersMutation();

  useEffect(() => {
    if (open) {
      listUsers({ }).unwrap().then((r) => setUsers(r.data)).catch(() => {});
    }
  }, [open]);

  const set = (key: keyof CreateTaskPayload, val: any) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    if (!form.title.trim()) return;
    try {
      const payload = {
        ...form,
        assignedTo: form.assignedTo || undefined,
        tags: form.tags ?? [],
        dueDate: form.dueDate || undefined,
        estimatedHours: form.estimatedHours || undefined,
      };
      await createTask(payload).unwrap();
      dispatch(showSnackbar({ message: "Task created successfully", severity: "success" }));
      dispatch(closeCreateTask());
      setForm(defaultForm);
    } catch {
      dispatch(showSnackbar({ message: "Failed to create task", severity: "error" }));
    }
  };

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.tags?.includes(tag)) {
      set("tags", [...(form.tags ?? []), tag]);
    }
    setTagInput("");
  };

  return (
    <Dialog open={open} onClose={() => dispatch(closeCreateTask())} maxWidth="sm" fullWidth>
      <DialogTitle>Create Task</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ pt: 0.5 }}>
          <Grid item xs={12}>
            <TextField
              label="Title *"
              fullWidth
              size="small"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              fullWidth
              size="small"
              multiline
              rows={3}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Priority"
              select
              fullWidth
              size="small"
              value={form.priority}
              onChange={(e) => set("priority", e.target.value as TaskPriority)}
            >
              {PRIORITIES.map((p) => (
                <MenuItem key={p} value={p} sx={{ textTransform: "capitalize" }}>{p}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Due Date"
              type="date"
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
              value={form.dueDate}
              onChange={(e) => set("dueDate", e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Assign To"
              select
              fullWidth
              size="small"
              value={form.assignedTo}
              onChange={(e) => set("assignedTo", e.target.value)}
            >
              <MenuItem value="">Unassigned</MenuItem>
              {users.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.firstName} {u.lastName}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Estimated Hours"
              type="number"
              fullWidth
              size="small"
              value={form.estimatedHours ?? ""}
              onChange={(e) => set("estimatedHours", e.target.value ? +e.target.value : undefined)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Project"
              fullWidth
              size="small"
              value={form.project}
              onChange={(e) => set("project", e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Department"
              fullWidth
              size="small"
              value={form.department}
              onChange={(e) => set("department", e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Add tag and press Enter"
              fullWidth
              size="small"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddTag(); } }}
            />
            {(form.tags ?? []).length > 0 && (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1 }}>
                {(form.tags ?? []).map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    onDelete={() => set("tags", form.tags!.filter((t) => t !== tag))}
                  />
                ))}
              </Box>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={() => dispatch(closeCreateTask())} size="small">Cancel</Button>
        <Button
          variant="contained"
          size="small"
          onClick={handleSubmit}
          disabled={isLoading || !form.title.trim()}
          startIcon={isLoading ? <CircularProgress size={14} color="inherit" /> : null}
        >
          Create Task
        </Button>
      </DialogActions>
    </Dialog>
  );
}