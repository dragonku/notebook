# 개발 가이드

## 로컬 개발 환경 설정

### 1. 사전 요구사항
- Docker & Docker Compose
- Node.js 20+
- Java 21+
- Git

### 2. 프로젝트 클론 및 설정
```bash
git clone https://github.com/dragonku/notebook.git
cd notebook
cp .env.sample .env
# .env 파일에서 필요한 환경변수 설정
```

### 3. 개발 서비스 시작
```bash
# 데이터베이스 및 캐시 서비스 시작
docker-compose up -d

# 서비스 상태 확인
docker-compose ps
```

### 4. 백엔드 실행
```bash
cd backend
./gradlew bootRun
```

### 5. 프론트엔드 실행
```bash
cd frontend
npm install
npm run dev
```

## 개발 워크플로우

### 브랜치 전략
- `master`: 프로덕션 브랜치
- `develop`: 개발 브랜치
- `feature/*`: 기능 개발 브랜치
- `hotfix/*`: 긴급 수정 브랜치

### 커밋 메시지 규칙
```
type(scope): subject

body

footer
```

**Types:**
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 스타일 변경
- `refactor`: 리팩토링
- `test`: 테스트 추가/수정
- `chore`: 빌드/설정 변경

### 코드 리뷰 체크리스트
- [ ] 모든 테스트가 통과하는가?
- [ ] 코드 스타일 가이드를 준수하는가?
- [ ] 보안 취약점은 없는가?
- [ ] 성능에 부정적인 영향은 없는가?
- [ ] 문서가 업데이트되었는가?

## 트러블슈팅

### 자주 발생하는 문제들

#### 1. Docker 서비스 연결 실패
```bash
# 컨테이너 로그 확인
docker-compose logs postgres
docker-compose logs redis

# 재시작
docker-compose down
docker-compose up -d
```

#### 2. 백엔드 포트 충돌
```bash
# 8080 포트를 사용하는 프로세스 확인
lsof -i :8080
# 프로세스 종료 후 재실행
```

#### 3. 프론트엔드 의존성 문제
```bash
# 노드 모듈 재설치
rm -rf node_modules package-lock.json
npm install
```

#### 4. 데이터베이스 마이그레이션 실패
```bash
# 데이터베이스 리셋
docker-compose down -v
docker-compose up -d postgres
# 마이그레이션 다시 실행
cd backend && ./gradlew flywayMigrate
```