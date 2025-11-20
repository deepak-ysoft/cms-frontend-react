import React from "react";
import { Card, CardContent, Typography, Stack, Chip, Box } from "@mui/material";
import { motion } from "framer-motion";
import { Users as UsersIcon } from "lucide-react";

const MotionBox = motion.create(Box);

const OverviewCard = ({ icon, title, value, subtitleData = [] }) => {
  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        overflow: "hidden",
        p: 2.5,
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.9), rgba(245,247,250,0.8))",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
        },
      }}
    >
      <CardContent>
        {/* Header Section */}
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            sx={{
              background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
              p: 1.5,
              borderRadius: 2,
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon || <UsersIcon size={24} />}
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h5" fontWeight={600}>
              {value ?? 0}
            </Typography>
          </Box>
        </Stack>

        {/* Subtitle Section with Animation */}
        <MotionBox
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          mt={2}
        >
          {subtitleData.length > 0 && (
            <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 1 }}>
              {subtitleData.map((r, i) => (
                <motion.div
                  key={r._id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Chip
                    label={
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Typography
                          variant="body2"
                          sx={{ color: "#2563eb", fontWeight: 500 }}
                        >
                          {r._id}
                        </Typography>
                        {r.count && (
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#111827",
                              fontWeight: 600,
                              backgroundColor: "rgba(59,130,246,0.1)",
                              px: 1,
                              borderRadius: 1,
                            }}
                          >
                            {r.count}
                          </Typography>
                        )}
                      </Stack>
                    }
                    size="small"
                    sx={{
                      backgroundColor: "rgba(59,130,246,0.08)",
                      borderRadius: "10px",
                      "&:hover": {
                        backgroundColor: "rgba(59,130,246,0.15)",
                      },
                    }}
                  />
                </motion.div>
              ))}
            </Stack>
          )}
        </MotionBox>
      </CardContent>
    </Card>
  );
};

export default OverviewCard;
