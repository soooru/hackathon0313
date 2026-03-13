# CLAUDE.md — 출근장터

사내 직원 전용(~300명) 중고팝니다 플랫폼. 싸이월드 미니홈피 스타일 레트로 UI.

**목표**: 하루 안에 프로토타입 출시. 핵심 기능 우선, 빠른 출시.

---

## 프로젝트 구조

```
hackathon0313/
├── backend/
│   ├── src/
│   │   ├── db/init.js           # DB 초기화 (better-sqlite3, WAL mode)
│   │   ├── middleware/auth.js   # JWT 검증 미들웨어
│   │   ├── routes/
│   │   │   ├── auth.js          # 회원가입/로그인/me
│   │   │   ├── products.js      # 상품 CRUD
│   │   │   ├── comments.js      # 댓글
│   │   │   ├── users.js         # 마이페이지
│   │   │   └── messages.js      # 501 skeleton (v2.0)
│   │   └── index.js
│   ├── data/marketplace.db      # SQLite DB (gitignore 권장)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/client.ts        # Fetch 래퍼 (JWT 자동 첨부)
│   │   ├── context/AuthContext.tsx
│   │   ├── components/
│   │   │   ├── Nav.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   └── PrivateRoute.tsx
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── SignupPage.tsx
│   │   │   ├── ProductListPage.tsx
│   │   │   ├── ProductCreatePage.tsx
│   │   │   ├── ProductEditPage.tsx
│   │   │   ├── ProductDetailPage.tsx
│   │   │   └── MyPage.tsx
│   │   ├── styles/theme.ts      # 디자인 토큰 (색상, 폰트, radius)
│   │   ├── types.ts
│   │   └── App.tsx
│   └── index.html               # Gowun Dodum 폰트 link 포함
├── PRD.md
├── ROADMAP.md
└── CLAUDE.md
```

---

## 실행 방법

```bash
# 백엔드 (포트 3000)
cd backend
node src/index.js

# 프론트엔드 (포트 5173)
cd frontend
npm run dev
```

---

## 기술 스택

### 백엔드
- **Express.js** + **better-sqlite3** + **jsonwebtoken** + **bcryptjs** + **cors**
- DB 파일 위치: `backend/data/marketplace.db`
- JWT 만료: 24h / secret: 환경변수 `JWT_SECRET` (기본값 하드코딩됨)

### 프론트엔드
- **React 18** + **TypeScript** + **Vite** + **React Router v6**
- 스타일: **인라인 CSS 100%** (CSS 파일, Tailwind, CSS-in-JS 없음)
- 폰트: Google Fonts **Gowun Dodum** (index.html에 link 태그로 주입)
- API 통신: `src/api/client.ts` Fetch 래퍼 사용 (axios 없음)

---

## 환경 이슈 및 결정 사항 (중요)

### bcrypt → bcryptjs
- `bcrypt`는 네이티브 바이너리 빌드 필요 → Windows 환경에서 컴파일 실패
- **`bcryptjs`(순수 JS)를 사용한다.** `bcrypt`는 절대 쓰지 않는다.

### better-sqlite3
- `npm install` 시 `--ignore-scripts` 없이 설치해야 사전 빌드 바이너리가 정상 적용됨
- `npm rebuild`는 Windows에서 실패함. 재설치가 필요하면 `npm install better-sqlite3@latest`로 해결

### Windows 환경 주의사항
- `sed` 명령어로 파일 수정 시 파일이 1줄짜리로 망가지는 현상 있음 → **파일 수정은 반드시 Edit/Write 도구를 사용한다. sed/awk Bash 명령어로 파일을 직접 수정하지 않는다.**
- `/dev/stdin` 미지원 → Node.js 스크립트 내에서 stdin 파이프 처리 불가. 테스트는 `test.js` 파일로 작성한다.

---

## v1.0 범위 (현재 구현 대상)

v1.0 목표는 **빠른 출시**. 아래 기능이 전부다.

- [x] 회원가입 / 로그인 (이메일 도메인 검증, JWT)
- [x] 상품 등록 / 수정 / 삭제 / 목록 / 상세
- [x] 댓글 (1depth)
- [x] 검색 (제목 + 닉네임 LIKE)
- [x] 태그 필터 (팝니다 / 삽니다 / 나눕니다)
- [x] 페이지네이션 (12개/페이지)
- [x] 마이페이지 (내 정보 + 내 상품)
- [x] 쪽지 — **UI 비활성 + 백엔드 501 skeleton만** (v2.0 대비)

**v1.0에서 하지 않는 것**: 쪽지 실제 구현, 이미지 업로드, 찜하기, 관리자 페이지, 알림

---

## 쪽지 기능 처리 규칙 (v1.0)

| 영역 | 처리 방식 |
|------|-----------|
| DB | `messages` 테이블 스키마만 생성 (데이터 없음) |
| 백엔드 | `GET /`, `GET /:conversationId`, `POST /` 모두 **501** 반환: `"쪽지 기능은 준비 중입니다 (v2.0)"` |
| Nav 탭 | "쪽지" 탭 렌더링하되 `opacity: 0.45`, `pointerEvents: 'none'`, "(준비 중)" 텍스트 병기 |
| 상품 상세 | "쪽지 보내기" 버튼 `disabled`, "(준비 중)" 텍스트 |

