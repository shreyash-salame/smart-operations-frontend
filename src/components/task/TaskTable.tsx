import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

import {
  useNavigate,
} from "react-router-dom";

import TaskStatusChip from "./TaskStatusChip";

interface Props {
  tasks: any[];
}

const TaskTable = ({
  tasks,
}: Props) => {
  const navigate =
    useNavigate();

  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              Title
            </TableCell>

            <TableCell>
              Status
            </TableCell>

            <TableCell>
              Priority
            </TableCell>

            <TableCell>
              Assigned To
            </TableCell>

            <TableCell>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {tasks.map((task) => (
            <TableRow
              key={task._id}
            >
              <TableCell>
                {task.title}
              </TableCell>

              <TableCell>
                <TaskStatusChip
                  status={
                    task.status
                  }
                />
              </TableCell>

              <TableCell>
                {task.priority}
              </TableCell>

              <TableCell>
                {task.assignedTo
                  ?.firstName ||
                  "-"}
              </TableCell>

              <TableCell>
                <Button
                  size="small"
                  onClick={() =>
                    navigate(
                      `/tasks/${task._id}`
                    )
                  }
                >
                  View
                </Button>

                <Button
                  size="small"
                  onClick={() =>
                    navigate(
                      `/tasks/edit/${task._id}`
                    )
                  }
                >
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default TaskTable;