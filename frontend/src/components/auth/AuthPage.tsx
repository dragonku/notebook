import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';

type AuthMode = 'login' | 'signup';

interface AuthPageProps {
  onAuthSuccess?: () => void;
}

export function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const [mode, setMode] = useState<AuthMode>('login');

  const handleSuccess = () => {
    onAuthSuccess?.();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {mode === 'login' ? (
            <LoginForm
              onSuccess={handleSuccess}
              onSwitchToSignup={() => setMode('signup')}
            />
          ) : (
            <SignupForm
              onSuccess={handleSuccess}
              onSwitchToLogin={() => setMode('login')}
            />
          )}
        </div>
      </div>
      
      {/* BookNote 로고/브랜딩 */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          📚 BookNote - 개인기록 중심 독서 기록 앱
        </p>
      </div>
    </div>
  );
}