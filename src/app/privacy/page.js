"use client";
// app/privacy/page.js
export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          SwapDeals - Integritetspolicy
        </h1>
        
        <p className="text-gray-600 mb-8">
          Senast uppdaterad: 2024-12-01
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            1. Inledning
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Välkommen till SwapDeals integritetspolicy. Vi på SwapDeals värnar om din integritet 
            och är engagerade i att skydda dina personuppgifter. Denna integritetspolicy förklarar 
            hur vi samlar in, använder, delar och skyddar dina personuppgifter när du använder vår tjänst.
          </p>
          <p className="text-gray-700 leading-relaxed mt-4">
            SwapDeals är en plattform där användare kan byta föremål med varandra. För att 
            tillhandahålla denna tjänst behöver vi behandla vissa personuppgifter om dig.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            2. Personuppgiftsansvarig
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-semibold">Personuppgiftsansvarig: SwapDeals AB</p>
            <ul className="mt-2 space-y-1 text-gray-700">
              <li><strong>Organisationsnummer:</strong> 556123-4567</li>
              <li><strong>Adress:</strong> Storgatan 1, 111 11 Stockholm</li>
              <li><strong>E-post:</strong> privacy@swapdeals.se</li>
              <li><strong>Telefon:</strong> 08-123 45 67</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            3. Vilka personuppgifter samlar vi in?
          </h2>
          <p className="text-gray-700 mb-4">
            Vi samlar in följande kategorier av personuppgifter:
          </p>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Kontoregistrering:</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                
                <li>E-postadress</li>
                
                <li>Profilbild (valfritt)</li>
                <li>Användarnamn</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Användningsdata:</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>IP-adress</li>
                <li>Enhetstyp och operativsystem</li>
                <li>Webbläsartyp och version</li>
                <li>Sidor du besöker på vår plattform</li>
                <li>Klick och navigering</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            4. Hur använder vi dina personuppgifter?
          </h2>
          <p className="text-gray-700 mb-3">
            Vi använder dina personuppgifter för att:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
            <li>Tillhandahålla våra tjänster</li>
            <li>Skapa och hantera ditt användarkonto</li>
            <li>Möjliggöra listning av föremål för byte</li>
            <li>Matcha användare med kompatibla bytesönskemål</li>
            <li>Underlätta kommunikation mellan användare</li>
            <li>Säkerställa plattformens säkerhet</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            5. Rättslig grund för behandling
          </h2>
          <p className="text-gray-700 mb-4">
            Vi behandlar dina personuppgifter baserat på följande rättsliga grunder enligt GDPR:
          </p>
          <div className="space-y-3">
            <div className="flex">
              <span className="font-medium text-gray-800 w-32 flex-shrink-0">Avtalsuppfyllelse:</span>
              <span className="text-gray-700">För att tillhandahålla de tjänster du har begärt</span>
            </div>
            <div className="flex">
              <span className="font-medium text-gray-800 w-32 flex-shrink-0">Berättigat intresse:</span>
              <span className="text-gray-700">För att förbättra våra tjänster och säkerställa säkerhet</span>
            </div>
            <div className="flex">
              <span className="font-medium text-gray-800 w-32 flex-shrink-0">Samtycke:</span>
              <span className="text-gray-700">För valfria funktioner som marknadsföring</span>
            </div>
            <div className="flex">
              <span className="font-medium text-gray-800 w-32 flex-shrink-0">Rättslig förpliktelse:</span>
              <span className="text-gray-700">För att uppfylla lagliga krav</span>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            6. Dina rättigheter
          </h2>
          <p className="text-gray-700 mb-4">
            Du har följande rättigheter enligt GDPR:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-2">Rätt till information och tillgång</h3>
              <p className="text-sm text-gray-600">Begära en kopia av dina personuppgifter</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-2">Rätt till rättelse</h3>
              <p className="text-sm text-gray-600">Korrigera felaktiga uppgifter</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-2">Rätt till radering</h3>
              <p className="text-sm text-gray-600">Rätten att bli glömd</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-2">Rätt till dataportabilitet</h3>
              <p className="text-sm text-gray-600">Få dina data i strukturerat format</p>
            </div>
          </div>
          <p className="text-gray-700 mt-4">
            Kontakta oss på{' '}
            <a href="mailto:privacy@swapdeals.se" className="text-blue-600 hover:underline">
              privacy@swapdeals.se
            </a>{' '}
            för att utöva dina rättigheter.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            13. Kontakta oss
          </h2>
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-gray-700 mb-4">
              Om du har frågor om denna integritetspolicy:
            </p>
            <div className="space-y-2 text-gray-700">
              <p><strong>E-post:</strong> privacy@swapdeals.se</p>
              <p><strong>Telefon:</strong> 08-123 45 67</p>
              <p><strong>Postadress:</strong> SwapDeals AB, Storgatan 1, 111 11 Stockholm</p>
              <p><strong>Kontorstider:</strong> Måndag - Fredag: 09:00 - 17:00</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}