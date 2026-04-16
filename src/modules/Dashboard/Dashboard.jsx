import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import PeopleIcon from "@mui/icons-material/People";
import { AuthContext } from "../../context/AuthContext";
import { ToastContext, useToast } from "../../context/ToastContext";
import { userService } from "../../services/api";
import UserCard from "../../components/UserCard";
import Navbar from "../../components/Navbar";
import { primaryColor } from "../ThemeColor";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await userService.getUsers();
      setUsers(data.users || data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleLogout = () => {
    logout();
    showToast("Logged out successfully!", "success");
  };

  const handleRefresh = () => {
    fetchUsers();
    showToast("Refreshing user list...", "info");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#1a1a2e",
      }}
    >
      <Navbar user={user} onLogout={handleLogout} />

      <Box sx={{ p: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ color: "#fff", fontWeight: 700 }}>
              User Dashboard
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "rgba(255,255,255,0.7)", mt: 0.5 }}
            >
              Welcome back, {user?.name || user?.email}
            </Typography>
          </Box>

          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            sx={{
              borderColor: primaryColor,
              color: primaryColor,
              "&:hover": {
                borderColor: "#1a1a5e",
                backgroundColor: "rgba(42, 52, 201, 0.1)",
              },
            }}
          >
            Refresh
          </Button>
        </Box>

        <Card
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: 3,
            mb: 4,
            p: 2,
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <PeopleIcon sx={{ fontSize: 40, color: primaryColor, mr: 2 }} />
              <Box>
                <Typography variant="h3" sx={{ color: "#fff", fontWeight: 700 }}>
                  {loading ? "..." : users.length}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(255,255,255,0.7)" }}
                >
                  Total Users
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              backgroundColor: "rgba(211, 47, 47, 0.2)",
              color: "#ff8a80",
              "& .MuiAlert-icon": { color: "#ff8a80" },
            }}
          >
            {error}
          </Alert>
        )}

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "300px",
            }}
          >
            <CircularProgress sx={{ color: primaryColor }} />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {users.map((userItem) => (
              <Grid item xs={12} sm={6} md={4} key={userItem.id || userItem._id}>
                <UserCard user={userItem} />
              </Grid>
            ))}
          </Grid>
        )}

        {!loading && users.length === 0 && !error && (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
            }}
          >
            <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.7)" }}>
              No users found
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
