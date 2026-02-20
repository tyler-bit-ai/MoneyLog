# CHANGELOG

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
