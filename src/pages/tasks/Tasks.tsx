import { useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

import {
  useAppDispatch,
  useAppSelector,
} from "../../app/hooks";

import { getTasks } from "../../redux/task";

const Tasks = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const {
    tasks,
    loading,
  } = useAppSelector(
    (state) => state.task
  );

  useEffect(() => {
    dispatch(
      getTasks({
        page: 1,
        limit: 20,
      })
    );
  }, [dispatch]);

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        mb={3}
      >
        <Typography
          variant="h4"
          fontWeight={700}
        >
          Tasks
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() =>
            navigate("/tasks/new")
          }
        >
          New Task
        </Button>
      </Box>

      <Paper sx={{ p: 2 }}>
        {loading ? (
          <Typography>
            Loading...
          </Typography>
        ) : (
          <table
            width="100%"
            cellPadding={10}
          >
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.title}</td>

                  <td>
                    {task.status}
                  </td>

                  <td>
                    {task.priority}
                  </td>

                  <td>
                    <Button
                      size="small"
                      onClick={() =>
                        navigate(
                          `/tasks/${task.id}`
                        )
                      }
                    >
                      View
                    </Button>

                    <Button
                      size="small"
                      onClick={() =>
                        navigate(
                          `/tasks/edit/${task.id}`
                        )
                      }
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Paper>
    </Box>
  );
};

export default Tasks;