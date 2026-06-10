import {
  Button,
  Grid2,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";

import {
  useForm,
} from "react-hook-form";

import {
  useNavigate,
} from "react-router-dom";

import {
  useAppDispatch,
} from "../../app/hooks";

import {
  createTask,
  updateTask,
} from "../../redux/task";

interface Props {
  task?: any;
}

const TaskForm = ({
  task,
}: Props) => {
  const dispatch =
    useAppDispatch();

  const navigate =
    useNavigate();

  const {
    register,
    handleSubmit,
  } = useForm({
    defaultValues: {
      title:
        task?.title || "",
      description:
        task?.description ||
        "",
      priority:
        task?.priority ||
        "medium",
      status:
        task?.status ||
        "todo",
    },
  });

  const onSubmit = async (
    data: any
  ) => {
    if (task?._id) {
      await dispatch(
        updateTask({
          id: task._id,
          data,
        })
      );
    } else {
      await dispatch(
        createTask(data)
      );
    }

    navigate("/tasks");
  };

  return (
    <form
      onSubmit={handleSubmit(
        onSubmit
      )}
    >
      <Stack spacing={3}>
        <TextField
          label="Title"
          {...register(
            "title"
          )}
        />

        <TextField
          label="Description"
          multiline
          rows={4}
          {...register(
            "description"
          )}
        />

        <Grid2
          container
          spacing={2}
        >
          <Grid2 size={6}>
            <TextField
              fullWidth
              select
              label="Priority"
              defaultValue={
                task?.priority ||
                "medium"
              }
              {...register(
                "priority"
              )}
            >
              <MenuItem value="low">
                Low
              </MenuItem>

              <MenuItem value="medium">
                Medium
              </MenuItem>

              <MenuItem value="high">
                High
              </MenuItem>

              <MenuItem value="critical">
                Critical
              </MenuItem>
            </TextField>
          </Grid2>

          <Grid2 size={6}>
            <TextField
              fullWidth
              select
              label="Status"
              defaultValue={
                task?.status ||
                "todo"
              }
              {...register(
                "status"
              )}
            >
              <MenuItem value="todo">
                Todo
              </MenuItem>

              <MenuItem value="in_progress">
                In Progress
              </MenuItem>

              <MenuItem value="review">
                Review
              </MenuItem>

              <MenuItem value="completed">
                Completed
              </MenuItem>
            </TextField>
          </Grid2>
        </Grid2>

        <Button
          type="submit"
          variant="contained"
        >
          {task
            ? "Update Task"
            : "Create Task"}
        </Button>
      </Stack>
    </form>
  );
};

export default TaskForm;