import { Chip } from "@mui/material";

interface Props {
  status: string;
}

const statusColor = (
  status: string
):
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "error" => {
  switch (
    status?.toLowerCase()
  ) {
    case "completed":
    case "done":
      return "success";

    case "in_progress":
    case "in progress":
      return "primary";

    case "review":
      return "warning";

    case "cancelled":
      return "error";

    default:
      return "default";
  }
};

const TaskStatusChip = ({
  status,
}: Props) => {
  return (
    <Chip
      size="small"
      label={status}
      color={statusColor(status)}
    />
  );
};

export default TaskStatusChip;