# data-fe

올림픽공원 프로젝트 프론트엔드. React + TypeScript (Vite). 서버에서는 빌드한 파일을 nginx가 보여 주고, /api 요청은 백엔드(data-be)로 넘겨요.

## 처음 실행

백엔드(data-be)를 먼저 띄운 뒤 실행하세요. 내 PC에 Node.js가 없어도 돼요 (도커 안의 Node 22.23.5를 씀).

```bash
cp .env.example .env
docker compose up
```

| 주소 | 내용 |
|---|---|
| http://localhost:8080 | 개발 서버 (파일을 저장하면 화면이 바로 바뀜) |
| http://localhost:8080/api/health | 개발 서버를 거쳐 백엔드 상태 확인 |

처음 실행할 때는 라이브러리를 설치하느라 1분 정도 걸려요.

### 배포 이미지로 확인하기 (선택)

서버와 같은 이미지(빌드 결과 + nginx)로 확인하고 싶을 때만 씁니다.

```bash
docker compose --profile prod up --build web-prod
```

http://localhost:8081 에서 열려요.

## 라이브러리 추가

내 PC가 아니라 컨테이너 안에서 설치하세요. package.json과 package-lock.json이 함께 바뀌어야 해요.

```bash
docker compose exec web npm install 라이브러리이름
```

## 검사 명령

```bash
docker compose exec web npm run typecheck   # 타입 검사
docker compose exec web npm run lint        # 코드 검사
docker compose exec web npm run build       # 배포 빌드가 되는지
```

## 폴더 구조

```
data-fe/
├── docker-compose.yml           로컬 실행 (개발 서버, 배포 이미지 확인용)
├── Dockerfile                   서버 배포 이미지 (빌드 → nginx)
├── docker-compose.server.yml    서버용 (팀원은 쓰지 않음)
├── nginx/templates/             서버 nginx 설정
├── index.html                   HTML 시작 파일
├── vite.config.ts               개발 서버, /api 연결 설정
├── public/                      그대로 복사되는 파일 (favicon 등)
└── src/
    ├── main.tsx                 시작점
    ├── app/                     App, 라우터, 전역 설정
    ├── pages/                   화면 (URL 하나에 하나)
    ├── components/              여러 화면에서 쓰는 공통 컴포넌트
    ├── api/                     백엔드 호출 (client.ts의 apiGet 사용)
    ├── hooks/                   공통 훅
    ├── types/                   공통 타입
    ├── styles/                  전역 스타일
    └── assets/                  이미지, 폰트
```

## 요청 흐름

```
로컬: 브라우저 → localhost:8080 (Vite 개발 서버) ─ /api/... → 내 PC 백엔드(8000)
서버: 브라우저 → Cloudflare → nginx ─┬─ /api/... → 백엔드 2대
                                     └─ 그 외    → 빌드된 화면 파일
```

화면에서 API를 부를 때는 백엔드 주소를 직접 쓰지 말고 /api/... 경로로 부르세요. 그래야 로컬, 테스트 서버, 운영 서버에서 코드를 바꾸지 않아도 돼요.

## 하지 말 것

- 코드나 이미지에 API 키, 비밀번호 넣기 (이미지는 공개돼요. 필요한 값은 백엔드가 가지고 있게)
- 백엔드 주소(http://...:8000)를 코드에 직접 쓰기
- dist/, node_modules/ 커밋하기
