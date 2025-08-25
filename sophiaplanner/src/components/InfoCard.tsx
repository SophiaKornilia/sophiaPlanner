const InfoCard = () => {
  return (
    <div className="w-full max-w-xl mx-auto bg-secondary rounded-xl  px-6 py-8 text-left">
      <h2 className="text-xl font-bold text-text mb-4 leading-tight">
        Förenkla.
        <br />
        Anpassa.
        <br />
        Inspirera.
      </h2>
      <p className="text-sm text-text-light mb-4">Med SophiaPlanner kan du:</p>
      <ul className="list-disc pl-5 space-y-2 text-sm text-text-light leading-snug">
        <li>Skapa personliga planeringar för varje elev.</li>
        <li>Hålla allt organiserat och alltid tillgängligt.</li>
        <li>Förbättra din undervisning med innovativa verktyg.</li>
      </ul>
    </div>
  );
};

export default InfoCard;
