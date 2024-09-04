# Stage 1: Build the application
FROM node:18 AS build

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

COPY . .
RUN pnpm run build

# Stage 2: Serve the application
FROM node:18-alpine

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package.json ./package.json
COPY --from=build /usr/src/app/pnpm-lock.yaml ./pnpm-lock.yaml

RUN npm install -g pnpm && pnpm install --prod

EXPOSE 8000

CMD ["node", "dist/main"]