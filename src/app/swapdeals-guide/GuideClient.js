// app/swapdeals-guide/GuideClient.js
'use client';

import { useState } from 'react';
import Link from 'next/link';

import { 
  ArrowLeft, 
  Camera, 
  CheckCircle, 
  Star, 
  Users, 
  MessageCircle, 
  Shield, 
  Coffee, 
  ArrowRight, 
  Upload, 
  Eye, 
  User, 
  History, 
  Gift,
  Sparkles,
  TrendingUp,
  Award,
  Lightbulb
} from 'lucide-react';

export default function GuideClient() {
  const tradingSteps = [
    {
      number: 1,
      icon: Upload,
      title: "Lägg upp dina föremål",
      description: "Börja din bytesresa genom att publicera föremål du vill byta bort på vår plattform.",
      details: [
        "Ta högkvalitativa foton i naturligt ljus från flera vinklar för bästa presentation",
        "Beskriv föremålet noggrant: märke, modell, storlek, färg och verkligt skick",
        "Specificera önskade bytesobjekt eller kategorier du är intresserad av",
        "Publicera din annons och gör den synlig för tusentals användare i hela Sverige"
      ],
      tip: "Professionella bilder och ärliga beskrivningar ökar dina chanser att få attraktiva byteserbjudanden med upp till 300%.",
      bgColor: "from-blue-50/90 to-cyan-50/70",
      tipColor: "text-blue-700",
      iconBg: "from-blue-100 to-cyan-200",
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      number: 2,
      icon: Eye,
      title: "Ta emot byteserbjudanden",
      description: "När din annons är live kan användare från hela Sverige upptäcka och erbjuda byten.",
      details: [
        "Din annons visas för relevanta användare baserat på deras intressen och sökningar",
        "Få realtidsnotiser via e-post och app när någon föreslår ett byte",
        "Se detaljerade erbjudanden med bilder, beskrivningar och användarrecensioner",
        "Jämför flera erbjudanden sida vid sida för att hitta det bästa bytet för dig"
      ],
      tip: "De mest framgångsrika bytesaffärerna sker inom 3-7 dagar efter publicering. Var aktiv och svara snabbt!",
      bgColor: "from-green-50/90 to-emerald-50/70",
      tipColor: "text-green-700",
      iconBg: "from-green-100 to-emerald-200",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      number: 3,
      icon: User,
      title: "Utvärdera och besluta",
      description: "Du har full kontroll över vilka byten du accepterar och kan ta dig tid att välja rätt.",
      details: [
        "✅ Acceptera: När du hittar det perfekta erbjudandet klickar du för att starta bytesprocessen",
        "❌ Avvisa: Tacka nej till erbjudanden som inte passar dina behov eller förväntningar",
        "⏸️ Vänta: Håll erbjudanden öppna medan du överväger eller väntar på bättre alternativ",
        "💬 Förhandla: Kontakta användaren för att diskutera möjliga justeringar av bytet"
      ],
      tip: "Det finns ingen brådska! 73% av användare som väntar på det rätta erbjudandet rapporterar högre tillfredsställelse med sina byten.",
      bgColor: "from-amber-50/90 to-yellow-50/70",
      tipColor: "text-amber-700",
      iconBg: "from-amber-100 to-yellow-200",
      gradient: "from-amber-500 to-yellow-600"
    },
    {
      number: 4,
      icon: MessageCircle,
      title: "Kommunicera säkert",
      description: "Efter ett accepterat byte får ni tillgång till en privat och säker chatt för att planera detaljerna.",
      details: [
        "📍 Bestäm mötesplats: Välj en trygg, offentlig plats som passar båda parter",
        "📦 Planera frakt: Diskutera fraktalternativ om ni inte kan mötas fysiskt",
        "⏰ Koordinera tidpunkt: Hitta en tid som fungerar för båda och bekräfta mötet",
        "🔍 Förtydliga detaljer: Ställ alla frågor om föremålets skick innan ni möts"
      ],
      tip: "Använd vår inbyggda chattfunktion för all kommunikation - aldrig dela personlig information för tidigt i processen.",
      bgColor: "from-purple-50/90 to-violet-50/70",
      tipColor: "text-purple-700",
      iconBg: "from-purple-100 to-violet-200",
      gradient: "from-purple-500 to-violet-600"
    },
    {
      number: 5,
      icon: CheckCircle,
      title: "Slutför bytet framgångsrikt",
      description: "När ni träffats och bytt föremål bekräftar ni transaktionen på plattformen.",
      details: [
        "Inspektera föremålet noggrant och säkerställ att det matchar beskrivningen",
        "Genomför bytet på den överenskomna platsen och tiden",
        "Markera bytet som 'Genomfört' i appen för att uppdatera er byteshistorik",
        "Båda parters statistik och rykte uppdateras automatiskt efter genomfört byte"
      ],
      tip: "Genom att markera byten som genomförda bygger du förtroende och får högre ranking i vårt community.",
      bgColor: "from-teal-50/90 to-emerald-50/70",
      tipColor: "text-teal-700",
      iconBg: "from-teal-100 to-emerald-200",
      gradient: "from-teal-500 to-emerald-600"
    },
    {
      number: 6,
      icon: History,
      title: "Följ din bytesresa",
      description: "SwapDeals ger dig fullständig överblick över all din bytesaktivitet och framsteg.",
      details: [
        "📊 Detaljerad statistik: Se antal genomförda byten, sparade pengar och miljöpåverkan",
        "🗂️ Komplett historik: Alla dina byten dokumenterade med datum, föremål och motpart",
        "⭐ Få betyg och recensioner: Bygg ditt rykte genom positiva bytesupplevelser",
        "🏆 Lås upp utmärkelser: Tjäna badges och bli en erkänd bytes-mästare i communityt"
      ],
      tip: "Aktiva användare med komplett historik får i genomsnitt 40% fler och bättre byteserbjudanden.",
      bgColor: "from-indigo-50/90 to-blue-50/70",
      tipColor: "text-indigo-700",
      iconBg: "from-indigo-100 to-blue-200",
      gradient: "from-indigo-500 to-blue-600"
    }
  ];

  const successTips = [
    {
      icon: Camera,
      title: "Kvalitet & Transparens",
      tips: [
        "Fotografera i dagsljus från minst 3-4 olika vinklar",
        "Visa upp eventuella defekter eller slitage tydligt",
        "Skriv detaljerade, sanningsenliga beskrivningar på minst 50 ord",
        "Inkludera mått, varumärke och ursprungligt inköpspris om möjligt",
        "Uppdatera annonsen omedelbart om något förändras"
      ],
      color: "green",
      bgGradient: "from-green-50/90 to-emerald-50/70",
      iconGradient: "from-green-100 to-emerald-200"
    },
    {
      icon: Users,
      title: "Kommunikation & Respekt",
      tips: [
        "Svara på meddelanden inom 24 timmar för bästa resultat",
        "Var artig, tydlig och professionell i all kommunikation",
        "Håll dina löften och följ överenskomna tider och platser",
        "Ställ alla relevanta frågor innan ni möts för att undvika missförstånd",
        "Ge konstruktiv feedback efter genomförda byten"
      ],
      color: "blue",
      bgGradient: "from-blue-50/90 to-cyan-50/70",
      iconGradient: "from-blue-100 to-cyan-200"
    },
    {
      icon: Shield,
      title: "Säkerhet & Förtroende",
      tips: [
        "Möts alltid på offentliga platser med god belysning och folk omkring",
        "Ta med en vän om du känner dig osäker på ett byte",
        "Kontrollera användarens betyg och historik innan du accepterar",
        "Lita på din magkänsla - avbryt om något känns konstigt",
        "Rapportera misstänkt beteende till vår säkerhetsavdelning omedelbart"
      ],
      color: "purple",
      bgGradient: "from-purple-50/90 to-violet-50/70",
      iconGradient: "from-purple-100 to-violet-200"
    }
  ];

  const additionalFeatures = [
    {
      icon: TrendingUp,
      title: "Växande Community",
      description: "Bli del av Sveriges snabbast växande bytesplattform med tusentals aktiva användare som delar din passion för hållbar konsumtion och smart återanvändning.",
      gradient: "from-orange-100 to-amber-200"
    },
    {
      icon: Gift,
      title: "Total Flexibilitet",
      description: "Du bestämmer helt själv över dina byten. Ändra dig när som helst, avböj erbjudanden utan förklaring, och pausa eller ta bort annonser efter behov.",
      gradient: "from-pink-100 to-rose-200"
    },
    {
      icon: Award,
      title: "Belöningssystem",
      description: "Tjäna poäng, badges och specialstatus genom aktiva och framgångsrika byten. Högre ranking ger bättre synlighet och fler premium-erbjudanden.",
      gradient: "from-yellow-100 to-amber-200"
    },
    {
      icon: Sparkles,
      title: "Smarta Matchningar",
      description: "Vår AI-drivna algoritm matchar dina önskemål med relevanta erbjudanden och föreslår byten du kanske inte hade tänkt på själv.",
      gradient: "from-cyan-100 to-blue-200"
    }
  ];

  const platformBenefits = [
    { icon: "💰", text: "Spara pengar genom smart byteshandel", color: "text-green-600" },
    { icon: "🌍", text: "Minska din klimatpåverkan med 70%", color: "text-blue-600" },
    { icon: "🤝", text: "Bygg meningsfulla relationer lokalt", color: "text-purple-600" },
    { icon: "♻️", text: "Bidra till cirkulär ekonomi", color: "text-teal-600" }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-green-50/20 to-blue-50/30">
      {/* Ambient light effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-transparent pointer-events-none z-0"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-green-100/20 via-transparent to-transparent pointer-events-none z-0"></div>

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex-1 py-6 sm:py-8 lg:py-12 relative z-10">
        
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            href="/"
            className="inline-flex items-center text-green-600 hover:text-green-700 font-semibold transition-all duration-300 hover:bg-green-50 px-4 py-2 rounded-xl"
          >
            <ArrowLeft className="w-5 h-5 mr-2" strokeWidth={2.5} />
            Tillbaka till startsidan
          </Link>
        </div>

        {/* Hero Section - Mobile First */}
        <section className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-12 mb-8 sm:mb-12 border border-green-100/60 relative overflow-hidden">
          {/* Ambient background effects */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-green-200/30 to-blue-200/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-br from-blue-200/30 to-green-200/30 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-green-100/20 to-transparent rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="flex items-center bg-gradient-to-r from-green-100 to-emerald-200 rounded-full px-4 py-2 shadow-lg">
                <Sparkles className="w-5 h-5 text-green-600 mr-2" strokeWidth={2.5} />
                <span className="text-green-800 font-bold text-sm">
                  Officiell Guide
                </span>
              </div>
              <div className="flex items-center bg-gradient-to-r from-blue-100 to-cyan-200 rounded-full px-4 py-2 shadow-lg">
                <Lightbulb className="w-5 h-5 text-blue-600 mr-2" strokeWidth={2.5} />
                <span className="text-blue-800 font-bold text-sm">
                  6 Enkla Steg
                </span>
              </div>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-6 leading-tight">
              Din Kompletta Guide till att leva Hållbart 
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl text-gray-700 mb-8 leading-relaxed max-w-4xl">
              Välkommen till <strong className="text-green-600">SwapDeals</strong> - Sveriges ledande plattform för 
              hållbar byteshandel där du kan förvandla oanvända föremål till saker du faktiskt behöver. 
              Den här guiden leder dig genom hela bytesprocessen från första annonsen till genomfört byte.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {platformBenefits.map((benefit, index) => (
                <div key={index} className="flex items-center p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-white/60 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <span className="text-3xl mr-3">{benefit.icon}</span>
                  <span className={`font-semibold ${benefit.color}`}>{benefit.text}</span>
                </div>
              ))}
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-green-200/50 shadow-lg">
              <p className="text-gray-800 text-base sm:text-lg leading-relaxed">
                <strong className="text-green-700 text-xl">🚀 Redo att börja?</strong> Följ dessa 6 enkla steg 
                för att bli en framgångsrik bytes-expert i vårt hållbara nätverk av tusentals svenska användare.
              </p>
            </div>
          </div>
        </section>

        {/* Trading Steps - Mobile First */}
        <section className="mb-8 sm:mb-12">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              6 Steg till Framgångsrika Byten
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              Varje steg är designat för att göra din bytesupplevelse så smidig och trygg som möjligt
            </p>
          </div>
          
          <div className="space-y-6 sm:space-y-8">
            {tradingSteps.map((step, index) => (
              <article 
                key={index} 
                className={`bg-gradient-to-br ${step.bgColor} backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-white/70 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1 relative overflow-hidden group`}
              >
                {/* Ambient effects */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
                
                {/* Step Header - Mobile Optimized */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 relative z-10 gap-4">
                  <div className={`bg-gradient-to-br ${step.iconBg} rounded-2xl p-4 sm:p-5 shadow-2xl group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className="w-7 h-7 sm:w-9 sm:h-9 text-gray-700" strokeWidth={2} />
                  </div>
                  
                  <div className="flex-1 w-full">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <div className="bg-white/90 backdrop-blur-sm text-gray-800 font-bold text-sm px-4 py-2 rounded-full shadow-lg">
                        Steg {step.number} av 6
                      </div>
                      <div className={`hidden sm:block h-1 flex-1 bg-gradient-to-r ${step.gradient} rounded-full opacity-30`}></div>
                    </div>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
                
                {/* Details Card */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 sm:p-6 lg:p-8 border border-white/70 mb-6 shadow-xl relative z-10">
                  <h4 className="font-bold text-gray-800 mb-5 text-base sm:text-lg flex items-center">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mr-3" strokeWidth={2.5} />
                    Så här gör du:
                  </h4>
                  <ul className="space-y-4">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="text-gray-700 flex items-start text-sm sm:text-base leading-relaxed">
                        <div className="w-2 h-2 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Pro Tip */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/50 shadow-lg relative z-10 hover:bg-white/80 transition-colors duration-300">
                  <p className={`${step.tipColor} font-bold text-base sm:text-lg flex items-start leading-relaxed`}>
                    <span className="text-2xl mr-3 flex-shrink-0">💡</span>
                    <span>
                      <strong className="block mb-1">Proffs-tips:</strong>
                      {step.tip}
                    </span>
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Additional Features - Mobile First Grid */}
        <section className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 mb-8 sm:mb-12 border border-gray-100/60 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-green-100/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-100/30 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 flex items-center flex-wrap gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl shadow-xl flex items-center justify-center">
                <Star className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" strokeWidth={2.5} />
              </div>
              <span>Ytterligare Fördelar</span>
            </h2>
            <p className="text-gray-600 mb-8 text-sm sm:text-base">
              SwapDeals erbjuder mycket mer än bara byteshandel
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {additionalFeatures.map((feature, index) => (
                <div 
                  key={index} 
                  className="flex flex-col sm:flex-row items-start p-5 sm:p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/70 hover:bg-white/90 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
                >
                  <div className={`bg-gradient-to-br ${feature.gradient} rounded-2xl p-4 shadow-xl mb-4 sm:mb-0 sm:mr-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-gray-700" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 mb-2 text-base sm:text-lg">
                      {feature.title}
                    </h4>
                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Success Tips - Mobile First */}
        <section className="mb-8 sm:mb-12">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              Tips för Framgångsrika Byten
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              Följ dessa riktlinjer för att maximera dina chanser till lyckade byten
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {successTips.map((category, index) => (
              <article 
                key={index} 
                className={`bg-gradient-to-br ${category.bgGradient} backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/70 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden group`}
              >
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                
                <div className="flex items-center mb-6 relative z-10">
                  <div className={`bg-gradient-to-br ${category.iconGradient} rounded-2xl p-4 shadow-xl mr-4 group-hover:scale-110 transition-transform duration-300`}>
                    <category.icon className="w-6 h-6 sm:w-7 sm:h-7 text-gray-700" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                    {category.title}
                  </h3>
                </div>
                
                <ul className="space-y-3 sm:space-y-4 relative z-10">
                  {category.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="text-gray-700 flex items-start text-sm sm:text-base leading-relaxed">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* Call to Action - Mobile First */}
        <section className="bg-gradient-to-br from-green-500 via-emerald-600 to-green-700 rounded-3xl shadow-2xl p-8 sm:p-10 lg:p-14 text-center text-white relative overflow-hidden">
          {/* Ambient effects */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute top-1/4 right-1/4 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
          
          <div className="relative z-10">
            <div className="mb-6">
              <div className="inline-flex items-center bg-white/20 backdrop-blur-lg rounded-full px-5 py-2 mb-4">
                <Sparkles className="w-5 h-5 mr-2" strokeWidth={2.5} />
                <span className="font-bold text-sm">Börja Din Bytesresa</span>
              </div>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Redo att Transformera Dina Oanvända Saker?
            </h2>
            
            <p className="text-lg sm:text-xl mb-8 sm:mb-10 opacity-95 max-w-3xl mx-auto leading-relaxed">
              Förvandla föremål du inte använder till saker du verkligen behöver! Gå med i Sveriges 
              största bytescommunity och bidra till en mer hållbar framtid samtidigt som du sparar pengar.
            </p>
            
            {/* Benefits Grid - Mobile Optimized */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10 max-w-4xl mx-auto">
              <div className="flex flex-col items-center p-5 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                <CheckCircle className="w-8 h-8 mb-3" strokeWidth={2.5} />
                <span className="font-bold text-base sm:text-lg">100% Gratis</span>
                <span className="text-sm opacity-90">Inga dolda avgifter</span>
              </div>
              <div className="flex flex-col items-center p-5 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                <Shield className="w-8 h-8 mb-3" strokeWidth={2.5} />
                <span className="font-bold text-base sm:text-lg">Säkert & Tryggt</span>
                <span className="text-sm opacity-90">Verifierade användare</span>
              </div>
              <div className="flex flex-col items-center p-5 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                <Users className="w-8 h-8 mb-3" strokeWidth={2.5} />
                <span className="font-bold text-base sm:text-lg">Stort Community</span>
                <span className="text-sm opacity-90">Tusentals användare</span>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-8 sm:mb-10">
              <Link href="/tradeform" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto bg-white text-green-600 hover:bg-green-50 py-4 px-8 rounded-2xl transition-all duration-300 font-bold text-base sm:text-lg flex items-center justify-center transform hover:scale-105 shadow-2xl hover:shadow-3xl">
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 mr-3" strokeWidth={2.5} />
                  Börja Byta Nu
                </button>
              </Link>
              <Link href="/hallbar-konsumtion" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto bg-green-700/80 hover:bg-green-700 text-white py-4 px-8 rounded-2xl transition-all duration-300 font-bold text-base sm:text-lg flex items-center justify-center transform hover:scale-105 shadow-xl border-2 border-white/30">
                  <Coffee className="w-5 h-5 sm:w-6 sm:h-6 mr-3" strokeWidth={2.5} />
                  Lär Dig Mer
                </button>
              </Link>
            </div>
            
            {/* Final Message */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/20 max-w-3xl mx-auto">
              <p className="text-lg sm:text-xl font-bold opacity-95 leading-relaxed">
                🎁 Börja din bytesresa idag och upplev glädjen i hållbar handel!
                <span className="block mt-2 text-yellow-200">
                  Tusentals svenskar byter redan bli en av dem! ✨
                </span>
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}