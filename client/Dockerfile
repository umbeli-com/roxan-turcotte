FROM node:20-alpine AS builder
WORKDIR /app

ARG VITE_API_URL=/api
ARG PUBLIC_BASE=/
ARG PUBLIC_SITE_URL=https://turcotte.umbeli.com
ARG PAGES_CNAME=
ENV VITE_API_URL=$VITE_API_URL
ENV PUBLIC_BASE=$PUBLIC_BASE
ENV PUBLIC_SITE_URL=$PUBLIC_SITE_URL
ENV PAGES_CNAME=$PAGES_CNAME

COPY client/package.json client/package-lock.json* ./
RUN npm install --no-audit --no-fund

COPY client/ ./
RUN npm run build


FROM nginx:1.27-alpine AS runtime
COPY client/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
