'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';
import Image from 'next/image';

export default function ContactPageClient() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [hoveredCard, setHoveredCard] = useState(null);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Create mailto link with form data
      const subject = encodeURIComponent(formData.subject || 'Kontakt från SwapDeals');
      const body = encodeURIComponent(
        `Namn: ${formData.name}\nE-post: ${formData.email}\n\nMeddelande:\n${formData.message}`
      );
      
      window.location.href = `mailto:kontakt@swapdeals.se?subject=${subject}&body=${body}`;
      
      // Show success message
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      // Clear status after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'E-post',
      value: 'kontakt@swapdeals.se',
      description: 'Vi svarar inom 24 timmar',
      href: 'mailto:kontakt@swapdeals.se'
    },
    {
      icon: MapPin,
      title: 'Plats',
      value: 'Sverige',
      description: 'Rikstäckande tjänst'
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50/30 via-white to-green-50/20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-100/20 rounded-full blur-3xl -z-10 transform translate-x-1/3 -translate-y-1/3" aria-hidden="true"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-100/20 rounded-full blur-3xl -z-10 transform -translate-x-1/3 translate-y-1/3" aria-hidden="true"></div>
      
      <div className="container mx-auto px-4 sm:px-6 py-12 relative z-10">
        {/* Header Section */}
        <header className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 via-green-500 to-green-600 rounded-2xl shadow-lg flex items-center justify-center relative" aria-hidden="true">
              <Image
                src="/Swapdealsemoji.png"
                alt="SwapDeals Logotyp"
                width={36}
                height={36}
                className="object-contain"
                priority
              />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full shadow-sm"></div>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 via-green-700 to-gray-800 bg-clip-text text-transparent mb-6">
            Kontakta SwapDeals
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Har du frågor, förslag eller behöver hjälp? Vi finns här för att hjälpa dig med allt som rör SwapDeals och hållbar byteshandel.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {/* Contact Information Cards */}
          <aside className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Kom i kontakt med oss</h2>
            
            {contactInfo.map((item, index) => (
              <div
                key={index}
                className={`p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-green-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer group ${
                  hoveredCard === index ? 'border-green-300/70' : ''
                }`}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => item.href && window.open(item.href, '_self')}
                role={item.href ? 'button' : 'region'}
                tabIndex={item.href ? 0 : -1}
                onKeyDown={(e) => {
                  if (item.href && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    window.open(item.href, '_self');
                  }
                }}
                aria-label={item.href ? `Kontakta oss via ${item.title.toLowerCase()}: ${item.value}` : `${item.title}: ${item.value}`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-xl group-hover:from-green-200 group-hover:to-green-300 transition-all duration-300`}>
                    <item.icon className="w-6 h-6 text-green-700" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
                    <p className="text-green-700 font-medium mb-1">{item.value}</p>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Additional Info Card */}
            <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200/50" role="region" aria-labelledby="mission-heading">
              <h3 id="mission-heading" className="font-semibold text-green-800 mb-3">🌱 Vårt uppdrag</h3>
              <p className="text-sm text-green-700 leading-relaxed">
                SwapDeals gör det enkelt att byta, sälja och köpa begagnade varor på ett hållbart sätt. 
                Tillsammans skapar vi en mer cirkulär ekonomi för en bättre framtid.
              </p>
            </div>
          </aside>

          {/* Contact Form */}
          <section className="lg:col-span-2" aria-labelledby="contact-form-heading">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-green-200/50 shadow-xl p-8">
              <h2 id="contact-form-heading" className="text-2xl font-semibold text-gray-800 mb-6">Skicka meddelande till oss</h2>
              
              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center space-x-3" role="alert" aria-live="polite">
                  <CheckCircle className="w-5 h-5 text-green-600" aria-hidden="true" />
                  <span className="text-green-800">Ditt e-postprogram öppnas med ditt meddelande!</span>
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3" role="alert" aria-live="polite">
                  <AlertCircle className="w-5 h-5 text-red-600" aria-hidden="true" />
                  <span className="text-red-800">Något gick fel. Försök igen eller kontakta oss direkt.</span>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Namn *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      aria-required="true"
                      aria-describedby="name-error"
                      className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                      placeholder="Ditt fullständiga namn"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      E-postadress *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      aria-required="true"
                      aria-describedby="email-error"
                      className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                      placeholder="din@email.se"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Ämne
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    placeholder="Vad handlar ditt meddelande om?"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Meddelande *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    aria-required="true"
                    aria-describedby="message-error"
                    rows="6"
                    className="w-full px-4 py-3 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm resize-none"
                    placeholder="Berätta mer om din fråga eller ditt meddelande..."
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                  aria-describedby="submit-help"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
                      <span>Skickar...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" aria-hidden="true" />
                      <span>Skicka meddelande</span>
                    </>
                  )}
                </button>
              </form>
              
              <div className="mt-6 pt-6 border-t border-green-200/50">
                <p id="submit-help" className="text-sm text-gray-600 text-center">
                  Genom att skicka detta formulär öppnas ditt e-postprogram med meddelandet förifyllt. 
                  Du kan sedan granska och skicka det till kontakt@swapdeals.se.
                </p>
              </div>
            </div>
          </section>
        </div>
        
        {/* FAQ Section */}
        <section className="mt-20 max-w-4xl mx-auto" aria-labelledby="faq-heading">
          <div className="text-center mb-12">
            <h2 id="faq-heading" className="text-3xl font-bold text-gray-800 mb-4">Vanliga frågor</h2>
            <p className="text-gray-600">Här hittar du svar på de mest förekommande frågorna om SwapDeals</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <article className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-green-200/50 shadow-lg">
              <h3 className="font-semibold text-gray-800 mb-3">Hur fungerar SwapDeals?</h3>
              <p className="text-gray-600 text-sm">
                SwapDeals gör det enkelt att byta, sälja och köpa begagnade varor. Skapa ett konto, 
                lägg upp dina saker och börja handla med andra användare för en mer hållbar framtid.
              </p>
            </article>
            
            <article className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-green-200/50 shadow-lg">
              <h3 className="font-semibold text-gray-800 mb-3">Kostar det något att använda SwapDeals?</h3>
              <p className="text-gray-600 text-sm">
               Ingenting kostar här, för länge sedan kostade det inte något att byta saker och så inte här heller
              </p>
            </article>
            
            <article className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-green-200/50 shadow-lg">
              <h3 className="font-semibold text-gray-800 mb-3">Hur snabbt får jag svar?</h3>
              <p className="text-gray-600 text-sm">
                Vi strävar efter att svara på alla förfrågningar inom 24 timmar på vardagar. 
                För brådskande frågor, kontakta oss direkt via e-post på kontakt@swapdeals.se.
              </p>
            </article>
            
            <article className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-green-200/50 shadow-lg">
              <h3 className="font-semibold text-gray-800 mb-3">Kan jag föreslå nya funktioner?</h3>
              <p className="text-gray-600 text-sm">
                Absolut! Vi värdesätter feedback från våra användare. Skicka dina förslag till oss 
                så tittar vi på möjligheten att implementera dem.
              </p>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}