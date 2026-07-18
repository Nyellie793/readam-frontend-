"use client";

import { getStoredUser } from "@/lib/auth";

export default function useCurrentUser() {
  const user = getStoredUser();

  return {
    user,


    name:
      user?.full_name ??
      "Student",

    email:
      user?.email ??
      "",

    avatar:
      "",
  };
}