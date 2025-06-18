'use client';
//app/terms/page.js
import { useRouter } from 'next/navigation';
import { ArrowLeft, FileText, Shield, Users, AlertCircle, Gavel, Mail, Phone, MapPin, Clock, Scale, FileCheck, Globe, Lock } from 'lucide-react';

export default function TermsOfServicePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Tillbaka
            </button>
            <div className="flex items-center">
              <FileText className="w-6 h-6 text-blue-600 mr-2" />
              <div className="text-right">
                <h1 className="text-lg font-bold text-gray-800">Användarvillkor</h1>
                <p className="text-sm text-gray-600">SwapDeals</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Terms Content */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">SwapDeals - Användarvillkor</h1>
              <p className="text-gray-600">Senast uppdaterad: [Datum]</p>
            </div>

            <div className="prose prose-gray max-w-none space-y-8">
              
              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Shield className="w-5 h-5 text-blue-600 mr-2" />
                  1. Allmänna bestämmelser
                </h2>
                <p className="text-gray-700 mb-4">
                  Välkommen till SwapDeals! Dessa användarvillkor (Villkor) reglerar din användning av SwapDeals-appen och våra tjänster (Tjänsten). Genom att använda SwapDeals godkänner du dessa villkor i sin helhet.
                </p>
                <p className="text-gray-700">
                  SwapDeals är en plattform där användare kan byta föremål med varandra på ett säkert och gemenskapsinriktat sätt. Vi fungerar som en förmedlare mellan användare men deltar inte direkt i byteshandlarna.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <FileCheck className="w-5 h-5 text-green-600 mr-2" />
                  2. Definitioner
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Plattformen</strong> avser SwapDeals-appen och alla relaterade tjänster</li>
                  <li><strong>Användare</strong> avser alla personer som använder vår tjänst</li>
                  <li><strong>Föremål</strong> avser varor som listas för byte på plattformen</li>
                  <li><strong>Byte</strong> avser utbytet av föremål mellan användare</li>
                  <li><strong>Vi/Oss</strong> avser SwapDeals och dess representanter</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Users className="w-5 h-5 text-purple-600 mr-2" />
                  3. Användarkonto och registrering
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">3.1 Kontoskapande</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                    
                      <li>All information du lämnar måste vara korrekt och aktuell</li>
                      <li>Du är ansvarig för att hålla dina inloggningsuppgifter säkra</li>
                      
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">3.2 Kontosäkerhet</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>Du är fullt ansvarig för all aktivitet på ditt konto</li>
                      <li>Meddela oss omedelbart om du misstänker obehörig användning</li>
                      <li>Vi förbehåller oss rätten att stänga av konton vid misstänkt missbruk</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Globe className="w-5 h-5 text-indigo-600 mr-2" />
                  4. Användning av tjänsten
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">4.1 Tillåten användning</h3>
                    <p className="text-gray-700 mb-2">Du får använda SwapDeals för att:</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>Lista föremål för byte</li>
                      <li>Bläddra bland andra användares föremål</li>
                      <li>Kommunicera med andra användare om potentiella byten</li>
                      <li>Genomföra byten enligt dessa villkor</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">4.2 Förbjuden användning</h3>
                    <p className="text-gray-700 mb-2">Du får INTE:</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>Lista illegala, stulna eller farliga föremål</li>
                      <li>Använda plattformen för kommersiell försäljning</li>
                      <li>Trakassera, hota eller på annat sätt störa andra användare</li>
                      <li>Försöka kringgå våra säkerhetssystem</li>
                      <li>Skapa falska konton eller identiteter</li>
                      <li>Lista föremål du inte äger eller har rätt att byta bort</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <FileText className="w-5 h-5 text-orange-600 mr-2" />
                  5. Listning av föremål
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">5.1 Krav för listning</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>Alla föremål måste beskrivas ärligt och korrekt</li>
                      <li>Foton måste vara aktuella och visa föremålets verkliga skick</li>
                      <li>Du måste ange eventuella defekter eller skador</li>
                     
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">5.2 Förbjudna föremål</h3>
                    <p className="text-gray-700 mb-2">Följande får INTE listas:</p>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        <li>Illegala substanser eller föremål</li>
                        <li>Vapen, ammunition eller explosiva ämnen</li>
                        <li>Levande djur</li>
                        <li>Medicinska produkter eller receptbelagda läkemedel</li>
                        <li>Alkohol eller tobaksprodukter</li>
                        <li>Förfalskade eller piratkopierade varor</li>
                        <li>Föremål som kränker upphovsrätt eller varumärken</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <ArrowLeft className="w-5 h-5 text-teal-600 mr-2 transform rotate-180" />
                  6. Bytesprocess
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">6.1 Erbjudanden och godkännanden</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>Du kan när som helst avbryta bytet eller dra tillbaka ditt erbjudande</li>
                      
                      
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">6.2 Kommunikation</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>All kommunikation mellan användare ska vara respektfull</li>
                      
                      <li>Vi förbehåller oss rätten att övervaka kommunikation för säkerhet</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">6.3 Genomförande av byte</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>Användare är själva ansvariga för att arrangera utbyte</li>
                      <li>Vi rekommenderar möten på offentliga platser för säkerhet</li>
                      <li>Båda parter måste markera bytet som slutfört i appen</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                  7. Användaransvar och säkerhet
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">7.1 Personlig säkerhet</h3>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        <li>Träffa alltid andra användare på säkra, offentliga platser</li>
                        <li>Ta med en vän om möjligt</li>
                        <li>Lita på din instinkt - avbryt om något känns fel</li>
                        <li>Vi rekommenderar möten under dagtid</li>
                      </ul>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">7.2 Föremålsverifiering</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>Inspektera alltid föremål innan byte genomförs</li>
                      <li>Du accepterar föremål i befintligt skick</li>
                      <li>Klaga inom 24 timmar efter genomfört byte</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Shield className="w-5 h-5 text-red-600 mr-2" />
                  8. Vårt ansvar och ansvarsfriskrivning
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">8.1 Plattformsroll</h3>
                    <p className="text-gray-700 mb-2">SwapDeals fungerar endast som en förmedlingsplattform. Vi:</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>Ansvarar INTE för kvaliteten på listade föremål</li>
                      <li>Garanterar INTE att byten kommer att genomföras</li>
                      <li>Ansvarar INTE för användarnas säkerhet vid möten</li>
                      <li>Kontrollerar INTE alla listade föremål i förväg</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">8.2 Ansvarsfriskrivning</h3>
                    <p className="text-gray-700 mb-2">Du använder SwapDeals på egen risk. Vi friskriver oss från ansvar för:</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>Skador eller förluster från byten</li>
                      <li>Bedrägeri eller vilseledning från andra användare</li>
                      <li>Tekniska problem eller avbrott i tjänsten</li>
                      <li>Förlust av data eller innehåll</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <FileCheck className="w-5 h-5 text-blue-600 mr-2" />
                  9. Immateriella rättigheter
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">9.1 Vårt innehåll</h3>
                    <p className="text-gray-700">
                      SwapDeals-appen, dess design, logotyper och funktioner skyddas av upphovsrätt och andra immateriella rättigheter som tillhör oss.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">9.2 Användargenererat innehåll</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>Du behåller äganderätten till innehåll du laddar upp</li>
                      <li>Du ger oss licens att använda, visa och distribuera ditt innehåll på plattformen</li>
                      <li>Du garanterar att du har rätt att dela det innehåll du laddar upp</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Lock className="w-5 h-5 text-green-600 mr-2" />
                  10. Integritet och personuppgifter
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">10.1 Datainsamling</h3>
                    <p className="text-gray-700">
                      Vi samlar in och behandlar personuppgifter enligt vår Integritetspolicy, som är en del av dessa villkor.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">10.2 Delning av information</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>Vi delar aldrig dina personuppgifter med tredje part utan ditt samtycke</li>
                      <li>Offentlig profilinformation kan synas för andra användare</li>
                      <li>Byteshistorik kan visas för att bygga förtroende</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Users className="w-5 h-5 text-purple-600 mr-2" />
                  11. Kontosuspension och uppsägning
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">11.1 Våra rättigheter</h3>
                    <p className="text-gray-700 mb-2">Vi kan stänga av eller avsluta ditt konto om du:</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>Bryter mot dessa villkor</li>
                      <li>Använder tjänsten på ett skadligt sätt</li>
                      <li>Mottar upprepade klagomål från andra användare</li>
                      <li>Inte använder kontot under en längre period</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">11.2 Dina rättigheter</h3>
                    <p className="text-gray-700 mb-2">Du kan när som helst:</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>Avsluta ditt konto</li>
                      <li>Ta bort ditt innehåll från plattformen</li>
                      <li>Begära radering av dina personuppgifter</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Gavel className="w-5 h-5 text-indigo-600 mr-2" />
                  12. Tvistlösning
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">12.1 Förhandling</h3>
                    <p className="text-gray-700">
                      Vi uppmuntrar användare att först försöka lösa tvister sinsemellan genom dialog.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">12.2 Medling</h3>
                    <p className="text-gray-700">
                      Vid allvarligare tvister medlar vi aldrig mellan parterna.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">12.3 Rättslig jurisdiktion</h3>
                    <p className="text-gray-700">
                      Dessa villkor styrs av svensk lag. Tvister ska lösas i svenska domstolar.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Clock className="w-5 h-5 text-orange-600 mr-2" />
                  13. Ändringar av villkoren
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">13.1 Uppdateringar</h3>
                    <p className="text-gray-700 mb-2">Vi kan uppdatera dessa villkor när som helst. Väsentliga ändringar kommer att meddelas via:</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                    
                      <li>Meddelanden i appen</li>
                      
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">13.2 Godkännande</h3>
                    <p className="text-gray-700">
                      Fortsatt användning efter ändringar innebär att du accepterar de nya villkoren.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Mail className="w-5 h-5 text-blue-600 mr-2" />
                  14. Kontaktinformation
                </h2>
                <p className="text-gray-700 mb-4">
                  Om du har frågor om dessa villkor eller SwapDeals, kontakta oss:
                </p>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-700">
                    <Mail className="w-5 h-5 text-blue-600 mr-3" />
                    <span>[kontakt@swapdeals.se]</span>
                  </div>
                 
                
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Scale className="w-5 h-5 text-gray-600 mr-2" />
                  15. Övrigt
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">15.1 Avskiljbarhet</h3>
                    <p className="text-gray-700">
                      Om någon del av dessa villkor bedöms som ogiltig, förblir resten av villkoren i kraft.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">15.2 Fullständigt avtal</h3>
                    <p className="text-gray-700">
                      Dessa villkor utgör det fullständiga avtalet mellan dig och SwapDeals.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">15.3 Språk</h3>
                    <p className="text-gray-700">
                      Vid tolkningsskillnader gäller den svenska versionen av dessa villkor.
                    </p>
                  </div>
                </div>
              </section>

              <div className="border-t border-gray-200 pt-8 mt-8">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                  <p className="text-blue-800 font-medium mb-2">
                    Genom att använda SwapDeals bekräftar du att du har läst, förstått och godkänt dessa användarvillkor.
                  </p>
                <p className="text-gray-600 text-sm transform transition-all duration-300 hover:translate-x-1">
            © {new Date().getFullYear()} SwapDeal AB. All rights reserved.
          </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}