import { Chip } from "@mui/material";
import type { TaskPriority } from "@/types";
import { priorityColor, priorityBgColor } from "@/utils/helpers";

interface Props {
  priority: TaskPriority;
  size?: "small" | "medium";
}

export default function PriorityChip({ priority, size = "small" }: Props) {
  if (!priority) return null;

  return (
    <Chip
      label={priority.charAt(0).toUpperCase() + priority.slice(1)}
      size={size}
      sx={{
        color: priorityColor[priority] ?? "#666",
        background: priorityBgColor[priority] ?? "#f5f5f5",
        borderColor: priorityColor[priority] ?? "#666",
        fontWeight: 600,
      }}
      variant="outlined"
    />
  );
}
// export default function PriorityChip({ priority, size = "small" }: Props) {
//   if (!priority) return null; // or fallback UI

//   return (
//     <Chip
//       label={priority.charAt(0).toUpperCase() + priority.slice(1)}
//       size={size}
//       sx={{
//         color: priorityColor[priority],
//         background: priorityBgColor[priority],
//         borderColor: priorityColor[priority],
//         fontWeight: 600,
//       }}
//       variant="outlined"
//     />
//   );
// }

// import { Chip } from "@mui/material";
// import type { TaskPriority } from "@/types";
// import { priorityColor, priorityBgColor } from "@/utils/helpers";

// interface Props {
//   priority: TaskPriority;
//   size?: "small" | "medium";
// }

// export default function PriorityChip({ priority, size = "small" }: Props) {
//   return (
//     <Chip
//       label={priority.charAt(0).toUpperCase() + priority.slice(1)}
//       size={size}
//       sx={{
//         color: priorityColor[priority],
//         background: priorityBgColor[priority],
//         borderColor: priorityColor[priority],
//         fontWeight: 600,
//       }}
//       variant="outlined"
//     />
//   );
// }