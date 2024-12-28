// import Slider from "react-slick";
// import InfoCard from "./InfoCard";
// import InfoTeachersStudents from "./InfoTeacherStudent";
// import Register from "./Register";
// import { useState } from "react";

// const HomeCarousel = () => {
//   const [activeIndex, setActiveIndex] = useState(0);

//   const settings = {
//     // dots: true, // Navigeringspunkter längst ner
//     infinite: true, // Loopar slides
//     speed: 500, // Bythastighet
//     slidesToShow: 1, // Antal slides som visas samtidigt
//     slidesToScroll: 1, // Antal slides som scrollas
//     autoplay: true,
//     autoplaySpeed: 5000,
//     pauseOnHover: true,
//     beforeChange: (next: any) => {
//       setActiveIndex(next); // Uppdaterar den aktiva sidan innan bytet
//     },
//   };

//   return (
//     <div className="relative h-screen w-full">
//       <Slider {...settings}>
//         <div className="h-screen flex items-center justify-center">
//           <InfoCard isActive={activeIndex === 0} />
//         </div>
//         <div className="h-screen flex items-center justify-center">
//           <InfoTeachersStudents />
//         </div>
//         <div className="h-screen flex items-center justify-center">
//           <Register />
//         </div>
//       </Slider>
//     </div>
//   );
// };

// export default HomeCarousel;
