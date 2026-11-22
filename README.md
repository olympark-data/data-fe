# data-fe

올림픽공원 프로젝트 프론트엔드. nginx가 화면 파일을 보여 주고, /api 요청은 백엔드(data-be)로 넘겨요.

## 처음 실행

백엔드(data-be)를 먼저 띄운 뒤 실행하세요.

```bash
cp .env.example .env
docker compose up -d
```

| 주소 | 내용 |
|---|---|
| http://localhost:8080 | 화면 |
| http://localhost:8080/api/health | nginx를 거쳐 백엔드 상태 확인 |

## 폴더 구조

```
data-fe/
├── docker-compose.yml           로컬 실행 (nginx)
├── .env.example                 백엔드 주소, 포트 (.env는 커밋 금지)
├── nginx/templates/             nginx 설정 (BACKEND_1, BACKEND_2를 .env에서 넣음)
└── dist/                        화면 파일 (지금은 안내 페이지)
```

## 요청 흐름

```
브라우저 → localhost:8080 (nginx)
             ├─ /api/...  → 백엔드 (BACKEND_1, BACKEND_2에 나눠서 전달)
             └─ 그 외      → dist/ 화면 파일
```

화면에서 API를 부를 때는 백엔드 주소를 직접 쓰지 말고 /api/... 경로로 부르세요. 그래야 로컬, 테스트 서버, 운영 서버에서 코드를 바꾸지 않아도 돼요.

## 프레임워크를 정하면

React(Vite) 등을 정하면 이 저장소에 프로젝트를 만들고, 빌드 결과물이 dist/에 들어오도록 빌드용 Dockerfile을 추가해요. 그때 dist/는 깃에서 빼요.
