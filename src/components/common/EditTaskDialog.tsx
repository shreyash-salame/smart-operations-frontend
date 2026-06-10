import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, MenuItem, Grid, Chip, Box, CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { closeEditTask, showSnackbar } from "@/store/slices/uiSlice";
import { useGetTaskByIdQuery, useUpdateTaskMutation } from "@/store/api/taskApi";
import type { UpdateTaskPayload, TaskPriority } from "@/types";

const PRIORITIES: TaskPriority[] = ["low", "medium", "high", "critical"];

export default function EditTaskDialog() {
  const dispatch = useAppDispatch();
  const taskId = useAppSelector((s) => s.ui.editTaskDialogId);
  const open = !!taskId;

  const { data } = useGetTaskByIdQuery(taskId!, { skip: !taskId });
  const [updateTask, { isLoading }] = useUpdateTaskMutation();

  const [form, setForm] = useState<UpdateTaskPayload & { tags: string[] }>({
    title: "", description: "", priority: "medium",
    project: "", tags: [], dueDate: "",
    estimatedHours: undefined, actualHours: undefined,
  });
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (data?.data) {
      const t = data.data;
      setForm({
        title: t.title ?? "",
        description: t.description ?? "",
        priority: t.priority ?? "medium",
        project: t.project ?? "",
        tags: t.tags ?? [],           // ← guard undefined
        dueDate: t.dueDate ? t.dueDate.slice(0, 10) : "",
        estimatedHours: t.estimatedHours,
        actualHours: t.actualHours,
      });
    }
  }, [data]);

  const set = (key: string, val: any) => setForm((f) => ({ ...f, [key]: val }));

  const tags = form.tags ?? [];       // ← safe reference throughout render

  const handleSubmit = async () => {
    try {
      await updateTask({ id: taskId!, data: { ...form, tags } }).unwrap();
      dispatch(showSnackbar({ message: "Task updated", severity: "success" }));
      dispatch(closeEditTask());
    } catch {
      dispatch(showSnackbar({ message: "Failed to update task", severity: "error" }));
    }
  };

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag)) set("tags", [...tags, tag]);
    setTagInput("");
  };

  return (
    <Dialog open={open} onClose={() => dispatch(closeEditTask())} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Task</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ pt: 0.5 }}>
          <Grid item xs={12}>
            <TextField label="Title *" fullWidth size="small" value={form.title}
              onChange={(e) => set("title", e.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Description" fullWidth size="small" multiline rows={3}
              value={form.description} onChange={(e) => set("description", e.target.value)} />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Priority" select fullWidth size="small" value={form.priority ?? "medium"}
              onChange={(e) => set("priority", e.target.value)}>
              {PRIORITIES.map((p) => (
                <MenuItem key={p} value={p} sx={{ textTransform: "capitalize" }}>{p}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField label="Due Date" type="date" fullWidth size="small"
              InputLabelProps={{ shrink: true }} value={form.dueDate ?? ""}
              onChange={(e) => set("dueDate", e.target.value)} />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Estimated Hours" type="number" fullWidth size="small"
              value={form.estimatedHours ?? ""}
              onChange={(e) => set("estimatedHours", e.target.value ? +e.target.value : undefined)} />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Actual Hours" type="number" fullWidth size="small"
              value={form.actualHours ?? ""}
              onChange={(e) => set("actualHours", e.target.value ? +e.target.value : undefined)} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Project" fullWidth size="small" value={form.project ?? ""}
              onChange={(e) => set("project", e.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Add tag and press Enter" fullWidth size="small"
              value={tagInput} onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddTag(); } }}
            />
            {tags.length > 0 && (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1 }}>
                {tags.map((tag) => (
                  <Chip key={tag} label={tag} size="small"
                    onDelete={() => set("tags", tags.filter((t) => t !== tag))} />
                ))}
              </Box>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={() => dispatch(closeEditTask())} size="small">Cancel</Button>
        <Button variant="contained" size="small" onClick={handleSubmit}
          disabled={isLoading || !form.title?.trim()}
          startIcon={isLoading ? <CircularProgress size={14} color="inherit" /> : null}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}


// import {
//   Dialog, DialogTitle, DialogContent, DialogActions,
//   Button, TextField, MenuItem, Grid, Chip, Box, CircularProgress,
// } from "@mui/material";
// import { useState, useEffect } from "react";
// import { useAppDispatch, useAppSelector } from "@/store";
// import { closeEditTask, showSnackbar } from "@/store/slices/uiSlice";
// import { useGetTaskByIdQuery, useUpdateTaskMutation } from "@/store/api/taskApi";
// import type { UpdateTaskPayload, TaskPriority } from "@/types";

// const PRIORITIES: TaskPriority[] = ["low", "medium", "high", "critical"];

// export default function EditTaskDialog() {
//   const dispatch = useAppDispatch();
//   const taskId = useAppSelector((s) => s.ui.editTaskDialogId);
//   const open = !!taskId;

//   const { data } = useGetTaskByIdQuery(taskId!, { skip: !taskId });
//   const [updateTask, { isLoading }] = useUpdateTaskMutation();

//   const [form, setForm] = useState<UpdateTaskPayload & { tags: string[] }>({
//     title: "", description: "", priority: "medium",
//     project: "", tags: [], dueDate: "",
//     estimatedHours: undefined, actualHours: undefined,
//   });
//   const [tagInput, setTagInput] = useState("");

//   useEffect(() => {
//     if (data?.data) {
//       const t = data.data;
//       setForm({
//         title: t.title,
//         description: t.description ?? "",
//         priority: t.priority,
//         project: t.project ?? "",
//         tags: t.tags,
//         dueDate: t.dueDate ? t.dueDate.slice(0, 10) : "",
//         estimatedHours: t.estimatedHours,
//         actualHours: t.actualHours,
//       });
//     }
//   }, [data]);

//   const set = (key: string, val: any) => setForm((f) => ({ ...f, [key]: val }));

//   const handleSubmit = async () => {
//     try {
//       await updateTask({ id: taskId!, data: form }).unwrap();
//       dispatch(showSnackbar({ message: "Task updated", severity: "success" }));
//       dispatch(closeEditTask());
//     } catch {
//       dispatch(showSnackbar({ message: "Failed to update task", severity: "error" }));
//     }
//   };

//   const handleAddTag = () => {
//     const tag = tagInput.trim();
//     if (tag && !form.tags.includes(tag)) set("tags", [...form.tags, tag]);
//     setTagInput("");
//   };

//   return (
//     <Dialog open={open} onClose={() => dispatch(closeEditTask())} maxWidth="sm" fullWidth>
//       <DialogTitle>Edit Task</DialogTitle>
//       <DialogContent dividers>
//         <Grid container spacing={2} sx={{ pt: 0.5 }}>
//           <Grid item xs={12}>
//             <TextField label="Title *" fullWidth size="small" value={form.title}
//               onChange={(e) => set("title", e.target.value)} />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField label="Description" fullWidth size="small" multiline rows={3}
//               value={form.description} onChange={(e) => set("description", e.target.value)} />
//           </Grid>
//           <Grid item xs={6}>
//             <TextField label="Priority" select fullWidth size="small" value={form.priority}
//               onChange={(e) => set("priority", e.target.value)}>
//               {PRIORITIES.map((p) => (
//                 <MenuItem key={p} value={p} sx={{ textTransform: "capitalize" }}>{p}</MenuItem>
//               ))}
//             </TextField>
//           </Grid>
//           <Grid item xs={6}>
//             <TextField label="Due Date" type="date" fullWidth size="small"
//               InputLabelProps={{ shrink: true }} value={form.dueDate}
//               onChange={(e) => set("dueDate", e.target.value)} />
//           </Grid>
//           <Grid item xs={6}>
//             <TextField label="Estimated Hours" type="number" fullWidth size="small"
//               value={form.estimatedHours ?? ""}
//               onChange={(e) => set("estimatedHours", e.target.value ? +e.target.value : undefined)} />
//           </Grid>
//           <Grid item xs={6}>
//             <TextField label="Actual Hours" type="number" fullWidth size="small"
//               value={form.actualHours ?? ""}
//               onChange={(e) => set("actualHours", e.target.value ? +e.target.value : undefined)} />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField label="Project" fullWidth size="small" value={form.project}
//               onChange={(e) => set("project", e.target.value)} />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField label="Add tag and press Enter" fullWidth size="small"
//               value={tagInput} onChange={(e) => setTagInput(e.target.value)}
//               onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddTag(); } }} />
//             {(form.tags.length) > 0 && (
//               <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1 }}>
//                 {form.tags.map((tag) => (
//                   <Chip key={tag} label={tag} size="small"
//                     onDelete={() => set("tags", form.tags.filter((t) => t !== tag))} />
//                 ))}
//               </Box>
//             )}
//           </Grid>
//         </Grid>
//       </DialogContent>
//       <DialogActions sx={{ px: 3, py: 2 }}>
//         <Button onClick={() => dispatch(closeEditTask())} size="small">Cancel</Button>
//         <Button variant="contained" size="small" onClick={handleSubmit}
//           disabled={isLoading || !form.title?.trim()}
//           startIcon={isLoading ? <CircularProgress size={14} color="inherit" /> : null}>
//           Save Changes
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }