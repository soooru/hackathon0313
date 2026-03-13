# 🛍️ 출근장터

> 출근하면 열리고, 퇴근하면 닫히는 사내 중고거래 플랫폼

[![Node.js](https://img.shields.io/badge/Node.js-Express-green)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-18-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![SQLite](https://img.shields.io/badge/Database-SQLite-lightgrey)](https://www.sqlite.org/)

---

## 소개

**출근장터**는 회사 내부 구성원만 사용할 수 있는 사내 중고거래 플랫폼입니다.

직원들이 사용하지 않는 물건을 판매하거나, 필요한 물건을 요청하거나, 무료로 나누거나, 공동구매를 진행할 수 있는 회사 전용 장터입니다. 싸이월드 미니홈피 감성의 레트로 UI로 친근한 사용 경험을 제공합니다.

---

## 주요 기능

### 🏷️ 4가지 거래 유형

| 태그 | 설명 |
|------|------|
| **팝니다** | 중고 물품 판매 |
| **삽니다** | 원하는 물품 구인 |
| **나눕니다** | 무료 나눔 |
| **같이삽시다** | 인원 모집 후 공동구매 |

### 🛒 상품

- 태그·검색(제목/닉네임)·완료 여부로 필터링
- 금액, 흥정 가능 여부, 공동구매 최대 인원 설정
- 상태 토글 (가능 ↔ 완료), 완료 시 수정·삭제 비활성화
- 카드에 최신 댓글 미리보기, 참여 인원 실시간 표시

### ⛵ 같이삽시다

- 비소유자: **한 배에 타기 / 배에서 하차하기**
- 인원 마감 시 소유자에게 **⚓ 출항** 버튼 노출
- 출항 팝업에서 참여자 이메일·닉네임 목록 확인

### ✉️ 쪽지

- 상품 상세 페이지에서 판매자에게 쪽지 전송
- 쪽지함: 대화 목록 (상대 닉네임, 관련 상품, 마지막 메시지)
- 채팅 스타일 대화 상세 (내 메시지 오른쪽, 상대 메시지 왼쪽)
- 읽지 않은 쪽지 수 Nav 뱃지 표시

### 👤 계정

- 사내 이메일 도메인 검증 + **이메일 인증 (OTP)**
- JWT 인증, 비로그인 전체 라우트 차단
- 회원탈퇴 시 게시글·댓글은 "탈퇴한 사용자"로 보존, 쪽지 내역도 유지
- 탈퇴 후 동일 이메일로 재가입 가능 (완전히 새 계정으로 처리)

### 📱 기타

- 모바일 반응형 네비게이션 (햄버거 메뉴)
- Open Graph 메타 태그 (SNS 공유 미리보기)

---

## 스크린샷

> 싸이월드 레트로 감성 + 뉴트로 오렌지 포인트 컬러

| 상품 목록 | 상품 상세 | 쪽지함 |
|----------|----------|--------|
| 태그 필터, 검색, 카드 그리드 | 같이삽시다, 쪽지 보내기, 댓글 | 대화 목록, 읽지 않은 수 뱃지 |

---

## 기술 스택

### 백엔드

| | |
|--|--|
| Runtime | Node.js |
| Framework | Express.js |
| Database | SQLite (better-sqlite3, WAL 모드) |
| 인증 | JWT (24h) + bcryptjs |
| 이메일 | Resend (OTP 발송) |

### 프론트엔드

| | |
|--|--|
| Framework | React 18 |
| Language | TypeScript |
| Build | Vite |
| Routing | React Router v6 |
| Style | 인라인 CSS (싸이월드 레트로, `.styles.ts` 분리) |
| Font | Google Fonts "Gowun Dodum" |

---

## 로컬 실행

### 요구사항
- Node.js 18+

### 1. 백엔드

```bash
cd backend
npm install
cp .env.example .env
# .env 파일에 RESEND_API_KEY 입력
node src/index.js
# → http://localhost:3000
```

### 2. 프론트엔드

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

> Vite 프록시가 `/api` 요청을 자동으로 `localhost:3000`으로 전달합니다.

---

## 환경변수

### `backend/.env`

```env
RESEND_API_KEY=re_xxxx   # resend.com에서 발급
```

### 프로덕션 (Vercel 환경변수)

```env
VITE_API_URL=https://your-backend.onrender.com
```

---

## 이메일 인증 백도어

이메일이 오지 않을 경우 인증코드 입력란에 **`B1234`** 를 입력하면 인증을 건너뛸 수 있습니다.
*(프로토타입 전용)*

---

## 허용 도메인 설정

`backend/src/db/init.js`에서 사내 이메일 도메인을 설정합니다.

```js
insertDomain.run('your-company.co.kr');
```

변경 후 DB를 초기화합니다.

```bash
rm backend/data/marketplace.db
node backend/src/index.js
```

---

## 배포

| 서비스 | 역할 |
|--------|------|
| [Vercel](https://vercel.com) | 프론트엔드 (Root: `frontend`) |
| [Render](https://render.com) | 백엔드 (Root: `backend`, Start: `node src/index.js`) |

> Render 무료 플랜은 SQLite 데이터가 재시작 시 초기화될 수 있습니다.

---

## 프로젝트 문서

- [PRD.md](./PRD.md) — 기능 명세 및 API 문서
- [ROADMAP.md](./ROADMAP.md) — 개발 로드맵
