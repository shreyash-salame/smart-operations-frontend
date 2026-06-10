import {
  Box,
  Typography,
  Paper,
} from "@mui/material";

import TaskForm from "../../components/task/TaskForm";

const AddTask = () => {
  return (
    <Box>
      <Typography
        variant="h4"
        fontWeight={700}
        mb={3}
      >
        Create Task
      </Typography>

      <Paper sx={{ p: 3 }}>
        <TaskForm />
      </Paper>
    </Box>
  );
};

export default AddTask;