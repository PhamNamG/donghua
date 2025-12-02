import { Facebook, Send, Twitter, Youtube } from 'lucide-react';
import MVLink from '../Link';
import Image from 'next/image';

export const socialLinks = {
  facebook: 'https://www.facebook.com/phanhhh3d',
  telegram: 'https://t.me/myang_03',
  twitter: '#',
  youtube: '#',
} as const;

const socialIcons = {
  facebook: Facebook,
  telegram: Send,
  twitter: Twitter,
  youtube: Youtube,
} as const;

const footerLinks = {
  main: [
    { name: 'Hội Đáp', href: '/faq' },
    { name: 'Chính sách bảo mật', href: '/privacy' },
    { name: 'Điều khoản sử dụng', href: '/terms' },
    { name: 'Giới thiệu', href: '/about' },
    { name: 'Liên hệ', href: '/contact' },
  ],
  categories: [
    { name: '#ophim', href: '/' },
    { name: '#hhkungfu', href: '/' },
    { name: '#hhpanda', href: '/' },
    { name: '#animehay', href: '/' },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Top Section: Logo + Vietnam Badge */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <MVLink href="/" className="flex items-center gap-3">
            <Image
              src="/images/b32705f7-9444-41f9-8457-d1cc7773a259-min.png"
              alt="HH3D Logo"
              width={60}
              height={60}
              className="rounded-full"
            />
            <div>
              <h3 className="text-2xl font-bold">HH3D</h3>
              <div className="flex items-center gap-2">
                {footerLinks.categories.map((link) => (
                  <div key={link.href}>
                    <MVLink
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </MVLink>
                  </div>
                ))}
              </div>
            </div>
            <div className='border-l border-muted-foreground h-[60px] w-1 mx-10 border-[#e0e0e0]!'></div>
            <div>
              <div className="flex gap-10">
                {Object.entries(socialLinks).map(([key, url]) => {
                  const Icon = socialIcons[key as keyof typeof socialIcons];
                  return (
                    <MVLink
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                      <Icon className="w-5 h-5" />
                    </MVLink>
                  );
                })}
              </div>
            </div>
          </MVLink>
        </div>

        {/* Middle Section: Links Grid */}
        {/* Main Links */}
        <div className="w-6/12 flex gap-2 mb-6">
          {footerLinks.main.map((link) => (
            <div key={link.href}>
              <MVLink
                href={link.href}
                className="text-sm text-muted-foreground hover:text-primary transition-colors color-[#e0e0e0]!"
              >
                {link.name}
              </MVLink>
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="mb-8 text-sm text-muted-foreground leading-relaxed w-6/12">
          <p>
            HH3D – Trang xem phim hoạt hình Trung Quốc (Donghua) online chất lượng cao miễn phí,
            thuyết minh, lồng tiếng full HD. Kho phim mới không lộ, phim chiếu rạp, phim bộ,
            phim lẻ từ nhiều quốc gia như Việt Nam, Hàn Quốc, Trung Quốc, Thái Lan, Nhật Bản,
            Âu Mỹ... đa dạng thể loại. Khám phá nền tảng phim trực tuyến hàng đầu 2024 chất lượng 4K!
          </p>
        </div>
      </div>
    </footer>
  );
} 