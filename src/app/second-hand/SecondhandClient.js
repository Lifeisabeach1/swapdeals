import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function BlogPost() {
  return (
    <div className="min-h-screen bg-white">
     
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <article>
          {/* Hero Section */}
          <div className="mb-12">
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Second Hand Tips: Din kompletta guide
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Allt du behöver veta för att lyckas med second hand-shopping
              </p>
            </div>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pb-8 border-b border-gray-200">
              <span>7 januari 2026</span>
              <span>•</span>
              <span>14 min läsning</span>
              <span>•</span>
              <span>Av Swapdeals</span>
            </div>
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            {/* Introduction */}
            <p className="text-xl leading-relaxed mb-8 text-gray-800">
              Second hand har exploderat i popularitet de senaste åren, och det är inte svårt att förstå 
              varför. Det är bra för plånboken, fantastiskt för miljön och ger möjlighet att hitta unika 
              fynd som ingen annan har. Men hur hittar man de bästa sakerna? Hur vet man vad som är värt 
              att köpa? Den här guiden ger dig alla tips du behöver för att bli en mästare på second hand.
            </p>

            <div className="float-right ml-8 mb-6 w-80 rounded-lg overflow-hidden shadow-lg">
              <Image 
                src="/second-hand.webp" 
                alt="Second hand shopping tips"
                width={320}
                height={320}
                className="w-full h-auto object-cover"
              />
            </div>

            <p className="leading-relaxed mb-8 text-gray-700">
              Second hand-shopping är en konstform som kräver lite övning, men när du väl lärt dig 
              knepen kommer du aldrig vilja handla på samma sätt igen. Det handlar om att ha ett tränat 
              öga, veta var man ska leta, och förstå vad som är värt sin tid. Låt oss dyka in i allt du 
              behöver veta.
            </p>

            {/* Section 1 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-16 mb-6">
              Varför second hand? Fördelarna du behöver veta
            </h2>
            
            <p className="leading-relaxed mb-6 text-gray-700">
              Innan vi går in på tips och tricks, låt oss prata om varför second hand är så värt det. 
              Det handlar om mycket mer än att bara spara pengar.
            </p>

            <div className="my-10 p-8 bg-gray-50 rounded-lg border-l-4 border-green-600">
              <p className="font-semibold text-gray-900 mb-4">De största fördelarna med second hand:</p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="mr-3 mt-1.5 flex-shrink-0 w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                  <span>Spara 50-90% jämfört med nypris på märkesvaror och designerprodukter</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 mt-1.5 flex-shrink-0 w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                  <span>Minska ditt klimatavtryck dramatiskt - ett begagnat plagg sparar 25 kg CO2</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 mt-1.5 flex-shrink-0 w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                  <span>Hitta unika vintage-fynd och saker som ingen annan har</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 mt-1.5 flex-shrink-0 w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                  <span>Ofta bättre kvalitet - äldre saker tillverkades för att hålla</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 mt-1.5 flex-shrink-0 w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                  <span>Skapa en personlig stil som verkligen är din egen</span>
                </li>
              </ul>
            </div>

            {/* Section 2 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-16 mb-6">
              Var hittar du de bästa second hand-fynden?
            </h2>

            <p className="leading-relaxed mb-6 text-gray-700">
              Olika platser erbjuder olika typer av fynd. Här är en genomgång av de bästa ställena 
              att leta och vad varje plats är bra för.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-4">
              Online-plattformar
            </h3>

            <div className="my-8 space-y-6 text-gray-700">
              <p>
                <span className="font-semibold text-gray-900">Swapdeals:</span> Perfekt för att byta 
                saker du inte längre använder mot det du behöver. Ingen ekonomisk barriär, bara rakt 
                byte mellan personer. Miljövänligt och smart.
              </p>
              <p>
                <span className="font-semibold text-gray-900">Tradera:</span> Sveriges största auktionssajt 
                med enormt utbud. Bra för vintage, samlarobjekt och unika fynd. Kräver lite tålamod att 
                budda men kan ge fantastiska fynd.
              </p>
              <p>
                <span className="font-semibold text-gray-900">Vinted:</span> Specialiserat på kläder och 
                mode. Enkelt interface och stort utbud, särskilt av yngre märken. Perfekt för att 
                uppdatera garderoben.
              </p>
              <p>
                <span className="font-semibold text-gray-900">Facebook Marketplace:</span> Lokalt fokus 
                gör det lätt att hämta större saker som möbler. Ofta bra priser eftersom folk bara vill 
                bli av med saker snabbt.
              </p>
              <p>
                <span className="font-semibold text-gray-900">Sellpy:</span> Kurerat utbud av bra kvalitet. 
                Lite dyrare men sakerna är fotade professionellt och beskrivna noggrant. Bra för säkra köp.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-4">
              Fysiska butiker och marknader
            </h3>

            <div className="my-8 space-y-6 text-gray-700">
              <p>
                <span className="font-semibold text-gray-900">Myrorna:</span> Sveriges största 
                second hand-kedja med butiker överallt. Stort utbud av allt från kläder till möbler. 
                Kom ofta för nya fynd då sortimentet roterar konstant.
              </p>
              <p>
                <span className="font-semibold text-gray-900">Stadsmissionen:</span> Bra priser och 
                brett sortiment. Pengarna går till välgörenhet. Ofta bra kvalitet eftersom de sorterar 
                noggrant.
              </p>
              <p>
                <span className="font-semibold text-gray-900">Röda Korset:</span> Liknande Stadsmissionen 
                med focus på välgörenhet. Ofta bra möbler och husgeråd.
              </p>
              <p>
                <span className="font-semibold text-gray-900">Vintage-butiker:</span> Specialiserade 
                butiker med kurerade varor från 60-90-talet. Dyrare men högre kvalitet och mer unikt. 
                Perfekt för mode och inredning.
              </p>
              <p>
                <span className="font-semibold text-gray-900">Loppisar:</span> Klassiska loppmarknader 
                som Hornstulls loppis och Hötorgsloppan. Kom tidigt på morgonen för bästa utbudet. 
                Förhandla gärna om priset.
              </p>
            </div>

            <div className="my-10 p-8 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-6">Proffstips för var du letar:</h4>
              <div className="space-y-4 text-gray-700">
                <p><span className="font-semibold text-gray-900">Rika områden:</span> Second hand-butiker 
                i välbärgade områden har ofta bättre kvalitet eftersom folk där skänker mer exklusiva saker</p>
                <p><span className="font-semibold text-gray-900">Säsongsberoende:</span> Kolla efter 
                vinterkläder i augusti när folk rensar, sommarsaker i mars</p>
                <p><span className="font-semibold text-gray-900">Nya leveranser:</span> Fråga butiker när 
                de får nya varor och besök då för första chansen på fynden</p>
                <p><span className="font-semibold text-gray-900">Mindre städer:</span> Ofta mindre 
                konkurrens och bättre priser än i storstäder</p>
              </div>
            </div>

            {/* Section 3 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-16 mb-6">
              Kläder och mode: Så hittar du de bästa styckena
            </h2>

            <p className="leading-relaxed mb-6 text-gray-700">
              Kläder är den mest populära second hand-kategorin, men också den som kräver mest kunskap 
              för att verkligen göra bra fynd. Här är expertråden.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-4">
              Kvalitetskontroll: Vad du ska kolla efter
            </h3>

            <div className="my-8 space-y-6 text-gray-700">
              <p>
                <span className="font-semibold text-gray-900">Tyget:</span> Känn på materialet. Ull, 
                kashmir, silke, lin och bomull av hög kvalitet känns lyxigt och tungt. Undvik tunna, 
                slitna tyger. Dra lätt i tyget - om det återgår till sin form är kvaliteten bra.
              </p>
              <p>
                <span className="font-semibold text-gray-900">Sömmarna:</span> Täta, jämna sömmar är 
                tecken på kvalitet. Kolla särskilt axelsömmar och sidosömmar. Om trådar hänger loss 
                eller sömmar har gått upp, hoppa över det.
              </p>
              <p>
                <span className="font-semibold text-gray-900">Dragkedjor och knappar:</span> Testa alla 
                dragkedjor - de ska gå lätt upp och ner. Kolla att alla knappar finns kvar och att 
                knapphålen är hela.
              </p>
              <p>
                <span className="font-semibold text-gray-900">Fläckar och skador:</span> Kolla noga efter 
                fläckar under armarna, vid kragen och på framsidan. Små hål kan lagas men stora skador 
                är oftast inte värda det. Lukta på plagget - mögel- och röklukt går sällan bort.
              </p>
              <p>
                <span className="font-semibold text-gray-900">Noppring:</span> Lite noppring är okej och 
                kan tas bort med en noppraka, men kraftig noppring betyder slitet tyg.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-4">
              Storlekar och passform
            </h3>

            <div className="my-8 space-y-6 text-gray-700">
              <p>
                <span className="font-semibold text-gray-900">Vintage-storlekar är mindre:</span> En 
                storlek 38 från 1970-talet motsvarar ofta en 34 idag. Prova alltid eller mät noggrant.
              </p>
              <p>
                <span className="font-semibold text-gray-900">Mät dig själv:</span> Ha ett måttband hemma 
                och skriv ner dina mått - byst, midja, höfter, innerbenlängd. Jämför med mått i annonser.
              </p>
              <p>
                <span className="font-semibold text-gray-900">Tänk hur du kan ändra:</span> För långa byxor 
                kan kortas, för stora kläder kan sys in. För små kläder går däremot sällan att göra större.
              </p>
              <p>
                <span className="font-semibold text-gray-900">Prova allt:</span> Även om du "vet" din 
                storlek, olika märken och epoker varierar enormt. Ta dig tid att prova.
              </p>
            </div>

            <div className="my-10 p-8 bg-gray-50 rounded-lg border-l-4 border-green-600">
              <p className="font-semibold text-gray-900 mb-4">Designermärken att leta efter:</p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="mr-3 mt-1.5 flex-shrink-0 w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                  <span><span className="font-semibold">Klassiska lyx:</span> Burberry, Hermès, Chanel, Louis Vuitton - håller värdet och kvaliteten</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 mt-1.5 flex-shrink-0 w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                  <span><span className="font-semibold">Skandinavisk design:</span> Acne Studios, Filippa K, Tiger of Sweden, Ganni</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 mt-1.5 flex-shrink-0 w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                  <span><span className="font-semibold">Vintage-guld:</span> Marimekko, Levi's 501 från 80-90-talet, Ralph Lauren</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 mt-1.5 flex-shrink-0 w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                  <span><span className="font-semibold">Skor:</span> Dr Martens, Birkenstock, kvalitetsskor i läder håller åratal</span>
                </li>
              </ul>
            </div>

            {/* Section 4 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-16 mb-6">
              Möbler och inredning: Gör rätt fynd
            </h2>

            <p className="leading-relaxed mb-6 text-gray-700">
              Second hand-möbler kan förvandla ditt hem för en bråkdel av priset för nya möbler. Men 
              det krävs kunskap för att veta vad som är värt att ta hem.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-4">
              Kvalitetsbedömning av möbler
            </h3>

            <div className="my-8 space-y-6 text-gray-700">
              <p>
                <span className="font-semibold text-gray-900">Konstruktion:</span> Skaka möbeln försiktigt. 
                Den ska kännas solid och stabil. Kolla att ben är ordentligt fastsatta. Massivt trä är 
                alltid bättre än spånskiva.
              </p>
              <p>
                <span className="font-semibold text-gray-900">Lådor och dörrar:</span> Öppna och stäng 
                alla lådor flera gånger. De ska glida smidigt utan att kärva. Kolla att gångjärn är hela.
              </p>
              <p>
                <span className="font-semibold text-gray-900">Träkvalitet:</span> Ek, teak, björk och 
                valnöt är fantastiska träslag som håller i generationer. Lär dig känna igen dem.
              </p>
              <p>
                <span className="font-semibold text-gray-900">Renoveringsmöjligheter:</span> Repor och 
                slitage på trä kan oftast slipas bort och möbeln kan få nytt liv med olja eller färg. 
                Men konstruktionsfel är svåra att laga.
              </p>
              <p>
                <span className="font-semibold text-gray-900">Klädsel:</span> För soffor och fåtöljer, 
                kolla tyget noga. Slitet tyg kan bytas men det kostar. Testa fjädringen genom att sätta 
                dig - den ska kännas fast och ge gott stöd.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-4">
              Epoker och stilar att känna till
            </h3>

            <div className="my-8 space-y-6 text-gray-700">
              <p>
                <span className="font-semibold text-gray-900">1950-60-tal:</span> Skandinavisk design, 
                rena linjer, teak och björk. Designers som Wegner, Eames och svenska Ikea-klassiker. 
                Mycket eftertraktat och håller värdet.
              </p>
              <p>
                <span className="font-semibold text-gray-900">1970-tal:</span> Funkis och färgstarka 
                inslag. Teakmöbler fortfarande populära. Lite mer blandad kvalitet.
              </p>
              <p>
                <span className="font-semibold text-gray-900">1980-tal:</span> Postmodernism och ofta 
                överdrivet. Leta efter de enkla, välgjorda styckena.
              </p>
              <p>
                <span className="font-semibold text-gray-900">Antikt:</span> Möbler från 1800-talet och 
                tidigare är ofta fantastisk kvalitet men kräver mer vård. Kan vara riktiga investeringar.
              </p>
            </div>

            <div className="my-10 p-8 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-6">Praktiska tips:</h4>
              <div className="space-y-4 text-gray-700">
                <p><span className="font-semibold text-gray-900">Mät först:</span> Ha dina rums mått och 
                ta med måttband. Kolla också dörrbredder - får möbeln plats in?</p>
                <p><span className="font-semibold text-gray-900">Planera transport:</span> Har du tillgång 
                till lämpligt fordon? Vissa möbler kräver skåpbil.</p>
                <p><span className="font-semibold text-gray-900">Städa och renovera:</span> Budgetera tid 
                och eventuellt pengar för att fixa upp möbeln</p>
                <p><span className="font-semibold text-gray-900">Testa stabilitet:</span> För stolar och 
                bord, testa genom att använda dem på plats</p>
              </div>
            </div>

            {/* Section 5 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-16 mb-6">
              Elektronik och prylar: Vad är värt att köpa begagnat?
            </h2>

            <p className="leading-relaxed mb-6 text-gray-700">
              Elektronik kan vara lite knepigare att köpa begagnat, men med rätt kunskap kan du göra 
              fantastiska affärer.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-4">
              Vad du ska testa och kolla
            </h3>

            <div className="my-8 space-y-6 text-gray-700">
              <p>
                <span className="font-semibold text-gray-900">Mobiler och surfplattor:</span> Kolla 
                batterihälsa (iPhone visar detta under inställningar). Testa alla knappar, kameror och 
                att touchscreen fungerar överallt. Se till att enheten inte är låst till operatör eller 
                konto.
              </p>
              <p>
                <span className="font-semibold text-gray-900">Datorer:</span> Testa att den startar och 
                kör smidigt. Kolla skärmkvalitet, tangentbord, trackpad. Fråga om specifikationer 
                (processor, RAM, lagring). Äldre än 5 år kan vara för långsamt för moderna behov.
              </p>
              <p>
                <span className="font-semibold text-gray-900">Hörlurar och högtalare:</span> Testa ljudet 
                ordentligt. Trådlösa: kolla batteritid och Bluetooth-anslutning. Brusreducering ska 
                fungera om de har det.
              </p>
              <p>
                <span className="font-semibold text-gray-900">Kameror:</span> Ta testbilder, kolla att 
                autofocus fungerar, testa alla knappar och menyer. Räkna antal slutarfällningar om möjligt.
              </p>
              <p>
                <span className="font-semibold text-gray-900">Spelkonsoler:</span> Testa med ett spel att 
                allt fungerar. Kolla att kontroller inte driftar och att alla knappar svarar.
              </p>
            </div>

            <div className="my-10 p-8 bg-gray-50 rounded-lg border-l-4 border-green-600">
              <p className="font-semibold text-gray-900 mb-4">Elektronik att undvika second hand:</p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="mr-3 mt-1.5 flex-shrink-0 w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                  <span>Batteridrivna enheter med dålig batterihälsa - byte är ofta dyrt</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 mt-1.5 flex-shrink-0 w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                  <span>Vitvaror utan garanti - reparationer kan kosta mer än nypris</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 mt-1.5 flex-shrink-0 w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                  <span>Mycket gammal elektronik (10+ år) - ofta inte kompatibel med modern teknik</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 mt-1.5 flex-shrink-0 w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                  <span>Saknar laddare eller kablar som är svåra att hitta</span>
                </li>
              </ul>
            </div>

            {/* Section 6 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-16 mb-6">
              Expertstrategier för att hitta de bästa fynden
            </h2>

            <p className="leading-relaxed mb-8 text-gray-700">
              Nu till de verkliga proffstipsen som skiljer nybörjare från experter i second hand-världen.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-4">
              Timing är allt
            </h3>

            <div className="my-8 space-y-6 text-gray-700">
              <p>
                <span className="font-semibold text-gray-900">Vardagar över helger:</span> Mindre folk på 
                loppisar och i butiker betyder mindre konkurrens om fynden.
              </p>
              <p>
                <span className="font-semibold text-gray-900">Tidigt på morgonen:</span> Kom när butiken 
                öppnar eller tidigt på loppmarknader för första chansen på nya varor.
              </p>
              <p>
                <span className="font-semibold text-gray-900">Sent på dagen vid loppisar:</span> Säljare 
                vill bli av med saker och är mer öppna för förhandling.
              </p>
              <p>
                <span className="font-semibold text-gray-900">Säsongsskifte:</span> Folk rensar när 
                säsongen byter. Våren och hösten ger mest nytt utbud.
              </p>
              <p>
                <span className="font-semibold text-gray-900">Efter jul och flyttperioder:</span> Många 
                skänker bort saker efter julstädning eller när de flyttar.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-4">
              Utveckla ditt öga
            </h3>

            <div className="my-8 space-y-6 text-gray-700">
              <p>
                <span className="font-semibold text-gray-900">Lär dig märken:</span> Kunskap om 
                kvalitetsmärken hjälper dig snabbt identifiera värdefulla fynd. Ta dig tid att googla 
                när du ser okända märken.
              </p>
              <p>
                <span className="font-semibold text-gray-900">Känn på material:</span> Ju mer du 
                second hand-shoppar desto bättre blir du på att känna kvalitet. Känn på allt och 
                lär dig skillnaden mellan bra och dåligt.
              </p>
              <p>
                <span className="font-semibold text-gray-900">Kolla hela butiken:</span> Hoppa inte över 
                sektioner. Ibland hamnar saker på fel ställe och då är konkurrensen mindre.
              </p>
              <p>
                <span className="font-semibold text-gray-900">Tänk potential:</span> Ett tråkigt plagg kan 
                bli fantastiskt med rätt styling. Tråkiga möbler kan målas om. Se bortom nuet.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-4">
              Förhandling och prissättning
            </h3>

            <div className="my-8 space-y-6 text-gray-700">
              <p>
                <span className="font-semibold text-gray-900">Loppisar:</span> Nästan alltid okej att 
                förhandla. Var artig, föreslå ett rimligt pris. Om du köper flera saker kan du ofta få 
                rabatt.
              </p>
              <p>
                <span className="font-semibold text-gray-900">Second hand-butiker:</span> Fastpris oftast, 
                men på större möbler kan det finnas förhandlingsutrymme, särskilt om de stått länge.
              </p>
              <p>
                <span className="font-semibold text-gray-900">Online:</span> Ingen skada att fråga om 
                säljaren kan gå ner lite i pris, särskilt om annonsen varit uppe länge.
              </p>
              <p>
                <span className="font-semibold text-gray-900">Kolla referenspriser:</span> Sök på Tradera 
                "sålda annonser" för att se vad liknande saker faktiskt sålt för.
              </p>
            </div>

            <div className="my-10 p-8 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-6">Röda flaggor att undvika:</h4>
              <div className="space-y-4 text-gray-700">
                <p><span className="font-semibold text-gray-900">Mögel- eller röklukt:</span> Går sällan 
                att få bort helt, särskilt ur textilier</p>
                <p><span className="font-semibold text-gray-900">Konstruktionsfel:</span> Trasiga sömmar 
                kan lagas, men strukturella problem är svåra att fixa</p>
                <p><span className="font-semibold text-gray-900">Mycket noppriga kläder:</span> Tecken på 
                kraftig användning och låg kvalitet</p>
                <p><span className="font-semibold text-gray-900">Spånplattemöbler med skador:</span> Går 
                inte att renovera på samma sätt som massivt trä</p>
                <p><span className="font-semibold text-gray-900">Elektronik utan möjlighet att testa:</span> 
                För riskabelt, särskilt dyra produkter</p>
              </div>
            </div>

            {/* Section 7 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-16 mb-6">
              Vård och underhåll: Få dina fynd att hålla
            </h2>

            <p className="leading-relaxed mb-6 text-gray-700">
              När du väl gjort dina fantastiska fynd vill du att de ska hålla länge. Här är tips för 
              att ta hand om dina second hand-skatter.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-4">
              Kläder
            </h3>

            <div className="my-8 space-y-6 text-gray-700">
              <p>
                <span className="font-semibold text-gray-900">Tvätta varsamt:</span> Låg temperatur, 
                mildt tvättmedel, lufttorka. Vintage-tyger kan vara ömtåligare än moderna.
              </p>
              <p>
                <span className="font-semibold text-gray-900">Laga snabbt:</span> En liten söm som gått 
                upp blir större om du inte fixar det direkt. Lär dig enkla reparationer.
              </p>
              <p>
                <span className="font-semibold text-gray-900">Förvara rätt:</span> Häng kläder istället 
                för att lägga ihop dem. Ull och kashmir bör vikas för att inte töjas ut.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-4">
              Möbler
            </h3>

            <div className="my-8 space-y-6 text-gray-700">
              <p>
                <span className="font-semibold text-gray-900">Trä:</span> Slipa lätt och behandla med olja 
                eller vax regelbundet. Detta skyddar och fräschar upp.
              </p>
              <p>
                <span className="font-semibold text-gray-900">Klädsel:</span> Dammsug regelbundet och 
                behandla fläckar direkt. Överväg professionell rengöring för dyra soffor.
              </p>
              <p>
                <span className="font-semibold text-gray-900">Drag och skruvar:</span> Dra åt lösa skruvar 
                när du märker dem. Förebygg större skador.
              </p>
            </div>

            {/* Conclusion */}
            <h2 className="text-3xl font-bold text-gray-900 mt-16 mb-6">
              Börja din second hand-resa idag
            </h2>

            <p className="leading-relaxed mb-6 text-gray-700">
              Second hand-shopping är en färdighet som förbättras med tiden. Ju mer du gör det, desto 
              bättre blir du på att se kvalitet, identifiera fynd och veta vad som är värt din tid och 
              pengar. Det viktigaste är att börja.
            </p>

            <p className="leading-relaxed mb-8 text-gray-700">
              Varje second hand-köp du gör är en investering i dig själv och i planeten. Du sparar 
              pengar, får unika saker och minskar din miljöpåverkan dramatiskt. Med tipsen i den här 
              guiden är du väl rustad att göra smarta val och hitta de bästa fynden.
            </p>

            <div className="my-12 p-10 bg-gray-50 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Sammanfattning - Dina bästa second hand-tips:</h3>
              <div className="grid md:grid-cols-2 gap-6 text-gray-700">
                <div>
                  <p className="font-semibold text-gray-900 mb-2">1. Lär dig kvalitet</p>
                  <p className="text-sm">Känn på tyger, kolla sömmar, testa konstruktion</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-2">2. Timing är nyckeln</p>
                  <p className="text-sm">Kom tidigt, besök ofta, tänk säsong</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-2">3. Ha tålamod</p>
                  <p className="text-sm">Bästa fynden kräver tid att hitta</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-2">4. Testa alltid</p>
                  <p className="text-sm">Prova kläder, testa elektronik, kontrollera möbler</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-2">5. Tänk långsiktigt</p>
                  <p className="text-sm">Välj kvalitet som håller över snabba trender</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-2">6. Ha roligt!</p>
                  <p className="text-sm">Second hand-jakt är en upplevelse - njut av resan</p>
                </div>
              </div>
            </div>

            <p className="leading-relaxed text-gray-700 text-center">
              Nu har du alla verktyg du behöver. Det är dags att ge dig ut och hitta dina egna 
              fantastiska fynd. Lycka till med jakten!
            </p>
          </div>

          {/* CTA */}
          <div className="mt-16 pt-12 border-t border-gray-200">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Redo att börja?
              </h3>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Upptäck bytesmöjligheter på SwapDeals - smart, hållbart och helt utan pengar!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/"
                  className="inline-block bg-green-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-800 transition"
                  aria-label="Börja byta på SwapDeals"
                >
                  Utforska SwapDeals
                </Link>
              </div>
            </div>
          </div>
        </article>
      </main>

    </div>
  );
}