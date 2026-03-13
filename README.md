# 🛍️ 출근장터

> 출근하면 열리고, 퇴근하면 닫히는 사내 중고거래 플랫폼

사내 직원 전용 중고거래·나눔·공동구매 서비스입니다. 싸이월드 레트로 감성의 UI로 직원들이 편하게 물건을 사고팔 수 있습니다.

---

## 주요 기능

- **팝니다 / 삽니다 / 나눕니다 / 같이삽시다** 태그로 게시글 분류
- **같이삽시다**: 참여 인원 모집 → 인원 마감 시 출항(공동구매 진행)
- **쪽지**: 판매자-구매자 1:1 메시지
- **댓글**: 게시글 내 1depth 댓글
- **이메일 인증** 회원가입 (사내 도메인만 허용)
- 모바일 반응형 UI

---

## 기술 스택

| | |
|--|--|
| **Backend** | Node.js + Express.js + SQLite (better-sqlite3) |
| **Frontend** | React 18 + TypeScript + Vite |
| **인증** | JWT + bcryptjs |
| **이메일** | Resend |
| **배포** | Vercel (프론트) + Render (백엔드) |

---

## 로컬 실행

### 사전 요구사항
- Node.js 18+

### 백엔드

```bash
cd backend
npm install
cp .env.example .env
# .env에 RESEND_API_KEY 입력
node src/index.js
# → http://localhost:3000
```

### 프론트엔드

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

---

## 환경변수

### backend/.env

```
RESEND_API_KEY=re_xxxx   # Resend에서 발급
```

### frontend (Vercel 환경변수)

```
VITE_API_URL=https://your-backend.onrender.com
```

> 로컬 개발 시 `VITE_API_URL`은 설정하지 않아도 됩니다. Vite 프록시가 자동으로 `localhost:3000`으로 연결합니다.

---

## 이메일 인증 백도어

이메일이 스팸함에도 오지 않을 경우 인증코드 입력란에 **`B1234`** 를 입력하면 인증을 통과할 수 있습니다. (프로토타입용)

---

## 허용 도메인 변경

`backend/src/db/init.js`에서 허용 도메인을 수정합니다.

```js
insertDomain.run('your-company.co.kr');
```

변경 후 DB 파일을 삭제하고 서버를 재시작하면 새 스키마가 적용됩니다.

```bash
rm backend/data/marketplace.db
node backend/src/index.js
```
