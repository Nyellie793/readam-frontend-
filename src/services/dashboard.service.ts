import {api} from "@/lib/api";

export async function getDashboard() {

    const response =
        await api.get("/student/dashboard");

    return response.data;

}

export async function getRecommendedCourses() {

    const response =
        await api.get("/courses/recommended");

    return response.data;

}

export async function getRecentlyViewed() {

    const response =
        await api.get("/courses/recent");

    return response.data;

}