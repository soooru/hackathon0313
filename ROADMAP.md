# 출근장터 개발 로드맵

> 기간: 3일 / 1인 개발 / 전체 기능 구현 목표

---

## Day 1 — 백엔드 완성

### 1-1. 프로젝트 초기 세팅
- [ ] 모노레포 구조 생성 (`/backend`, `/frontend`)
- [ ] 백엔드: `npm init`, Express + better-sqlite3 + jsonwebtoken + bcrypt 설치
- [ ] DB 초기화 스크립트 작성 (테이블 생성: users, products, comments, messages, allowed_domains)
- [ ] `allowed_domains` 초기 데이터 seed

### 1-2. 인증 API
- [ ] `POST /api/auth/signup` — 도메인 검증 + bcrypt 해싱 + 저장
- [ ] `POST /api/auth/login` — JWT 발급
- [ ] `GET /api/auth/me` — JWT 미들웨어 + 내 정보 반환
- [ ] JWT 인증 미들웨어 공통화

### 1-3. 상품 API
- [ ] `GET /api/products` — 목록 + 검색(제목/닉네임) + 페이지네이션
- [ ] `GET /api/products/:id` — 상세
- [ ] `POST /api/products` — 등록
- [ ] `PUT /api/products/:id` — 수정 (본인 확인)
- [ ] `DELETE /api/products/:id` — 삭제 (본인 확인)

### 1-4. 댓글 / 쪽지 / 마이페이지 API
- [ ] `GET/POST /api/products/:id/comments`
- [ ] `GET /api/messages` — 대화 목록 (conversation_id 기준 그룹)
- [ ] `GET /api/messages/:conversationId` — 대화 상세
- [ ] `POST /api/messages` — 쪽지 보내기
- [ ] `GET /api/users/me/products` — 내 등록 상품

---

## Day 2 — 프론트엔드 핵심 기능

### 2-1. 프론트엔드 초기 세팅
- [ ] `create-react-app` 또는 Vite으로 React 18 + TypeScript 프로젝트 생성
- [ ] React Router v6 설정
- [ ] Fetch API 커스텀 래퍼 작성 (JWT 자동 첨부)
- [ ] 인증 Context 설정 (로그인 상태 전역 관리)
- [ ] Private Route 설정 (비로그인 시 로그인 페이지로 리다이렉트)

### 2-2. 인증 페이지
- [ ] 로그인 페이지
- [ ] 회원가입 페이지 (이메일 도메인 안내 문구 포함)

### 2-3. 상품 관련 페이지
- [ ] 상품 목록 페이지 (검색 입력, 카드 리스트)
- [ ] 상품 등록 페이지 (제목, 설명, 태그 선택)
- [ ] 상품 상세 페이지 (상품 정보 + 댓글 + 쪽지 보내기 버튼)
- [ ] 상품 수정/삭제 (본인 상품만 버튼 노출)

---

## Day 3 — 쪽지함 / 마이페이지 + 디자인 완성

### 3-1. 쪽지함 / 마이페이지
- [ ] 쪽지함 페이지 (대화 목록 → 대화 상세)
- [ ] 마이페이지 (내 정보 + 내 상품 목록)

### 3-2. 공통 UI / 디자인 적용
- [ ] 공통 네비게이션 탭 컴포넌트
- [ ] 싸이월드 디자인 시스템 전체 적용
  - 크림/아이보리 배경 + 오렌지 체크무늬 패턴
  - 뉴트로 오렌지 포인트 컬러
  - 둥근 모서리 카드, 점선/실선 테두리
  - 레트로 폰트 적용

### 3-3. 마무리
- [ ] 전체 기능 연결 확인 (E2E 흐름 테스트)
- [ ] 에러 처리 및 빈 상태(empty state) UI
- [ ] 빌드 및 실행 확인

---

## 디렉토리 구조 (예정)

```
hackathon0313/
├── backend/
│   ├── src/
│   │   ├── db/          # DB 초기화, 쿼리
│   │   ├── middleware/  # JWT 인증 미들웨어
│   │   ├── routes/      # auth, products, comments, messages, users
│   │   └── index.js     # 진입점
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # 공통 컴포넌트 (Nav, Card 등)
│   │   ├── pages/       # 각 페이지
│   │   ├── context/     # AuthContext
│   │   ├── api/         # Fetch 래퍼
│   │   └── main.tsx
│   └── package.json
├── PRD.md
└── ROADMAP.md
```

---

## 우선순위 메모

- 백엔드를 Day 1에 **완전히** 끝내야 Day 2~3가 원활함
- 디자인은 Day 3에 몰아서 적용 (기능 우선)
- 쪽지 기능(conversation_id 그룹핑)이 가장 복잡 — 백엔드 설계 시 주의
