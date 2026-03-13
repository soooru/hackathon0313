# 출근장터 — Product Requirements Document

> 마지막 업데이트: 2026-03-13 / v1.0 완료

## 1. 프로젝트 개요

출근장터는 회사 내부 구성원만 사용할 수 있는 사내 중고거래 플랫폼입니다.
직원들이 사용하지 않는 물건을 판매하거나, 필요한 물건을 요청하거나, 나누거나, 공동구매를 진행할 수 있는 회사 전용 장터 서비스입니다.
서비스 이름처럼 출근하면 열리고 퇴근하면 닫히는 장터라는 컨셉을 가지고 있습니다.

---

## 2. 기술 스택

| 영역 | 기술 |
|------|------|
| Backend Runtime | Node.js / Express.js / JavaScript |
| Database | SQLite (better-sqlite3, WAL 모드, foreign_keys ON) |
| 인증 | JWT (jsonwebtoken, 24h 만료) + bcryptjs (salt rounds: 10) |
| 이메일 | Resend (OTP 발송, 무료 플랜) |
| Frontend | React 18 / TypeScript / Vite / React Router v6 |
| 스타일 | 인라인 CSS (싸이월드 레트로), `.styles.ts` 파일 분리 |
| 폰트 | Google Fonts "Gowun Dodum" |
| 배포 | Vercel (프론트) + Render (백엔드) |

---

## 3. 구현 기능 (v1.0)

### 3.1 인증

- **회원가입**: 이메일(사내 도메인 검증) + 닉네임 + 비밀번호(영문+숫자 6자+)
- **이메일 인증**: `POST /api/auth/send-code` → Resend로 6자리 OTP 발송 (5분 TTL, 서버 메모리 저장) → `POST /api/auth/verify-code` 검증
- **백도어**: `B1234` 입력 시 무조건 통과 (이메일 미수신 대비)
- **로그인**: JWT 토큰 발급, localStorage 저장
- **비로그인 차단**: PrivateRoute로 전체 라우트 보호
- **회원탈퇴**: 계정 삭제. 게시글·댓글은 `user_id = NULL`로 유지 ("탈퇴한 사용자" 표시). 쪽지는 원본 sender_id/receiver_id 보존 (LEFT JOIN으로 "탈퇴한 사용자" 표시). 재가입 시 신규 계정으로 처리.

### 3.2 상품 목록

- 태그 필터: 팝니다 / 삽니다 / 나눕니다 / 같이삽시다 / 전체
- 제목·닉네임 검색, 페이지네이션 (12개)
- **완료 상품 보기** 체크박스 (기본: 숨김)
- 카드: 태그 뱃지, 금액, 설명, 댓글 수, 최신 댓글 1개, 날짜(우측 상단)
- 같이삽시다 카드: 참여 인원 N/M 표시
- 완료 카드: 회색 테두리 + 비활성 스타일

### 3.3 상품 등록·수정

- 태그: 팝니다 / 삽니다 / 나눕니다 / 같이삽시다
- 금액 (선택, 나눕니다 제외) + 흥정 가능 체크박스
- 같이삽시다: 최대 인원 입력
- 상태: 가능 / 완료 (수정 폼에서 변경 가능)

### 3.4 상품 상세

- 금액 + 흥정 가능 뱃지
- **상태 토글 버튼** (소유자만): 가능 ↔ 완료
- **완료 상태**: 수정·삭제 버튼 숨김
- **⋮ 드롭다운** (소유자이고 완료가 아닐 때): 수정 / 삭제
- **✉️ 쪽지 보내기** (비소유자): 클릭 시 모달 → 전송 후 쪽지함 이동
- 댓글 (1depth): 작성·목록, 닉네임 표시

### 3.5 같이삽시다

