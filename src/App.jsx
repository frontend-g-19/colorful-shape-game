import { useEffect, useReducer, useMemo } from "react";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Box,
  Typography,
  Stack,
  Switch,
  Card,
  CardContent,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";

import ShapeBoard from "./ShapeBoard";
import { reducer, initialState } from "./reducer";

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: state.themeMode === "dark" ? "dark" : "light",
        },
      }),
    [state.themeMode]
  );

  useEffect(() => {
    if (!state.isPlaying || state.gameOver) return;

    const spawn = setInterval(() => dispatch({ type: "SPAWN" }), state.speed);
    const clearExpired = setInterval(
      () => dispatch({ type: "CLEAR_EXPIRED" }),
      300
    );
    const timer = setInterval(() => dispatch({ type: "TICK" }), 1000);

    return () => {
      clearInterval(spawn);
      clearInterval(clearExpired);
      clearInterval(timer);
    };
  }, [state.speed, state.isPlaying, state.gameOver]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box textAlign="center" p={{ xs: 2, sm: 3 }}>
        {/* Header */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "center", sm: "center" }}
          px={{ xs: 1, sm: 3 }}
          gap={1}
        >
          <Typography variant="h5" sx={{ fontSize: { xs: 22, sm: 28 } }}>
            🎮 Shape Click Game
          </Typography>

          <Stack direction="row" alignItems="center">
            <Typography>Light</Typography>
            <Switch
              checked={state.themeMode === "dark"}
              onChange={() => dispatch({ type: "TOGGLE_THEME" })}
            />
            <Typography>Dark</Typography>
          </Stack>
        </Stack>

        {/* Stats */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="center"
          alignItems="center"
          gap={2}
          mt={2}
        >
          {[
            { label: "Score", value: state.score },
            { label: "❤️ Lives", value: "❤️".repeat(state.lives) },
            { label: "⏳ Time", value: state.timeLeft },
            { label: "🏆 Best", value: state.bestScore },
          ].map((item, i) => (
            <Card key={i} sx={{ minWidth: { xs: "85%", sm: 220 } }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontSize: { xs: 18, sm: 22 } }}>
                  {item.label}: {item.value}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>

        {/* Difficulty + Play */}
        {!state.isPlaying && !state.gameOver && (
          <>
            <Typography mt={3} variant="h6">
              Qiyinlikni tanla
            </Typography>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="center"
              gap={2}
              mt={2}
            >
              <Button
                variant="outlined"
                onClick={() =>
                  dispatch({ type: "SET_DIFFICULTY", payload: "easy" })
                }
              >
                Easy
              </Button>
              <Button
                variant="outlined"
                onClick={() =>
                  dispatch({ type: "SET_DIFFICULTY", payload: "normal" })
                }
              >
                Normal
              </Button>
              <Button
                variant="outlined"
                onClick={() =>
                  dispatch({ type: "SET_DIFFICULTY", payload: "hard" })
                }
              >
                Hard
              </Button>
            </Stack>

            <Button
              variant="contained"
              sx={{ mt: 3 }}
              onClick={() => dispatch({ type: "START" })}
            >
              PLAY
            </Button>
          </>
        )}

        {/* Game Over */}
        {state.gameOver && (
          <Box mt={4}>
            <Typography
              variant="h4"
              color="error"
              fontSize={{ xs: 26, sm: 36 }}
            >
              Game Over!
            </Typography>

            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={() => dispatch({ type: "RESET" })}
            >
              Restart
            </Button>
          </Box>
        )}

        {/* Game Board */}
        <ShapeBoard
          shapes={state.shapes}
          onClick={(shape) => dispatch({ type: "CLICK_SHAPE", payload: shape })}
        />

        {/* History Table */}
        <Box mt={5}>
          <Typography variant="h6">🧾 History (Top Scores)</Typography>

          <Table
            sx={{
              width: { xs: "95%", sm: "80%", md: "60%" },
              margin: "auto",
              mt: 2,
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>#</b>
                </TableCell>
                <TableCell>
                  <b>Score</b>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {state.history.slice(0, 10).map((score, i) => (
                <TableRow key={i}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{score}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
