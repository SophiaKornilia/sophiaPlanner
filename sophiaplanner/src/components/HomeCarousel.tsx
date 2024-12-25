import Slider from "react-slick";
import InfoCard from "./InfoCard";
import InfoTeachersStudents from "./InfoTeacherStudent";
import Register from "./Register";

const HomeCarousel = () => {
  const settings = {
    dots: true, // Navigeringspunkter längst ner
    infinite: true, // Loopar slides
    speed: 500, // Bythastighet
    slidesToShow: 1, // Antal slides som visas samtidigt
    slidesToScroll: 1, // Antal slides som scrollas
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <Slider {...settings}>
      <div>
        <InfoCard />
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