- 참여 인원 표시 (N / M명)
- **한 배에 타기** / **배에서 하차하기** 버튼 (비소유자)
- 인원 마감 시 소유자에게 **⚓ 출항** 버튼 노출
- 출항 팝업: 참여자 이메일·닉네임 목록 + "메일 전송" 버튼 (UI만)

### 3.6 쪽지

- **쪽지함** (`/messages`): 대화 목록 (상대 닉네임, 관련 상품, 마지막 메시지, 읽지 않은 수)
- **대화 상세** (`/messages/:partnerId`): 채팅 스타일 스레드, 진입 시 읽음 처리, Enter 전송
- **Nav 뱃지**: 읽지 않은 쪽지 수 표시, 라우트 이동 시 갱신

### 3.7 마이페이지

- 닉네임·이메일·가입일 표시
- 내 상품 목록
- 회원탈퇴 → "진짜로 날 떠날거야?" 확인 다이얼로그

### 3.8 네비게이션

- **데스크탑**: 로고 | 홈 | 상품등록 | 쪽지(뱃지) + 우측 닉네임 드롭다운
- **모바일 (640px 이하)**: 햄버거 메뉴 | 로고 | 사람 아이콘

### 3.9 기타

- Open Graph 메타 태그 + SVG OG 이미지
- 탈퇴 사용자 게시글·댓글·쪽지: "탈퇴한 사용자" 표시

---

## 4. API 명세

### 인증

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | /api/auth/send-code | 유효성 검사 + OTP 이메일 발송 |
| POST | /api/auth/verify-code | OTP 검증 (B1234 백도어) |
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

### 쪽지

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | /api/messages | 내 대화 목록 |
| GET | /api/messages/unread-count | 읽지 않은 쪽지 수 |
| GET | /api/messages/:partnerId | 특정 상대와의 대화 (읽음 처리) |
| POST | /api/messages | 쪽지 보내기 |

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
| id | INTEGER PK | |
| user_id | INTEGER FK | 탈퇴 시 NULL (ON DELETE SET NULL) |
| title | TEXT NOT NULL | |
| description | TEXT NOT NULL | |
| tag | TEXT | 팝니다/삽니다/나눕니다/같이삽시다 |
| status | TEXT | 가능(default)/완료 |
| price | INTEGER | 금액 (선택) |
| is_negotiable | INTEGER | 흥정 가능 (0/1) |
| max_participants | INTEGER | 최대 인원 (같이삽시다) |
| created_at / updated_at | TEXT | |

### comments
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INTEGER PK | |
| product_id | INTEGER FK | ON DELETE CASCADE |
| user_id | INTEGER FK | 탈퇴 시 NULL (ON DELETE SET NULL) |
| content | TEXT NOT NULL | |
| created_at | TEXT | |

### group_buy_participants
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INTEGER PK | |
| product_id | INTEGER FK | ON DELETE CASCADE |
| user_id | INTEGER FK | ON DELETE CASCADE |
| created_at | TEXT | |
| UNIQUE(product_id, user_id) | | 중복 방지 |

### messages
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INTEGER PK | |
| sender_id | INTEGER | FK 없음 — 탈퇴 후에도 원본 ID 보존 |
| receiver_id | INTEGER | FK 없음 — 탈퇴 후에도 원본 ID 보존 |
| product_id | INTEGER FK | ON DELETE SET NULL |
| content | TEXT NOT NULL | |
| is_read | INTEGER | 읽음 여부 (0/1) |
| created_at | TEXT | |

### allowed_domains
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INTEGER PK | |
| domain | TEXT UNIQUE | 허용 도메인 (현재: ubcare.co.kr) |

---

## 6. 향후 계획 (v2.0)

- 상품 이미지 업로드
- 관심 상품 찜하기
- 사용자 평가 / 후기
- 관리자 페이지 (allowed_domains 관리)
- 이메일 인증 코드 DB 저장 (현재 서버 메모리 → 재시작 시 유지)
- 실시간 쪽지 알림 (Socket.io)
