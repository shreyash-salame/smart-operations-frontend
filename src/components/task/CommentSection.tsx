import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useState } from "react";

interface Comment {
  _id: string;
  content: string;
  createdAt: string;
  createdBy?: {
    firstName: string;
    lastName: string;
  };
}

interface Props {
  comments: Comment[];
  onAddComment: (
    comment: string
  ) => void;
}

const CommentSection = ({
  comments,
  onAddComment,
}: Props) => {
  const [comment, setComment] =
    useState("");

  const submitComment = () => {
    if (!comment.trim()) return;

    onAddComment(comment);

    setComment("");
  };

  return (
    <Box mt={4}>
      <Typography
        variant="h6"
        mb={2}
      >
        Comments
      </Typography>

      <Stack spacing={2}>
        {comments?.map(
          (item) => (
            <Card
              key={item._id}
            >
              <CardContent>
                <Typography
                  fontWeight={600}
                >
                  {item.createdBy
                    ?.firstName ||
                    "User"}
                </Typography>

                <Typography>
                  {item.content}
                </Typography>

                <Typography
                  variant="caption"
                >
                  {new Date(
                    item.createdAt
                  ).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          )
        )}
      </Stack>

      <Box mt={3}>
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Add Comment"
          value={comment}
          onChange={(e) =>
            setComment(
              e.target.value
            )
          }
        />

        <Button
          sx={{ mt: 2 }}
          variant="contained"
          onClick={
            submitComment
          }
        >
          Add Comment
        </Button>
      </Box>
    </Box>
  );
};

export default CommentSection;