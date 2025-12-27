FROM node:20-slim

WORKDIR /usr/src/app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm ci --only=production || npm install --only=production

# Copy application code
COPY . .

# Environment
ENV NODE_ENV=production

# Cloud Run sets PORT; app.js already honors it
EXPOSE 8080

CMD ["npm", "start"]
