"use client";

import type React from "react";
import { ExternalLink } from "lucide-react";
import MVImage from "@/components/ui/image";

interface ZaloButtonProps {
  href: string;
  variant?: "default" | "outline" | "ghost" | "floating";
  size?: "sm" | "default" | "lg";
  showIcon?: boolean;
  children?: React.ReactNode;
}

export function ZaloButton({
  href,
  variant = "default",
  size = "default",
  showIcon = true,
  children
}: ZaloButtonProps) {
  const baseClasses = "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]";

  const variants = {
    default: "  ",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white",
    ghost: "text-blue-600 hover:bg-blue-50",
    floating: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl fixed bottom-6 right-6 z-50 rounded-full animate-pulse hover:animate-none"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    default: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  };

  const className = `${baseClasses} ${variants[variant]} ${sizes[size]}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {showIcon && (
        <MVImage src="/7044033_zalo_icon.svg" width={80} height={80} alt="Zalo" className="w-5 h-5" />
      )}
      {children || "Tham gia nhóm Zalo"}
      <ExternalLink className="w-4 h-4 opacity-70" />
    </a>
  );
}
