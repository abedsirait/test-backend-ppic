# Menggunakan image Node.js versi terbaru sebagai base image
FROM node:18-alpine as build

# Menetapkan direktori kerja di dalam container
WORKDIR /app

# Copy file package.json dan package-lock.json terlebih dahulu
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy seluruh file ke dalam container
COPY . .

ENV CLIENT_URL="https://frontend-ppic.vercel.app"

EXPOSE 8080

# Jalankan aplikasi
CMD ["node", "index.js"]
