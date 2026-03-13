# CLAUDE.md — 출근장터

사내 직원 전용(~300명) 중고거래 플랫폼. 싸이월드 레트로 UI.

---

## 프로젝트 구조

```
hackathon0313/
├── backend/
│   ├── src/
│   │   ├── db/init.js
│   │   ├── middleware/auth.js
│   │   └── routes/
│   │       ├── auth.js        # 회원가입/로그인 (OTP 이메일 인증, B1234 백도어)
│   │       ├── products.js    # 상품 CRUD + 같이삽시다
│   │       ├── comments.js
│   │       ├── groupBuy.js    # 한 배에 타기/하차, 출항
│   │       ├── users.js       # 마이페이지, 회원탈퇴
│   │       └── messages.js    # 쪽지 (대화 목록/상세/전송)
│   ├── .env                   # RESEND_API_KEY (gitignore)
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/client.ts      # Fetch 래퍼 (VITE_API_URL 환경변수)
│   │   ├── context/AuthContext.tsx
│   │   ├── components/        # Nav, ProductCard, PrivateRoute
│   │   ├── pages/             # 각 페이지 + .styles.ts 분리
│   │   ├── styles/theme.ts    # 디자인 토큰
│   │   └── types.ts
│   └── index.html
├── PRD.md
├── ROADMAP.md
└── README.md
```

---

## 실행 방법

```bash
# 백엔드 (포트 3000)
cd backend
cp .env.example .env   # RESEND_API_KEY 입력
node src/index.js

# 프론트엔드 (포트 5173)
cd frontend
npm run dev
```

---

## 기술 스택

- **Backend**: Express.js + better-sqlite3 (WAL) + JWT (24h) + bcryptjs + Resend
- **Frontend**: React 18 + TypeScript + Vite + React Router v6
- **Style**: 인라인 CSS 100%, theme.ts 토큰 참조, `.styles.ts` 파일 분리
- **Font**: Google Fonts "Gowun Dodum"

---

## 환경 이슈 (Windows)

- **bcrypt 금지**: 네이티브 빌드 실패 → `bcryptjs`(순수 JS)만 사용
- **파일 수정**: `sed`/`awk` Bash 명령어로 직접 수정 금지 → Edit/Write 도구 사용
- **DB 스키마 변경**: `CREATE TABLE IF NOT EXISTS`는 기존 테이블을 수정하지 않음 → `taskkill //F //IM node.exe` 후 DB 파일 삭제 필요

---

## 코드 컨벤션

- **Backend**: CommonJS (`require`/`module.exports`), 에러 메시지 한국어
- **Frontend**: ES modules, TypeScript strict, 함수형 컴포넌트
- **스타일**: `Foo.tsx` 옆에 `Foo.styles.ts` 분리, `colors.*` / `fonts.*` 등 theme 토큰 사용
- **상태관리**: `useState` + `useEffect` + Context API (Redux/Zustand 없음)

---

## DB 스키마 요약

```
users              (id, email UNIQUE, nickname UNIQUE, password_hash, created_at)
allowed_domains    (id, domain UNIQUE)  ← seed: ubcare.co.kr
products           (id, user_id NULL→탈퇴, title, description, tag, status, price, ...)
comments           (id, product_id CASCADE, user_id NULL→탈퇴, content, created_at)
group_buy_participants (id, product_id CASCADE, user_id CASCADE, UNIQUE(product_id, user_id))
messages           (id, sender_id, receiver_id, product_id, content, is_read, created_at)
```

- `products.user_id`, `comments.user_id`: `ON DELETE SET NULL` → 탈퇴 시 '탈퇴한 사용자' 표시
- `messages.sender_id/receiver_id`: FK 없음 → 탈퇴 후에도 메시지 보존, LEFT JOIN으로 '탈퇴한 사용자' 표시

---

## 허용 도메인 변경

`backend/src/db/init.js`의 `insertDomain.run(...)` 수정 후 DB 재생성.
