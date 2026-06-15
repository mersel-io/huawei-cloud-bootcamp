const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5034";

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || error.errorMessage || res.statusText);
  }

  return res.json();
}

export const api = {
  users: {
    getById: (id: string) =>
      request<import("./types").ApiResponse<import("./types").UserDto>>(
        `/api/users/${id}`
      ),

    getByEmail: (email: string) =>
      request<import("./types").ApiResponse<import("./types").UserDto>>(
        `/api/users/by-email/${encodeURIComponent(email)}`
      ),

    create: (data: import("./types").CreateUserRequest) =>
      request<import("./types").ApiResponse<import("./types").UserDto>>(
        `/api/users`,
        { method: "POST", body: JSON.stringify(data) }
      ),

    update: (id: string, data: import("./types").UpdateUserRequest) =>
      request<import("./types").ApiResponse<import("./types").UserDto>>(
        `/api/users/${id}`,
        { method: "PUT", body: JSON.stringify(data) }
      ),

    delete: (id: string) =>
      request<import("./types").ApiResponse<null>>(`/api/users/${id}`, {
        method: "DELETE",
      }),
  },

  profiles: {
    getById: (id: string) =>
      request<import("./types").ApiResponse<import("./types").ProfileDto>>(
        `/api/profiles/${id}`
      ),

    getBySlug: (slug: string) =>
      request<import("./types").ApiResponse<import("./types").ProfileDto>>(
        `/api/profiles/slug/${slug}`
      ),

    getByUserId: (
      userId: string,
      pageNumber = 1,
      pageSize = 20
    ) =>
      request<
        import("./types").PagedResponse<import("./types").ProfileDto>
      >(
        `/api/profiles/user/${userId}?pageNumber=${pageNumber}&pageSize=${pageSize}`
      ),

    create: (data: import("./types").CreateProfileRequest) =>
      request<import("./types").ApiResponse<import("./types").ProfileDto>>(
        `/api/profiles`,
        { method: "POST", body: JSON.stringify(data) }
      ),

    update: (id: string, data: import("./types").UpdateProfileRequest) =>
      request<import("./types").ApiResponse<import("./types").ProfileDto>>(
        `/api/profiles/${id}`,
        { method: "PUT", body: JSON.stringify(data) }
      ),

    delete: (id: string) =>
      request<import("./types").ApiResponse<null>>(`/api/profiles/${id}`, {
        method: "DELETE",
      }),
  },

  health: {
    check: () => request<void>(`/api/health`),
  },
};
