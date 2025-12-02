'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Search, Menu, X, Heart, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useCallback } from 'react';
import debounce from 'lodash/debounce';
import MVLink from '../Link';
import Image from 'next/image';
import { NAVIGATION, type NavigationItem } from '@/constant';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { useWatchlistStore } from '@/store/watchlist';
import { ThemeToggle } from '@/components/theme-toggle-select-dynamic';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { animes } = useWatchlistStore();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      if (query.trim()) {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        setIsSearchOpen(false);
        setSearchQuery('');
      }
    }, 500),
    [router]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    debouncedSearch(searchQuery);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim()) {
      debouncedSearch(value);
    }
  };

  const childCategories = [
    { name: 'Chính kịch', href: '/categories/chinh-kich' },
    { name: 'Hành động', href: '/categories/hanh-dong' },
    { name: 'Kinh dị', href: '/categories/kinh-di' },
    { name: 'Lãng mạn', href: '/categories/lang-man' },
    { name: 'Tình cảm', href: '/categories/tinh-cam' },
    { name: 'Tội ác', href: '/categories/toi-ac' },
    { name: 'Võ thuật', href: '/categories/vo-thuat' },
    { name: 'Viễn tưởng', href: '/categories/vien-tuong' },

  ];
  return (
    <header className="border-b sticky top-0 bg-background z-50">
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center gap-4 md:gap-8">
            <MVLink href="/" className="text-md md:text-1xl font-bold">
              <Image src={'/images/b32705f7-9444-41f9-8457-d1cc7773a259-min.png'} alt='logo' width={60} height={60} />
            </MVLink>
            <nav className="hidden md:flex gap-6 py-4 items-center">
              {NAVIGATION(childCategories).map((item: NavigationItem) => (
                <div key={item.href} className="relative">
                  {item.children ? (
                    <button
                      onClick={() => setOpenDropdown(openDropdown === item.name ? null : item.name)}
                      className="flex items-center gap-1 text-sm font-medium hover:text-primary"
                    >
                      {item.name}
                      <ChevronDown
                        className={`w-4 h-4 ${openDropdown === item.name ? 'rotate-180' : ''}`}
                      />
                    </button>
                  ) : (
                    item.href === '#' ? (
                      <div className="text-sm font-medium">
                        {item.name}
                      </div>
                    ) : (
                      <MVLink
                        href={item.href}
                        className="text-sm font-medium"
                      >
                        {item.name}
                      </MVLink>
                    ))}

                  {/* Dropdown Menu */}
                  {item.children && openDropdown === item.name && (
                    <div
                      className="
                      grid grid-cols-2 lg:grid-cols-4 gap-2
                      absolute top-full left-0 mt-2 p-4
                      w-[400px] lg:w-[600px]
                      bg-background/95 backdrop-blur-md
                      rounded-xl shadow-2xl 
                      border border-border/50
                      z-50
                    "
                    >
                      {item.children.map((child: { name: string; href: string }) => (
                        <MVLink
                          key={child.href}
                          href={child.href}
                          className="
                            px-4 py-2.5 
                            text-sm font-medium text-center
                            text-foreground/80 
                            hover:text-primary
                            hover:bg-gray-100
                            rounded-lg
                          "
                          onClick={() => setOpenDropdown(null)}
                        >
                          {child.name}
                        </MVLink>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Desktop Search and Profile */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />

            <Tooltip>
              <TooltipTrigger asChild>
                <MVLink href="/profile" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9 relative">
                  <Heart className="h-5 w-5" />
                  {animes.length > 0 && (
                    <Badge variant="secondary" className="absolute -top-1 -right-2 h-5 min-w-[20px] flex items-center justify-center p-0 text-xs">
                      {animes.length}
                    </Badge>
                  )}
                </MVLink>
              </TooltipTrigger>
              <TooltipContent>
                <p>Phim đã lưu</p>
              </TooltipContent>
            </Tooltip>

            <form onSubmit={handleSearch} className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm phim..."
                className="pl-8"
                value={searchQuery}
                onChange={handleInputChange}
              />
            </form>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden py-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm phim..."
                className="pl-8"
                value={searchQuery}
                onChange={handleInputChange}
              />
            </form>
          </div>
        )}

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t">
            <nav className="flex flex-col py-4">
              {NAVIGATION(childCategories).map((item: NavigationItem) => (
                <div key={item.href} className="relative">
                  <div className="flex items-center justify-between px-4 py-2">
                    <MVLink
                      href={item.href}
                      className={`flex-1 text-sm font-medium hover:text-primary ${pathname === item.href ? 'text-primary' : 'text-muted-foreground'
                        }`}
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setMobileDropdown(null);
                      }}
                    >
                      {item.name}
                    </MVLink>
                    {item.children && (
                      <button
                        onClick={() => setMobileDropdown(mobileDropdown === item.name ? null : item.name)}
                        className="p-2 hover:bg-accent rounded-md"
                        aria-label="Toggle dropdown"
                      >
                        <ChevronDown
                          className={`w-4 h-4 ${mobileDropdown === item.name ? 'rotate-180' : ''
                            }`}
                        />
                      </button>
                    )}
                  </div>

                  {/* Mobile Dropdown */}
                  {item.children && mobileDropdown === item.name && (
                    <div className="px-4 pb-2 space-y-1">
                      {item.children.map((child: { name: string; href: string }) => (
                        <MVLink
                          key={child.href}
                          href={child.href}
                          className="
                            block px-4 py-2 
                            text-sm font-medium
                            text-muted-foreground
                            hover:text-primary
                            hover:bg-primary/10
                            rounded-md
                            border-l-2 border-transparent
                            hover:border-primary
                          "
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            setMobileDropdown(null);
                          }}
                        >
                          {child.name}
                        </MVLink>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <MVLink
                href="/profile"
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Heart className="h-4 w-4" />
                <span className="flex-1">Phim đã lưu</span>
                {animes.length > 0 && (
                  <Badge variant="secondary" className="h-5 min-w-[20px] flex items-center justify-center p-0 text-xs">
                    {animes.length}
                  </Badge>
                )}
              </MVLink>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
} 