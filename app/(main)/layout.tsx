import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { SeriesProvider } from "@/contexts/SeriesContext";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SeriesProvider>
      <Header />
      {children}
      <Footer />
    </SeriesProvider>
  );
}

