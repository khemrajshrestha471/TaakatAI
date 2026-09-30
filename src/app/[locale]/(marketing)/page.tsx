import {
  AiSection,
  Faq,
  FinalCta,
  ForCoaches,
  Hero,
  HowItWorks,
  PaymentStrip,
  Pricing,
  Services,
  Testimonials,
  Transformations,
} from "@/features/marketing/sections";

export default function HomePage() {
  return (
    <>
      <Hero />
      <PaymentStrip />
      <Services />
      <HowItWorks />
      <AiSection />
      <ForCoaches />
      <Transformations />
      <Pricing />
      <Testimonials />
      <Faq />
      <FinalCta />
    </>
  );
}
