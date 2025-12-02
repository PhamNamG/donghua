'use client';

import { useEffect } from 'react';
import MVLink from '@/components/Link';
import { PlugZap, Home, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {

  useEffect(() => {
    console.error('Error occurred:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-lg w-full text-center">
        {/* Animated Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            {/* Pulsing background circle */}
            <div className="absolute inset-0 rounded-full bg-destructive/20 animate-ping" />
            
            {/* Icon container */}
            <div className="relative bg-destructive/10 p-8 rounded-full">
              <PlugZap 
                className="w-20 h-20 text-destructive animate-[shake_0.5s_ease-in-out_infinite]" 
                strokeWidth={1.5}
              />
            </div>
            
            {/* Spark effects */}
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-500 rounded-full animate-pulse" />
            <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-orange-500 rounded-full animate-pulse delay-75" />
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Mất kết nối!
          </h1>
          <h2 className="text-xl md:text-2xl font-semibold text-muted-foreground">
            Đã xảy ra lỗi không mong muốn
          </h2>
          <p className="text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
            Có vẻ như hệ thống đã gặp sự cố. Vui lòng thử lại hoặc quay về trang chủ.
          </p>
        </div>

        {/* Error Details (Collapsible) */}
        {error.digest && (
          <div className="mb-8 p-4 bg-muted/50 border border-border rounded-lg text-left animate-in fade-in duration-700">
            <details className="cursor-pointer">
              <summary className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Chi tiết lỗi (click để xem)
              </summary>
              <div className="mt-2 pt-2 border-t border-border text-xs font-mono text-muted-foreground break-all">
                <p className="mb-1">
                  <span className="text-foreground font-semibold">Mã lỗi:</span> {error.digest}
                </p>
                <p className="text-destructive/80">{error.message}</p>
              </div>
            </details>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <button
            onClick={() => reset()}
            className="group flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
          >
            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            <span className="font-medium">Thử lại</span>
          </button>
          
          <MVLink
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-all hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Về trang chủ</span>
          </MVLink>
        </div>

        {/* Help Text */}
        <p className="mt-8 text-sm text-muted-foreground animate-in fade-in duration-1000">
          Nếu vấn đề vẫn tiếp tục, vui lòng{' '}
          <MVLink href="/contact" className="text-primary hover:underline">
            liên hệ với chúng tôi
          </MVLink>
        </p>
      </div>

      {/* Custom shake animation */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
      `}</style>
    </div>
  );
}
