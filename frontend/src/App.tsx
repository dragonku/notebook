import { useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { AuthPage } from './components/auth/AuthPage';
import { OnboardingForm } from './components/auth/OnboardingForm';

function App() {
  const { isAuthenticated, user, refreshTokenFn } = useAuth();

  // 앱 시작 시 토큰 갱신 시도
  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated && localStorage.getItem('accessToken')) {
        await refreshTokenFn();
      }
    };

    checkAuth();
  }, [isAuthenticated, refreshTokenFn]);

  // 인증되지 않은 경우 로그인 페이지 표시
  if (!isAuthenticated) {
    return <AuthPage onAuthSuccess={() => window.location.reload()} />;
  }

  // 온보딩이 필요한 경우
  if (user && !user.onboardingCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <OnboardingForm 
              onSuccess={() => {
                // 온보딩 완료 후 페이지 새로고침 (상태 업데이트 반영)
                window.location.reload();
              }} 
            />
          </div>
        </div>
      </div>
    );
  }

  // 메인 앱 (임시)
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-xl font-semibold text-gray-900">
              📚 BookNote
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                안녕하세요, {user?.nickname}님!
              </span>
              <button
                onClick={() => useAuth.getState().logout()}
                className="text-sm text-red-600 hover:text-red-700"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                BookNote 메인 대시보드
              </h2>
              <p className="text-gray-600 mb-4">
                독서 기록 기능이 곧 추가될 예정입니다.
              </p>
              <div className="text-sm text-gray-500 space-y-1">
                <p>사용자 ID: {user?.id}</p>
                <p>이메일: {user?.email}</p>
                <p>온보딩 완료: {user?.onboardingCompleted ? '✅' : '❌'}</p>
                {user?.readingGoalMonthly && (
                  <p>월간 독서 목표: {user.readingGoalMonthly}권</p>
                )}
                {user?.favoriteGenres && user.favoriteGenres.length > 0 && (
                  <p>선호 장르: {user.favoriteGenres.join(', ')}</p>
                )}
                {user?.privacyLevel && (
                  <p>공개 설정: {user.privacyLevel}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
