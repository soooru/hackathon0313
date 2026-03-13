# 출근장터 - Product Requirements Document

> 마지막 업데이트: 2026-03-13

## 1. 프로젝트 개요

- 출근장터는 회사 내부 구성원만 사용할 수 있는 사내 중고거래 플랫폼입니다.
- 직원들이 사용하지 않는 물건을 판매하거나, 필요한 물건을 요청하거나, 나눕니다 또는 같이삽시다를 진행할 수 있는 회사 전용 장터 서비스입니다.
- 서비스 이름처럼 출근하면 열리고 퇴근하면 닫히는 장터라는 컨셉을 가지고 있습니다.

---

## 2. 기술 스택

### 백엔드
- Runtime: Node.js / Framework: Express.js / Language: JavaScript
- DB: SQLite (better-sqlite3, WAL 모드, foreign_keys ON)
- Auth: JWT (jsonwebtoken, 24h 만료) + bcryptjs (salt rounds: 10)

### 프론트엔드
- Framework: React 18 / Routing: React Router v6 / Language: TypeScript
- Build: Vite (proxy `/api` → `localhost:3000`, `host: true` for LAN 공유)
- 스타일: 인라인 CSS (싸이월드 레트로, 스타일 파일 분리 `.styles.ts`)
- 폰트: Google Fonts "Gowun Dodum"

---

## 3. 구현 완료 기능 (v1.0)

### 3.1 인증
- 회원가입: 이메일(사내 도메인 검증) + 닉네임 + 비밀번호(영문+숫자 6자+)
- **이메일 인증 (mock)**: presignup 유효성 검사 → 팝업에 인증코드 1234 표시 → 입력 후 실제 가입 진행
- 로그인: JWT 토큰 발급, localStorage 저장
- 비로그인 사용자 전체 라우트 차단 (PrivateRoute)
- **회원탈퇴**: 계정 삭제, 작성 게시글·댓글은 user_id=NULL로 유지 ("탈퇴한 사용자" 표시)

### 3.2 상품 목록
- 태그 필터 (팝니다 / 삽니다 / 나눕니다 / 같이삽시다 / 전체)
- 제목·닉네임 검색, 페이지네이션 (12개)
- **완료 상품 보기 체크박스** (기본: 숨김)
- 카드: 태그 뱃지, 금액, 설명, 댓글 수, 최신 댓글 1개, 날짜(우측 상단)
- 같이삽시다 카드: 참여 인원 N/M 표시
- 완료 카드: 회색 테두리 + 비활성 스타일

### 3.3 상품 등록·수정
- 태그: 팝니다 / 삽니다 / 나눕니다 / 같이삽시다
- 금액 (선택, 나눕니다 제외) + 흥정 가능 체크박스
- 같이삽시다: 최대 인원 입력 가능
- 상태: 가능 / 완료 (수정 폼에서 변경 가능)

### 3.4 상품 상세
- 금액 + 흥정 가능 뱃지 표시
- **상태 토글 버튼** (소유자만): 가능 ↔ 완료 전환
- **완료 상태**: 수정·삭제 버튼 hide
- **⋮ 드롭다운** (소유자이고 완료가 아닐 때): 수정 / 삭제
- 쪽지 보내기 (비소유자): disabled, "준비 중"
- 댓글 (1depth): 작성·목록, 닉네임 표시

### 3.5 같이삽시다
- 참여 인원 표시 (N / M명)
- **한 배에 타기** / **배에서 하차하기** 버튼 (비소유자)
- 인원 마감 시 소유자에게 **⚓ 출항** 버튼 노출
- 출항 팝업: 참여자 이메일·닉네임 목록 + "메일 전송" 버튼 (UI만)

### 3.6 마이페이지
- 닉네임·이메일·가입일 표시
- 내 상품 목록
- 회원탈퇴 버튼 (하단) → "진짜로 날 떠날거야?" 확인 다이얼로그 (남기 / 떠나기)

### 3.7 네비게이션
- 데스크탑: 로고 | 홈 | 상품등록 | 쪽지(준비중) + 우측 닉네임 드롭다운
- **모바일 (640px 이하)**: 햄버거 아이콘 | 출근장터 로고 | 사람 아이콘

### 3.8 기타
- Open Graph 메타 태그 + OG 이미지 (SVG)
- 탈퇴 사용자 게시글·댓글: "탈퇴한 사용자" 표시
- 쪽지 기능: DB 스키마 준비, API 501 반환 (v2.0 대비)

---

## 4. API 명세

### 인증

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | /api/auth/presignup | 가입 전 유효성 검사 (도메인·중복 확인) |
| POST | /api/auth/signup | 회원가입 (계정 생성 + JWT 발급) |
| POST | /api/auth/login | 로그인 (JWT 발급) |
| GET | /api/auth/me | 내 정보 조회 |

### 상품

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | /api/products | 상품 목록 (search, tag, page, showDone) |
| GET | /api/products/:id | 상품 상세 |
| POST | /api/products | 상품 등록 |
| PUT | /api/products/:id | 상품 수정 (본인만) |
| DELETE | /api/products/:id | 상품 삭제 (본인만) |

### 댓글

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | /api/products/:id/comments | 댓글 목록 |
| POST | /api/products/:id/comments | 댓글 작성 |

### 같이삽시다

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | /api/products/:id/join | 현재 유저 참여 여부 |
| POST | /api/products/:id/join | 한 배에 타기 |
| DELETE | /api/products/:id/join | 배에서 하차하기 |
| GET | /api/products/:id/participants | 참여자 목록 (작성자만) |

### 유저

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | /api/users/me/products | 내 등록 상품 목록 |
| DELETE | /api/users/me | 회원탈퇴 |

