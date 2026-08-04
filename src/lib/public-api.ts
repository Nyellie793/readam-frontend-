import { API_BASE_URL } from "@/lib/constants";
import type {
  PaginatedCoursesResponse,
  CourseDetailResponse,
  PublicTutorResponse,
} from "@/types/api.types";

/**
 * Server-side reads of the public catalogue.
 *
 * These endpoints accept anonymous requests, which is what lets the marketing
 * pages render real data and stay indexable. Fetching here rather than in a
 * client effect means the HTML search engines and link-preview scrapers
 * receive already contains the content.
 *
 * Every helper resolves to null or an empty page instead of throwing: a
 * marketing page must still render if the API is briefly unavailable, falling
 * back to its empty state rather than a crashed route.
 */

/** Cache public catalogue reads for 5 minutes. */
const REVALIDATE_SECONDS = 300;

export interface PaginatedTutorsResponse {
  items: PublicTutorResponse[];
  total: number;
  page: number;
  page_size: number;
}

async function publicGet<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      next: { revalidate: REVALIDATE_SECONDS },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    // Network failure, DNS, or the API being down. The caller renders its
    // empty state; a marketing page should never 500 because of this.
    return null;
  }
}

const EMPTY_COURSES: PaginatedCoursesResponse = {
  items: [],
  total: 0,
  page: 1,
  page_size: 0,
} as PaginatedCoursesResponse;

const EMPTY_TUTORS: PaginatedTutorsResponse = { items: [], total: 0, page: 1, page_size: 0 };

/** Published courses for the public catalogue. */
export async function getPublicCourses(params?: {
  search?: string;
  category?: string;
  page?: number;
  pageSize?: number;
}): Promise<PaginatedCoursesResponse> {
  const q = new URLSearchParams();
  if (params?.search) q.set("search", params.search);
  if (params?.category) q.set("category", params.category);
  q.set("page", String(params?.page ?? 1));
  q.set("page_size", String(params?.pageSize ?? 24));

  return (await publicGet<PaginatedCoursesResponse>(`/v1/courses?${q}`)) ?? EMPTY_COURSES;
}

/** A single published course, or null if it does not exist. */
export async function getPublicCourse(courseId: string): Promise<CourseDetailResponse | null> {
  return publicGet<CourseDetailResponse>(`/v1/courses/${courseId}`);
}

/** Verified tutors for the public directory. */
export async function getPublicTutors(params?: {
  search?: string;
  subject?: string;
  page?: number;
  pageSize?: number;
}): Promise<PaginatedTutorsResponse> {
  const q = new URLSearchParams();
  if (params?.search) q.set("search", params.search);
  if (params?.subject) q.set("subject", params.subject);
  q.set("page", String(params?.page ?? 1));
  q.set("page_size", String(params?.pageSize ?? 24));

  return (await publicGet<PaginatedTutorsResponse>(`/v1/tutors?${q}`)) ?? EMPTY_TUTORS;
}

/** A single tutor's public profile, or null if not found. */
export async function getPublicTutor(tutorId: string): Promise<PublicTutorResponse | null> {
  return publicGet<PublicTutorResponse>(`/v1/tutors/${tutorId}`);
}

/** Real tutor ids are UUIDs; the legacy landing-page entries use slugs. */
export function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}
