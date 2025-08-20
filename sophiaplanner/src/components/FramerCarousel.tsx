import { useEffect, useState } from "react";
import InfoCard from "./InfoCard";
import InfoTeachersStudents from "./InfoTeacherStudent";
import Register from "./Register";
import { AnimatePresence, motion } from "framer-motion";

interface Slide {
  id: number;
  content: JSX.Element;
}
export const FramerCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides: Slide[] = [
    { id: 1, content: <InfoCard /> }, // Första sliden med InfoCard-komponenten
    { id: 2, content: <InfoTeachersStudents /> }, // Andra sliden med InfoTeachersStudents-komponenten
    { id: 3, content: <Register /> }, // Tredje sliden med Register-komponenten
  ];

  useEffect(() => {
    if (isPaused) return; // gör inget om pausad

    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  return (
    <div
      className="relative w-full min-h-[450px] overflow-hidden transition-transform duration-300 hover:scale-[1.01] md:h-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Rendera slides */}
      <AnimatePresence>
        {slides.map(
          (slide, index) =>
            index === activeIndex && ( // Visa endast den aktiva sliden
              <motion.div
                key={slide.id}
                className="absolute inset-0 w-full min-h-[400px] md:h-full flex items-center justify-center bg-secondary px-4 py-6 md:px-0 md:py-0"
                initial={{ x: 300 }} // Börjar från höger
                animate={{ x: 0 }} // Flyttar in till mitten
                exit={{ x: -300 }} // Försvinner till vänster
                transition={{ duration: 0.5 }} // 0.5 sekunders animering
              >
                {slide.content} {/* Rendera innehållet (din komponent) */}
              </motion.div>
            )
        )}
      </AnimatePresence>
    </div>
  );
};
