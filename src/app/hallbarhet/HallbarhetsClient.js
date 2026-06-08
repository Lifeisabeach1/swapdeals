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
                Hållbarhet är viktigare än någonsin
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Vår planets framtid börjar med våra val idag
              </p>
            </div>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pb-8 border-b border-gray-200">
              <span>3 januari 2026</span>
              <span>•</span>
              <span>15 min läsning</span>
              <span>•</span>
              <span>Av Swapdeals</span>
            </div>
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            {/* Introduction */}
            <p className="text-xl leading-relaxed mb-8 text-gray-800">
              I en tid präglad av snabba förändringar och globala utmaningar står hållbarhet i centrum 
              för vår gemensamma framtid. Det är inte längre en fråga om val, utan en nödvändighet för 
              vårt samhälles överlevnad och välmående.
            </p>

            <div className="float-right ml-8 mb-6 w-80 rounded-lg overflow-hidden shadow-lg">
              <Image 
                src="/hallbarhet.webp" 
                alt="Hållbarhet och miljö"
                width={320}
                height={320}
                className="w-full h-auto object-cover"
              />
            </div>

            <p className="leading-relaxed mb-8 text-gray-700">
              När vi står vid början av 2026 befinner sig mänskligheten vid en avgörande vändpunkt. 
              De beslut vi fattar idag, både som individer och som samhälle, kommer att forma världen 
              för generationer framöver. Hållbarhet är inte bara ett modeord eller en trend - det är 
              fundamentet för vår fortsatta existens på denna planet.
            </p>

            {/* Section 1 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-16 mb-6">
              Klimatkrisen: Den största utmaningen i vår tid
            </h2>
            
            <p className="leading-relaxed mb-6 text-gray-700">
              Vetenskapen är glasklar och konsensus bland forskare världen över är överväldigande: 
              vi befinner oss mitt i en klimatkris av proportioner som mänskligheten aldrig tidigare 
              upplevt. Enligt FN:s klimatpanel IPCC har de globala medeltemperaturerna redan stigit 
              med cirka 1,1 grader Celsius jämfört med förindustriell tid, och vi riskerar att 
              överskrida den kritiska 1,5-gradersgränsen inom de närmaste åren.
            </p>

            <div className="my-10 p-8 bg-gray-50 rounded-lg border-l-4 border-green-600">
              <p className="font-semibold text-gray-900 mb-4">Kritiska fakta om klimatet:</p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="mr-3 mt-1.5 flex-shrink-0 w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                  <span>De senaste åtta åren har varit de varmaste någonsin uppmätta</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 mt-1.5 flex-shrink-0 w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                  <span>Arktis förlorar cirka 13% av sin istäckning per decennium</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 mt-1.5 flex-shrink-0 w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                  <span>Havsnivåerna stiger med 3,4 mm per år och accelererar</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 mt-1.5 flex-shrink-0 w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                  <span>Extremväder som översvämningar, torka och värmebölgor ökar i frekvens</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 mt-1.5 flex-shrink-0 w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                  <span>Över 1 miljon arter riskerar utrotning på grund av klimatförändringar</span>
                </li>
              </ul>
            </div>

            <p className="leading-relaxed mb-6 text-gray-700">
              Konsekvenserna av klimatförändringarna ser vi redan idag. Rekordvarma temperaturer 
              torkar ut jordbruksmark i vissa regioner medan extrema översvämningar ödelägger 
              samhällen i andra. Korallreven, som är hem för 25% av allt marint liv, bleks och 
              dör i alarmande takt. Glaciärer som försörjt miljarder människor med färskvatten 
              krymper dramatiskt.
            </p>

            <p className="leading-relaxed mb-8 text-gray-700">
              Varje tiondels grad räknas. Skillnaden mellan 1,5 och 2 graders uppvärmning kan 
              innebära hundratals miljoner fler människor som drabbas av extremväder, 
              vattenbrist och livsmedelskris. Tiden för handling är nu - varje år, varje månad, 
              varje dag som vi dröjer gör omställningen svårare och konsekvenserna allvarligare.
            </p>

            {/* Section 2 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-16 mb-6">
              Miljöförstöring bortom klimatet
            </h2>

            <p className="leading-relaxed mb-6 text-gray-700">
              Klimatkrisen är bara en del av de miljöutmaningar vi står inför. Vår planets ekosystem 
              är under press från flera håll samtidigt, och dessa kriser förstärker varandra på 
              oroväckande sätt.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-4">
              Plastföroreningar och avfall
            </h3>

            <p className="leading-relaxed mb-6 text-gray-700">
              Varje år hamnar uppskattningsvis 8-10 miljoner ton plast i våra hav. Detta motsvarar 
              en soptruck full med plast varje minut. Mikroplaster har nu hittats överallt - från 
              Marianergraven till toppen av Mount Everest, i vårt dricksvatten och till och med i 
              människors blod och organ. Havsdjur, fåglar och marina däggdjur dör efter att ha ätit 
              plast som de förväxlar med mat.
            </p>

            <div className="my-10 p-8 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-6">Plastkrisen i siffror:</h4>
              <div className="grid md:grid-cols-2 gap-6 text-gray-700">
                <div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">400 miljoner ton</p>
                  <p className="text-sm">Plast produceras globalt varje år</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">5 000 miljarder</p>
                  <p className="text-sm">Plastbitar flyter i världshaven</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">450 år</p>
                  <p className="text-sm">Tid för en plastflaska att brytas ner</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">90%</p>
                  <p className="text-sm">Av all plast återvinns aldrig</p>
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-4">
              Förlust av biologisk mångfald
            </h3>

            <p className="leading-relaxed mb-6 text-gray-700">
              Vi befinner oss mitt i den sjätte massutrotningen - den första som orsakats av en enda 
              art: oss människor. Arter försvinner i en takt som är 1000 gånger högre än den naturliga 
              utrotningshastigheten. Detta är inte bara tragiskt för de arter som försvinner, utan utgör 
              också ett hot mot mänsklighetens överlevnad eftersom vi är beroende av fungerande ekosystem 
              för mat, vatten, medicin och klimatreglering.
            </p>

            <p className="leading-relaxed mb-8 text-gray-700">
              Regnskogar, som kallas jordens lungor och innehåller mer än hälften av världens arter, 
              försvinner i alarmerande takt. Amazonas, som historiskt varit en kolsänka, riskerar nu 
              att bli en kolkälla på grund av avskogning och torka. Våtmarker, som fungerar som naturliga 
              vattenreningsverk och kollagringssystem, försvinner tre gånger snabbare än skogar.
            </p>

            {/* Section 3 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-16 mb-6">
              Ekonomiska perspektiv på hållbarhet
            </h2>

            <p className="leading-relaxed mb-6 text-gray-700">
              Hållbarhet handlar inte bara om miljön - det är också grundläggande ekonomi. Under lång tid 
              har ekonomisk tillväxt equaterats med ökad resursförbrukning och miljöförstöring, men denna 
              modell är varken hållbar eller nödvändig. Den gröna omställningen representerar en av de 
              största ekonomiska möjligheterna i modern tid.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-4">
              Kostnaden av inaktivitet
            </h3>

            <p className="leading-relaxed mb-8 text-gray-700">
              Enligt Stern-rapporten från ekonomen Nicholas Stern kan kostnaden för att inte agera mot 
              klimatförändringarna uppgå till 5-20% av global BNP årligen, medan kostnaden för att agera 
              nu uppskattas till cirka 1-2% av global BNP. Extremväder kostar redan nu hundratals miljarder 
              dollar årligen i skador, förlorad produktivitet och hälsokostnader.
            </p>

            <div className="my-10 p-8 bg-gray-50 rounded-lg border-l-4 border-green-600">
              <p className="font-semibold text-gray-900 mb-4">Ekonomiska fördelar med hållbarhet:</p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="mr-3 mt-1.5 flex-shrink-0 w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                  <span>Cirkulär ekonomi kan generera 4,5 biljoner dollar i ekonomisk aktivitet till 2030</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 mt-1.5 flex-shrink-0 w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                  <span>Förnybar energi skapar fler jobb per investerad krona än fossil energi</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 mt-1.5 flex-shrink-0 w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                  <span>Företag med stark hållbarhetsprofil har i genomsnitt 18% högre lönsamhet</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 mt-1.5 flex-shrink-0 w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                  <span>Energieffektivisering kan minska företags energikostnader med 20-30%</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 mt-1.5 flex-shrink-0 w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                  <span>Hållbara investeringar växer 40% snabbare än traditionella investeringar</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 mt-1.5 flex-shrink-0 w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                  <span>Grön teknik förväntas vara värd över 2,5 biljoner dollar år 2030</span>
                </li>
              </ul>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-4">
              Nya affärsmöjligheter
            </h3>

            <p className="leading-relaxed mb-6 text-gray-700">
              Den gröna omställningen driver innovation och skapar helt nya marknader. Företag som ligger 
              i framkant inom hållbarhet får konkurrensfördelar genom effektivare processer, starkare 
              varumärken och bättre förmåga att attrahera både kunder och talang. Unga generationer, som 
              utgör en allt större del av arbetsmarknaden och konsumentmarknaden, prioriterar i högre grad 
              hållbarhet i sina val.
            </p>

            <p className="leading-relaxed mb-8 text-gray-700">
              Inom sektorer som förnybar energi, elektrisk transport, hållbar mat, grön byggnation och 
              cirkulär ekonomi skapas miljontals nya jobb. Sverige, som länge varit ledande inom 
              miljöteknik, har stora möjligheter att dra nytta av denna omställning och exportera både 
              kunskap och teknologi till resten av världen.
            </p>

            {/* Section 4 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-16 mb-6">
              Social hållbarhet och rättvisa
            </h2>

            <p className="leading-relaxed mb-6 text-gray-700">
              Hållbarhet är fundamentalt en fråga om rättvisa - både mellan människor idag och mellan 
              generationer. De som har bidragit minst till klimatkrisen drabbas ofta hårdast av dess 
              konsekvenser, medan de rika länderna som historiskt orsakat mest utsläpp har bättre 
              förutsättningar att anpassa sig.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-4">
              Global ojämlikhet
            </h3>

            <p className="leading-relaxed mb-6 text-gray-700">
              De rikaste 10% av världens befolkning står för cirka 50% av alla koldioxidutsläpp, medan 
              de fattigaste 50% endast står för 10%. Samtidigt är det ofta fattiga samhällen i 
              utvecklingsländer som drabbas värst av översvämningar, torka och extremväder. Små ö-stater 
              riskerar att helt försvinna under havsytan trots att de knappt bidragit till 
              klimatförändringarna.
            </p>

            <p className="leading-relaxed mb-8 text-gray-700">
              Klimatförändringarna förvärrar också befintliga ojämlikheter. När skördar misslyckas på grund 
              av torka stiger matpriserna, vilket drabbar de fattigaste hårdast. Extremväder förstör hem och 
              infrastruktur, och de som saknar resurser att återbygga drabbas värst. Detta kan leda till 
              ökad migration, konflikter och social oro.
            </p>

            <div className="my-10 p-8 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-4">Social hållbarhet innebär:</h4>
              <div className="space-y-4 text-gray-700">
                <p><span className="font-semibold text-gray-900">Rättvis fördelning</span> — Alla människor ska ha tillgång till grundläggande resurser som mat, vatten och energi</p>
                <p><span className="font-semibold text-gray-900">Jämställdhet</span> — Kvinnor och män ska ha samma möjligheter och rättigheter</p>
                <p><span className="font-semibold text-gray-900">Arbetarrätt</span> — Anständiga arbetsvillkor och rättvisa löner genom hela värdekedjan</p>
                <p><span className="font-semibold text-gray-900">Hälsa och välbefinnande</span> — Tillgång till hälsovård och en hälsosam miljö för alla</p>
                <p><span className="font-semibold text-gray-900">Utbildning</span> — Alla barn ska ha rätt till utbildning oavsett bakgrund</p>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-4">
              En rättvis omställning
            </h3>

            <p className="leading-relaxed mb-8 text-gray-700">
              När samhället ställer om till fossilfrihet måste vi säkerställa att ingen lämnas efter. 
              Arbetare i fossila industrier behöver omskolning och nya möjligheter. Sårbara grupper måste 
              få stöd att anpassa sig till förändringar. Den gröna omställningen måste vara inkluderande 
              och rättvis för att lyckas.
            </p>

            {/* Section 5 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-16 mb-6">
              Vad kan du göra idag?
            </h2>

            <p className="leading-relaxed mb-8 text-gray-700">
              Det är lätt att känna sig överväldigad av hållbarhetsproblemens omfattning, men varje persons 
              handlingar spelar roll. Genom att göra medvetna val i vardagen kan vi tillsammans skapa stor 
              förändring. Här är konkreta tips inom olika områden:
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-4">
              Hållbart hem och energi
            </h3>

            <div className="my-8 space-y-6 text-gray-700">
              <p>
                <span className="font-semibold text-gray-900">Energieffektivisering:</span> Byt till LED-lampor som använder 
                85% mindre energi än glödlampor. Installera termostatventiler för att styra värmen i varje rum. 
                Tänk på att kyl och frys ofta är de mest energikrävande apparaterna - välj energiklassade modeller 
                och håll dem rena för optimal prestanda.
              </p>
              <p>
                <span className="font-semibold text-gray-900">Förnybar energi:</span> Om möjligt, byt till el från förnybara 
                källor eller installera egna solpaneler. Solcellspriserna har sjunkit dramatiskt och kan nu 
                betala sig själva på 8-12 år.
              </p>
              <p>
                <span className="font-semibold text-gray-900">Isolering:</span> En välisolerad bostad kan minska uppvärmningskostnader 
                med upp till 50%. Täta springor vid fönster och dörrar, överväg tilläggsisolering på vinden.
              </p>
              <p>
                <span className="font-semibold text-gray-900">Vatten:</span> Installera snålspolande kranar och duschar. 
                En kort dusch istället för bad sparar hundratals liter vatten. Samla upp regnvatten för 
                trädgårdsbevattning.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-4">
              Hållbar transport
            </h3>

            <div className="my-8 space-y-6 text-gray-700">
              <p>
                <span className="font-semibold text-gray-900">Prioritera aktiv mobilitet:</span> Gång och cykling är inte bara 
                utsläppsfria utan också hälsosamma. En person som cyklar till jobbet istället för att köra bil 
                sparar cirka 1-2 ton CO2 per år samtidigt som de får motion.
              </p>
              <p>
                <span className="font-semibold text-gray-900">Kollektivtrafik:</span> Tåg, buss och tunnelbana har mycket 
                lägre utsläpp per passagerare än bil. En resa med tåg släpper ut cirka 14 gånger mindre CO2 
                än samma resa med flyg.
              </p>
              <p>
                <span className="font-semibold text-gray-900">Bildelning och samåkning:</span> Om du behöver bil, överväg 
                bilpool eller samåkning. Fyra personer som delar på en bil minskar utsläppen med 75% per person.
              </p>
              <p>
                <span className="font-semibold text-gray-900">Elektrifiering:</span> Om du ska köpa bil, välj en elbil. De blir 
                allt billigare och har redan lägre totalkostnad än bensinbilar när man räknar in drivmedel och 
                underhåll.
              </p>
              <p>
                <span className="font-semibold text-gray-900">Flyg smart:</span> Undvik flyg när det går, särskilt korta sträckor. 
                När du flyger, välj direktflyg (start och landning drar mest bränsle) och economy class 
                (mindre utrymme per passagerare = lägre utsläpp).
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-4">
              Hållbar mat och konsumtion
            </h3>

            <div className="my-8 space-y-6 text-gray-700">
              <p>
                <span className="font-semibold text-gray-900">Växtbaserad kost:</span> Animaliska produkter står för cirka 60% 
                av livsmedelsindustrins växthusgasutsläpp trots att de bara utgör 18% av våra kalorier. Att minska 
                köttkonsumtionen, särskilt nötkött, är en av de mest effektiva åtgärderna en individ kan göra. 
                Du behöver inte bli vegan - att byta till vegetariskt några dagar i veckan gör stor skillnad.
              </p>
              <p>
                <span className="font-semibold text-gray-900">Lokalt och säsongsanpassat:</span> Mat som transporterats långa 
                sträckor eller odlats i uppvärmda växthus har större klimatavtryck. Välj svenska grönsaker i 
                säsong och köp direkt från lokala producenter när möjligt.
              </p>
              <p>
                <span className="font-semibold text-gray-900">Minska matsvinn:</span> Cirka en tredjedel av all mat som 
                produceras slängs. Planera dina inköp, förvara mat rätt, använd rester kreativt och kompostera 
                det som blir över. Detta sparar både pengar och miljö.
              </p>
              <p>
                <span className="font-semibold text-gray-900">Ekologiskt:</span> Ekologisk odling använder mindre bekämpningsmedel 
                och är bättre för biologisk mångfald. Välj särskilt ekologiskt för produkter där du äter skalet.
              </p>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-4">
              Hållbart mode och konsumtion
            </h3>

            <div className="my-8 space-y-6 text-gray-700">
              <p>
                <span className="font-semibold text-gray-900">Köp mindre, välj bättre:</span> Modeindustrin står för 10% av 
                globala koldioxidutsläpp. Köp kläder av hög kvalitet som håller längre istället för snabba 
                trender. Fråga dig kommer jag använda detta 30 gånger? innan du köper.
              </p>
              <p>
                <span className="font-semibold text-gray-900">Second hand:</span> Begagnade kläder är nästan helt utsläppsfria. 
                Loppisar, second hand-butiker och online-plattformar erbjuder ett stort utbud.
              </p>
              <p>
                <span className="font-semibold text-gray-900">Reparera och vårda:</span> Laga kläder istället för att slänga dem. 
                Lär dig enkla reparationer eller använd skräddare. Tvätta i lägre temperatur och häng för torkning 
                istället för torktumlare.
              </p>
              <p>
                <span className="font-semibold text-gray-900">Hyra och dela:</span> För festkläder eller andra saker du sällan 
                använder, överväg att hyra istället för att köpa.
              </p>
            </div>

            {/* Section 6 */}
            <h2 className="text-3xl font-bold text-gray-900 mt-16 mb-6">
              Systemförändring och politiskt engagemang
            </h2>

            <p className="leading-relaxed mb-8 text-gray-700">
              Individuella handlingar är viktiga, men för att verkligen lösa klimatkrisen krävs också stora 
              systemförändringar. Som medborgare har vi möjlighet att påverka de strukturer och system som 
              formar vårt samhälle.
            </p>

            <div className="my-10 p-8 bg-gray-50 rounded-lg border-l-4 border-green-600">
              <p className="font-semibold text-gray-900 mb-4">Så kan du påverka systemförändringar:</p>
              <div className="space-y-4 text-gray-700">
                <p><span className="font-semibold text-gray-900">Engagera dig i organisationer:</span> Gå med i miljöorganisationer 
                eller starta egna initiativ. Kollektiv organisering har genom historien varit drivkraften bakom 
                samhällsförändringar.</p>
                <p><span className="font-semibold text-gray-900">Påverka din arbetsplats:</span> Föreslå hållbara lösningar på jobbet. 
                Många företag är mer öppna för förändring än man tror när medarbetare engagerar sig.</p>
                <p><span className="font-semibold text-gray-900">Kontakta politiker:</span> Skicka e-post, gå på medborgardialoger, 
                delta i demonstrationer. Politiker behöver höra att väljare bryr sig om klimatet.</p>
                <p><span className="font-semibold text-gray-900">Sprid kunskap:</span> Dela artiklar, prata med vänner, skriv 
                insändare. Medvetenhet är första steget mot förändring.</p>
              </div>
            </div>

            {/* Conclusion */}
            <h2 className="text-3xl font-bold text-gray-900 mt-16 mb-6">
              Hopp och handling: Vägen framåt
            </h2>

            <p className="leading-relaxed mb-6 text-gray-700">
              Trots de enorma utmaningarna vi står inför finns det anledning till hopp. Över hela världen 
              sker en grön revolution. Förnybar energi blir billigare än fossil energi. Elektriska bilar 
              blir mainstream. Företag och länder sätter ambitiösa klimatmål. Unga människor världen över 
              kräver handling och förändring.
            </p>

            <p className="leading-relaxed mb-8 text-gray-700">
              Vi har teknologin och kunskapen som behövs för att möta klimatkrisen. Solceller och vindkraft 
              har blivit de billigaste energikällorna i historien. Batterier blir bättre och billigare varje 
              år. Vi kan odla mat på mer hållbara sätt. Vi kan bygga cirkulära ekonomier där avfall blir 
              resurser. Lösningarna finns - det som behövs är politisk vilja och kollektiv handling.
            </p>

            <div className="my-12 p-10 bg-gray-50 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Saker som ger hopp:</h3>
              <div className="grid md:grid-cols-2 gap-8 text-gray-700">
                <div>
                  <p className="font-semibold text-gray-900 mb-2">Förnybar energi exploderar</p>
                  <p className="text-sm">Solenergi och vindkraft installeras i rekordfart och är nu billigare än fossil energi i de flesta länder</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-2">Skogplantering ökar</p>
                  <p className="text-sm">Flera länder planterar miljarder träd och arbetar med att återställa ekosystem</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-2">Företag tar ansvar</p>
                  <p className="text-sm">Allt fler stora företag sätter vetenskapsbaserade klimatmål och investerar i hållbara lösningar</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-2">Innovation accelererar</p>
                  <p className="text-sm">Genombrott inom grön vätgas, kolinfångning och alternativa proteiner ger nya möjligheter</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-2">Medvetenheten växer</p>
                  <p className="text-sm">Fler människor än någonsin förstår allvaret och är beredda att agera</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-2">Batterier blir bättre</p>
                  <p className="text-sm">Kapaciteten ökar och priserna sjunker, vilket möjliggör elektrifiering av allt från bilar till flygplan</p>
                </div>
              </div>
            </div>

            <p className="leading-relaxed mb-6 text-gray-700">
              Att agera hållbart är inte perfektionism - det handlar om att göra bättre val när vi kan. 
              Ingen kan göra allt, men alla kan göra något. Varje litet steg räknas, och tillsammans kan 
              våra individuella handlingar skapa enorm påverkan. När miljoner människor börjar göra hållbarare 
              val förändras marknader, företag anpassar sig, och politiker får mandat att fatta modiga beslut.
            </p>

            <p className="leading-relaxed mb-6 text-gray-700">
              Framtiden formas av de val vi gör idag. Vi står vid ett vägskäl där varje beslut - individuellt, 
              kollektivt och politiskt - spelar roll. Hållbarhet är inte längre ett alternativ eller en trend 
              - det är vägen framåt för ett samhälle som värnar om både människor och planet.
            </p>

            <div className="my-12 p-8 bg-gray-900 rounded-lg">
              <p className="text-lg text-gray-100 leading-relaxed italic">
                Låt oss tillsammans bygga en framtid där alla kan leva goda liv inom planetens gränser. 
                En framtid där ekonomisk utveckling går hand i hand med miljöhänsyn och social rättvisa. 
                En framtid vi kan vara stolta över att lämna till våra barn och barnbarn.
              </p>
            </div>

            <p className="leading-relaxed text-gray-700 text-center">
              Börja idag. Börja smått. Men börja. Din framtid, dina barns framtid, och planetens framtid 
              är värd det.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-16 pt-12 border-t border-gray-200">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Redo att göra skillnad?
              </h3>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Börja din hållbarhetsresa genom att byta på SwapDeals
              </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
  <Link
    href="/"
    className="inline-block bg-green-700 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-800 transition"
    aria-label="Gå till SwapDeals startsida för byteshandel"
  >
    Tillbaka till SwapDeals Startsida
  </Link>
</div>
            </div>
          </div>
        </article>
      </main>

      
    </div>
  );
}

