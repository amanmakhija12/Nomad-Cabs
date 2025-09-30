import FAQ from "../components/Faqs/FAQ";
import HeroSection from "../components/Hero/HeroSection";
import Navbar from "../components/Navbar/Navbar";
import PlanSection from "../components/Plan/PlanSection";
import Testimonials from "../components/Testimonials/Testimonials";
import Footer from "../components/Footer/Footer";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const ScrollAnimation = ({ children}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 75 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 75 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

const LandingPage = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <ScrollAnimation>
        <PlanSection />
      </ScrollAnimation>
      <ScrollAnimation>
        <Testimonials />
      </ScrollAnimation>
      <ScrollAnimation>
        <FAQ />
      </ScrollAnimation>
      <ScrollAnimation>
        <Footer />
      </ScrollAnimation>
    </>
  );
};
export default LandingPage;
