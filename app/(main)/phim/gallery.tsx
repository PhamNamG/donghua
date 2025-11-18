"use client";
import MVImage from "@/components/ui/image";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import LightGallery from "lightgallery/react";
import lgZoom from "lightgallery/plugins/zoom";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";

type AspectRatio = "16:9" | "6:19" | "9:16" | "1:1";

export interface GalleryImageItem {
  imageUrl: string;
  alt?: string;
  aspect?: AspectRatio;
}

interface GalleryProps {
  title?: string;
  images: GalleryImageItem[];
  className?: string;
}

function getAspectClasses(aspect: AspectRatio | undefined) {
  const value = aspect ?? "16:9";
  if (value === "9:16") {
    return {
      wrapper: "aspect-square w-[150px] sm:w-[120px] md:w-[140px] lg:w-[160px]",
    };
  }
  if (value === "1:1") {
    return {
      wrapper: "aspect-square w-full sm:w-[200px] md:w-[240px] lg:w-[280px]",
    };
  }
  
  if (value === "6:19") {
    return {
      wrapper: "aspect-square md:aspect-[6/19] w-full sm:w-[140px] md:w-[160px] lg:w-[180px]",
    };
  }
  
  return {
    wrapper: "aspect-square md:aspect-[16/9] w-full md:w-[300px] lg:w-[340px]",
  };
}

export function Gallery({ title = "Gallery", images, className }: GalleryProps) {
  if (!images || images.length === 0) return null;
  return (
    <div className={cn("w-full space-y-3 mt-5", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
        <span className="text-sm text-muted-foreground">{images.length} ảnh</span>
      </div>
      <Separator />
     
      <div className="relative">
        <LightGallery
          speed={300}
          download={false}
          plugins={[lgZoom, lgThumbnail]}
          elementClassNames={cn(
            // Mobile: 2 columns with equal heights (all square)
            "grid grid-cols-2 gap-2 sm:gap-3",
            // Tablet and up: flex wrap layout for better control
            "md:flex md:flex-wrap md:gap-4",
            // Remove default margins
            "-mx-1 px-1 md:mx-0 md:px-0"
          )}
        >
          {images.map((img, index) => {
            const { wrapper } = getAspectClasses(img.aspect);
            return (
              <a
                key={`${img.imageUrl}-${index}`}
                href={img.imageUrl}
                className={cn(
                  "relative overflow-hidden rounded-lg border bg-muted/20",
                  "transition-all duration-200 hover:shadow-lg hover:scale-[1.02]",
                  // Mobile: full width within grid
                  "w-full",
                  // Desktop: specific widths
                  "md:flex-none",
                  wrapper
                )}
              >
                <MVImage
                  src={img.imageUrl}
                  alt={img.alt ?? `Gallery image ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-300"
                  priority={index < 4}
                />
               
                {/* Optional overlay for better visual feedback */}
                <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-200" />
              </a>
            );
          })}
        </LightGallery>
      </div>
    </div>
  );
}

export default Gallery;