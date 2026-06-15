export interface UserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  bio: string | null;
  avatarUrl: string | null;
  role: string;
  gitHubUsername: string | null;
  createdAtUtc: string;
}

export interface ProfileLinkDto {
  id: string;
  label: string;
  url: string;
  icon: string | null;
  displayOrder: number;
}

export interface ProfileDto {
  id: string;
  userId: string;
  slug: string;
  title: string;
  subtitle: string | null;
  bio: string | null;
  visibility: string;
  theme: string | null;
  isPrimary: boolean;
  links: ProfileLinkDto[];
  createdAtUtc: string;
}

export interface ApiResponse<T> {
  data: T;
  isSuccess: boolean;
  errorMessage: string | null;
}

export interface PagedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  bio?: string;
  avatarUrl?: string;
}

export interface CreateProfileRequest {
  userId: string;
  slug?: string;
  title?: string;
  subtitle?: string;
  bio?: string;
  visibility?: string;
}

export interface UpdateProfileRequest {
  title?: string;
  subtitle?: string;
  bio?: string;
  visibility?: string;
  theme?: string;
}
