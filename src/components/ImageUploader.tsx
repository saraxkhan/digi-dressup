import React, { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Upload, X, User, Shirt } from "lucide-react";

interface ImageUploaderProps {
  label: string;
  icon: "person" | "clothing";
  image: string | null;
  onImageChange: (img: string | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ label, icon, image, onImageChange }) => {
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => onImageChange(e.target?.result as string);
    reader.readAsDataURL(file);
  }, [onImageChange]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const onFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const Icon = icon === "person" ? User : Shirt;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 min-w-[260px]"
    >
      <p className="text-sm font-medium text-muted-foreground mb-2 font-display">{label}</p>
      {image ? (
        <div className="relative group rounded-xl overflow-hidden border border-border aspect-[3/4]">
          <img src={image} alt={label} className="w-full h-full object-cover" />
          <button
            onClick={() => onImageChange(null)}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-background/80 backdrop-blur-sm text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed cursor-pointer aspect-[3/4] transition-all ${
            dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-card/40"
          }`}
        >
          <div className="p-4 rounded-2xl bg-secondary">
            <Icon className="w-8 h-8 text-muted-foreground" />
          </div>
          <div className="text-center px-4">
            <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
              <Upload className="w-4 h-4" /> Drop or click
            </p>
            <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
          </div>
          <input type="file" accept="image/*" className="hidden" onChange={onFileSelect} />
        </label>
      )}
    </motion.div>
  );
};

export default ImageUploader;
