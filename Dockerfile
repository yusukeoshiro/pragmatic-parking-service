FROM node:16 AS builder
WORKDIR /app
COPY package.json package-lock.json .npmrc ./
RUN npm run artifactregistry-login
RUN npm install
COPY ./ ./
RUN npm run build
RUN npm install --production

FROM node:16-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY package.json package-lock.json .npmrc ./
RUN npm run artifactregistry-login
RUN npm install --production
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/node_modules /app/node_modules

CMD ["npm", "run", "start:prod"]
