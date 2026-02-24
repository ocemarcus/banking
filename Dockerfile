# Stage 1: Install production dependencies and build
FROM oven/bun:latest AS builder
WORKDIR /app
ENV TZ=America/Sao_Paulo


# Copy necessary files
COPY package.json  /app/
COPY tsconfig.json /app/
COPY tsconfig.build.json /app/
COPY nest-cli.json /app/
COPY . /app

# Install dependencies and build
RUN bun install --frozen-lockfile
RUN bun run build
RUN bunx tsc-alias

# Remove node_modules and install only production dependencies
RUN rm -rf node_modules
RUN bun install --production --frozen-lockfile

# Stage 2: Final image with distroless
FROM gcr.io/distroless/nodejs20-debian11

WORKDIR /app
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/node_modules /app/node_modules

COPY ./migrations /app/dist/src/migrations

ENV TZ=America/Sao_Paulo
ENV PGSSLMODE=no-verify

EXPOSE 5000

CMD ["dist/src/main.js"]