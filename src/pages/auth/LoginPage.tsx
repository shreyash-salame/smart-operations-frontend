import {
  Box, Card, TextField, Button, Typography,
  CircularProgress, InputAdornment, IconButton, Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/store";
import { setCredentials } from "@/store/slices/authSlice";
import { useLoginMutation } from "@/store/api/authApi";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ user: res.data.user, token: res.data.token }));
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Invalid credentials. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f5f7fa 0%, #e8edf5 100%)",
        p: 2,
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 400, p: 4 }}>
        {/* Logo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <Box
            sx={{
              width: 40, height: 40, borderRadius: 2,
              background: "linear-gradient(135deg, #185fa5, #378add)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "1rem" }}>SO</Typography>
          </Box>
          <Box>
            <Typography variant="h1" sx={{ color: "#185fa5" }}>SmartOps</Typography>
            <Typography variant="caption" color="text.secondary">Operations Management</Typography>
          </Box>
        </Box>

        <Typography variant="h2" sx={{ mb: 0.5 }}>Welcome back</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Sign in to your account to continue
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2, fontSize: "0.8125rem" }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            size="small"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            autoFocus
          />
          <TextField
            label="Password"
            type={showPass ? "text" : "password"}
            fullWidth
            size="small"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setShowPass(!showPass)} edge="end">
                    {showPass ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading || !email || !password}
            sx={{ mt: 1, py: 1 }}
            startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {isLoading ? "Signing in…" : "Sign In"}
          </Button>
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ display: "block", textAlign: "center", mt: 3 }}>
          Contact your administrator to get access.
        </Typography>
      </Card>
    </Box>
  );
}