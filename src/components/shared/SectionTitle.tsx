import { cn } from "@/lib/utils";

interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export default function SectionTitle({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        "mb-10",
        align === "center" ? "mx-auto max-w-2xl text-center" : "text-left",
        className
      )}
    >
      {eyebrow && (
        <span className="text-xs font-bold uppercase tracking-widest text-orange-500">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-2 text-3xl font-black text-gray-900 sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-base leading-relaxed text-gray-500">
          {description}
        </p>
      )}
    </div>
  );
}
