# Bubblet 개발 컨벤션

## 🏗️ 프로젝트 구조

```
bubblet/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── @modal/            # Parallel Routes - 모달
│   │   ├── api/               # API Routes
│   │   ├── bubbles/           # 버블 관련 페이지
│   │   ├── login/             # 로그인 페이지
│   │   ├── me/                # 마이페이지
│   │   ├── globals.css        # 전역 스타일
│   │   ├── layout.tsx         # 루트 레이아웃
│   │   └── page.tsx           # 메인 페이지
│   ├── components/            # 재사용 컴포넌트
│   └── lib/                   # 유틸리티 함수들
├── public/                    # 정적 파일들
└── docs/                      # 문서
```

## 🎯 핵심 기능

### 1. **버블 시스템**
- **랜덤 배치**: 버블들이 화면에 무작위로 배치
- **모달 인터셉트**: 버블 클릭 시 모달로 상세 보기
- **실시간 업데이트**: 새 버블 생성 시 즉시 반영

### 2. **인증 시스템**
- **카카오 로그인**: OAuth 2.0 기반
- **세션 관리**: 쿠키 기반 세션
- **자동 리다이렉트**: 로그인 후 원래 페이지로

### 3. **UI/UX**
- **반응형 디자인**: 모바일/데스크톱 대응
- **다크 테마**: 검은 배경 + 흰색 텍스트
- **애니메이션**: 버블 움직임 효과

## 🔧 기술 스택

### Frontend
- **Next.js 15**: App Router, Server Components
- **TypeScript**: 타입 안전성
- **Tailwind CSS**: 스타일링
- **React**: UI 라이브러리

### Backend
- **Supabase**: 데이터베이스, 인증
- **PostgreSQL**: 관계형 데이터베이스
- **Next.js API Routes**: 서버 API

### 인증
- **카카오 OAuth**: 소셜 로그인
- **쿠키 세션**: 서버 사이드 세션 관리

## 📝 코딩 컨벤션

### 1. **파일 명명**
- **컴포넌트**: PascalCase (`BubbleCard.tsx`)
- **페이지**: kebab-case (`[id]/page.tsx`)
- **API**: kebab-case (`route.ts`)
- **유틸리티**: camelCase (`session.ts`)

### 2. **컴포넌트 구조**
```tsx
// 1. 타입 정의
type Props = {
  // ...
};

// 2. 컴포넌트
export default function ComponentName({ prop }: Props) {
  // 3. 상태/훅
  const [state, setState] = useState();
  
  // 4. 이벤트 핸들러
  const handleClick = () => {
    // ...
  };
  
  // 5. 렌더링
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### 3. **API 구조**
```tsx
// 1. 타입 정의
type RequestData = {
  // ...
};

type ResponseData = {
  // ...
};

// 2. 핸들러
export async function POST(req: NextRequest) {
  try {
    // 3. 요청 처리
    const data: RequestData = await req.json();
    
    // 4. 비즈니스 로직
    const result = await processData(data);
    
    // 5. 응답
    return NextResponse.json(result);
  } catch (error) {
    // 6. 에러 처리
    return NextResponse.json({ error: "message" }, { status: 500 });
  }
}
```

## 🔐 보안

### 1. **환경 변수**
- **Public**: `NEXT_PUBLIC_*` (클라이언트 노출)
- **Private**: 일반 변수 (서버만)
- **Secrets**: 토큰/키는 `.env.*`(로컬), Vercel Env(운영)에만 저장

### 2. **인증 보안**
- **HTTPS**: 프로덕션에서만 쿠키 secure 플래그
- **CSRF**: SameSite 쿠키 설정
- **세션**: 서버 사이드 세션 검증

### 3. **데이터 검증**
- **입력 검증**: 모든 사용자 입력 검증
- **SQL Injection**: Supabase ORM 사용으로 방지
- **XSS**: React의 기본 이스케이핑 활용

## 🚀 배포

### 1. **Vercel 배포**
- **자동 배포**: GitHub 연동
- **환경 변수**: Vercel 대시보드에서 설정
- **도메인**: bubblet.kr

### 2. **환경별 설정**
- **개발**: `.env.local`
- **프로덕션**: Vercel Environment Variables

## 📊 데이터베이스

### 1. **테이블 구조**
```sql
-- 사용자 테이블
users (
  id UUID PRIMARY KEY,
  kakao_id TEXT UNIQUE NOT NULL,
  nickname TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 버블 테이블
bubbles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  emoji TEXT,
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 2. **RLS (Row Level Security)**
- **사용자 데이터**: 본인만 수정 가능
- **버블**: 모든 사용자가 읽기 가능, 작성자만 수정/삭제

## 🎨 UI/UX 가이드

### 1. **색상 팔레트**
- **배경**: `#000000` (검은색)
- **텍스트**: `#FFFFFF` (흰색)
- **강조**: `#FBBF24` (노란색)
- **투명도**: `rgba(255,255,255,0.1)` (반투명)

### 2. **타이포그래피**
- **제목**: Fraunces (serif)
- **본문**: Geist Sans (sans-serif)
- **코드**: Geist Mono (monospace)

### 3. **간격**
- **기본**: `1rem` (16px)
- **작은**: `0.5rem` (8px)
- **큰**: `2rem` (32px)

## 🔄 개발 워크플로우

### 1. **새 기능 개발**
1. 브랜치 생성: `feature/기능명`
2. 개발 및 테스트
3. PR 생성
4. 코드 리뷰
5. 머지

### 2. **버그 수정**
1. 브랜치 생성: `fix/버그명`
2. 수정 및 테스트
3. PR 생성
4. 코드 리뷰
5. 머지

### 3. **배포**
1. `main` 브랜치에 머지
2. Vercel 자동 배포
3. 프로덕션 테스트

## 📋 체크리스트

### 개발 환경 설정
- [ ] Node.js 18+ 설치
- [ ] npm/yarn 설치
- [ ] Git 설정
- [ ] VS Code 확장 설치

### 프로젝트 설정
- [ ] 저장소 클론
- [ ] 의존성 설치 (`npm install`)
- [ ] 환경 변수 설정
- [ ] 개발 서버 실행 (`npm run dev`)

### 환경 변수 설정
- [ ] Supabase 프로젝트 생성
- [ ] 카카오 개발자 앱 설정
- [ ] 로컬: `.env.local`
- [ ] .env / Vercel Env 동기화 완료

### 배포 준비
- [ ] Vercel 프로젝트 연결
- [ ] 환경 변수 설정
- [ ] 도메인 연결 (bubblet.kr)
- [ ] SSL 인증서 확인

## 🐛 문제 해결

### 1. **개발 서버 문제**
```bash
# 포트 충돌
lsof -ti:3000 | xargs kill -9

# 캐시 클리어
rm -rf .next
npm run dev
```

### 2. **환경 변수 문제**
- `.env.local` 파일 확인
- Vercel 환경 변수 확인
- 변수명 대소문자 확인

### 3. **데이터베이스 문제**
- Supabase 연결 확인
- RLS 정책 확인
- 테이블 구조 확인

## 📚 참고 자료

- [Next.js 공식 문서](https://nextjs.org/docs)
- [Supabase 문서](https://supabase.com/docs)
- [카카오 개발자 문서](https://developers.kakao.com)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
