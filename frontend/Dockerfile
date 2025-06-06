# Build Stage
FROM node:20-alpine AS build
WORKDIR /app
COPY frontend/jdblog/package*.json ./
RUN npm install --force
COPY frontend/jdblog/. .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "prod"]
