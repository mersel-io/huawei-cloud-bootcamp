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

export interface SkillDto {
  id: string;
  profileId: string;
  name: string;
  level: string;
  category: string | null;
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
  skills: SkillDto[];
  experiences: ExperienceDto[];
  education: EducationDto[];
  projects: ProjectDto[];
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
  password: string;
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

export interface AuthResponseDto {
  token: string;
  user: UserDto;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateSkillRequest {
  profileId: string;
  name: string;
  level: string;
  category?: string;
}

export interface UpdateSkillRequest {
  name: string;
  level: string;
  category?: string;
  displayOrder: number;
}

export interface ExperienceDto {
  id: string;
  profileId: string;
  company: string;
  position: string;
  description: string | null;
  location: string | null;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  companyUrl: string | null;
  displayOrder: number;
}

export interface CreateExperienceRequest {
  profileId: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
  location?: string;
  companyUrl?: string;
}

export interface UpdateExperienceRequest {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
  location?: string;
  companyUrl?: string;
  displayOrder: number;
}

export interface EducationDto {
  id: string;
  profileId: string;
  institution: string;
  degree: string;
  fieldOfStudy: string | null;
  description: string | null;
  grade: string | null;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  displayOrder: number;
}

export interface CreateEducationRequest {
  profileId: string;
  institution: string;
  degree: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  fieldOfStudy?: string;
  description?: string;
  grade?: string;
}

export interface UpdateEducationRequest {
  institution: string;
  degree: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  fieldOfStudy?: string;
  description?: string;
  grade?: string;
  displayOrder: number;
}

export interface ProjectDto {
  id: string;
  profileId: string;
  title: string;
  description: string | null;
  repositoryUrl: string | null;
  liveUrl: string | null;
  imageUrl: string | null;
  status: string;
  technologies: string | null;
  displayOrder: number;
}

export interface CreateProjectRequest {
  profileId: string;
  title: string;
  description?: string;
  repositoryUrl?: string;
  liveUrl?: string;
  technologies?: string;
  status: string;
}

export interface UpdateProjectRequest {
  title: string;
  description?: string;
  repositoryUrl?: string;
  liveUrl?: string;
  technologies?: string;
  status: string;
  displayOrder: number;
}

export interface CreateProfileLinkRequest {
  profileId: string;
  label: string;
  url: string;
  icon?: string;
}

export interface UpdateProfileLinkRequest {
  label: string;
  url: string;
  icon?: string;
  displayOrder: number;
}
