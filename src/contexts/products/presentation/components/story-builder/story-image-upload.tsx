"use client";

import { useRef, useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { productsApiClient } from "@/contexts/products/infrastructure/api/products-api.client";
import { toast } from "sonner";
import { compressImage } from "@/shared/utils/compress-image";

interface StoryImageUploadProps {
  value?: string;
  onChange: (url: string | undefined) => void;
  label?: string;
}

export function StoryImageUpload({ value, onChange, label }: StoryImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const compressed = await compressImage(file);
      const result = await productsApiClient.uploadStoryImage(compressed);
      onChange(result.url);
    } catch {
      toast.error("Erro ao fazer upload da imagem.");
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      {value ? (
        <div className="relative group w-full max-w-[200px]">
          <img
            src={value}
            alt="Story"
            className="rounded-lg border object-cover w-full h-24"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onChange(undefined)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
          className="min-h-[44px]"
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Upload className="h-4 w-4 mr-2" />
          )}
          {isUploading ? "Enviando..." : "Upload imagem"}
        </Button>
      )}
    </div>
  );
}
