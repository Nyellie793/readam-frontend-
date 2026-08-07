"use client";

export function TutorInitials({ name }: { name: string | null }) {
    const initials = (name ?? "")
        .split(" ")
        .map(n => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <span className="flex size-6 items-center justify-center rounded-full bg-gray-100 text-[10px] font-semibold text-gray-700">
            {initials}
        </span>
    );
}