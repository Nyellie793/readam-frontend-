import { api } from "@/lib/api";

export async function getDashboard() {
  return await api.get("/student/dashboard");
}

export async function getRecommendedCourses() {
  return await api.get("/courses/recommended");
}

export async function getRecentlyViewed() {
  return await api.get("/courses/recent");
}