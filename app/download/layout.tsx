import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tải ứng dụng | Xem phim mọi lúc mọi nơi",
  description:
    "Tải ứng dụng xem phim hoạt hình Trung Quốc miễn phí cho Android. Xem phim mượt mà, chất lượng cao với giao diện thân thiện.",
  keywords: [
    "tải app xem phim",
    "app hoạt hình trung quốc",
    "download apk",
    "app xem phim miễn phí",
    "ứng dụng xem anime",
  ],
  openGraph: {
    title: "Tải ứng dụng xem phim hoạt hình Trung Quốc",
    description: "Trải nghiệm xem phim tuyệt vời trên điện thoại Android",
    type: "website",
  },
};

export default function DownloadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

