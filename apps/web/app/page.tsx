import { Navbar } from "@/components/layouts/Navbar";
import { Hero } from "@/components/ui/Hero";
import { DashboardContent } from "@/components/ui/DashboardContent";
import { Footer } from "@/components/layouts/Footer";

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="bg-background pt-16">
        <Hero />
        <DashboardContent />
        <Footer />
      </main>
    </>
  );
}
