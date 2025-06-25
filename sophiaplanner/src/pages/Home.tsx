import demoVideo from "../../src/assets/video/lessonplaninfovideo.mp4";
import photo from "../assets/images/SophiaPlanner_logo.png";
import { FramerCarousel } from "../components/FramerCarousel";
import { Header } from "../components/Header";
import { useRef, useState } from "react";

const Home = () => {
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Funktion för att slå på/stänga av ljud på videon
  const toggleMute = () => {
    if (videoRef.current) {
      setMuted((prevMuted) => {
        const newMuted = !prevMuted;
        videoRef.current!.muted = newMuted; // Ändra mute-status direkt på videon
        return newMuted;
      });
    }
  };

  return (
    <div
      className="bg-gradient-to-b from-primary to-background h-screen overflow-hidden
"
    >
      <Header />
      <div>
        <div className="text-center mb-6 md:mb-8 pt-5">
          <h2 className="text-3xl md:text-5xl font-extrabold text-text mb-2 md:mb-4">
            Välkommen till SophiaPlanner
          </h2>
          <p className="text-base md:text-xl text-text-light">
            En smart lösning för att planera lektioner och skapa scheman för
            både lärare och elever.
          </p>
        </div>
      </div>
      <div className="h-[440px] m-5 max-w-6xl mx-auto flex gap-5 rounded-xl p-5">
        <div className="w-[48%] h-[400px] bg-secondary flex items-center justify-center rounded-xl overflow-hidden">
          <FramerCarousel />
        </div>
        <div className="w-[48%] h-[400px] bg-secondary flex items-center justify-center rounded-xl">
          {/* Video Section */}
          <div className="m-5 text-center">
            <video
              ref={videoRef}
              src={demoVideo}
              muted={muted}
              autoPlay
              loop
              className="w-full aspect-video rounded-md shadow-md"
              poster={photo}
            >
              Din webbläsare stöder inte video. Prova en annan webbläsare.
            </video>
            <button
              onClick={toggleMute}
              className="mt-4 bg-accent text-white px-4 py-2 rounded-lg font-semibold hover:bg-accent-light transition duration-300"
            >
              {muted ? "Slå på ljud" : "Stäng av ljud"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
