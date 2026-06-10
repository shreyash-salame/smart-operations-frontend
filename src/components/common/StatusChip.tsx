import { Chip } from "@mui/material";
import type { TaskStatus } from "@/types";
import { statusLabel, statusColor } from "@/utils/helpers";

interface Props {
  status: TaskStatus;
  size?: "small" | "medium";
}

export default function StatusChip({ status, size = "small" }: Props) {
  return (
    <Chip
      label={statusLabel[status]}
      color={statusColor[status]}
      size={size}
      variant="outlined"
    />
  );
}
// import { Chip } from "@mui/material";
// import { TaskStatus, TaskPriority } from "@/types";

// const STATUS_COLORS: Record<TaskStatus, { bg: string; color: string; label: string }> = {
//   todo:        { bg: "#f1efe8", color: "#5f5e5a", label: "Todo" },
//   in_progress: { bg: "#e6f1fb", color: "#0c447c", label: "In progress" },
//   in_review:   { bg: "#faeeda", color: "#633806", label: "In review" },
//   done:        { bg: "#eaf3de", color: "#27500a", label: "Done" },
//   cancelled:   { bg: "#fcebeb", color: "#791f1f", label: "Cancelled" },
// };

// const PRIORITY_COLORS: Record<TaskPriority, { bg: string; color: string; label: string; dot: string }> = {
//   low:      { bg: "#eaf3de", color: "#27500a", label: "Low",      dot: "#639922" },
//   medium:   { bg: "#e6f1fb", color: "#0c447c", label: "Medium",   dot: "#378add" },
//   high:     { bg: "#faeeda", color: "#633806", label: "High",     dot: "#ef9f27" },
//   critical: { bg: "#fcebeb", color: "#791f1f", label: "Critical", dot: "#e24b4a" },
// };

// interface StatusChipProps {
//   status: TaskStatus;
//   size?: "small" | "medium";
// }

// interface PriorityChipProps {
//   priority: TaskPriority;
//   size?: "small" | "medium";
// }

// export function StatusChip({ status, size = "small" }: StatusChipProps) {
//   const cfg = STATUS_COLORS[status] || STATUS_COLORS.todo;
//   return (
//     <Chip
//       label={cfg.label}
//       size={size}
//       sx={{
//         backgroundColor: cfg.bg,
//         color: cfg.color,
//         fontWeight: 500,
//         fontSize: "0.7rem",
//         height: 22,
//         "& .MuiChip-label": { px: 1 },
//       }}
//     />
//   );
// }

// export function PriorityChip({ priority, size = "small" }: PriorityChipProps) {
//   const cfg = PRIORITY_COLORS[priority] || PRIORITY_COLORS.medium;
//   return (
//     <Chip
//       label={cfg.label}
//       size={size}
//       icon={
//         <span
//           style={{
//             width: 7,
//             height: 7,
//             borderRadius: "50%",
//             background: cfg.dot,
//             display: "inline-block",
//             marginLeft: 8,
//             marginRight: -2,
//             flexShrink: 0,
//           }}
//         />
//       }
//       sx={{
//         backgroundColor: cfg.bg,
//         color: cfg.color,
//         fontWeight: 500,
//         fontSize: "0.7rem",
//         height: 22,
//         "& .MuiChip-label": { px: 1 },
//         "& .MuiChip-icon": { ml: 0.5, mr: -0.5 },
//       }}
//     />
//   );
// }