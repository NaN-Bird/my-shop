import React from "react";
import Hero from "../components/Hero";
import HeroCategories from "../components/HeroCategories";
import InstagramSlider from "../components/InstagramSlider";
import Reviews from "../components/Reviews";

export default function HomePage() {
    return (
        <>
            <Hero />
            <HeroCategories />
            <InstagramSlider />
            <Reviews />
        </>
    );
}
