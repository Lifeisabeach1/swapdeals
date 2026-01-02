"use client"
import { useState } from 'react';
import { ArrowLeft, Leaf, Recycle, DollarSign, Users, Home, TrendingUp, 
         CheckCircle, Globe, Heart, Package, ArrowRight, Coffee } from 'lucide-react';

export default function SustainableTradingPage() {
  const benefits = [
    {
      icon: <Recycle className="w-8 h-8 text-green-600" />,
      title: "Minska avfall",
      description: "Ge dina prylar ett andra liv istället för att låta dem hamna på soptippen"
    },
    {
      icon: <DollarSign className="w-8 h-8 text-blue-600" />,
      title: "Spara pengar",
      description: "Byta istället för att köpa nytt - bättre för din plånbok och budget"
    },
    {
      icon: <Users className="w-8 h-8 text-purple-600" />,
      title: "Bygga gemenskap",
      description: "Koppla ihop med riktiga människor över hela Sverige som delar dina värderingar"
    },
    {
      icon: <Globe className="w-8 h-8 text-teal-600" />,
      title: "Miljöpåverkan",
      description: "Minska efterfrågan på tillverkning och minimera ditt koldioxidavtryck"
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => window.history.back()}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition flex items-center"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Till användar guiden
            </button>

            <div className="text-right">
              <h1 className="text-lg font-bold text-gray-800 flex items-center">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-3">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                Hållbara byten
              </h1>
              <p className="text-sm text-gray-600">Lär dig varför det spelar roll</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="flex items-center bg-green-100 rounded-full px-4 py-2">
              <Globe className="w-6 h-6 text-green-600 mr-2" />
              <span className="text-green-800 font-semibold text-sm">
                Eco Friendly Movement
              </span>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            Varför Eco Friendly spelar roll—och varför nu
          </h1>
          
          <p className="text-xl text-gray-700 mb-8">
            I dagens snabba värld blir människor mer medvetna om miljöpåverkan av 
            överkonsumtion och avfall. Klimatförändringarna, överfulla soptipper och stigande levnadskostnader 
            har gjort det tydligt: vi behöver smartare, mer hållbara sätt att leva.
          </p>
          
          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <p className="text-gray-800 text-lg">
              <strong className="text-green-700">Miljövänliga byten</strong> är inte bara en trend—det är en rörelse. 
              Det handlar om att hålla föremål i användning längre, minska behovet att tillverka nya och minimera 
              vårt miljöavtryck.
            </p>
          </div>
        </section>

        {/* Problem Statement */}
        <section className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-4">
              <Package className="w-6 h-6 text-red-600" />
            </div>
            Problemet vi löser
          </h2>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
            <p className="text-gray-700 mb-4 text-lg">
              Varje år hamnar otaliga perfekt användbara föremål i soporna—kläder som inte längre passar, 
              verktyg vi inte använder, elektronik som samlar damm. Samtidigt finns det andra där ute som letar 
              efter att köpa exakt samma saker.
            </p>
            <p className="text-gray-800 font-bold text-xl">Så varför inte byta istället för att handla?</p>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Vad gör hållbar handel annorlunda?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                <div className="flex items-start">
                  <div className="bg-gray-100 rounded-lg p-4 mr-4">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{benefit.title}</h3>
                    <p className="text-gray-700">{benefit.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* When People Think Section */}
        <section className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            När kommer folk att tänka på detta?
          </h2>
          
          <p className="text-gray-700 mb-6 text-lg">Folk kommer att tänka på hållbara byten när de:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {whenPeopleThink.map((item, index) => (
              <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="bg-green-100 rounded-lg p-3 mr-4 mt-1">
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-1">{item.title}</h4>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-green-500 rounded-xl shadow-lg p-10 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Redo att börja leva Eco Friendly?</h2>
          
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Oavsett om du är student, en ung familj, minimalist eller bara någon som försöker leva smartare—
            hållbar handel erbjuder en win-win-lösning.
          </p>
          
          <div className="flex items-center justify-center mb-8 flex-wrap gap-6">
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 mr-2" />
              <span className="font-semibold">Minska avfall</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 mr-2" />
              <span className="font-semibold">Spara pengar</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 mr-2" />
              <span className="font-semibold">Bygga gemenskap</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">            
            <button className="bg-white text-green-600 hover:bg-gray-100 py-4 px-8 rounded-lg transition font-bold flex items-center justify-center">
              <Coffee className="w-6 h-6 mr-3" />
              Läs bytes guiden
              <ArrowRight className="w-5 h-5 ml-3" />
            </button>
          </div>
          
          <div className="bg-white bg-opacity-20 rounded-lg p-6">
            <p className="text-xl font-bold">
              Börja tänka annorlunda. Börja byta smartare. 
              SwapDeals—för att bra grejer förtjänar en andra chans. 🌍
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}