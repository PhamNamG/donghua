"use client";

import { useState, useEffect } from "react";
import {
  Download,
  Smartphone,
  Zap,
  Heart,
  Bell,
  Shield,
  Star,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  Sparkles,
  TrendingUp,
  Clock,
  MessageCircle,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DownloadPage() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [currentScreenshot, setCurrentScreenshot] = useState(0);

  const screenshots = [
    { title: "Trang chủ", desc: "Giao diện hiện đại" },
    { title: "Xem phim", desc: "Chất lượng HD" },
    { title: "Danh sách", desc: "Quản lý dễ dàng" },
    { title: "Cài đặt", desc: "Tùy chỉnh linh hoạt" },
  ];

  const handleDownload = () => {
    setIsDownloading(true);

    setTimeout(() => {
      const apkUrl = "/path-to-your-app.apk";
      const link = document.createElement("a");
      link.href = apkUrl;
      link.download = "HH3D-App.apk";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsDownloading(false);
    }, 1500);
  };

  const features = [
    {
      icon: Heart,
      title: "Danh sách yêu thích",
      description: "Lưu phim để xem sau",
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
    {
      icon: Bell,
      title: "Thông báo tập mới",
      description: "Nhận thông báo khi có tập mới",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      icon: Shield,
      title: "Không quảng cáo",
      description: "N/A",
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      icon: PlayCircle,
      title: "Offline Mode",
      description: "Xem phim đã tải về",
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      icon: Sparkles,
      title: "Giao diện đẹp mắt",
      description: "Dark mode & Light mode",
      color: "text-pink-500",
      bg: "bg-pink-500/10",
    },
  ];

  const installSteps = [
    {
      step: 1,
      title: "Tải xuống file APK",
      description: "Nhấn nút tải xuống bên dưới để tải file APK về máy",
    },
    {
      step: 2,
      title: "Bật nguồn không xác định",
      description: 'Vào Cài đặt > Bảo mật > Cho phép cài đặt từ "Nguồn không xác định"',
    },
    {
      step: 3,
      title: "Cài đặt ứng dụng",
      description: "Mở file APK vừa tải và nhấn Cài đặt",
    },
    {
      step: 4,
      title: "Xem phim",
      description: "Mở ứng dụng và bắt đầu xem phim yêu thích!",
    },
  ];

  const supportChannels = [
    {
      name: "Telegram",
      icon: "🚀",
      description: "Nhóm Telegram",
      members: "2.5K thành viên",
      link: "https://t.me/your-group",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/30",
    },
    {
      name: "Zalo",
      icon: "💬",
      description: "Nhóm Zalo",
      members: "1.8K thành viên",
      link: "https://zalo.me/your-group",
      color: "from-blue-600 to-blue-400",
      bgColor: "bg-blue-600/10",
      borderColor: "border-blue-600/30",
    },
  ];

  const stats = [
    { icon: Star, value: "4.8", label: "Đánh giá", color: "text-yellow-500" },
    { icon: Download, value: "50K+", label: "Lượt tải", color: "text-blue-500" },
    { icon: TrendingUp, value: "1000+", label: "Bộ phim", color: "text-green-500" },
    { icon: Users, value: "24/7", label: "Hỗ trợ", color: "text-purple-500" },
  ];

  // Auto-rotate screenshots
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentScreenshot((prev) => (prev + 1) % screenshots.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [screenshots.length]);

  const nextScreenshot = () => {
    setCurrentScreenshot((prev) => (prev + 1) % screenshots.length);
  };

  const prevScreenshot = () => {
    setCurrentScreenshot((prev) => (prev - 1 + screenshots.length) % screenshots.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center gap-2 mb-8">
          <Button variant="ghost" size="sm" className="gap-1" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>
        </div>

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 mb-16 shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-grid-white/[0.02]" />

          <div className="relative grid md:grid-cols-2 gap-8 p-8 md:p-16 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <Badge variant="secondary" className="w-fit bg-primary/10 text-primary border-primary/20">
                <Smartphone className="w-3 h-3 mr-1" />
                Ứng dụng Android
              </Badge>

              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  Xem phim
                  <br />
                  <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                    mọi lúc mọi nơi
                  </span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-md">
                  Tải ngay ứng dụng xem phim hoạt hình Trung Quốc với hàng nghìn bộ phim chất lượng cao, cập nhật liên tục.
                </p>
              </div>

              {/* Download Button */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="text-lg h-14 px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  {isDownloading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                      Đang tải...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                      Tải APK (Android)
                    </>
                  )}
                </Button>

                <Button size="lg" variant="outline" className="text-lg h-14 px-8 border-2">
                  <PlayCircle className="w-5 h-5 mr-2" />
                  Xem trên Web
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4 pt-8 border-t border-border/50">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="text-center transform hover:scale-110 transition-transform duration-300"
                  >
                    <div className={`${stat.color} mb-2 flex justify-center`}>
                      <div className="p-2 rounded-lg bg-background/50 backdrop-blur-sm border border-border/50">
                        <stat.icon className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="text-xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-xs text-muted-foreground font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - App Preview with Screenshots Slider */}
            <div className="relative flex justify-center items-center py-8">
              <div className="relative w-full max-w-sm">
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-purple-500/30 to-pink-500/30 blur-3xl animate-pulse" />

                {/* Phone mockup */}
                <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-[3rem] p-2.5 shadow-2xl border-[6px] border-gray-700/50">
                  {/* Screen area */}
                  <div className="bg-black rounded-[2.2rem] overflow-hidden aspect-[9/19.5] relative">
                    {/* Screenshots slider */}
                    <div className="relative w-full h-full">
                      {screenshots.map((screenshot, index) => (
                        <div
                          key={index}
                          className={`absolute inset-0 transition-all duration-700 ease-in-out ${index === currentScreenshot
                              ? "opacity-100 scale-100"
                              : "opacity-0 scale-95"
                            }`}
                        >
                          <div className="relative w-full h-full bg-gradient-to-br from-primary/10 via-background to-muted/30 flex flex-col items-center justify-center p-6">
                            {/* App icon */}
                            <div className="relative w-20 h-20 mb-6 rounded-2xl bg-primary/20 backdrop-blur-sm border border-primary/30 flex items-center justify-center shadow-lg">
                              <Smartphone className="w-10 h-10 text-primary" />
                            </div>

                            {/* Screenshot info */}
                            <div className="text-center space-y-2 mb-8">
                              <h3 className="text-2xl font-bold">{screenshot.title}</h3>
                              <p className="text-sm text-muted-foreground">{screenshot.desc}</p>
                            </div>

                            {/* Mock content */}
                            <div className="w-full space-y-3 px-4">
                              {[1, 2, 3].map((item) => (
                                <div key={item} className="bg-card/50 backdrop-blur-sm rounded-xl p-3 border border-border/50 flex items-center gap-3">
                                  <div className="w-16 h-16 rounded-lg bg-primary/10 flex-shrink-0" />
                                  <div className="flex-1 space-y-1">
                                    <div className="h-3 bg-foreground/20 rounded w-3/4" />
                                    <div className="h-2 bg-foreground/10 rounded w-1/2" />
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Star rating */}
                            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-1">
                              {[1, 2, 3, 4, 5].map((i) => (
                                <Star
                                  key={i}
                                  className="w-4 h-4 fill-yellow-500 text-yellow-500 animate-pulse"
                                  style={{ animationDelay: `${i * 100}ms` }}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Navigation arrows */}
                    <button
                      onClick={prevScreenshot}
                      className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-white" />
                    </button>
                    <button
                      onClick={nextScreenshot}
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-white" />
                    </button>

                    {/* Screenshot indicators */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                      {screenshots.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentScreenshot(index)}
                          className={`h-1.5 rounded-full transition-all duration-300 ${index === currentScreenshot
                              ? "w-8 bg-primary"
                              : "w-1.5 bg-white/30 hover:bg-white/50"
                            }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Phone details */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full border-2 border-gray-700" />
                  <div className="absolute right-0 top-24 w-1 h-12 bg-gray-700 rounded-l-sm" />
                  <div className="absolute left-0 top-20 w-1 h-8 bg-gray-700 rounded-r-sm" />
                  <div className="absolute left-0 top-32 w-1 h-8 bg-gray-700 rounded-r-sm" />
                </div>

                {/* Floating badges */}
                <div className="absolute -top-6 -right-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-xl flex items-center gap-2 animate-bounce">
                  <CheckCircle2 className="w-4 h-4" />
                  Miễn phí
                </div>
                <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-xl flex items-center gap-2 animate-pulse">
                  <Sparkles className="w-4 h-4" />
                  HD Quality
                </div>
                <div className="absolute top-1/2 -right-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl rotate-12">
                  Mới
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
              <MessageCircle className="w-3 h-3 mr-1" />
              Hỗ trợ
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60 bg-clip-text text-transparent">
              Tham gia cộng đồng
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Kết nối với hàng nghàn người dùng khác, nhận hỗ trợ nhanh chóng và cập nhật tin tức mới nhất
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {supportChannels.map((channel, index) => (
              <Card
                key={index}
                className={`group relative overflow-hidden border-2 ${channel.borderColor} hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-card to-card/50`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${channel.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                <CardContent className="p-8 relative">
                  <div className="flex items-start gap-6">
                    {/* Icon */}
                    <div className={`w-20 h-20 rounded-2xl ${channel.bgColor} flex items-center justify-center text-4xl flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                      {channel.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="text-2xl font-bold mb-1 group-hover:text-primary transition-colors duration-300">
                          {channel.name}
                        </h3>
                        <p className="text-muted-foreground">{channel.description}</p>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span className="font-medium">{channel.members}</span>
                      </div>

                      <Button
                        className={`w-full bg-gradient-to-r ${channel.color} hover:opacity-90 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                        onClick={() => window.open(channel.link, '_blank')}
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Tham gia ngay
                      </Button>
                    </div>
                  </div>

                  {/* Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge className={`${channel.bgColor} border-0 text-xs`}>
                      Hoạt động
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Support benefits */}
          <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Clock, title: "Hỗ trợ 24/7", desc: "Đội ngũ sẵn sàng giúp đỡ" },
              { icon: Users, title: "Cộng đồng lớn", desc: "Hàng nghìn thành viên" },
              { icon: Sparkles, title: "Cập nhật nhanh", desc: "Tin tức và tính năng mới" },
            ].map((item, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
              <Sparkles className="w-3 h-3 mr-1" />
              Tính năng
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60 bg-clip-text text-transparent">
              Tính năng nổi bật
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Trải nghiệm xem phim tuyệt vời với những tính năng được thiết kế đặc biệt cho bạn
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 hover:border-primary/30 bg-gradient-to-br from-card to-card/50"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardContent className="p-8 relative">
                  <div
                    className={`w-16 h-16 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}
                  >
                    <feature.icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>

                  <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Installation Guide */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Hướng dẫn
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60 bg-clip-text text-transparent">
              Hướng dẫn cài đặt
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Làm theo 4 bước đơn giản để cài đặt ứng dụng trên thiết bị Android
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {installSteps.map((item, index) => (
              <Card
                key={index}
                className="relative overflow-hidden border-2 hover:border-primary/40 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 group bg-gradient-to-br from-card to-card/50"
              >
                {index < installSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-14 -right-3 w-6 h-0.5 bg-gradient-to-r from-primary/50 to-transparent z-10" />
                )}

                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <CardContent className="p-8 relative">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[3rem] group-hover:scale-110 transition-transform duration-500" />
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center text-2xl font-black mb-6 shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                      {item.step}
                    </div>
                    <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Important Notice */}
        <section className="mb-20">
          <Card className="border-2 border-yellow-500/20 bg-yellow-500/5">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-yellow-500" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    Lưu ý quan trọng
                  </h3>
                  <div className="space-y-3 text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <p>Ứng dụng yêu cầu Android 6.0 trở lên để hoạt động tốt nhất.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <p>Bạn cần bật “Cho phép cài đặt từ nguồn không xác định” trong Cài đặt thiết bị.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <p>Tệp APK đã được kiểm tra an toàn, không chứa virus hay mã độc.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <p>Ứng dụng hoàn toàn miễn phí, không có quảng cáo và không thu thập dữ liệu cá nhân.</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