쪽지 관련 코드를 활성화하거나 실제 구현하지 않는다. v2.0 태스크다.

---

## 디자인 시스템

모든 스타일은 `src/styles/theme.ts`의 상수를 참조한다. 임의의 색상값을 하드코딩하지 않는다.

| 토큰 | 값 | 용도 |
|------|----|------|
| `colors.bg` | `#FFF8F0` | 배경 (크림) |
| `colors.primary` | `#FF6B35` | 뉴트로 오렌지 포인트 |
| `colors.border` | `#FFB899` | 카드/입력 테두리 |
| `colors.tagTrade` | `#FF6B35` | 팝니다 태그 |
| `colors.tagExchange` | `#4ECDC4` | 삽니다 태그 |
| `colors.tagFree` | `#FFD93D` | 나눕니다 태그 |
| `fonts.main` | `'Gowun Dodum', sans-serif` | 전체 폰트 |
| `radius.md` | `12px` | 카드 radius |

배경 패턴: `repeating-linear-gradient(45deg, rgba(255,107,53,0.03) ...)` CSS gradient로 체크무늬 표현.

---

## API 규칙

- 기본 URL: `http://localhost:3000`
- 인증이 필요한 엔드포인트: `Authorization: Bearer <token>` 헤더 필수
- 에러 응답 형식: `{ "error": "한국어 메시지" }`
- 성공 응답: 리소스 객체 또는 `{ "message": "..." }`

### 엔드포인트 요약

```
POST   /api/auth/signup
POST   /api/auth/login
GET    /api/auth/me                      (인증 필요)

GET    /api/products?search=&tag=&page=  (공개)
GET    /api/products/:id                 (공개)
POST   /api/products                     (인증 필요)
PUT    /api/products/:id                 (인증 + 소유자)
DELETE /api/products/:id                 (인증 + 소유자)

GET    /api/products/:id/comments        (공개)
POST   /api/products/:id/comments        (인증 필요)

GET    /api/users/me/products            (인증 필요)

GET    /api/messages                     (인증 필요) → 501
GET    /api/messages/:conversationId     (인증 필요) → 501
POST   /api/messages                     (인증 필요) → 501
```

---

## 코드 컨벤션

- **백엔드**: CommonJS (`require`/`module.exports`), async/await, 에러는 한국어 메시지
- **프론트엔드**: ES modules, TypeScript strict, 함수형 컴포넌트
- **스타일**: 인라인 CSS 객체 방식 유지. `className`, CSS 파일, Tailwind 없음
- **상태관리**: React 내장 (`useState`, `useEffect`, Context API). Redux/Zustand 없음
- **에러 처리**: try/catch + 한국어 에러 메시지 state로 UI에 표시

## 스타일 파일 분리 규칙

TSX 파일 안에 스타일 객체를 직접 넣지 않는다. 반드시 별도 파일로 분리한다.

**파일 구조:**
- 각 `Foo.tsx` 옆에 `Foo.styles.ts` 파일을 만든다
- `Foo.styles.ts`는 `styles` 객체를 default export한다
- `React.CSSProperties` 타입을 사용한다
- 색상/폰트/radius 값은 반드시 `theme.ts` 상수를 참조한다

**예시:**

```ts
// Nav.styles.ts
import { CSSProperties } from 'react';
import { colors, fonts, shadow } from '../styles/theme';

const styles = {
  nav: {
    background: colors.white,
    borderBottom: `2px solid ${colors.primary}`,
    boxShadow: shadow.nav,
  } as CSSProperties,
};

export default styles;
```

```tsx
// Nav.tsx
import styles from './Nav.styles';
// ...
<nav style={styles.nav}>
```

동적 스타일(조건부 값)이 필요한 경우 `Foo.styles.ts`에서 함수로 export한다:

```ts
export const tabStyle = (isActive: boolean): CSSProperties => ({
  background: isActive ? colors.primary : 'transparent',
});
```

---

## DB 스키마 요약

```sql
users         (id, email UNIQUE, nickname UNIQUE, password_hash, created_at)
allowed_domains (id, domain UNIQUE)           -- seed: company.co.kr, corp.co.kr, example.com
products      (id, user_id FK, title, description, tag, status, created_at, updated_at)
comments      (id, product_id FK, user_id FK, content, created_at)
messages      (id, sender_id FK, receiver_id FK, product_id FK, content, is_read, created_at)
```

`PRAGMA foreign_keys = ON` / `PRAGMA journal_mode = WAL` 적용.
삭제 시 CASCADE: products 삭제 → comments 자동 삭제.

---

## 허용 도메인 변경 방법

`backend/src/db/init.js`의 `domains` 배열을 수정한다.
DB가 이미 생성된 경우 직접 SQL로 insert/delete 처리.

## 개발 방향성

 전문적이게
