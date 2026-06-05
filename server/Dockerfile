FROM node:20-alpine AS builder
WORKDIR /app

# better-sqlite3 native build deps
RUN apk add --no-cache python3 make g++

COPY server/package.json server/package-lock.json* ./
RUN npm install --omit=dev --no-audit --no-fund

# (no TS build for server — it's pure ESM .js)

FROM node:20-alpine AS runtime
WORKDIR /app

# better-sqlite3 needs libstdc++ at runtime
RUN apk add --no-cache python3 make g++

COPY server/package.json server/package-lock.json* ./
COPY --from=builder /app/node_modules ./node_modules
COPY server/src ./src

RUN mkdir -p /app/data /app/uploads
VOLUME ["/app/data", "/app/uploads"]

ENV NODE_ENV=production
ENV PORT=3010
EXPOSE 3010

# Run migrations standalone first — the app's index.js imports app.js
# which eagerly db.prepare()s in route modules before bootstrap can run
# the migrations itself, so a fresh volume crashes on "no such table".
# Migrations + seed run before the server starts. seed.js is idempotent: it
# only creates the default admin (roxan/Bonjour-2026!) and reference data
# when the tables are empty, so it's safe on every boot.
CMD ["sh", "-c", "node src/db/migrate.js && node src/db/seed.js && node src/index.js"]
