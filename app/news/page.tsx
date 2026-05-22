/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "@mui/material/styles";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Typography,
} from "@mui/material";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import FeedRoundedIcon from "@mui/icons-material/FeedRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import AdCard from "@/app/components/AdCard";

export default function NewsPage() {
  const muiTheme = useTheme();
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/news")
      .then((res) => res.json())
      .then((res) => {
        setNews(res.articles || res.data || []);
      })
      .catch(() => setNews([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box sx={{ minHeight: "100dvh", bgcolor: muiTheme.palette.background.default, color: muiTheme.palette.text.primary }}>
      <Header />

      <Box component="main" sx={{ mx: "auto", maxWidth: { xs: "448px", lg: "1280px" }, pt: 7, pb: 24 }}>
        <Box sx={{ px: 2, pt: 2 }}>
          <Button
            component={Link}
            href="/"
            startIcon={<HomeRoundedIcon />}
            variant="contained"
            sx={{
              bgcolor: "#0d6bde",
              borderRadius: "999px",
              fontWeight: 900,
              textTransform: "none",
              boxShadow: "none",
              "&:hover": {
                bgcolor: "#0a58b8",
                boxShadow: "none",
              },
            }}
          >
            Back Home
          </Button>
        </Box>

        <Box sx={{ px: 2, pt: 2 }}>
          <Typography sx={{ fontSize: 32, fontWeight: 950, color: "#0f172a" }}>
            Cricket News
          </Typography>

          <Typography
            sx={{
              mt: 0.7,
              fontSize: 14,
              fontWeight: 600,
              color: "#64748b",
            }}
          >
            Latest cricket updates, stories and headlines.
          </Typography>
        </Box>

        <AdCard />

        {loading ? (
          <Card sx={{ m: 2, p: 4, borderRadius: "24px", textAlign: "center" }}>
            <CircularProgress sx={{ color: "#0d6bde" }} />

            <Typography sx={{ mt: 2, fontWeight: 900, color: "#64748b" }}>
              Loading news...
            </Typography>
          </Card>
        ) : news.length === 0 ? (
          <Card sx={{ m: 2, p: 4, borderRadius: "24px", textAlign: "center" }}>
            <FeedRoundedIcon sx={{ fontSize: 56, color: "#94a3b8" }} />

            <Typography sx={{ mt: 2, fontSize: 20, fontWeight: 950 }}>
              No news available
            </Typography>
          </Card>
        ) : (
          <Box sx={{ px: 2, pt: 2, display: "grid", gap: 2 }}>
            {news.map((item, index) => (
              <Box key={index}>
                <NewsListCard item={item} />

                {(index + 1) % 4 === 0 && <AdCard />}
              </Box>
            ))}
          </Box>
        )}

        <AdCard />
      </Box>

      <Footer />
    </Box>
  );
}

function NewsListCard({ item }: { item: any }) {
  const title = item.title || "Cricket News";
  const description =
    item.description || item.content || "Latest cricket news and updates.";
  const image = item.image || item.urlToImage;
  const url = item.url || "#";

  return (
    <Card
      sx={{
        borderRadius: "24px",
        overflow: "hidden",
        border: "1px solid #cbd5e1",
        boxShadow: "0 4px 16px rgba(15,23,42,0.08)",
        bgcolor: "#fff",
      }}
    >
      {image && (
        <Box
          component="img"
          src={image}
          alt={title}
          sx={{
            width: "100%",
            height: 190,
            objectFit: "cover",
            bgcolor: "#e2e8f0",
          }}
        />
      )}

      <CardContent sx={{ p: 2 }}>
        <Chip
          label="Cricket News"
          size="small"
          sx={{
            bgcolor: "#0d6bde",
            color: "#fff",
            fontWeight: 900,
            mb: 1.5,
          }}
        />

        <Typography
          sx={{
            fontSize: 18,
            fontWeight: 950,
            color: "#0f172a",
            lineHeight: 1.35,
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            mt: 1,
            fontSize: 13,
            fontWeight: 600,
            color: "#64748b",
            lineHeight: 1.65,
          }}
        >
          {description}
        </Typography>

        <Button
          component={Link}
          href={`/news/${encodeURIComponent(title)}`}
          fullWidth
          variant="contained"
          endIcon={<OpenInNewRoundedIcon />}
          sx={{
            mt: 2,
            height: 44,
            bgcolor: "#0d6bde",
            borderRadius: "999px",
            fontWeight: 900,
            textTransform: "none",
            boxShadow: "none",
            "&:hover": {
              bgcolor: "#0a58b8",
              boxShadow: "none",
            },
          }}
        >
          Read More
        </Button>

        {url !== "#" && (
          <Button
            href={url}
            target="_blank"
            fullWidth
            variant="outlined"
            sx={{
              mt: 1,
              height: 42,
              borderRadius: "999px",
              fontWeight: 900,
              textTransform: "none",
            }}
          >
            Open Source
          </Button>
        )}
      </CardContent>
    </Card>
  );
}