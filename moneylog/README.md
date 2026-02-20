# MoneyLog Dashboard

Google Sheets 기반 수입/지출 대시보드입니다. Next.js(App Router) + TypeScript + TailwindCSS로 구성되었습니다.

## 1) 실행

```bash
npm install
cp .env.example .env.local
npm run dev
```

## 2) 필수 환경변수

- `GOOGLE_SHEET_ID`: 구글 스프레드시트 ID
- `GOOGLE_SHEET_GID_BUDGET`: `수입지출항목` 탭 gid
- `GOOGLE_SHEET_GID_CHECKLIST`: `챙겨야하는 것` 탭 gid
- `DASHBOARD_PASSWORD`: 로그인 비밀번호
- `SESSION_SECRET`: 세션 서명 시크릿

## 3) 주요 경로

- `/login`: 로그인
- `/`: 대시보드
- `/api/dashboard/snapshot`: 대시보드 스냅샷 API (인증 필요)

## 4) 보안

- `httpOnly` 세션 쿠키 사용
- 비고(note) 내 계좌/긴 숫자 패턴 마스킹
- 미들웨어로 페이지/API 접근 제어
