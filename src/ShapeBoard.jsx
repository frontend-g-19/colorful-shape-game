import { Box, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function ShapeBoard({ shapes, onClick }) {
  return (
    <Box
      sx={{
        width: { xs: "95%", sm: "90%", md: "80%" },
        height: { xs: "55vh", sm: "60vh", md: "70vh" },
        bgcolor: "#2222",
        m: "auto",
        mt: 4,
        borderRadius: 3,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {shapes.map((shape) => (
        <Box
          key={shape.id}
          onClick={() => onClick(shape)}
          sx={{
            width: { xs: 50, sm: 65, md: 80 },
            height: { xs: 50, sm: 65, md: 80 },
            bgcolor: shape.color,
            borderRadius: shape.type === "circle" ? "50%" : "12px",
            position: "absolute",
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "opacity 0.4s ease, transform 0.2s",
            opacity: shape.expiresAt - Date.now() < 900 ? 0.25 : 1,

            // Mobile UX better
            touchAction: "none",

            "&:active": {
              transform: "scale(0.9)",
            },
          }}
        >
          {shape.danger ? (
            <CloseIcon
              sx={{ fontSize: { xs: 28, sm: 34, md: 40 }, color: "white" }}
            />
          ) : (
            <Typography
              fontWeight="bold"
              color="white"
              fontSize={{ xs: 16, sm: 20, md: 24 }}
            >
              +{shape.value}
            </Typography>
          )}
        </Box>
      ))}
    </Box>
  );
}
