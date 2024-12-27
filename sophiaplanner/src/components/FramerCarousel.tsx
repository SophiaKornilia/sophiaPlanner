import { useState } from "react";
import InfoCard from "./InfoCard";
import InfoTeachersStudents from "./InfoTeacherStudent";
import Register from "./Register";
import { AnimatePresence, motion } from "framer-motion";

export const FramerCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = [
    { id: 1, content: <InfoCard isActive={activeIndex === 0} /> }, // Första sliden med InfoCard-komponenten
    { id: 2, content: <InfoTeachersStudents /> }, // Andra sliden med InfoTeachersStudents-komponenten
    { id: 3, content: <Register /> }, // Tredje sliden med Register-komponenten
  ];

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Rendera slides */}
      <AnimatePresence>
        {slides.map(
          (slide, index) =>
            index === activeIndex && ( // Visa endast den aktiva sliden
              <motion.div
                key={slide.id}
                className="absolute w-full h-full flex items-center justify-center bg-gray-100"
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

      {/* Navigeringsknappar */}
      <button
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-text bg-opacity-75 text-white p-3 rounded-full shadow-lg hover:bg-opacity-90"
        onClick={() =>
          setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length)
        }
      >
        &lt;
      </button>

      <button
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-text bg-opacity-75 text-white p-3 rounded-full shadow-lg hover:bg-opacity-90"
        onClick={() => setActiveIndex((prev) => (prev + 1) % slides.length)}
      >
        &gt;
      </button>
    </div>
  );
};
