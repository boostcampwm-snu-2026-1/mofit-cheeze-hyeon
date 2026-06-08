import { useRef } from "react";

export interface UploadImage {
  id: string;
  url: string;
  file?: File;
}

interface ImageUploadProps {
  images: UploadImage[];
  onAdd: (files: FileList) => void;
  onRemove: (id: string) => void;
  maxImages?: number;
  accept?: string;
}

export function ImageUpload({
  images,
  onAdd,
  onRemove,
  maxImages = 10,
  accept = "image/*",
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const canAdd = images.length < maxImages;

  return (
    <div className="grid grid-cols-3 gap-2">
      {images.map((img) => (
        <div key={img.id} className="relative aspect-square rounded-card overflow-hidden bg-surface-subtle border border-border">
          <img
            src={img.url}
            alt=""
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={() => onRemove(img.id)}
            className="absolute top-1 right-1 w-5 h-5 rounded-pill bg-charcoal text-offwhite text-xs flex items-center justify-center leading-none"
            aria-label="삭제"
          >
            ×
          </button>
        </div>
      ))}

      {canAdd && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="aspect-square rounded-card border-2 border-dashed border-border text-muted hover:border-border-interactive hover:text-charcoal transition-colors flex flex-col items-center justify-center gap-1"
        >
          <span className="text-xl leading-none">+</span>
          <span className="text-xs font-sans">{images.length}/{maxImages}</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) {
            onAdd(e.target.files);
            e.target.value = "";
          }
        }}
      />
    </div>
  );
}
