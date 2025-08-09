# Bubblet 배포 가이드

## 🚀 Vercel 배포 설정

### 1. 환경 변수 설정

Vercel 대시보드에서 다음 환경 변수들을 설정하세요:

#### 필수 환경 변수
```env
# 카카오 OAuth
KAKAO_CLIENT_ID=d368ba89d6843f1952a0f09a24b8e6fc
KAKAO_REDIRECT_URI=https://bubblet.kr/api/auth/kakao/callback

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://bqtksvbgrvxktnurheki.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=https://bqtksvbgrvxktnurheki.supabase.co
SUPABASE_SERVICE_ROLE=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxdGtzdmJncnZ4a3RudXJoZWtpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDcxNTc4MiwiZXhwIjoyMDcwMjkxNzgyfQ.YlniuyEZoXtCTEAySwj-ot7vGpftrydpQtOZuJmHOVI

# 사이트 설정
NEXT_PUBLIC_SITE_URL=https://bubblet.kr
NEXT_PUBLIC_WANT_EMAIL=false

# 세션 보안
SESSION_SECRET=4e5123c7a993f0c36c36b9d2f8a4c971f17d9b0480a0fd12b471eec87f3d39ac
```

### 2. 카카오 개발자 설정

1. [카카오 개발자 콘솔](https://developers.kakao.com)에 접속
2. 앱 설정 → 플랫폼 → Web 플랫폼 등록
3. 사이트 도메인에 `https://bubblet.kr` 추가
4. Redirect URI에 `https://bubblet.kr/api/auth/kakao/callback` 추가

### 3. 도메인 연결

1. Vercel 프로젝트 설정 → Domains
2. `bubblet.kr` 도메인 추가
3. DNS 설정 확인 (A 레코드 또는 CNAME)

### 4. 배포 확인

1. GitHub에 코드 푸시
2. Vercel 자동 배포 확인
3. `https://bubblet.kr`에서 사이트 동작 확인

## 🔧 로컬 개발 환경

### 환경 변수 (.env.local)
```env
# 개발 환경용
KAKAO_CLIENT_ID=d368ba89d6843f1952a0f09a24b8e6fc
KAKAO_REDIRECT_URI=http://localhost:3000/api/auth/kakao/callback

NEXT_PUBLIC_KAKAO_CLIENT_ID=d368ba89d6843f1952a0f09a24b8e6fc
NEXT_PUBLIC_KAKAO_REDIRECT_URI=http://localhost:3000/api/auth/kakao/callback

NEXT_PUBLIC_SUPABASE_URL=https://bqtksvbgrvxktnurheki.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=https://bqtksvbgrvxktnurheki.supabase.co
SUPABASE_SERVICE_ROLE=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxdGtzdmJncnZ4a3RudXJoZWtpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDcxNTc4MiwiZXhwIjoyMDcwMjkxNzgyfQ.YlniuyEZoXtCTEAySwj-ot7vGpftrydpQtOZuJmHOVI

NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_WANT_EMAIL=false
SESSION_SECRET=4e5123c7a993f0c36c36b9d2f8a4c971f17d9b0480a0fd12b471eec87f3d39ac
```

## 📋 배포 체크리스트

- [ ] Vercel 환경 변수 설정 완료
- [ ] 카카오 개발자 콘솔 설정 완료
- [ ] 도메인 연결 완료
- [ ] SSL 인증서 확인
- [ ] 로그인 기능 테스트
- [ ] 버블 생성/조회 기능 테스트
- [ ] 모바일 반응형 확인

## 🐛 문제 해결

### 배포 후 문제
1. **환경 변수 확인**: Vercel 대시보드에서 모든 변수 설정 확인
2. **카카오 설정 확인**: Redirect URI가 정확한지 확인
3. **도메인 확인**: DNS 설정이 올바른지 확인

### 로컬 개발 문제
1. **포트 충돌**: `lsof -ti:3000 | xargs kill -9`
2. **캐시 문제**: `rm -rf .next && npm run dev`
3. **환경 변수**: `.env.local` 파일 확인
