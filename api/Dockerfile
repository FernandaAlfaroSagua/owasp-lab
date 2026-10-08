FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
# Dev mode: the source directory is mounted as a volume and Nest recompiles on change.
CMD ["npm", "run", "start:dev"]
