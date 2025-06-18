'use client';

import { useState } from 'react';
import { ArrowLeft, Leaf, Recycle, DollarSign, Users, Home, TrendingUp, ChevronLeft, 
         CheckCircle, Globe, Heart, Package, ArrowRight, Camera, Coffee } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Head from 'next/head';
import { useAuth } from '@/hooks/useAuth';
import RegisterForm from '@/components/RegisterForm';
import LoginForm from '@/components/LoginForm';

// Meta Tags Component
const MetaTags = () => {
  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>Hållbara Byten - SwapDeals | Byta Grejer Istället för Att Köpa Nytt</title>
      <meta name="title" content="Hållbara Byten - SwapDeals | Byta Grejer Istället för Att Köpa Nytt" />
      <meta name="description" content="Upptäck hållbar handel med SwapDeals. Byta grejer istället för att köpa nytt - spara pengar, minska avfall och bygga gemenskap. Eco-friendly byten för en bättre miljö." />
      <meta name="keywords" content="hållbara byten, eco friendly, byta grejer, återvinning, miljövänlig handel, spara pengar, minska avfall, SwapDeals, hållbar konsumtion, miljöpåverkan, cirkulär ekonomi, byteshandel, second hand, återbruk" />
      <meta name="author" content="SwapDeals" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="Swedish" />
      <meta name="revisit-after" content="7 days" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://swapdeals.se/sustainable-trading" />
      <meta property="og:title" content="Hållbara Byten - SwapDeals | Byta Grejer Istället för Att Köpa Nytt" />
      <meta property="og:description" content="Upptäck hållbar handel med SwapDeals. Byta grejer istället för att köpa nytt - spara pengar, minska avfall och bygga gemenskap. Eco-friendly byten för en bättre miljö." />
      <meta property="og:image" content="https://swapdeals.se/Swapdealsemoji.png" />
      <meta property="og:image:alt" content="SwapDeals - Hållbara Byten Logo" />
      <meta property="og:site_name" content="SwapDeals" />
      <meta property="og:locale" content="sv_SE" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://swapdeals.se/sustainable-trading" />
      <meta property="twitter:title" content="Hållbara Byten - SwapDeals | Byta Grejer Istället för Att Köpa Nytt" />
      <meta property="twitter:description" content="Upptäck hållbar handel med SwapDeals. Byta grejer istället för att köpa nytt - spara pengar, minska avfall och bygga gemenskap." />
      <meta property="twitter:image" content="https://swapdeals.se/Swapdealsemoji.png" />

      {/* Additional SEO Meta Tags */}
      <meta name="geo.region" content="SE" />
      <meta name="geo.country" content="Sweden" />
      <meta name="geo.placename" content="Sverige" />
      
      {/* Schema.org structured data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Hållbara Byten - SwapDeals",
          "description": "Upptäck hållbar handel med SwapDeals. Byta grejer istället för att köpa nytt - spara pengar, minska avfall och bygga gemenskap.",
          "url": "https://swapdeals.se/sustainable-trading",
          "publisher": {
            "@type": "Organization",
            "name": "SwapDeals",
            "logo": {
              "@type": "ImageObject",
              "url": "https://swapdeals.se/Swapdealsemoji.png"
            }
          },
          "inLanguage": "sv-SE",
          "about": [
            {
              "@type": "Thing",
              "name": "Hållbar handel"
            },
            {
              "@type": "Thing", 
              "name": "Miljövänliga byten"
            },
            {
              "@type": "Thing",
              "name": "Återvinning"
            },
            {
              "@type": "Thing",
              "name": "Cirkulär ekonomi"
            }
          ]
        })}
      </script>

      {/* Canonical URL */}
      <link rel="canonical" href="https://swapdeals.se/sustainable-trading" />
    </Head>
  );
};

