import React from "react";
import Hero from "../components/Hero";
import FeatureSection from "../components/FeatureSection";
import Banner from "../components/Banner";
import Testimonial from "../components/Testimonial";
import NewsLatter from "../components/NewsLatter";

const Home = () => {
  return (
    <div>
      <Hero />
      <FeatureSection />
      <Banner/>
      <Testimonial/>
      <NewsLatter/>
    </div>
  );
};

export default Home;