### 쪽지 (v2.0 skeleton)

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | /api/messages | 501 Not Implemented |
| GET | /api/messages/:id | 501 Not Implemented |
| POST | /api/messages | 501 Not Implemented |

---

## 5. 데이터베이스 스키마

### users
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INTEGER PK | 자동증가 |
| email | TEXT UNIQUE NOT NULL | 회사 이메일 |
| nickname | TEXT UNIQUE NOT NULL | 공개 닉네임 |
| password_hash | TEXT NOT NULL | bcryptjs 해시 |
| created_at | TEXT | 가입일 |

### products
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INTEGER PK | 자동증가 |
| user_id | INTEGER FK | 작성자 (탈퇴 시 NULL, ON DELETE SET NULL) |
| title | TEXT NOT NULL | 제목 |
| description | TEXT NOT NULL | 설명 |
| tag | TEXT | 팝니다/삽니다/나눕니다/같이삽시다 |
| status | TEXT | 가능(default)/완료 |
| price | INTEGER | 금액 (선택) |
| is_negotiable | INTEGER | 흥정 가능 (0/1) |
| max_participants | INTEGER | 최대 인원 (같이삽시다) |
| created_at / updated_at | TEXT | 일시 |

### comments
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INTEGER PK | 자동증가 |
| product_id | INTEGER FK | 상품 (ON DELETE CASCADE) |
| user_id | INTEGER FK | 작성자 (탈퇴 시 NULL, ON DELETE SET NULL) |
| content | TEXT NOT NULL | 댓글 내용 |
| created_at | TEXT | 작성일 |

### group_buy_participants
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INTEGER PK | 자동증가 |
| product_id | INTEGER FK | 게시글 (ON DELETE CASCADE) |
| user_id | INTEGER FK | 참여자 (ON DELETE CASCADE) |
| created_at | TEXT | 참여일 |
| UNIQUE(product_id, user_id) | | 중복 방지 |

### allowed_domains
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INTEGER PK | 자동증가 |
| domain | TEXT UNIQUE | 허용 도메인 (현재: company.co.kr) |

### messages (v2.0 skeleton)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INTEGER PK | 자동증가 |
| sender_id / receiver_id | INTEGER FK | 발신/수신자 |
| product_id | INTEGER FK | 관련 상품 (nullable) |
| content | TEXT NOT NULL | 내용 |
| is_read | INTEGER | 읽음 여부 |
| created_at | TEXT | 작성일 |

---

## 6. 이메일 인증 구현 계획 (다음 작업)

> 현재: mock 코드(1234) / 목표: 실제 이메일 발송 + 백도어 코드(B1234)

### 6.1 서비스 선택 비교

| 서비스 | 무료 한도 | 난이도 | 비고 |
|--------|-----------|--------|------|
| **Resend** | 3,000건/월, 100건/일 | ⭐ 매우 쉬움 | REST API, Node.js SDK 제공, 추천 |
| Nodemailer + Gmail | 무제한 (개인 계정) | ⭐⭐ 보통 | Google App Password 설정 필요, 스팸 분류 위험 |
| SendGrid | 100건/일 | ⭐⭐ 보통 | 도메인 인증 필요, 셋업 복잡 |
| Brevo | 300건/일 | ⭐⭐ 보통 | 무료 플랜 충분 |

**추천: Resend**
- API key 발급 즉시 사용 가능 (도메인 없어도 `onboarding@resend.dev`로 테스트 발송 가능)
- `npm install resend` 한 줄로 설치
- 코드 5줄이면 발송 완료

### 6.2 구현 흐름

```
[회원가입 폼 제출]
      ↓
POST /api/auth/send-code
  - presignup 유효성 검사 (도메인, 중복)
  - 6자리 OTP 생성 (ex: 482910)
  - 서버 메모리(Map)에 { code, expiresAt: +5분 } 저장
  - Resend로 이메일 발송
  - 발송 실패해도 200 반환 (백도어 코드로 대응)
      ↓
[프론트: 인증코드 입력 팝업]
      ↓
POST /api/auth/verify-code  { email, code }
  - 'B1234' 입력 시 무조건 통과 (백도어)
  - 그 외: Map에서 코드 조회, 만료 확인, 일치 여부 확인
  - 성공 시 단기 검증 토큰 반환 (or 그냥 ok: true)
      ↓
POST /api/auth/signup  (기존 엔드포인트 재사용)
  - 계정 생성 + JWT 발급
```

### 6.3 필요 작업

**Backend**
- `npm install resend`
- `.env` 파일: `RESEND_API_KEY=re_xxxx`
- `routes/auth.js`:
  - `POST /api/auth/send-code` 추가 (코드 생성 + 이메일 발송 + 메모리 저장)
  - `POST /api/auth/verify-code` 추가 (코드 검증, 백도어 B1234 처리)
- `index.js`: `dotenv` 로드 (`npm install dotenv`)

**Frontend**
- `SignupPage.tsx`: `presignup` 호출 → `send-code` 호출로 변경
- 인증코드 팝업: 안내 문구 변경 ("이메일을 확인해주세요. 스팸함도 확인!")
- 백도어 힌트는 팝업에 조용히 표시 ("메일이 오지 않으면: B1234 입력")

---

## 7. 향후 계획 (v2.0)

- **쪽지 기능**: 판매자-구매자 간 1:1 쪽지함
- 상품 이미지 업로드
- 관심 상품 찜하기
- 사용자 평가/후기
- 관리자 페이지 (allowed_domains 관리)
- 이메일 인증 코드 DB 저장 (현재 메모리 → 서버 재시작 시 유지)
