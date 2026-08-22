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

interface UploadedFile {
  id: string;
  file: File;
  url: string;
  path: string;
}

interface Props extends Omit<_DropzoneProps, "children" | "onDrop"> {
  children?: (dropzone: _DropzoneState) => React.ReactNode;

  showFilesList?: boolean;
  showErrorMessage?: boolean;

  recipeId: string;

  value: string[];
  onChange: React.Dispatch<React.SetStateAction<string[]>>;
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

      if (acceptedFiles.length === 0) {
        return;
      }

      try {
        setUploading(true);

        const uploadedFiles = await Promise.all(acceptedFiles.map(uploadFile));

        setFilesUploaded((prev) => [...prev, ...uploadedFiles]);

        onChange((prev) => [...prev, ...uploadedFiles.map((file) => file.url)]);
      } catch (error) {
        console.error("Image upload failed:", error);

        setErrorMessage(
          error instanceof Error ? error.message : "Failed to upload image."
        );
      } finally {
        setUploading(false);
      }
    },
    [recipeId, onChange]
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

  const deleteUploadedFile = async (uploadedFile: UploadedFile) => {
    try {
      const { error } = await supabase.storage
        .from("recipe-images")
        .remove([uploadedFile.path]);

      if (error) {
        console.error("Failed to delete image:", error);
        setErrorMessage("Failed to delete image.");
        return;
      }

      setFilesUploaded((prev) => prev.filter((file) => file.id !== uploadedFile.id));

      onChange((prev) => prev.filter((url) => url !== uploadedFile.url));
    } catch (error) {
      console.error("Failed to delete image:", error);
      setErrorMessage("Failed to delete image.");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Dropzone */}
      <div
        {...dropzone.getRootProps()}
        className={cn(
          "relative flex min-h-32 w-full cursor-pointer select-none",
          "items-center justify-center rounded-lg border-2 border-dashed",
          "border-white/[0.08] transition-all",
          "hover:bg-white/[0.03]",
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
        ) : children ? (
          children(dropzone)
        ) : dropzone.isDragAccept ? (
          <div className="text-sm font-medium text-amber-500">Drop your files here</div>
        ) : dropzone.isDragReject ? (
          <div className="text-sm font-medium text-red-400">These files are not allowed</div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center text-sm font-medium text-zinc-400">
              <Upload className="mr-2 size-4" />
              Upload photos
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

      {/* Error */}
      {showErrorMessage && errorMessage && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/10 bg-red-500/5 px-3 py-2 text-xs text-red-400">
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Uploaded files */}
      {showFilesList && filesUploaded.length > 0 && (
        <div className="flex flex-col gap-2">
          {filesUploaded.map((uploadedFile) => (
            <div
              key={uploadedFile.id}
              className="flex h-16 w-full items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.015] px-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="size-10 shrink-0 overflow-hidden rounded-md border border-white/[0.06]">
                  {uploadedFile.file.type.startsWith("image/") ? (
                    <img
                      src={uploadedFile.url}
                      alt={uploadedFile.file.name}
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center">
                      <FileText className="size-5 text-zinc-500" />
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-zinc-300">
                    {uploadedFile.file.name}
                  </p>
                  <p className="text-[11px] text-zinc-600">
                    {(uploadedFile.file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={uploading}
                onClick={() => deleteUploadedFile(uploadedFile)}
                className="ml-3 shrink-0 rounded-md p-2 text-zinc-600 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}