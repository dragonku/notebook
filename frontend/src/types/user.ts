export interface User {
  id: number;
  email: string;
  nickname: string;
  favoriteGenres: Genre[];
  readingGoalMonthly?: number;
  privacyLevel: PrivacyLevel;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface OnboardingData {
  favoriteGenres: string[];
  readingGoalMonthly: number;
  privacyLevel: string;
}

export const Genre = {
  FICTION: 'FICTION',
  NON_FICTION: 'NON_FICTION',
  SELF_DEVELOPMENT: 'SELF_DEVELOPMENT',
  HISTORY: 'HISTORY',
  SCIENCE: 'SCIENCE',
  PHILOSOPHY: 'PHILOSOPHY',
  ART: 'ART',
  TRAVEL: 'TRAVEL',
  COOKING: 'COOKING',
  HEALTH: 'HEALTH',
  BUSINESS: 'BUSINESS',
  TECHNOLOGY: 'TECHNOLOGY',
  ROMANCE: 'ROMANCE',
  MYSTERY: 'MYSTERY',
  FANTASY: 'FANTASY',
  BIOGRAPHY: 'BIOGRAPHY',
  EDUCATION: 'EDUCATION',
  CHILDREN: 'CHILDREN',
  COMIC: 'COMIC',
  OTHER: 'OTHER',
} as const;

export type Genre = typeof Genre[keyof typeof Genre];

export const PrivacyLevel = {
  PUBLIC: 'PUBLIC',
  FRIENDS_ONLY: 'FRIENDS_ONLY',
  PRIVATE: 'PRIVATE',
} as const;

export type PrivacyLevel = typeof PrivacyLevel[keyof typeof PrivacyLevel];

export const GENRE_LABELS: Record<Genre, string> = {
  [Genre.FICTION]: '소설',
  [Genre.NON_FICTION]: '비소설',
  [Genre.SELF_DEVELOPMENT]: '자기계발',
  [Genre.HISTORY]: '역사',
  [Genre.SCIENCE]: '과학',
  [Genre.PHILOSOPHY]: '철학',
  [Genre.ART]: '예술',
  [Genre.TRAVEL]: '여행',
  [Genre.COOKING]: '요리',
  [Genre.HEALTH]: '건강',
  [Genre.BUSINESS]: '비즈니스',
  [Genre.TECHNOLOGY]: '기술',
  [Genre.ROMANCE]: '로맨스',
  [Genre.MYSTERY]: '미스터리',
  [Genre.FANTASY]: '판타지',
  [Genre.BIOGRAPHY]: '전기',
  [Genre.EDUCATION]: '교육',
  [Genre.CHILDREN]: '아동',
  [Genre.COMIC]: '만화',
  [Genre.OTHER]: '기타',
};

export const PRIVACY_LABELS: Record<PrivacyLevel, string> = {
  [PrivacyLevel.PUBLIC]: '공개',
  [PrivacyLevel.FRIENDS_ONLY]: '친구만',
  [PrivacyLevel.PRIVATE]: '비공개',
};