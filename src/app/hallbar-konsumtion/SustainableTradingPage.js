import { Leaf, Recycle, DollarSign, Users, Home, TrendingUp, 
         CheckCircle, Globe, Heart, Package, ArrowRight, Coffee } from 'lucide-react';

export default function SustainableTradingPage() {
  const benefits = [
    {
      icon: <Recycle className="w-6 h-6 text-green-600" />,
      title: "Minska avfall",
      description: "Ge dina prylar ett andra liv istället för att låta dem hamna på soptippen"
    },
    {
      icon: <DollarSign className="w-6 h-6 text-blue-600" />,
      title: "Spara pengar",
      description: "Byta istället för att köpa nytt - bättre för din plånbok och budget"
    },
    {
      icon: <Users className="w-6 h-6 text-purple-600" />,
      title: "Bygga gemenskap",
      description: "Koppla ihop med riktiga människor över hela Sverige som delar dina värderingar"
    },
    {
      icon: <Globe className="w-6 h-6 text-teal-600" />,
      title: "Miljöpåverkan",
      description: "Minska efterfrågan på tillverkning och minimera ditt koldioxidavtryck"
    }
  ];

  const whenPeopleThink = [
    {
      icon: <Home className="w-5 h-5 text-green-600" />,
      title: "Städa hemma",
      description: "Undrar vad de ska göra med saker de inte längre använder"
    },
    {
      icon: <DollarSign className="w-5 h-5 text-green-600" />,
      title: "Spara pengar",
      description: "Särskilt under tuffa ekonomiska tider eller stigande inflation"
    },
    {
      icon: <Leaf className="w-5 h-5 text-green-600" />,
      title: "Miljöomsorg",
      description: "Vill minska sitt avfall och leva mer hållbart"
    },
    {
      icon: <Package className="w-5 h-5 text-green-600" />,
      title: "Flytta hemifrån",
      description: "Vill minska utan att kasta bort bra grejer"
    },
    {
      icon: <Heart className="w-5 h-5 text-green-600" />,
      title: "Hitta något specifikt",
      description: "Kan inte rättfärdiga att köpa det helt nytt men behöver det ändå"
    },
    {
      icon: <Users className="w-5 h-5 text-green-600" />,
      title: "Gemenskap",
      description: "Vill knyta kontakt med likasinnade människor lokalt"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-green-50">
      {/* Header - Compact version */}
      <header className="relative overflow-hidden bg-gradient-to-br from-green-600 via-green-500 to-teal-500">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.1),transparent_50%)]"></div>
        
        <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 relative">
          <div className="text-center">
            <div className="inline-flex items-center justify-center mb-3">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                <Leaf className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow-lg" />
              </div>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight px-2">
              Miljövänligt
            </h1>
            
            <p className="text-base sm:text-lg text-white/95 max-w-2xl mx-auto font-medium px-4">
              Upptäck varför hållbart byte spelar roll
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 sm:py-10">
        {/* Hero Section */}
        <section className="bg-white rounded-2xl shadow-lg p-5 sm:p-10 mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 text-center leading-tight">
            Varför miljövänligt spelar roll och varför nu
          </h2>
          
          <p className="text-base sm:text-lg lg:text-xl text-gray-700 mb-5 sm:mb-8 leading-relaxed">
            I dagens snabba värld blir människor mer medvetna om miljöpåverkan av 
            överkonsumtion och avfall. Klimatförändringarna, överfulla soptipper och stigande levnadskostnader 
            har gjort det tydligt: vi behöver smartare, mer hållbara sätt att leva.
          </p>
          
          <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-5 sm:p-6 border-2 border-green-200">
            <p className="text-gray-800 text-base sm:text-lg leading-relaxed">
              <strong className="text-green-700 text-lg sm:text-xl block mb-2">Hållbar handel</strong>
              är inte bara en trend—det är en rörelse. Det handlar om att hålla föremål i användning längre, 
              minska behovet att tillverka nya och minimera vårt miljöavtryck genom miljövänliga val.
            </p>
          </div>
        </section>

        {/* Problem Statement */}
        <section className="bg-white rounded-2xl shadow-lg p-5 sm:p-10 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-5 sm:mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-xl flex items-center justify-center mr-3 flex-shrink-0">
                <Package className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
              </div>
              <span className="leading-tight">Problemet vi löser</span>
            </div>
          </h2>
          
          <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-5 sm:p-6 space-y-4">
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
              Varje år hamnar otaliga perfekt användbara föremål i soporna kläder som inte längre passar, 
              verktyg vi inte använder, elektronik som samlar damm. Samtidigt finns det andra där ute som letar 
              efter att köpa exakt samma saker.
            </p>
            <p className="text-gray-900 font-bold text-lg sm:text-xl">
              Så varför inte byta istället för att handla?
            </p>
          </div>
        </section>

        {/* Benefits Grid - Mobile optimized */}
        <section className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-5 sm:mb-8 text-center leading-tight px-2">
            Vad gör hållbar handel annorlunda?
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {benefits.map((benefit, index) => (
              <article key={index} className="bg-white rounded-xl shadow-md p-5 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-3 flex-shrink-0">
                    {benefit.icon}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 leading-tight">
                      {benefit.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* When People Think Section - Mobile optimized */}
        <section className="bg-white rounded-2xl shadow-lg p-5 sm:p-10 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-5 sm:mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-3 flex-shrink-0">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <span className="leading-tight">När tänker folk på detta?</span>
            </div>
          </h2>
          
          <p className="text-gray-700 mb-5 text-base sm:text-lg leading-relaxed">
            Folk tänker på miljövänlig och hållbar handel när de:
          </p>
          
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            {whenPeopleThink.map((item, index) => (
              <div key={index} className="flex items-start p-4 bg-gradient-to-br from-gray-50 to-green-50 rounded-xl border border-gray-200 hover:border-green-300 transition-colors duration-300">
                <div className="bg-green-100 rounded-lg p-2.5 mr-3 flex-shrink-0">
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-gray-900 mb-1 text-sm sm:text-base leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action - Mobile optimized */}
        <section className="bg-gradient-to-br from-green-500 via-green-600 to-teal-600 rounded-2xl shadow-xl p-6 sm:p-10 lg:p-12 text-center text-white">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 leading-tight">
            Redo att börja leva miljövänligt?
          </h2>
          
          <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
            Oavsett om du är student, en ung familj, minimalist eller bara någon som försöker leva smartare
            hållbar handel erbjuder en win-win-lösning för dig och planeten.
          </p>
          
          <div className="flex items-center justify-center mb-6 sm:mb-8 flex-wrap gap-2 sm:gap-3">
            <div className="flex items-center bg-white/20 rounded-full px-3 py-2 backdrop-blur-sm text-sm sm:text-base">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
              <span className="font-semibold whitespace-nowrap">Minska avfall</span>
            </div>
            <div className="flex items-center bg-white/20 rounded-full px-3 py-2 backdrop-blur-sm text-sm sm:text-base">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
              <span className="font-semibold whitespace-nowrap">Spara pengar</span>
            </div>
            <div className="flex items-center bg-white/20 rounded-full px-3 py-2 backdrop-blur-sm text-sm sm:text-base">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
              <span className="font-semibold whitespace-nowrap">Bygga gemenskap</span>
            </div>
          </div>
          
          <div className="mb-6 sm:mb-8">            
            <a 
              href="/swapdeals-guide" 
              className="inline-block w-full sm:w-auto"
              aria-label="Läs SwapDeals guide om hållbar byteshandel och miljövänlig konsumtion"
            >
              <button className="w-full sm:w-auto bg-white text-green-600 hover:bg-gray-50 active:bg-gray-100 py-4 px-6 sm:px-8 rounded-xl transition-all duration-300 font-bold text-base sm:text-lg flex items-center justify-center shadow-lg hover:shadow-xl">
                <Coffee className="w-5 h-5 mr-2 flex-shrink-0" />
                <span>Läs komplett guide om hållbar byteshandel</span>
                <ArrowRight className="w-5 h-5 ml-2 flex-shrink-0" />
              </button>
            </a>
          </div>
          
          <div className="bg-white/20 rounded-xl p-5 sm:p-6 backdrop-blur-sm">
            <p className="text-base sm:text-lg lg:text-xl font-bold leading-relaxed">
              Börja tänka annorlunda. Börja byta smartare. 
              SwapDeals för att bra grejer förtjänar en andra chans. 🌍
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
