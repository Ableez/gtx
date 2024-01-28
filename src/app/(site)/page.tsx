import Contact from "@/components/landing/Contact";
import Cwu from "@/components/landing/Cwu";
import FAQs from "@/components/landing/FAQs";
import Features from "@/components/landing/Features";
import Hero from "@/components/landing/Hero";
import Metrics from "@/components/landing/Metrics";
import Service from "@/components/landing/Service";
import ServiceDetail from "@/components/landing/ServiceDetail";
import UserFeedBacks from "@/components/landing/UserFeedBacks";

export default function Home() {
  return (
    <main className="text-center tracking-normal">
      <Hero />
      <Service />
      <Metrics />
      <Cwu />
      <Features />
      <ServiceDetail />
      <UserFeedBacks />
      <FAQs />
      <Contact />
    </main>
  );
}
