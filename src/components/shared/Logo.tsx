import Link from "next/link";
import { GraduationCap} from "lucide-react";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      
      {/* Blue book icon */}
      <GraduationCap className="h-10 w-5 text-blue-800" />

      <span className="text-blue-800 text-3xl font-bold">
        READ
        <span className="text-orange-400">AM</span>
      </span>

    </Link>
  );
}