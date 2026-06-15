import type {
  ApiResponse,
  UserDto,
  ProfileDto,
  CreateUserRequest,
  UpdateUserRequest,
  CreateProfileRequest,
  UpdateProfileRequest,
  PagedResponse,
  AuthResponseDto,
  RegisterRequest,
  LoginRequest,
  SkillDto,
  CreateSkillRequest,
  UpdateSkillRequest,
  ExperienceDto,
  CreateExperienceRequest,
  UpdateExperienceRequest,
  EducationDto,
  CreateEducationRequest,
  UpdateEducationRequest,
  ProjectDto,
  CreateProjectRequest,
  UpdateProjectRequest,
  ProfileLinkDto,
  CreateProfileLinkRequest,
  UpdateProfileLinkRequest,
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5034";
const TOKEN_KEY = "portfolify_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options?.headers as Record<string, string>) ?? {}),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || error.errorMessage || res.statusText);
  }

  return res.json();
}

export const api = {
  auth: {
    register: (data: RegisterRequest) =>
      request<ApiResponse<AuthResponseDto>>(`/api/auth/register`, {
        method: "POST",
        body: JSON.stringify(data),
      }),

    login: (data: LoginRequest) =>
      request<ApiResponse<AuthResponseDto>>(`/api/auth/login`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },

  users: {
    getById: (id: string) =>
      request<ApiResponse<UserDto>>(`/api/users/${id}`),

    getByEmail: (email: string) =>
      request<ApiResponse<UserDto>>(
        `/api/users/by-email/${encodeURIComponent(email)}`
      ),

    create: (data: CreateUserRequest) =>
      request<ApiResponse<UserDto>>(`/api/users`, {
        method: "POST",
        body: JSON.stringify(data),
      }),

    update: (id: string, data: UpdateUserRequest) =>
      request<ApiResponse<UserDto>>(`/api/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      request<ApiResponse<null>>(`/api/users/${id}`, {
        method: "DELETE",
      }),
  },

  profiles: {
    getById: (id: string) =>
      request<ApiResponse<ProfileDto>>(`/api/profiles/${id}`),

    getBySlug: (slug: string) =>
      request<ApiResponse<ProfileDto>>(`/api/profiles/slug/${slug}`),

    getByUserId: (
      userId: string,
      pageNumber = 1,
      pageSize = 20
    ) =>
      request<PagedResponse<ProfileDto>>(
        `/api/profiles/user/${userId}?pageNumber=${pageNumber}&pageSize=${pageSize}`
      ),

    create: (data: CreateProfileRequest) =>
      request<ApiResponse<ProfileDto>>(`/api/profiles`, {
        method: "POST",
        body: JSON.stringify(data),
      }),

    update: (id: string, data: UpdateProfileRequest) =>
      request<ApiResponse<ProfileDto>>(`/api/profiles/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      request<ApiResponse<null>>(`/api/profiles/${id}`, {
        method: "DELETE",
      }),
  },

  skills: {
    getByProfileId: (profileId: string) =>
      request<ApiResponse<SkillDto[]>>(
        `/api/skills/profile/${profileId}`
      ),

    create: (data: CreateSkillRequest) =>
      request<ApiResponse<SkillDto>>(`/api/skills`, {
        method: "POST",
        body: JSON.stringify(data),
      }),

    update: (id: string, data: UpdateSkillRequest) =>
      request<ApiResponse<SkillDto>>(`/api/skills/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      request<ApiResponse<null>>(`/api/skills/${id}`, {
        method: "DELETE",
      }),
  },

  experiences: {
    getByProfileId: (profileId: string) =>
      request<ApiResponse<ExperienceDto[]>>(
        `/api/experiences/profile/${profileId}`
      ),

    create: (data: CreateExperienceRequest) =>
      request<ApiResponse<ExperienceDto>>(`/api/experiences`, {
        method: "POST",
        body: JSON.stringify(data),
      }),

    update: (id: string, data: UpdateExperienceRequest) =>
      request<ApiResponse<ExperienceDto>>(`/api/experiences/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      request<ApiResponse<null>>(`/api/experiences/${id}`, {
        method: "DELETE",
      }),
  },

  education: {
    getByProfileId: (profileId: string) =>
      request<ApiResponse<EducationDto[]>>(
        `/api/education/profile/${profileId}`
      ),

    create: (data: CreateEducationRequest) =>
      request<ApiResponse<EducationDto>>(`/api/education`, {
        method: "POST",
        body: JSON.stringify(data),
      }),

    update: (id: string, data: UpdateEducationRequest) =>
      request<ApiResponse<EducationDto>>(`/api/education/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      request<ApiResponse<null>>(`/api/education/${id}`, {
        method: "DELETE",
      }),
  },

  projects: {
    getByProfileId: (profileId: string) =>
      request<ApiResponse<ProjectDto[]>>(
        `/api/projects/profile/${profileId}`
      ),

    create: (data: CreateProjectRequest) =>
      request<ApiResponse<ProjectDto>>(`/api/projects`, {
        method: "POST",
        body: JSON.stringify(data),
      }),

    update: (id: string, data: UpdateProjectRequest) =>
      request<ApiResponse<ProjectDto>>(`/api/projects/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      request<ApiResponse<null>>(`/api/projects/${id}`, {
        method: "DELETE",
      }),
  },

  profileLinks: {
    create: (data: CreateProfileLinkRequest) =>
      request<ApiResponse<ProfileLinkDto>>(`/api/profile-links`, {
        method: "POST",
        body: JSON.stringify(data),
      }),

    update: (id: string, data: UpdateProfileLinkRequest) =>
      request<ApiResponse<ProfileLinkDto>>(`/api/profile-links/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      request<ApiResponse<null>>(`/api/profile-links/${id}`, {
        method: "DELETE",
      }),
  },

  health: {
    check: () => request<void>(`/api/health`),
  },
};
