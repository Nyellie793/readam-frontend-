"use client";

import { getStoredUser } from "@/lib/auth";

export default function useCurrentUser() {
  const user = getStoredUser();

  return {
    user,
    name:
      user?.full_name ??
      user?.name ??
      "Student",

    email:
      user?.email ??
      "",

    avatar:
      user?.profile_picture ??
      "",
  };
}