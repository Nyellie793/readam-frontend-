import Link from "next/link"; 
import { FaGraduationCap } from "react-icons/fa6";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      
      {/* Blue book icon */}
      <FaGraduationCap className="h-11 w-11 text-blue-800" />

      <span className="text-blue-800 text-3xl font-bold">
        READ
        <span className="text-orange-400">AM</span>
      </span>

    </Link>
  );
}