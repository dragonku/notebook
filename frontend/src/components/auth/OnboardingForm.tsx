import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../hooks/useAuth';
import { userApi, ApiError } from '../../api';
import { Button, Input, Select, Checkbox } from '../ui';
import { PrivacyLevel, GENRE_LABELS, PRIVACY_LABELS } from '../../types/user';

const onboardingSchema = z.object({
  favoriteGenres: z
    .array(z.string())
    .min(1, '최소 1개 이상의 선호 장르를 선택해주세요')
    .max(5, '최대 5개까지 선택 가능합니다'),
  readingGoalMonthly: z
    .number()
    .min(1, '월간 독서 목표는 최소 1권 이상이어야 합니다')
    .max(100, '월간 독서 목표는 최대 100권까지 설정 가능합니다'),
  privacyLevel: z.string(),
});

type OnboardingFormData = z.infer<typeof onboardingSchema>;

interface OnboardingFormProps {
  onSuccess?: () => void;
}

export function OnboardingForm({ onSuccess }: OnboardingFormProps) {
  const [submitError, setSubmitError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      favoriteGenres: [],
      readingGoalMonthly: 5,
      privacyLevel: PrivacyLevel.PRIVATE,
    },
  });

  const watchedGenres = watch('favoriteGenres');

  const handleGenreChange = (genre: string, checked: boolean) => {
    const currentGenres = watchedGenres || [];
    
    if (checked) {
      if (currentGenres.length < 5) {
        return [...currentGenres, genre];
      } else {
        return currentGenres;
      }
    } else {
      return currentGenres.filter(g => g !== genre);
    }
  };

  const onSubmit = async (data: OnboardingFormData) => {
    try {
      setIsLoading(true);
      setSubmitError('');
      
      const updatedUser = await userApi.completeOnboarding(data);
      
      // 사용자 정보 업데이트 (온보딩 완료 표시)
      const authState = useAuth.getState();
      if (authState.user) {
        authState.setUser(updatedUser);
      }
      
      onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof ApiError 
        ? error.message 
        : '프로필 설정 중 오류가 발생했습니다';
      setSubmitError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const privacyOptions = Object.entries(PRIVACY_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">프로필 설정</h1>
        <p className="text-gray-600 mt-2">
          {user?.nickname}님만의 독서 취향을 알려주세요
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* 선호 장르 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            선호 장르 (최대 5개)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(GENRE_LABELS).map(([genre, label]) => (
              <Controller
                key={genre}
                name="favoriteGenres"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    label={label}
                    checked={field.value?.includes(genre) || false}
                    onChange={(e) => {
                      const newGenres = handleGenreChange(genre, e.target.checked);
                      field.onChange(newGenres);
                    }}
                    disabled={
                      !field.value?.includes(genre) && 
                      (field.value?.length || 0) >= 5
                    }
                  />
                )}
              />
            ))}
          </div>
          {errors.favoriteGenres && (
            <p className="mt-1 text-sm text-red-600">{errors.favoriteGenres.message}</p>
          )}
          <p className="mt-2 text-sm text-gray-500">
            선택된 장르: {watchedGenres?.length || 0}/5개
          </p>
        </div>

        {/* 월간 독서 목표 */}
        <Input
          {...register('readingGoalMonthly', { 
            valueAsNumber: true,
            setValueAs: (value: string) => value === '' ? 0 : parseInt(value, 10)
          })}
          type="number"
          label="월간 독서 목표"
          placeholder="5"
          min={1}
          max={100}
          error={errors.readingGoalMonthly?.message}
          helperText="한 달에 읽고 싶은 책의 권수를 입력해주세요"
        />

        {/* 공개 범위 설정 */}
        <Controller
          name="privacyLevel"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              label="독서 기록 공개 범위"
              options={privacyOptions}
              error={errors.privacyLevel?.message}
              helperText="다른 사용자에게 독서 기록을 어느 범위까지 공개할지 선택해주세요"
            />
          )}
        />

        {submitError && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            {submitError}
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          size="lg"
          isLoading={isLoading}
          disabled={isLoading || (watchedGenres?.length || 0) === 0}
        >
          BookNote 시작하기
        </Button>
      </form>

      {/* 나중에 설정하기 옵션 */}
      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => onSuccess?.()}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          나중에 설정하기
        </button>
      </div>
    </div>
  );
}