// export default InfoCard;
import demoVideo from "../assets/video/lessonplaninfovideo.mp4";
import photo from "../assets/images/SophiaPlanner_logo.png";
import { useEffect, useRef, useState } from "react";

const InfoCard = ({ isActive }: { isActive: boolean }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [muted, setMuted] = useState(true);

  // useEffect: Spela eller pausa videon beroende på om komponenten är aktiv
  useEffect(() => {
  
    if (isActive && videoRef.current) {
      console.log("Playing video");
      videoRef.current.play();
    } else if (videoRef.current) {
      console.log("Pausing video");
      videoRef.current.pause();
    }
  }, [isActive]);

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
    <div className="h-screen flex flex-col justify-start bg-gradient-to-b from-primary to-background px-4 py-4 md:px-10 md:py-10 overflow-y-auto">
      {/* Header */}
      <div className="text-center mb-6 md:mb-8">
        <h2 className="text-3xl md:text-5xl font-extrabold text-text mb-2 md:mb-4">
          Välkommen till SophiaPlanner
        </h2>
        <p className="text-base md:text-xl text-text-light">
          En smart lösning för att planera lektioner och skapa scheman för både
          lärare och elever.
        </p>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row items-center gap-8 w-full mx-auto bg-secondary p-6 md:p-10 rounded-xl shadow-lg">
        {/* Text Section */}
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-text mb-4">
            Förenkla. Anpassa. Inspirera.
          </h1>
          <p className="text-base md:text-lg text-text-light mb-6">
            Med SophiaPlanner kan du:
          </p>
          <ul className="list-disc list-inside text-text-light space-y-2">
            <li>Skapa personliga planeringar för varje elev.</li>
            <li>Hålla allt organiserat och alltid tillgängligt.</li>
            <li>Förbättra din undervisning med innovativa verktyg.</li>
          </ul>
        </div>

        {/* Video Section */}
        <div className="md:w-1/2 text-center">
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
  );
};
export default InfoCard;
