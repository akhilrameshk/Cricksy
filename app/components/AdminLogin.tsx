"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
} from "@mui/material";
import { useAdmin } from "@/app/hooks/useAdmin";

export default function AdminLogin({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { isAdmin, setAdminStatus } = useAdmin();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const ADMIN_PASSWORD = "admin123"; // Simple password - replace with env variable for production

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAdminStatus(true);
      setPassword("");
      setError("");
      onClose();
    } else {
      setError("Invalid password");
      setPassword("");
    }
  };

  const handleLogout = () => {
    setAdminStatus(false);
    setPassword("");
    setError("");
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isAdmin) {
      handleLogin();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 900, fontSize: 18 }}>
        {isAdmin ? "Admin Panel" : "Admin Login"}
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {isAdmin ? (
          <Box>
            <Box
              sx={{
                p: 2,
                borderRadius: "12px",
                bgcolor: "#d1fae5",
                border: "1px solid #6ee7b7",
                mb: 2,
              }}
            >
              <Typography sx={{ fontWeight: 900, color: "#065f46" }}>
                ✓ Admin Mode Active
              </Typography>
              <Typography sx={{ fontSize: 13, color: "#047857", mt: 0.5 }}>
                You have full access to edit features.
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box>
            <Typography sx={{ fontSize: 13, color: "#64748b", mb: 2 }}>
              Enter admin password to unlock editing features:
            </Typography>

            <TextField
              fullWidth
              type="password"
              label="Admin Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              onKeyPress={handleKeyPress}
              error={!!error}
              helperText={error}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                },
              }}
              autoFocus
            />

            <Box
              sx={{
                mt: 2,
                p: 2,
                borderRadius: "12px",
                bgcolor: "#fef3c7",
                border: "1px solid #fcd34d",
              }}
            >
              <Typography sx={{ fontSize: 12, color: "#92400e", fontWeight: 700 }}>
                Demo Password: admin123
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ borderRadius: "999px", fontWeight: 900, textTransform: "none" }}
        >
          Close
        </Button>

        {isAdmin ? (
          <Button
            onClick={handleLogout}
            variant="contained"
            sx={{
              borderRadius: "999px",
              fontWeight: 900,
              textTransform: "none",
              bgcolor: "#dc2626",
              "&:hover": { bgcolor: "#b91c1c" },
            }}
          >
            Logout
          </Button>
        ) : (
          <Button
            onClick={handleLogin}
            variant="contained"
            sx={{
              borderRadius: "999px",
              fontWeight: 900,
              textTransform: "none",
              bgcolor: "#0d6bde",
              "&:hover": { bgcolor: "#0a58b8" },
            }}
          >
            Login
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
