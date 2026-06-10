import {
  useEffect,
} from "react";

import {
  useParams,
} from "react-router-dom";

import {
  Box,
  Paper,
  Typography,
} from "@mui/material";

import {
  useAppDispatch,
  useAppSelector,
} from "../../app/hooks";

import {
  getTaskById,
} from "../../redux/task";

import TaskForm from "../../components/task/TaskForm";

const EditTask = () => {
  const { id } = useParams();

  const dispatch =
    useAppDispatch();

  const {
    selectedTask,
  } = useAppSelector(
    (state) => state.task
  );

  useEffect(() => {
    if (id) {
      dispatch(
        getTaskById(id)
      );
    }
  }, [id]);

  return (
    <Box>
      <Typography
        variant="h4"
        fontWeight={700}
        mb={3}
      >
        Edit Task
      </Typography>

      <Paper sx={{ p: 3 }}>
        {selectedTask && (
          <TaskForm
            task={selectedTask}
          />
        )}
      </Paper>
    </Box>
  );
};

export default EditTask;