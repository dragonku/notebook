# BookNote 배포 가이드

이 문서는 BookNote 애플리케이션을 Vercel(프론트엔드)과 Railway(백엔드)에 배포하는 방법을 안내합니다.

## 배포 아키텍처

- **프론트엔드**: Vercel (React + Vite)
- **백엔드**: Railway (Spring Boot)
- **데이터베이스**: Railway PostgreSQL
- **캐시**: Railway Redis
- **파일 저장소**: AWS S3 (또는 Cloudinary)

## 1. 백엔드 배포 (Railway)

### Railway 프로젝트 생성
1. [Railway](https://railway.app) 계정 생성 및 로그인
2. "New Project" → "Deploy from GitHub repo" 선택
3. 이 GitHub 저장소 연결

### 환경변수 설정
Railway 프로젝트에서 다음 환경변수들을 설정합니다:

```bash
# Database (Railway에서 자동 생성됨)
POSTGRES_URL=postgresql://user:password@host:port/database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-password

# Redis (Railway에서 자동 생성됨)  
REDIS_HOST=redis-host
REDIS_PORT=6379

# JWT Configuration
JWT_SECRET=your-super-long-secret-key-at-least-32-characters
JWT_ACCESS_TTL_MIN=15
JWT_REFRESH_TTL_DAY=14

# Spring Profile
SPRING_PROFILES_ACTIVE=prod

# AWS S3 (선택사항)
AWS_REGION=ap-northeast-2
S3_BUCKET=booknote-prod
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key

# External APIs (선택사항)
KAKAO_REST_API_KEY=your-kakao-key
NAVER_CLIENT_ID=your-naver-id
NAVER_CLIENT_SECRET=your-naver-secret
```

### 데이터베이스 및 Redis 추가
1. Railway 프로젝트에서 "Add Service" 클릭
2. "Database" → "PostgreSQL" 선택
3. "Add Service" → "Database" → "Redis" 선택

### 배포 설정
Railway는 자동으로 `railway.json` 설정을 읽고 빌드/배포합니다:
- 빌드 명령어: `cd backend && ./gradlew build -x test`
- 시작 명령어: `cd backend && java -jar build/libs/booknote-0.0.1-SNAPSHOT.jar`
- 헬스체크: `/api/actuator/health`

## 2. 프론트엔드 배포 (Vercel)

### Vercel 프로젝트 생성
1. [Vercel](https://vercel.com) 계정 생성 및 로그인
2. "New Project" 선택
3. GitHub 저장소 import
4. Framework Preset: "Vite" 선택
5. Root Directory: `frontend` 설정

### 환경변수 설정
Vercel 프로젝트 설정에서 다음 환경변수를 추가합니다:

```bash
VITE_API_URL=https://your-railway-app.railway.app/api
```

### 빌드 설정
Vercel은 자동으로 다음 설정을 사용합니다:
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

## 3. 도메인 연결 (선택사항)

### 백엔드 도메인
Railway에서 제공하는 기본 도메인을 사용하거나 커스텀 도메인을 연결할 수 있습니다.

### 프론트엔드 도메인
Vercel에서 제공하는 기본 도메인을 사용하거나 커스텀 도메인을 연결할 수 있습니다.

## 4. CI/CD 설정

### 자동 배포
- **Railway**: main 브랜치에 push하면 자동 배포
- **Vercel**: main 브랜치에 push하면 자동 배포

### 환경별 배포
- `main` 브랜치: 프로덕션 환경
- `develop` 브랜치: 스테이징 환경 (선택사항)

## 5. 모니터링 설정

### 백엔드 모니터링
Railway 대시보드에서 다음을 모니터링할 수 있습니다:
- CPU/메모리 사용량
- 응답시간
- 로그
- 메트릭스 (`/api/actuator/metrics`)

### 프론트엔드 모니터링
Vercel Analytics로 다음을 모니터링할 수 있습니다:
- 페이지 로드 시간
- 사용자 트래픽
- Core Web Vitals

## 6. 배포 확인

### 백엔드 헬스체크
```bash
curl https://your-railway-app.railway.app/api/actuator/health
```

### 프론트엔드 확인
브라우저에서 Vercel 도메인에 접속하여 애플리케이션이 정상적으로 로드되는지 확인합니다.

## 트러블슈팅

### 일반적인 문제
1. **데이터베이스 연결 오류**: 환경변수 확인
2. **CORS 오류**: 백엔드에서 프론트엔드 도메인 허용 설정
3. **빌드 오류**: 의존성 버전 충돌 확인
4. **메모리 부족**: Railway 플랜 업그레이드 고려

### 로그 확인
- **Railway**: 프로젝트 대시보드에서 실시간 로그 확인
- **Vercel**: Functions 탭에서 로그 확인

## 보안 고려사항

1. JWT 시크릿 키를 충분히 길고 복잡하게 설정
2. 데이터베이스 비밀번호를 강력하게 설정
3. CORS 설정을 프론트엔드 도메인으로 제한
4. HTTPS 사용 (Railway, Vercel 모두 기본 제공)
5. 환경변수로 민감한 정보 관리