export default function SustainableTradingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');
  
  // Add state for modals
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);

  const benefits = [
    {
      icon: <Recycle className="w-8 h-8 text-green-600" />,
      title: "Minska avfall",
      description: "Ge dina prylar ett andra liv istället för att låta dem hamna på soptippen",
      bgColor: "from-green-50/80 to-green-100/80",
      iconBg: "from-green-100 to-green-200"
    },
    {
      icon: <DollarSign className="w-8 h-8 text-blue-600" />,
      title: "Spara pengar",
      description: "Byta istället för att köpa nytt - bättre för din plånbok och budget",
      bgColor: "from-blue-50/80 to-blue-100/80",
      iconBg: "from-blue-100 to-blue-200"
    },
    {
      icon: <Users className="w-8 h-8 text-purple-600" />,
      title: "Bygga gemenskap",
      description: "Koppla ihop med riktiga människor över hela Sverige som delar dina värderingar",
      bgColor: "from-purple-50/80 to-purple-100/80",
      iconBg: "from-purple-100 to-purple-200"
    },
    {
      icon: <Globe className="w-8 h-8 text-teal-600" />,
      title: "Miljöpåverkan",
      description: "Minska efterfrågan på tillverkning och minimera ditt koldioxidavtryck",
      bgColor: "from-teal-50/80 to-teal-100/80",
      iconBg: "from-teal-100 to-teal-200"
    }
  ];

  const whenPeopleThink = [
    {
      icon: <Home className="w-6 h-6 text-green-600" />,
      title: "Städa hemma",
      description: "Undrar vad de ska göra med saker de inte längre använder"
    },
    {
      icon: <DollarSign className="w-6 h-6 text-green-600" />,
      title: "Spara pengar",
      description: "Särskilt under tuffa ekonomiska tider eller stigande inflation"
    },
    {
      icon: <Leaf className="w-6 h-6 text-green-600" />,
      title: "Miljöomsorg",
      description: "Vill minska sitt avfall och leva mer hållbart"
    },
    {
      icon: <Package className="w-6 h-6 text-green-600" />,
      title: "Flytta hemifrån",
      description: "Vill minska utan att kasta bort bra grejer"
    },
    {
      icon: <Heart className="w-6 h-6 text-green-600" />,
      title: "Hitta något specifikt",
      description: "Kan inte rättfärdiga att köpa det helt nytt men behöver det ändå"
    },
    {
      icon: <Users className="w-6 h-6 text-green-600" />,
      title: "Gemenskap",
      description: "Vill knyta kontakt med likasinnade människor lokalt"
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

  // Handle "Föreslå ett byte" button click
  const handleProposeTradeClick = () => {
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
      <MetaTags />
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-gray-100">
        {/* Premium light effects overlay */}
        <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-b from-green-50/10 to-transparent pointer-events-none z-0"></div>
        
        {/* Enhanced Header with glassmorphism */}
        <div className="bg-white/90 backdrop-blur-lg shadow-lg border-b border-green-200/30 sticky top-0 z-50">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-green-50/20 to-transparent pointer-events-none"></div>
          
          <div className="max-w-6xl mx-auto px-4 py-4 relative z-10">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => router.back()}
               className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-600 hover:to-green-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-md flex items-center"            >
                <ArrowLeft className="w-5 h-5 mr-2" />
                <span className="font-medium">Till användar guiden</span>
              </button>

              <div className="text-right">
                <h1 className="text-lg font-bold text-gray-800 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg shadow-lg flex items-center justify-center mr-3">
                    <Leaf className="w-5 h-5 text-white" />
                  </div>
                  Hållbara byten
                </h1>
                <p className="text-sm text-gray-600">Lär dig varför det spelar roll</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto w-full px-4 flex-1 py-8 relative z-10">
          {/* Enhanced Hero Section with premium effects */}
          <section className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-8 border border-green-200/50 relative overflow-hidden">
            {/* Premium background effects */}
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-green-200/30 to-yellow-200/30 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-br from-blue-200/30 to-green-200/30 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-green-100/20 to-transparent rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="flex items-center bg-gradient-to-r from-green-100 to-green-200 rounded-full px-4 py-2 shadow-lg">
                  <Globe className="w-6 h-6 text-green-600 mr-2" />
                  <span className="text-green-800 font-semibold text-sm">
                    Eco Friendly Movement
                  </span>
                </div>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-800 mb-6 leading-tight">
                Varför Eco Friendly 
                <span className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent"> spelar roll</span>
                —och varför nu
              </h1>
              
              <p className="text-xl text-gray-700 mb-8 leading-relaxed max-w-4xl">
                I dagens snabba värld blir människor mer medvetna om miljöpåverkan av 
                överkonsumtion och avfall. Klimatförändringarna, överfulla soptipper och stigande levnadskostnader 
                har gjort det tydligt: vi behöver smartare, mer hållbara sätt att leva.
              </p>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-lg">
                <p className="text-gray-800 text-lg leading-relaxed">
                  <strong className="text-green-700">Miljövänliga byten</strong> är inte bara en trend—det är en rörelse. 
                  Det handlar om att hålla föremål i användning längre, minska behovet att tillverka nya och minimera 
                  vårt miljöavtryck.
                </p>
              </div>
            </div>
          </section>

          {/* Enhanced Problem Statement */}
          <section className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl p-8 mb-8 border border-red-200/50 relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-red-100/30 rounded-full blur-2xl"></div>
            
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center relative z-10">
              <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 rounded-xl shadow-lg flex items-center justify-center mr-4">
                <Package className="w-6 h-6 text-red-600" />
              </div>
              Problemet vi löser
            </h2>
            
            <div className="bg-gradient-to-r from-red-50/80 to-orange-50/80 backdrop-blur-sm border border-red-200/50 rounded-2xl p-6 mb-4 relative z-10">
              <p className="text-gray-700 mb-4 text-lg leading-relaxed">
                Varje år hamnar otaliga perfekt användbara föremål i soporna—kläder som inte längre passar, 
                verktyg vi inte använder, elektronik som samlar damm. Samtidigt finns det andra där ute som letar 
                efter att köpa exakt samma saker.
              </p>
              <p className="text-gray-800 font-bold text-xl">Så varför inte byta istället för att handla?</p>
            </div>
          </section>

          {/* Enhanced Benefits Grid */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              Vad gör hållbar handel annorlunda?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className={`bg-gradient-to-br ${benefit.bgColor} backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/60 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105`}>
                  <div className="flex items-start">
                    <div className={`bg-gradient-to-br ${benefit.iconBg} rounded-2xl p-4 shadow-lg mr-6`}>
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-3">{benefit.title}</h3>
                      <p className="text-gray-700 text-lg leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Enhanced When People Think Section */}
          <section className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl p-8 mb-8 border border-blue-200/50 relative overflow-hidden">
            <div className="absolute -top-16 -left-16 w-32 h-32 bg-blue-100/30 rounded-full blur-2xl"></div>
            
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center relative z-10">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl shadow-lg flex items-center justify-center mr-4">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              När kommer folk att tänka på detta?
            </h2>
            
            <p className="text-gray-700 mb-8 text-lg relative z-10">Folk kommer att tänka på hållbara byten när de:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              {whenPeopleThink.map((item, index) => (
                <div key={index} className="flex items-start p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-green-200/50 hover:bg-white/80 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-xl p-3 shadow-md mr-4 mt-1">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 mb-2 text-lg">{item.title}</h4>
                    <p className="text-gray-600 leading-relaxed">{item.description}</p>
                  </div>
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
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl flex items-center justify-center">
                  <Image
                    src="/Swapdealsemoji.png"
                    alt="SwapDeals Logo"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
              </div>
              
              <h2 className="text-4xl font-bold mb-6">Redo att börja leva Eco Friendly?</h2>
              
              <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto leading-relaxed">
                Oavsett om du är student, en ung familj, minimalist eller bara någon som försöker leva smartare—
                hållbar handel erbjuder en win-win-lösning.
              </p>
              
              <div className="flex items-center justify-center mb-8 flex-wrap gap-8">
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 mr-2" />
                  <span className="font-semibold text-lg">Minska avfall</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 mr-2" />
                  <span className="font-semibold text-lg">Spara pengar</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-6 h-6 mr-2" />
                  <span className="font-semibold text-lg">Bygga gemenskap</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
                <button
                  onClick={handleProposeTradeClick}
                  className="bg-white/90 backdrop-blur-lg text-green-600 hover:bg-white hover:text-green-700 py-4 px-8 rounded-2xl transition-all duration-300 font-bold shadow-xl hover:shadow-2xl flex items-center justify-center transform hover:-translate-y-1 text-lg"
                >
                  <Camera className="w-6 h-6 mr-3" />
                  Föreslå ett byte
                </button>
                <Link href="/zwapit-guide">
                  <button className="bg-transparent border-2 border-white/80 text-white hover:bg-white/10 backdrop-blur-lg hover:border-white py-4 px-8 rounded-2xl transition-all duration-300 font-bold flex items-center justify-center transform hover:-translate-y-1 text-lg">
                    <Coffee className="w-6 h-6 mr-3" />
                    Läs bytes guiden
                    <ArrowRight className="w-5 h-5 ml-3" />
                  </button>
                </Link>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                <p className="text-xl font-bold opacity-95 leading-relaxed">
                  Börja tänka annorlunda. Börja byta smartare. 
                  <span className="text-yellow-200"> SwapDeals</span>—för att bra grejer förtjäner en andra chans. 🌍
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