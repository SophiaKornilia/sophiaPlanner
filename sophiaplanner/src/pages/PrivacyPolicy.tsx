export const PrivacyPolicy = () => {
  return (
    <div className="p-6 bg-gradient-to-b from-primary to-background">
      <h1 className="text-3xl font-bold mb-4">
        Integritetspolicy (Privacy Policy)
      </h1>
      <p className="mb-4">
        Vi på Kornilia värnar om din personliga integritet och strävar efter att
        skydda de personuppgifter som du delar med oss. Denna integritetspolicy
        beskriver vilken data vi samlar in, varför vi samlar in den, och hur vi
        hanterar och skyddar dina uppgifter.
      </p>
      <h2 className="text-2xl font-semibold mt-6 mb-2">
        Vilken data samlar vi in?
      </h2>
      <ul className="list-disc list-inside mb-4">
        <li>
          <strong>Namn</strong>
        </li>
        <li>
          <strong>E-postadress</strong>
        </li>
        <li>
          <strong>Lösenord</strong> (krypterat och säkerställt)
        </li>
        <li>
          <strong>IP-adress</strong> (om det krävs för säkerhetsåtgärder eller
          teknisk support)
        </li>
      </ul>
      <h2 className="text-2xl font-semibold mt-6 mb-2">
        Hur används din data?
      </h2>
      <ul className="list-disc list-inside mb-4">
        <li>Skapa och hantera ditt konto.</li>
        <li>Tillhandahålla våra tjänster.</li>
        <li>
          Kommunicera med dig vid behov (t.ex. support eller viktiga
          meddelanden).
        </li>
      </ul>
      <h2 className="text-2xl font-semibold mt-6 mb-2">
        Hur länge sparas din data?
      </h2>
      <p className="mb-4">
        Vi sparar din data så länge det är nödvändigt för att uppfylla syftet
        med behandlingen eller tills du begär att vi ska radera den. Du har rätt
        att när som helst kontakta oss för att begära radering av dina
        personuppgifter.
      </p>
      <h2 className="text-2xl font-semibold mt-6 mb-2">
        Hur kan du komma åt eller radera dina uppgifter?
      </h2>
      <p className="mb-4">
        Om du vill få tillgång till de uppgifter vi har om dig, eller om du
        önskar att vi raderar din data, kan du kontakta oss på:
      </p>
      <p className="mb-4">
        <strong>E-post:</strong>{" "}
        <a href="mailto:info@kornilia.com" className="text-blue-500">
          info@kornilia.com
        </a>
      </p>
      <h2 className="text-2xl font-semibold mt-6 mb-2">
        Hur skyddar vi din data?
      </h2>
      <p className="mb-4">
        Vi vidtar lämpliga tekniska och organisatoriska åtgärder för att skydda
        dina personuppgifter mot obehörig åtkomst, förlust eller manipulering.
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>
          Lösenord lagras <strong>krypterade</strong>.
        </li>
        <li>
          All kommunikation med våra servrar sker via{" "}
          <strong>säkra protokoll (SSL/TLS)</strong>.
        </li>
      </ul>
      <h2 className="text-2xl font-semibold mt-6 mb-2">Frågor?</h2>
      <p>
        Om du har frågor om hur vi hanterar din data eller vill veta mer om vår
        integritetspolicy, tveka inte att kontakta oss:
      </p>
      <p>
        <strong>E-post:</strong>{" "}
        <a href="mailto:info@kornilia.com" className="text-blue-500">
          info@kornilia.com
        </a>
      </p>
      <p className="mt-6 text-sm text-gray-500">
        *Denna policy uppdaterades senast: 28 december 2024.
      </p>
    </div>
  );
};
