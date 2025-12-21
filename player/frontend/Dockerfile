# =========================
# Player Frontend – DEV
# Next.js + Tailwind + pnpm
# =========================

FROM node:20-alpine

# ---- System deps (required for next / sharp / sass / native builds)
RUN apk update && apk add --no-cache \
  bash \
  python3 \
  make \
  g++ \
  libc6-compat

# ---- App directory
WORKDIR /home/node/app

# ---- Enable pnpm via corepack (Node 20 native)
RUN corepack enable && corepack prepare pnpm@latest --activate

# ---- Environment
ENV NODE_ENV=development
ENV PORT=8080
ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 8080

# ---- Copy only dependency files first (better layer caching)
COPY package.json pnpm-lock.yaml* ./

# ---- Install ALL deps (including dev deps → tailwind/postcss loaders)
RUN pnpm install --frozen-lockfile

# ---- Copy full source AFTER deps
COPY . .

# ---- Fix permissions (important for Docker + volumes)
RUN chown -R node:node /home/node/app

# ---- Run as non-root user
USER node

# ---- Clear Next cache just in case
RUN rm -rf .next

# ---- Start Next dev server
CMD ["pnpm", "dev"]
