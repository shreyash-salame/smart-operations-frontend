import { useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Stack,
  TextField,
  Typography,
  Alert,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";

import { loginSchema } from "../validations/auth.validation";

import {
  useAppDispatch,
  useAppSelector,
} from "../app/hooks";

import {
  loginUser,
  clearError,
} from "../redux/auth";

interface LoginForm {
  email: string;
  password: string;
}

const Login = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const {
    loading,
    error,
    isAuthenticated,
  } = useAppSelector(
    (state) => state.auth
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (
    data: LoginForm
  ) => {
    const result = await dispatch(
      loginUser(data)
    );

    if (loginUser.fulfilled.match(result)) {
      navigate("/");
    }
  };

  useEffect(() => {
    dispatch(clearError());

    if (isAuthenticated) {
      navigate("/");
    }
  }, []);
  console.log(import.meta.env.VITE_API_URL);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F5F7FA",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            borderRadius: 4,
            boxShadow:
              "0px 10px 30px rgba(0,0,0,0.1)",
          }}
        >
          <CardContent sx={{ p: 5 }}>
            <Stack spacing={3}>
              <Box textAlign="center">
                <Typography
                  variant="h4"
                  fontWeight={700}
                >
                  Smart Ops
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Sign in to continue
                </Typography>
              </Box>

              {error && (
                <Alert severity="error">
                  {error}
                </Alert>
              )}

              <form
                onSubmit={handleSubmit(
                  onSubmit
                )}
              >
                <Stack spacing={3}>
                  <TextField
                    label="Email"
                    fullWidth
                    {...register("email")}
                    error={
                      !!errors.email
                    }
                    helperText={
                      errors.email
                        ?.message
                    }
                  />

                  <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    {...register(
                      "password"
                    )}
                    error={
                      !!errors.password
                    }
                    helperText={
                      errors.password
                        ?.message
                    }
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                  >
                    {loading ? (
                      <CircularProgress
                        size={22}
                        color="inherit"
                      />
                    ) : (
                      "Login"
                    )}
                  </Button>
                </Stack>
              </form>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;