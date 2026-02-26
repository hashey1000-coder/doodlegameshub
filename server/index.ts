import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import compression from "compression";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Gzip / Brotli compression
  app.use(compression());

  // Security + performance headers
  app.use((_req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    // Permissions-Policy: disable unused browser features
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(), interest-cohort=()");
    // Vary on encoding for correct CDN caching
    res.setHeader("Vary", "Accept-Encoding");
    next();
  });

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  // Immutable cache for hashed assets (JS, CSS, images)
  app.use(
    "/assets",
    express.static(path.join(staticPath, "assets"), {
      maxAge: "1y",
      immutable: true,
    })
  );

  // Long cache for thumbnail images (content-addressed)
  app.use(
    "/thumbnails",
    express.static(path.join(staticPath, "thumbnails"), {
      maxAge: "30d",
      immutable: true,
    })
  );

  // Short cache for other static files (sitemap, robots.txt)
  app.use(express.static(staticPath, {
    maxAge: "1h",
    setHeaders(res, filePath) {
      // HTML pages: short cache + stale-while-revalidate for instant loads
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=86400');
      }
    }
  }));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    // Set cache headers for HTML fallback
    res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=86400');
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
