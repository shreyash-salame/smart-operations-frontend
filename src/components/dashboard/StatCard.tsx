import {
  Card,
  CardContent,
  Typography,
} from "@mui/material";

interface Props {
  title: string;
  value: number;
}

const StatCard = ({
  title,
  value,
}: Props) => {
  return (
    <Card>
      <CardContent>
        <Typography
          color="text.secondary"
        >
          {title}
        </Typography>

        <Typography
          variant="h4"
          fontWeight={700}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StatCard;