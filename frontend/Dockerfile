# Build Stage
FROM node:20-alpine AS build
WORKDIR /app
COPY frontend/jdblog-vike/package*.json ./
RUN npm install --force
COPY frontend/jdblog-vike/. .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "prod"]
