# API 문서

BookNote API는 RESTful 설계 원칙을 따르며, JSON 형식으로 데이터를 주고받습니다.

## Base URL
- **Local**: `http://localhost:8080/api`
- **Production**: `https://api.booknote.app/api`

## 인증

JWT Bearer Token을 사용합니다.

```http
Authorization: Bearer <access_token>
```

### 토큰 만료 시간
- **Access Token**: 15분
- **Refresh Token**: 14일

## API 엔드포인트

### 인증 (Authentication)

#### 회원가입
```http
POST /api/auth/signup

{
  "email": "user@example.com",
  "password": "password123",
  "nickname": "독서왕"
}
```

**Response:**
```http
201 Created

{
  "message": "회원가입이 완료되었습니다",
  "user": {
    "id": 1,
    "email": "user@example.com", 
    "nickname": "독서왕"
  }
}
```

#### 로그인
```http
POST /api/auth/login

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```http
200 OK

{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "nickname": "독서왕"
  }
}
```

#### 토큰 갱신
```http
POST /api/auth/refresh

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### 도서 (Books)

#### 도서 검색
```http
GET /api/books/search?q=해리포터&page=1&size=10
```

**Response:**
```http
200 OK

{
  "content": [
    {
      "id": 1,
      "title": "해리 포터와 마법사의 돌",
      "author": "J.K. 롤링",
      "publisher": "문학수첩",
      "isbn": "9788983920775",
      "coverUrl": "https://example.com/cover.jpg",
      "publishedDate": "2000-12-01"
    }
  ],
  "page": 1,
  "size": 10,
  "totalElements": 100,
  "totalPages": 10
}
```

#### 도서 상세 조회
```http
GET /api/books/{bookId}
```

### 독서 기록 (Records)

#### 기록 목록 조회
```http
GET /api/records?from=2024-01&to=2024-12&tags=소설&status=read&page=0&size=20
```

#### 기록 생성 (빠른 기록)
```http
POST /api/records

{
  "bookId": 1,
  "rating": 5,
  "status": "read",
  "readDate": "2024-08-09",
  "tags": ["소설", "판타지"],
  "review": "정말 재미있게 읽었습니다."
}
```

#### 기록 수정
```http
PUT /api/records/{recordId}

{
  "rating": 4,
  "review": "수정된 리뷰입니다."
}
```

#### 기록 삭제
```http
DELETE /api/records/{recordId}
```

### 통계 (Statistics)

#### 월별 통계
```http
GET /api/stats/monthly?month=2024-08
```

**Response:**
```http
200 OK

{
  "month": "2024-08",
  "totalBooks": 15,
  "averageRating": 4.2,
  "topTags": ["소설", "자기계발", "역사"],
  "genreDistribution": {
    "소설": 8,
    "자기계발": 4,
    "역사": 3
  }
}
```

#### 태그 통계
```http
GET /api/stats/tags?from=2024-01&to=2024-12
```

### 백업/복원 (Backup/Restore)

#### 데이터 내보내기
```http
GET /api/export?format=csv
GET /api/export?format=json
```

#### 데이터 가져오기
```http
POST /api/import
Content-Type: multipart/form-data

file: <csv_file>
```

## 에러 응답

모든 에러 응답은 다음 형식을 따릅니다:

```http
400 Bad Request

{
  "error": "VALIDATION_ERROR",
  "message": "입력값이 올바르지 않습니다",
  "details": [
    {
      "field": "email",
      "message": "유효한 이메일 형식이 아닙니다"
    }
  ],
  "timestamp": "2024-08-09T12:00:00Z"
}
```

### 에러 코드
- `400` - 잘못된 요청
- `401` - 인증 실패
- `403` - 권한 없음
- `404` - 리소스 없음
- `409` - 리소스 충돌 (중복)
- `429` - 요청 한도 초과
- `500` - 서버 오류