# 서버 배포용 이미지: nginx + 설정 템플릿 + 화면 파일
# 로컬 개발은 docker-compose.yml (폴더를 그대로 연결)을 쓴다.
FROM nginx:1.27-alpine

COPY nginx/templates /etc/nginx/templates
COPY dist /usr/share/nginx/html
