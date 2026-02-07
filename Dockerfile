# Build stage
FROM denoland/deno:latest AS builder

WORKDIR /app
COPY . .

# Install necessary dependencies
RUN deno cache main.ts dev.ts

# Build with full permissions and proper environment variables
# This will generate the Tailwind CSS output
RUN deno task build --allow-all --allow-env --allow-read

# Production stage
FROM denoland/deno:latest

WORKDIR /app
COPY --from=builder /app .

# Run with necessary permissions
CMD ["deno", "run", "--allow-net", "--allow-env", "--allow-read", "main.ts"]