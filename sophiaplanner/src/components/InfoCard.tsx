const InfoCard = () => (
  <div className="h-screen flex justify-center items-center bg-background">
    <div className="w-full max-w-4xl bg-secondary p-6 rounded-lg shadow-md text-center">
      <h2 className="text-2xl font-bold text-text mb-4">Eureka</h2>
      <p className="text-lg text-text">
        Hantera lektioner och scheman enkelt. Anpassat för både lärare och
        elever.
      </p>
      <img
        src="/path-to-image.jpg"
        alt="Eureka info"
        className="mt-6 mx-auto max-h-60"
      />
    </div>
  </div>
);

export default InfoCard;
