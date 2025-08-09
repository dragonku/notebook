# 📚 BookNote - 개인기록 중심 독서 기록 앱

> 사용자가 읽은 책을 빠르게 기록하고, 되돌아보기/검색/통계에 최적화된 개인 서재를 제공합니다.

## 🛠 기술 스택

### Backend
- **Framework**: Spring Boot 3 (Java 21)
- **Database**: PostgreSQL 14 + Redis 7
- **Security**: Spring Security + JWT
- **Migration**: Flyway
- **Storage**: AWS S3

### Frontend
- **Framework**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query
- **Routing**: TanStack Router
- **Forms**: React Hook Form + Zod

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **Monitoring**: Spring Actuator + Prometheus

## 🚀 빠른 시작

### 사전 요구사항
- Docker & Docker Compose
- Node.js 20+
- Java 21+

### 로컬 개발 환경 설정

1. **저장소 클론**
   ```bash
   git clone <repository-url>
   cd notebook
   ```

2. **환경변수 설정**
   ```bash
   cp .env.sample .env
   # .env 파일을 수정하여 필요한 값들을 설정
   ```

3. **개발 서비스 실행**
   ```bash
   # 데이터베이스, Redis, LocalStack 실행
   docker-compose up -d
   ```

4. **백엔드 실행**
   ```bash
   cd backend
   ./gradlew bootRun
   ```

5. **프론트엔드 실행**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### 애플리케이션 접근

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080/api
- **API Documentation**: http://localhost:8080/api/swagger-ui.html

## 📁 프로젝트 구조

```
notebook/
├── backend/           # Spring Boot API 서버
│   ├── src/
│   ├── build.gradle
│   └── Dockerfile
├── frontend/          # React 클라이언트
│   ├── src/
│   ├── package.json
│   └── Dockerfile
├── docker/            # Docker 관련 설정
├── docs/              # 문서화
├── .github/workflows/ # CI/CD 파이프라인
└── docker-compose.yml # 로컬 개발환경
```

## 🔧 주요 기능

### MVP (P0)
- [x] 사용자 인증 (로그인/회원가입)
- [x] 도서 검색 및 등록
- [x] 독서 기록 CRUD
- [x] 기본 통계 및 리포트
- [x] 데이터 내보내기 (CSV/JSON)

### 향후 계획 (P1)
- [ ] 월별 회고 리포트
- [ ] 태그 자동 추천
- [ ] 데이터 가져오기
- [ ] OCR 하이라이트

## 🧪 테스트

```bash
# 백엔드 테스트
cd backend
./gradlew test

# 프론트엔드 테스트
cd frontend
npm test
```

## 📊 모니터링

- **Health Check**: http://localhost:8080/api/actuator/health
- **Metrics**: http://localhost:8080/api/actuator/metrics
- **Prometheus**: http://localhost:8080/api/actuator/prometheus

## 🔐 보안

- JWT 기반 인증/인가
- HTTPS 강제 적용
- 입력 데이터 검증
- 민감 정보 환경변수 관리

## 📝 라이센스

MIT License

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request