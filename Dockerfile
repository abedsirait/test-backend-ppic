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
ENV ACCESS_TOKEN_SECRET = "ff97sdf88dyfdjf94ysdjglf89497jafasdjf984ydjjf75fjajdf894789jaf9d8fu8df847y8sdf"
ENV REFRESH_TOKEN_SECRET = "ldjafisdofj8947848j84hf84hf7yjs9f849jfq98un4yneyf478nf7hf78ygrhg78ty4uwt9nru89rtu8en98g"

EXPOSE 8080

# Jalankan aplikasi
CMD ["node", "index.js"]
