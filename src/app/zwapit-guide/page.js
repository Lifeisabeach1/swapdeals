'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import RegisterForm from '@/components/RegisterForm';
import LoginForm from '@/components/LoginForm';

// Import icons individually to avoid potential import issues
import { 
  ArrowLeft, 
  Camera, 
  Package, 
  CheckCircle, 
  Star, 
  Users, 
  MessageCircle, 
  Shield, 
  TrendingUp, 
  Coffee, 
  ArrowRight, 
  Clock, 
  MapPin, 
  Zap, 
  Heart, 
  Upload, 
  Eye, 
  User, 
  History, 
  Gift 
} from 'lucide-react';

export default function ZwapitGuidePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);

  const tradingSteps = [
    {
      number: 1,
      icon: Upload,
      title: "Ladda upp dina föremål",
      description: "Det första steget är att lista de föremål du är villig att byta bort.",
      details: [
        "Ta tydliga, välbelysta foton av ditt föremål från en bra vinkel",
        "Skriv detaljerade beskrivningar inklusive skick, märke, storlek och alla viktiga detaljer",
        "Ange vilka typer av föremål du letar efter i utbyte",
        "Ladda upp ditt bytesobjekt för att göra det synligt för andra användare"
      ],
      tip: "Ju bättre dina foton och beskrivningar är, desto större chans har du att få byteserbjudanden.",
      bgColor: "from-blue-50/80 to-blue-100/80",
      tipColor: "text-blue-600",
      iconBg: "from-blue-100 to-blue-200"
    },
    {
      number: 2,
      icon: Eye,
      title: "Vänta på byteserbjudanden",
      description: "När dina föremål är listade kan andra användare bläddra och upptäcka vad du erbjuder.",
      details: [
        "Andra användare kommer att se dina bytesföremål och kan föreslå byten",
        "Du får notifieringar när någon gör ett erbjudande",
        "Erbjudanden visar vilka föremål de är villiga att byta mot dina",
        "Du kan se deras föremål, foton och beskrivningar innan du bestämmer dig"
      ],
      tip: "Ha tålamod: Bra byten tar tid. Rätt person med rätt föremål kommer att hitta ditt bytesföremål.",
      bgColor: "from-green-50/80 to-green-100/80",
      tipColor: "text-green-600",
      iconBg: "from-green-100 to-green-200"
    },
    {
      number: 3,
      icon: User,
      title: "Granska och svara på erbjudanden",
      description: "När erbjudanden kommer in har du full kontroll över dina bytesbeslut.",
      details: [
        "Acceptera byte: Klicka här när du hittar ett erbjudande du är nöjd med",
        "Avböj byte: Tryck på denna knapp om erbjudandet inte intresserar dig",
        "Vänta: Du kan ta tid att överväga erbjudanden eller vänta på bättre"
      ],
      tip: "Du kan avböja vilket byte som helst när som helst under processen, så känn ingen press att acceptera det första erbjudandet.",
      bgColor: "from-yellow-50/80 to-yellow-100/80",
      tipColor: "text-yellow-600",
      iconBg: "from-yellow-100 to-yellow-200"
    },
    {
      number: 4,
      icon: MessageCircle,
      title: "Privat kommunikation",
      description: "När du accepterar ett byte kommer du in i en privat chatt med din bytespartner.",
      details: [
        "Mötesplats om ni byter personligen",
        "Fraktarrangemang om ni byter via post",
        "Timing och logistik",
        "Eventuella sista detaljer om föremålen"
      ],
      tip: "Denna konversation är bara mellan dig och din bytespartner.",
      bgColor: "from-purple-50/80 to-purple-100/80",
      tipColor: "text-purple-600",
      iconBg: "from-purple-100 to-purple-200"
    },
    {
      number: 5,
      icon: CheckCircle,
      title: "Genomför bytet",
      description: "Efter att ni har ordnat detaljerna och framgångsrikt bytt föremål:",
      details: [
        "Klicka på 'Genomfört byte' för att slutföra transaktionen",
        "Detta stänger bytet och uppdaterar båda användarnas byteshistorik",
        "Din bytesstatistik kommer att uppdateras"
      ],
      tip: "Att genomföra byten på rätt sätt hjälper till att bygga förtroende i gemenskapen.",
      bgColor: "from-teal-50/80 to-teal-100/80",
      tipColor: "text-teal-600",
      iconBg: "from-teal-100 to-teal-200"
    },
    {
      number: 6,
      icon: History,
      title: "Spåra din byteshistorik",
      description: "SwapDeals håller koll på all din bytesaktivitet.",
      details: [
        "Komplett historik över alla dina byten",
        "Statistik om din bytesaktivitet",
        "Föremål du har bytt bort och mottagit"
      ],
      tip: "Din byteshistorik hjälper dig att hålla koll på dina byten på ett enkelt sätt",
      bgColor: "from-indigo-50/80 to-indigo-100/80",
      tipColor: "text-indigo-600",
      iconBg: "from-indigo-100 to-indigo-200"
    }
  ];

  const successTips = [
    {
      icon: Camera,
      title: "Kvalitet & Ärlighet",
      tips: [
        "Var ärlig om föremålens skick",
        "Ta kvalitetsfoton",
        "Skriv tydliga, detaljerade beskrivningar",
        "Inkludera eventuella fel eller slitage"
      ],
      color: "green"
    },
    {
      icon: Users,
      title: "Kommunikation",
      tips: [
        "Var respektfull i din kommunikation",
        "Följ genom med överenskomna byten",
        "Ställ frågor om du är osäker"
      ],
      color: "blue"
    },
    {
      icon: Shield,
      title: "Säkerhet & Förtroende",
      tips: [
        "Använd sunt förnuft för säkerhet",
        "Träffas på offentliga platser",
        "Lita på din intuition"
      ],
      color: "purple"
    }
  ];

  const additionalFeatures = [
    {
      icon: Users,
      title: "Gemenskapsfokus",
      description: "SwapDeals bygger mot en starkare gemenskapsupplevelse med ytterligare funktioner som kommer i framtiden."
    },
    {
      icon: Gift,
      title: "Flexibilitet",
      description: "Kom ihåg att du behåller kontrollen genom hela processen och kan avböja byten när som helst om du ändrar dig."
    }
  ];

  // Handle login success
  const handleLoginSuccess = (userData) => {
    setShowLoginForm(false);
    setShowRegisterForm(false);
    // Redirect to trade form after successful login
    router.push('/tradeform');
  };

  // Modal switching functions
  const handleSwitchToLogin = () => {
    setShowRegisterForm(false);
    setTimeout(() => {
      setShowLoginForm(true);
    }, 100);
  };

  const handleSwitchToRegister = () => {
    setShowLoginForm(false);
    setTimeout(() => {
      setShowRegisterForm(true);
    }, 100);
  };

  // Handle "Kom igång nu" button click
  const handleGetStartedClick = () => {
    if (isAuthenticated) {
      // If user is logged in, go directly to trade form
      router.push('/tradeform');
    } else {
      // If user is not logged in, show login modal
      setShowLoginForm(true);
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-100">
        {/* Premium light effects overlay */}
        <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-b from-blue-50/10 to-transparent pointer-events-none z-0"></div>
        
        {/* Enhanced Header with glassmorphism */}
        <div className="bg-white/90 backdrop-blur-lg shadow-lg border-b border-blue-200/30 sticky top-0 z-50">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-50/20 to-transparent pointer-events-none"></div>
          
          <div className="max-w-6xl mx-auto px-4 py-4 relative z-10">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => router.back()}
               className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-600 hover:to-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-md flex items-center"            >
              
                <ArrowLeft className="w-5 h-5 mr-2" />
                <span className="font-medium">Till Hem</span>
              </button>
              <div className="text-right">
                <h1 className="text-lg font-bold text-gray-800 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg shadow-lg flex items-center justify-center mr-3">
                    <Gift className="w-5 h-5 text-white" />
                  </div>
                  Komplett användarguide
                </h1>
                <p className="text-sm text-gray-600">Bemästra SwapDeals bytes-handel</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto w-full px-4 flex-1 py-8 relative z-10">
          {/* Enhanced Hero Section with premium effects */}
          <section className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-8 border border-yellow-200/50 relative overflow-hidden">
            {/* Premium background effects */}
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-yellow-200/30 to-blue-200/30 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-br from-blue-200/30 to-yellow-200/30 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-yellow-100/20 to-transparent rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="flex items-center bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-full px-4 py-2 shadow-lg">
                  <Gift className="w-6 h-6 text-yellow-600 mr-2" />
                  <span className="text-yellow-800 font-semibold text-sm">
                    Komplett guide
                  </span>
                </div>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-800 mb-6 leading-tight">
                Kom igång med 
                <span className="bg-gradient-to-r from-gray-800 via-green-700 to-gray-800 bg-clip-text text-transparent"> SwapDeals</span>
              </h1>
              
              <p className="text-xl text-gray-700 mb-8 leading-relaxed max-w-4xl">
                Välkommen till SwapDeals, den gemenskapsdrivna plattformen där du kan byta föremål du inte längre behöver 
                mot saker du faktiskt vill ha. Denna guide kommer att guida dig genom hela bytesprocessen från början till slut.
              </p>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-lg">
                <p className="text-gray-800 text-lg leading-relaxed">
                  <strong className="text-gray-800">Redo att börja?</strong> Följ dessa 6 enkla steg för att bli en framgångsrik bytes-handlare 
                  i vårt hållbara nätverk.
                </p>
              </div>
            </div>
          </section>

          {/* Enhanced Trading Steps */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              6 Steg till framgångsrika byten
            </h2>
            <div className="space-y-8">
              {tradingSteps.map((step, index) => (
                <div key={index} className={`bg-gradient-to-br ${step.bgColor} backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/60 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden`}>
                  {/* Premium background effects for each step */}
                  <div className="absolute -top-16 -right-16 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                  <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
                  
                  <div className="flex items-start mb-6 relative z-10">
                    <div className={`bg-gradient-to-br ${step.iconBg} rounded-2xl p-4 shadow-xl mr-6`}>
                      <step.icon className="w-8 h-8 text-gray-700" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <div className="bg-white/90 backdrop-blur-sm text-gray-800 font-bold text-sm px-4 py-2 rounded-full mr-4 shadow-lg">
                          Steg {step.number}
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800">{step.title}</h3>
                      </div>
                      <p className="text-gray-700 text-lg leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                  
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/60 mb-6 shadow-lg relative z-10">
                    <h4 className="font-bold text-gray-800 mb-4 text-lg">Vad du ska göra:</h4>
                    <ul className="space-y-3">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="text-gray-700 flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="leading-relaxed">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/40 shadow-md relative z-10">
                    <p className={`${step.tipColor} font-semibold text-lg`}>
                      💡 Proffs-tips: {step.tip}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Enhanced Additional Features */}
          <section className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl p-8 mb-8 border border-gray-200/50 relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-yellow-100/30 rounded-full blur-2xl"></div>
            
            <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center relative z-10">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl shadow-lg flex items-center justify-center mr-4">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              Ytterligare funktioner
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              {additionalFeatures.map((feature, index) => (
                <div key={index} className="flex items-start p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/60 hover:bg-white/80 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl p-3 shadow-lg mr-4 mt-1">
                    <feature.icon className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2 text-lg">{feature.title}</h4>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Enhanced Success Tips */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              Tips för framgångsrika byten
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {successTips.map((category, index) => (
                <div key={index} className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-gray-200/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden">
                  <div className="absolute -top-8 -right-8 w-16 h-16 bg-gray-100/20 rounded-full blur-xl"></div>
                  
                  <div className="flex items-center mb-6 relative z-10">
                    <div className={`bg-gradient-to-br ${
                      category.color === 'green' ? 'from-green-100 to-green-200' :
                      category.color === 'blue' ? 'from-blue-100 to-blue-200' :
                      'from-purple-100 to-purple-200'
                    } rounded-2xl p-4 shadow-lg mr-4`}>
                      <category.icon className={`w-6 h-6 ${
                        category.color === 'green' ? 'text-green-600' :
                        category.color === 'blue' ? 'text-blue-600' :
                        'text-purple-600'
                      }`} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">{category.title}</h3>
                  </div>
                  
                  <ul className="space-y-3 relative z-10">
                    {category.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="text-gray-700 flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="leading-relaxed">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Enhanced Call to Action */}
          <section className="bg-gradient-to-br from-green-400 via-green-500 to-green-600 rounded-3xl shadow-2xl p-10 text-center text-white relative overflow-hidden">
            {/* Premium background effects */}
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
            <div className="absolute top-1/4 right-1/4 w-20 h-20 bg-white/5 rounded-full blur-xl"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-6">Redo att börja Byta?</h2>
              <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed">
                Förvandla dina oanvända föremål till saker du faktiskt vill ha! Gå med i communityt 
                byt till dig saker som du behöver samtidigt som du hjälper miljön.
              </p>
              
              <div className="flex items-center justify-center mb-8 flex-wrap gap-8">
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 mr-2" />
                  <span className="font-semibold text-lg">Lätt att använda</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 mr-2" />
                  <span className="font-semibold text-lg">Säkert & tryggt</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 mr-2" />
                  <span className="font-semibold text-lg">Gemenskapsdriven</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
                <button
                  onClick={handleGetStartedClick}
                  className="bg-white/90 backdrop-blur-lg text-green-600 hover:bg-white hover:text-green-700 py-4 px-8 rounded-2xl transition-all duration-300 font-bold shadow-xl hover:shadow-2xl flex items-center justify-center transform hover:-translate-y-1 text-lg"
                >
                  <Upload className="w-6 h-6 mr-3" />
                  Kom igång nu
                </button>
                <Link href="/sustainable-trading">
                  <button className="bg-transparent border-2 border-white/80 text-white hover:bg-white/10 backdrop-blur-lg hover:border-white py-4 px-8 rounded-2xl transition-all duration-300 font-bold flex items-center justify-center transform hover:-translate-y-1 text-lg">
                    <Coffee className="w-6 h-6 mr-3" />
                    Lär dig om hållbarhet
                    <ArrowRight className="w-5 h-5 ml-3" />
                  </button>
                </Link>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <p className="text-xl font-bold opacity-95 leading-relaxed">
                  Börja din bytes resa idag och upptäck glädjen i att byta! 
                  <span className="text-yellow-200"> På SwapDeals</span>. 🎁✨
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Login and Register Modals */}
      <RegisterForm 
        isOpen={showRegisterForm} 
        onClose={() => setShowRegisterForm(false)}
        onSuccess={handleLoginSuccess}
        onSwitchToLogin={handleSwitchToLogin}
      />

      <LoginForm 
        isOpen={showLoginForm} 
        onClose={() => setShowLoginForm(false)}
        onSuccess={handleLoginSuccess}
        onSwitchToRegister={handleSwitchToRegister}
      />
    </>
  );
}