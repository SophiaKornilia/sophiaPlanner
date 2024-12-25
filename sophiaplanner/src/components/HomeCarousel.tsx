import Slider from "react-slick";
import InfoCard from "./InfoCard";
import InfoTeachersStudents from "./InfoTeacherStudent";
import Register from "./Register";
import { useState } from "react";

const HomeCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const settings = {
    dots: true, // Navigeringspunkter längst ner
    infinite: true, // Loopar slides
    speed: 500, // Bythastighet
    slidesToShow: 1, // Antal slides som visas samtidigt
    slidesToScroll: 1, // Antal slides som scrollas
    autoplay: true,
    autoplaySpeed: 5000,
    beforeChange: (next: any) => {
      setActiveIndex(next); // Uppdaterar den aktiva sidan innan bytet
    },
  };

  return (
    <Slider {...settings}>
      <div>
        <InfoCard isActive={activeIndex === 0} />
      </div>
      <div>
        <InfoTeachersStudents />
      </div>
      <div>
        <Register />
      </div>
    </Slider>
  );
};

export default HomeCarousel;
