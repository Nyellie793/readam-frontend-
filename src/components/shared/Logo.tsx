import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      
      {/* Blue book icon */}
      <BookOpen className="h-5 w-5 text-blue-800" />

      <span className="text-blue-800 text-3xl font-bold">
        READ
        <span className="text-orange-400">AM</span>
      </span>

    </Link>
  );
}