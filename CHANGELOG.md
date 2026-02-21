# CHANGELOG

## 2026-02-21

### 요청 단위 요약
- 신용카드 월별 실적 시트를 별도 ENV로 연동하고 KST 현재월만 조회하도록 추가했습니다.
- 대시보드 우측 영역에 `신용카드 실적` 패널을 추가해 `OK/NOK/미입력`과 달성률을 함께 표시합니다.
- 스냅샷 타입/API에 `cardPerformance` 데이터를 확장했습니다.

### 변경 파일
- `.env.example`
- `README.md`
- `lib/env.ts`
- `lib/types.ts`
- `lib/sheets.ts`
- `lib/dashboard.ts`
- `app/components/card-performance-panel.tsx`
- `app/page.tsx`
- `CHANGELOG.md`

## 2026-02-20

### 요청 단위 요약
- 월수입 상세가 보이도록 대시보드에 `월수입 상세` 표를 추가했습니다.
- 예산 표에서 `소분류`, `비용` 헤더 클릭 시 오름차순/내림차순이 토글되도록 정렬 기능을 추가했습니다.
- `일회성 수입`, `일회성 지출`을 기본 접힘 상태로 변경하고 클릭 시 펼치도록 아코디언 UI를 추가했습니다.
- 하단 `일회성 순수지` 섹션을 제거했습니다.

### 변경 파일
- `lib/types.ts`
- `lib/dashboard.ts`
- `app/components/budget-table.tsx`
- `app/components/collapsible-section.tsx`
- `app/page.tsx`
- `CHANGELOG.md`

### 검증
- 완료: `npm run lint` 통과
- 완료: `npm run build` 통과
- 참고 경고:
  - 루트 잠금파일 다중 감지(`C:\Codex\MoneyLog\package-lock.json` + `moneylog/package-lock.json`)
  - `middleware.ts` 규약 deprecate 경고(동작은 정상)
