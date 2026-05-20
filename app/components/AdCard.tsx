/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Typography,
} from "@mui/material";

export default function AdCard() {
  useEffect(() => {
    try {
      ((window as any).adsbygoogle =
        (window as any).adsbygoogle || []).push({});
    } catch (err) {}
  }, []);

  return (
    <Card
      sx={{
        mx: 2,
        mt: 1.5,
        borderRadius: "20px",
        overflow: "hidden",
        border: "1px solid #dbeafe",
        background:
          "linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)",
        boxShadow: "0 4px 12px rgba(13,107,222,0.08)",
        transition: "all 0.25s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 8px 24px rgba(13,107,222,0.14)",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2,
          py: 1,
          borderBottom: "1px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background:
            "linear-gradient(90deg, rgba(13,107,222,0.06) 0%, rgba(13,107,222,0.02) 100%)",
        }}
      >
        <Chip
          label="SPONSORED"
          size="small"
          sx={{
            height: 20,
            fontSize: 9,
            fontWeight: 900,
            letterSpacing: "0.14em",
            bgcolor: "#0d6bde",
            color: "#fff",
            borderRadius: "999px",
          }}
        />

        <Typography
          sx={{
            fontSize: 10,
            fontWeight: 700,
            color: "#64748b",
          }}
        >
          Advertisement
        </Typography>
      </Box>

      {/* Ad Area */}
      <CardContent
        sx={{
          minHeight: 72,
          px: 1.5,
          py: 1.2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#fff",
          "&:last-child": {
            pb: 1.2,
          },
        }}
      >
        <Box
          sx={{
            width: "100%",
            borderRadius: "14px",
            overflow: "hidden",
            bgcolor: "#f8fafc",
            p: 0.5,
          }}
        >
          <ins
            className="adsbygoogle"
            style={{
              display: "block",
              width: "100%",
              minHeight: "60px",
            }}
            data-ad-client="ca-pub-5590321516536916"
            data-ad-slot="2254489201"
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        </Box>
      </CardContent>
    </Card>
  );
}