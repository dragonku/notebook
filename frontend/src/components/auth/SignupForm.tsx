import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../hooks/useAuth';
import { authApi } from '../../api/auth';
import { ApiError } from '../../api/client';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

const signupSchema = z.object({
  email: z
    .string()
    .min(1, '이메일을 입력해주세요')
    .email('올바른 이메일 형식을 입력해주세요'),
  password: z
    .string()
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
    .regex(/^(?=.*[A-Za-z])(?=.*\d)/, '영문과 숫자를 포함해야 합니다'),
  confirmPassword: z
    .string()
    .min(1, '비밀번호 확인을 입력해주세요'),
  nickname: z
    .string()
    .min(2, '닉네임은 최소 2자 이상이어야 합니다')
    .max(20, '닉네임은 20자를 초과할 수 없습니다'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "비밀번호가 일치하지 않습니다",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export function SignupForm({ onSuccess, onSwitchToLogin }: SignupFormProps) {
  const [submitError, setSubmitError] = useState<string>('');
  const [emailCheckStatus, setEmailCheckStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [nicknameCheckStatus, setNicknameCheckStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  
  const { signup, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const watchedEmail = watch('email');
  const watchedNickname = watch('nickname');

  // 이메일 중복 체크
  useEffect(() => {
    const checkEmail = async () => {
      if (!watchedEmail || errors.email || emailCheckStatus === 'checking') {
        return;
      }

      setEmailCheckStatus('checking');
      
      try {
        const result = await authApi.checkEmail(watchedEmail);
        setEmailCheckStatus(result.available ? 'available' : 'taken');
      } catch {
        setEmailCheckStatus('idle');
      }
    };

    const timeoutId = setTimeout(checkEmail, 500);
    return () => clearTimeout(timeoutId);
  }, [watchedEmail, errors.email, emailCheckStatus]);

  // 닉네임 중복 체크
  useEffect(() => {
    const checkNickname = async () => {
      if (!watchedNickname || errors.nickname || nicknameCheckStatus === 'checking') {
        return;
      }

      setNicknameCheckStatus('checking');
      
      try {
        const result = await authApi.checkNickname(watchedNickname);
        setNicknameCheckStatus(result.available ? 'available' : 'taken');
      } catch {
        setNicknameCheckStatus('idle');
      }
    };

    const timeoutId = setTimeout(checkNickname, 500);
    return () => clearTimeout(timeoutId);
  }, [watchedNickname, errors.nickname, nicknameCheckStatus]);

  const onSubmit = async (data: SignupFormData) => {
    // 최종 중복 체크
    if (emailCheckStatus === 'taken' || nicknameCheckStatus === 'taken') {
      setSubmitError('이메일 또는 닉네임이 이미 사용 중입니다');
      return;
    }

    try {
      setSubmitError('');
      await signup({
        email: data.email,
        password: data.password,
        nickname: data.nickname,
      });
      onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof ApiError 
        ? error.message 
        : '회원가입 중 오류가 발생했습니다';
      setSubmitError(errorMessage);
    }
  };

  const getEmailHelperText = () => {
    if (emailCheckStatus === 'checking') return '이메일 중복을 확인하는 중...';
    if (emailCheckStatus === 'available') return '✓ 사용 가능한 이메일입니다';
    if (emailCheckStatus === 'taken') return '이미 사용 중인 이메일입니다';
    return '';
  };

  const getNicknameHelperText = () => {
    if (nicknameCheckStatus === 'checking') return '닉네임 중복을 확인하는 중...';
    if (nicknameCheckStatus === 'available') return '✓ 사용 가능한 닉네임입니다';
    if (nicknameCheckStatus === 'taken') return '이미 사용 중인 닉네임입니다';
    return '';
  };

  const isFormValid = emailCheckStatus === 'available' && nicknameCheckStatus === 'available';

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">회원가입</h1>
        <p className="text-gray-600 mt-2">BookNote와 함께 독서 기록을 시작하세요</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          {...register('email')}
          type="email"
          label="이메일"
          placeholder="example@email.com"
          error={errors.email?.message || (emailCheckStatus === 'taken' ? '이미 사용 중인 이메일입니다' : '')}
          helperText={getEmailHelperText()}
          autoComplete="email"
        />

        <Input
          {...register('password')}
          type="password"
          label="비밀번호"
          placeholder="영문, 숫자 포함 8자 이상"
          error={errors.password?.message}
          helperText="영문과 숫자를 포함하여 8자 이상 입력해주세요"
          autoComplete="new-password"
        />

        <Input
          {...register('confirmPassword')}
          type="password"
          label="비밀번호 확인"
          placeholder="비밀번호를 다시 입력하세요"
          error={errors.confirmPassword?.message}
          autoComplete="new-password"
        />

        <Input
          {...register('nickname')}
          label="닉네임"
          placeholder="2-20자 사이의 닉네임"
          error={errors.nickname?.message || (nicknameCheckStatus === 'taken' ? '이미 사용 중인 닉네임입니다' : '')}
          helperText={getNicknameHelperText()}
        />

        {submitError && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            {submitError}
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          isLoading={isLoading}
          disabled={isLoading || !isFormValid}
        >
          회원가입
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          이미 계정이 있으신가요?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            로그인
          </button>
        </p>
      </div>
    </div>
  );
}