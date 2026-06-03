# 🐱 Cozy Quest

> 아늑한 풍경 속에 숨은 고양이 다섯 마리를 찾는 코지 발견 게임

![Cozy Quest](apps/web/public/og.png)

한 장의 아늑한 수채화 풍경이 열리고, 그 속에 숨은 다섯 마리의 고양이를 찾아냅니다. 모두 찾으면 숨어 있ㅓ 고양이가 등장하고, 선물을 줘요. 고양이가 준 선물로 보금자리를 꾸며세요.

**🔗 [cozy-quest-web.vercel.app](https://cozy-quest-web.vercel.app)**

## 기술 스택

- **Next.js 14** (App Router) · **React 18** · **TypeScript**
- **Tailwind CSS** — 수채화 + 잉크 라인 디자인 시스템
- **pnpm 워크스페이스** + **Turborepo** 모노레포

## 프로젝트 구조

```
cozy-quest/
├── apps/web/         # Next.js 게임 클라이언트 (9:16 모바일 프레임)
├── packages/shared/  # 공유 타입·시즌 데이터
└── docs/             # 기획서·게임 규칙(GAME_RULES.md)·시즌 정의
```

## 시작하기

```bash
pnpm install
pnpm dev          # 전체 워크스페이스 dev 실행 (turbo)
```

`apps/web`은 http://localhost:3000 에서 열립니다.

## 스크립트

| 명령             | 설명           |
| ---------------- | -------------- |
| `pnpm dev`       | 개발 서버 실행 |
| `pnpm build`     | 프로덕션 빌드  |
| `pnpm lint`      | 린트           |
| `pnpm typecheck` | 타입 체크      |

## 콘텐츠

- **시즌 1 — 치즈**: 7일치 풍경(Day 1–7), caramel orange tabby 고양이
- 게임 메커닉·배치 규칙은 [docs/GAME_RULES.md](docs/GAME_RULES.md) 참고
