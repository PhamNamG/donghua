import { Facebook, Send } from 'lucide-react';
import MVLink from '../Link';

export const socialLinks = {
  facebook: 'https://www.facebook.com/phanhhh3d',
  telegram: 'https://t.me/myang_03',
} as const;

const socialIcons = {
  facebook: Facebook,
  telegram: Send,
} as const;


export default function Footer() {
  return (
    <footer className="py-8">
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-between gap-4 px-10">
            <p>© {new Date().getFullYear()} HH3D. All rights reserved.</p>
            <div className="flex items-center gap-3">
              Liên hệ quảng cáo qua 
              {Object.entries(socialLinks).map(([key, url]) => {
                const Icon = socialIcons[key as keyof typeof socialIcons];
                return (
                  <MVLink 
                    key={key}
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-primary"
                  >
                    <Icon className="w-4 h-4" />
                  </MVLink>
                );
              })}
            </div>
          </div>
        </div>
    </footer>
  );
} 