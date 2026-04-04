import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { createServer } from "node:http";

const host = process.env.HOST ?? "0.0.0.0";
const port = Number(process.env.PORT ?? 3000);
const rootDir = normalize(join(process.cwd(), "out"));

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
};

function resolveFilePath(urlPath) {
  const pathname = decodeURIComponent(urlPath.split("?")[0] ?? "/");
  const safePath = normalize(join(rootDir, pathname));

  if (!safePath.startsWith(rootDir)) {
    return null;
  }

  if (!existsSync(safePath)) {
    const htmlPath = normalize(join(rootDir, pathname, "index.html"));
    if (htmlPath.startsWith(rootDir) && existsSync(htmlPath)) {
      return htmlPath;
    }

    return null;
  }

  if (statSync(safePath).isDirectory()) {
    const indexPath = join(safePath, "index.html");
    return existsSync(indexPath) ? indexPath : null;
  }

  return safePath;
}

const server = createServer((request, response) => {
  const filePath = resolveFilePath(request.url ?? "/");

  if (!filePath) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  const extension = extname(filePath).toLowerCase();
  response.writeHead(200, {
    "Content-Type": contentTypes[extension] ?? "application/octet-stream",
    "Cache-Control": extension === ".html" ? "no-cache" : "public, max-age=31536000, immutable",
  });

  createReadStream(filePath).pipe(response);
});

server.listen(port, host, () => {
  console.log(`Static export available at http://localhost:${port}`);
});
