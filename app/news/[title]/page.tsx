/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import AdCard from "@/app/components/AdCard";

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const titleParam =
    typeof params.title === "string" ? params.title : params.title?.[0] || "";

  useEffect(() => {
    fetch("/api/news")
      .then((res) => res.json())
      .then((data) => {
        const found = data.articles?.find(
          (n: any) => encodeURIComponent(n.title) === titleParam
        );

        setArticle(found || null);
      })
      .finally(() => setLoading(false));
  }, [titleParam]);

  if (loading) {
    return (
      <div className="min-h-dvh bg-[#e9eef1] dark:bg-slate-950">
        <Header />

        <main className="mx-auto flex min-h-dvh max-w-md items-center justify-center pt-14 pb-24">
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress sx={{ color: "#0d6bde" }} />

            <Typography sx={{ mt: 2, fontWeight: 900 }}>
              Loading article...
            </Typography>
          </Box>
        </main>

        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-dvh bg-[#e9eef1] dark:bg-slate-950">
        <Header />

        <main className="mx-auto max-w-md pt-14 pb-24">
          <Card sx={{ m: 2, borderRadius: "24px", p: 4 }}>
            <Typography sx={{ fontSize: 18, fontWeight: 900 }}>
              Article not found
            </Typography>
          </Card>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#e9eef1] text-black dark:bg-slate-950 dark:text-white">
      <Header />

      <main className="mx-auto max-w-md pt-14 pb-24">
        

        <Box sx={{ px: 2, pt: 2,mt:7 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push("/")}
            variant="contained"
            sx={{
              bgcolor: "#0d6bde",
              borderRadius: "999px",
              textTransform: "none",
              fontWeight: 900,
              boxShadow: "none",
              "&:hover": {
                bgcolor: "#0a58b8",
                boxShadow: "none",
              },
            }}
          >
            Back to Home
          </Button>
        </Box>
<Box sx={{ pt: 1 }}>
          <AdCard />
        </Box>
        <Card
          sx={{
            m: 2,
            borderRadius: "28px",
            overflow: "hidden",
            border: "1px solid #cbd5e1",
            boxShadow: "0 6px 24px rgba(15,23,42,0.08)",
          }}
        >
          <Box sx={{ width: "100%", height: 240, bgcolor: "#e2e8f0" }}>
            {article.image ? (
              <Box
                component="img"
                src={article.image}
                alt={article.title}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <Box
                sx={{
                  height: "100%",
                  display: "grid",
                  placeItems: "center",
                  bgcolor: "#eff6ff",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 22,
                    fontWeight: 900,
                    color: "#0d6bde",
                  }}
                >
                  CRICKSY NEWS
                </Typography>
              </Box>
            )}
          </Box>

          <CardContent sx={{ p: 3 }}>
            <Chip
              label="Cricket News"
              sx={{
                mb: 2,
                bgcolor: "#0d6bde",
                color: "#fff",
                fontWeight: 900,
              }}
            />

            <Typography
              sx={{
                fontSize: 24,
                fontWeight: 950,
                lineHeight: 1.35,
                color: "#0f172a",
              }}
            >
              {article.title}
            </Typography>

            <Typography
              sx={{
                mt: 2,
                fontSize: 15,
                lineHeight: 1.9,
                color: "#475569",
              }}
            >
              {article.description ||
                "Latest cricket updates and breaking stories from around the cricket world."}
            </Typography>

            {article.content && (
              <Typography
                sx={{
                  mt: 2,
                  fontSize: 14,
                  lineHeight: 1.85,
                  color: "#64748b",
                }}
              >
                {article.content}
              </Typography>
            )}

            <Button
              fullWidth
              variant="contained"
              endIcon={<OpenInNewIcon />}
              href={article.url}
              target="_blank"
              sx={{
                mt: 3,
                height: 52,
                borderRadius: "18px",
                bgcolor: "#0d6bde",
                fontWeight: 900,
                textTransform: "none",
                boxShadow: "none",
                "&:hover": {
                  bgcolor: "#0a58b8",
                  boxShadow: "none",
                },
              }}
            >
              Read Full Article
            </Button>
          </CardContent>
        </Card>

        <Box sx={{ mb: 2 }}>
          <AdCard />
        </Box>
      </main>

      <Footer />
    </div>
  );
}