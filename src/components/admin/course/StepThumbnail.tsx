"use client";

import { useRef } from "react";
import Image from "next/image";
import {
    Check,
    ImageIcon,
} from "lucide-react";

interface StepThumbnailProps {
    file: File | null;
    preview: string;
    onFile: (file: File) => void;
}

export default function StepThumbnail({
    file,
    preview,
    onFile,
}: StepThumbnailProps) {
    const ref = useRef<HTMLInputElement>(null);

    function handleDrop(
        event: React.DragEvent
    ) {
        event.preventDefault();

        const droppedFile =
            event.dataTransfer.files[0];

        if (
            droppedFile &&
            droppedFile.type.startsWith("image/")
        ) {
            onFile(droppedFile);
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                    Course Thumbnail{" "}
                    <span className="text-red-500">*</span>
                </label>

                <p className="mb-4 text-xs text-gray-400">
                    Recommended: 1280×720px (16:9), JPG or PNG,
                    max 2MB
                </p>

                <div
                    onDrop={handleDrop}
                    onDragOver={(e) =>
                        e.preventDefault()
                    }
                    onClick={() =>
                        ref.current?.click()
                    }
                    className={`relative flex min-h-[240px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all ${preview
                            ? "border-blue-300 bg-blue-50/30"
                            : "border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/20"
                        }`}
                >
                    {preview ? (
                        <div className="relative h-52 w-full overflow-hidden rounded-xl">
                            <Image
                                src={preview}
                                alt="Thumbnail preview"
                                fill
                                className="object-cover"
                            />

                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                                <p className="text-sm font-semibold text-white">
                                    Click to change
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
                                <ImageIcon className="h-7 w-7 text-blue-500" />
                            </div>

                            <p className="mt-4 text-sm font-semibold text-gray-700">
                                Drag & drop or click to upload
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                                PNG, JPG up to 2MB
                            </p>
                        </>
                    )}

                    <input
                        ref={ref}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                            if (e.target.files?.[0]) {
                                onFile(e.target.files[0]);
                            }
                        }}
                    />
                </div>

                {file && (
                    <div className="mt-3 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-2.5">
                        <Check className="h-4 w-4 text-green-600" />

                        <span className="text-sm font-medium text-green-700">
                            {file.name}
                        </span>

                        <span className="ml-auto text-xs text-gray-400">
                            {(file.size / 1024).toFixed(0)} KB
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}