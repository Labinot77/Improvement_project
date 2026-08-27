"use client";

import { useCallback, useState } from "react";
import {
  FileText,
  Loader2,
  Trash2,
  Upload,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import {
  type DropzoneProps as _DropzoneProps,
  type DropzoneState as _DropzoneState,
} from "react-dropzone";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { wait } from "@/lib/mics/helpers";

interface UploadedFile {
  id: string;
  file: File;
  url: string;
  path: string;
}

export interface PhotoDropzoneRenderState extends _DropzoneState {
  uploading: boolean;
  hasImage: boolean;
  currentImageUrl: string | null;
  removeImage: () => Promise<void>;
}

interface Props extends Omit<_DropzoneProps, "children" | "onDrop"> {
  children?: (dropzone: PhotoDropzoneRenderState) => React.ReactNode;

  showFilesList?: boolean;
  showErrorMessage?: boolean;

  recipeId: string;

  value: string[];
  onChange: React.Dispatch<React.SetStateAction<string[]>>;
}

function extractPathFromUrl(url: string): string | null {
  const marker = "/recipe-images/";
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.slice(idx + marker.length);
}

export function PhotoDropzone({
  children,
  showFilesList = true,
  showErrorMessage = true,
  recipeId,
  value,
  onChange,
  ...props
}: Props) {
  const supabase = createClient();

  const [filesUploaded, setFilesUploaded] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const currentImageUrl = filesUploaded[0]?.url ?? value[0] ?? null;
  const hasImage = !!currentImageUrl;

  const uploadFile = async (file: File): Promise<UploadedFile> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const id = crypto.randomUUID();
    const fileName = `${id}.${extension}`;
    const filePath = `${user.id}/${recipeId}/${fileName}`;

    const { error } = await supabase.storage
      .from("recipe-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (error) throw error;
    const { data } = supabase.storage.from("recipe-images").getPublicUrl(filePath);

    return { id, file, url: data.publicUrl, path: filePath };
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: any[]) => {
      if (fileRejections.length > 0) {
        let message = `Could not upload ${fileRejections[0].file.name}`;
        if (fileRejections.length > 1) {
          message += `, and ${fileRejections.length - 1} other files.`;
        }
        setErrorMessage(message);
      } else {
        setErrorMessage("");
      }

      if (acceptedFiles.length === 0) return;

      try {
        setUploading(true);

        const file = acceptedFiles[0];
        const uploaded = await uploadFile(file);

        if (value.length > 0) {
          const oldPaths = value
            .map((url) => extractPathFromUrl(url))
            .filter((p): p is string => !!p);

          if (oldPaths.length > 0) {
            await supabase.storage.from("recipe-images").remove(oldPaths);
          }
        }

        setFilesUploaded([uploaded]);
        onChange([uploaded.url]);
      } catch (error) {
        console.error("Image upload failed:", error);
        setErrorMessage(error instanceof Error ? error.message : "Failed to upload image.");
      } finally {
        setUploading(false);
      }
    },
    [recipeId, onChange, value]
  );

  const dropzone = useDropzone({
    ...props,
    onDrop,
    accept: props.accept ?? {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
    },
  });

  const removeCurrentImage = async () => {
    try {
      const pathsToRemove = filesUploaded.length > 0
        ? [filesUploaded[0].path]
        : value.map(extractPathFromUrl).filter((p): p is string => !!p);

      if (pathsToRemove.length > 0) {
        const { error } = await supabase.storage.from("recipe-images").remove(pathsToRemove);
        if (error) {
          console.error("Failed to delete image:", error);
          setErrorMessage("Failed to delete image.");
          return;
        }
      }

      setFilesUploaded([]);
      onChange([]);
    } catch (error) {
      console.error("Failed to delete image:", error);
      setErrorMessage("Failed to delete image.");
    }
  };

  // Full override mode — caller owns all visuals, we just wire up root/input props + state.
if (children) {
  return (
    <div className="flex flex-col gap-2">
      {children({ ...dropzone, uploading, hasImage, currentImageUrl, removeImage: removeCurrentImage })}

      {showErrorMessage && errorMessage && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/10 bg-red-500/5 px-3 py-2 text-xs text-red-400">
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
  return (
    <div className="flex flex-col gap-2">
      <div className={cn("flex gap-3", hasImage ? "flex-col sm:flex-row" : "flex-col")}>
        {/* Dropzone */}
        <div
          {...dropzone.getRootProps()}
          className={cn(
            "relative flex min-h-32 cursor-pointer select-none",
            "items-center justify-center rounded-lg border-2 border-dashed",
            "border-white/[0.08] transition-all",
            "hover:bg-white/[0.03]",
            hasImage ? "sm:w-[60%] w-full" : "w-full",
            dropzone.isDragActive && "border-amber-500/50 bg-amber-500/[0.03]",
            dropzone.isDragReject && "border-red-500/50 bg-red-500/[0.03]",
            uploading && "pointer-events-none opacity-60"
          )}
        >
          <input {...dropzone.getInputProps()} />

          {uploading ? (
            <div className="flex flex-col items-center gap-2 text-zinc-500">
              <Loader2 className="size-5 animate-spin" />
              <span className="text-xs font-medium">Uploading image...</span>
            </div>
          ) : dropzone.isDragAccept ? (
            <div className="text-sm font-medium text-amber-500">Drop your files here</div>
          ) : dropzone.isDragReject ? (
            <div className="text-sm font-medium text-red-400">These files are not allowed</div>
          ) : (
            <div className="flex flex-col items-center gap-2 px-4 text-center">
              <div className="flex items-center text-sm font-medium text-zinc-400">
                <Upload className="mr-2 size-4" />
                {hasImage ? "Replace photo" : "Upload photos"}
              </div>
              <div className="text-xs text-zinc-600">JPG, PNG, WEBP</div>
              {props.maxSize && (
                <div className="text-[11px] text-zinc-600">
                  Max. file size: {(props.maxSize / (1024 * 1024)).toFixed(2)} MB
                </div>
              )}
            </div>
          )}
        </div>

        {/* Current image preview */}
        {showFilesList && hasImage && (
          <div className="relative flex-1 min-h-32 overflow-hidden rounded-lg border border-white/[0.06]">
            <img
              src={currentImageUrl}
              alt="Recipe photo"
              className="size-full object-cover"
            />
            <button
              type="button"
              disabled={uploading}
              onClick={removeCurrentImage}
              className="absolute top-2 right-2 rounded-md bg-black/60 p-1.5 text-white
                transition-colors hover:bg-red-500/80 disabled:opacity-50"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Error */}
      {showErrorMessage && errorMessage && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/10 bg-red-500/5 px-3 py-2 text-xs text-red-400">
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}