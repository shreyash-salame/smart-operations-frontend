import { Avatar, Tooltip } from "@mui/material";
import type { User } from "@/types";
import { getUserInitials, getFullName } from "@/utils/helpers";

interface Props {
  user?: User | string;
  size?: number;
  showTooltip?: boolean;
}

export default function UserAvatar({ user, size = 28, showTooltip = true }: Props) {
  const initials = getUserInitials(user);
  const name = getFullName(user);

  const avatar = (
    <Avatar
      sx={{
        width: size,
        height: size,
        background: "#185fa5",
        fontSize: size * 0.35,
        fontWeight: 600,
      }}
    >
      {typeof user !== "string" && user?.avatar ? (
        <img src={user.avatar} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        initials
      )}
    </Avatar>
  );

  return showTooltip ? <Tooltip title={name}>{avatar}</Tooltip> : avatar;
}