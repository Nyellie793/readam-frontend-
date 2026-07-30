/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getStoredUser } from "@/lib/auth";
import type { User } from "@/types/user.types";
import { useEffect, useState } from "react";

export default function DashboardGreeting() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  const name = user?.full_name ?? "Student";

  const initials = name
    .split(" ")
    .map((n : string) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

    const [greeting, setGreeting] = useState("");

    useEffect(() => {
        const hour = new Date().getHours();
    
        if (hour < 12)
            setGreeting("Good Morning");
        else if (hour < 17)
            setGreeting("Good Afternoon");
        else
            setGreeting("Good Evening");
    }, []);

  return (
    <div className="flex items-center gap-3">
      <Avatar className="size-11">
        <AvatarImage src={user?.avatar_url ?? ""} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>

      <div>
        <p className="text-sm text-gray-500">
          {greeting},
        </p>

        <h1 className="text-lg font-bold text-blue-600">
          {name}
        </h1>
      </div>
    </div>
  );
}