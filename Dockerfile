ARG NODE_VERSION=24.13.0-slim

FROM node:${NODE_VERSION} AS dependencies
WORKDIR /app
COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm \
    if [ -f package-lock.json ]; then npm ci --no-audit --no-fund; else npm install --no-audit --no-fund; fi

FROM node:${NODE_VERSION} AS builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
ARG NEXT_PUBLIC_AGENCY_SLUG=first-cargo
ARG NEXT_PUBLIC_APP_NAME="First Cargo"
ARG NEXT_PUBLIC_BRAND_PRIMARY=#263070
ARG NEXT_PUBLIC_API_URL=/backend/api/v1
ARG NEXT_PUBLIC_BACKEND_URL=
ARG NEXT_PUBLIC_STAFF_APP_URL=https://ntigi.cm
ENV NEXT_PUBLIC_AGENCY_SLUG=$NEXT_PUBLIC_AGENCY_SLUG
ENV NEXT_PUBLIC_APP_NAME=$NEXT_PUBLIC_APP_NAME
ENV NEXT_PUBLIC_BRAND_PRIMARY=$NEXT_PUBLIC_BRAND_PRIMARY
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_STAFF_APP_URL=$NEXT_PUBLIC_STAFF_APP_URL
RUN npm run build

FROM node:${NODE_VERSION} AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
USER node
EXPOSE 3000
CMD ["node", "server.js"]
