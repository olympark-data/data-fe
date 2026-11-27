# 서버 배포용 이미지.
# 1단계: React(Vite) 빌드  2단계: nginx에 빌드 결과(dist)와 설정 템플릿만 담는다.
# 로컬 개발은 docker-compose.yml의 web(개발 서버)을 쓴다.

FROM node:22.23.5-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx/templates /etc/nginx/templates
COPY --from=build /app/dist /usr/share/nginx/html
