/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Mail, Youtube, ExternalLink, Play, X, CheckCircle2 } from "lucide-react";

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="text-brand text-xs font-semibold tracking-widest uppercase mb-4 block">
    {children}
  </span>
);

const Button = ({ children, className = "", onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className={`bg-brand hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors ${className}`}
  >
    {children}
  </button>
);

const RegistrationModal = ({ isOpen, onClose, courseTitle }: { isOpen: boolean; onClose: () => void; courseTitle: string }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", website: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Honeypot check: If 'website' is filled, it's likely a bot
    if (formData.website) {
      console.log("Bot detected!");
      onClose();
      return;
    }

    // Simulate submission
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
      setFormData({ name: "", email: "", phone: "" });
    }, 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-slate-400" />
            </button>

            <div className="p-8 md:p-12">
              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Tak for din tilmelding!</h3>
                  <p className="text-slate-500">Vi har modtaget din interesse for {courseTitle} og kontakter dig snarest.</p>
                </div>
              ) : (
                <>
                  <SectionLabel>TILMELDING</SectionLabel>
                  <h3 className="text-2xl font-bold mb-2">{courseTitle}</h3>
                  <p className="text-slate-500 mb-8">Udfyld formularen herunder, så kontakter vi dig med flere informationer.</p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Honeypot field - hidden from users, visible to bots */}
                    <div className="hidden">
                      <label>Website (Do not fill this)</label>
                      <input 
                        type="text" 
                        value={formData.website}
                        onChange={(e) => setFormData({...formData, website: e.target.value})}
                        autoComplete="off"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Fulde navn</label>
                      <input 
                        required
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all"
                        placeholder="F.eks. Kenneth Starup Ibsen"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">E-mail adresse</label>
                      <input 
                        required
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all"
                        placeholder="din@email.dk"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Telefonnummer</label>
                      <input 
                        required
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all"
                        placeholder="+45 00 00 00 00"
                      />
                    </div>
                    <Button className="w-full justify-center mt-4">
                      Send tilmelding <ArrowRight className="w-4 h-4" />
                    </Button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default function App() {
  const [modalConfig, setModalConfig] = useState({ isOpen: false, courseTitle: "" });

  const openModal = (courseTitle: string) => {
    setModalConfig({ isOpen: true, courseTitle });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <RegistrationModal 
        isOpen={modalConfig.isOpen} 
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })} 
        courseTitle={modalConfig.courseTitle}
      />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center transform rotate-12">
              <div className="w-4 h-4 bg-white rounded-full" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-800">Vivforto</span>
          </div>
          <nav className="flex items-center gap-8">
            <a href="#kurser" className="text-slate-600 hover:text-brand font-medium transition-colors">Kursus</a>
            <a href="#om" className="text-slate-600 hover:text-brand font-medium transition-colors">Om</a>
          </nav>
        </div>
      </header>

      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-20 lg:py-32 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 leading-tight mb-8">
              Udforsk Martinus Åndsvidenskab
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Naturvidenskab møder åndsvidenskab
            </p>
            <p className="text-lg text-slate-500 mb-10 leading-relaxed max-w-lg">
              Har du en dyb interesse for naturvidenskab, men samtidig mærker en nysgerrighed efter, hvad der ligger ud over den fysiske verden? Så er du kommet til det rette sted. Hos Vivforto kombinerer vi det bedste fra de to verdener.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img 
              src="https://res.cloudinary.com/duoz7qnsj/image/upload/v1775152480/WebBillede-1_zjyhfs.jpg" 
              alt="Vivforto - Mælkebøtte bryder gennem asfalt" 
              className="rounded-3xl shadow-2xl w-full aspect-[4/3] object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </section>

        {/* Courses Section */}
        <section id="kurser" className="bg-slate-50 py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <SectionLabel>VIVFORTOS KURSER</SectionLabel>
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900">Kurser på flere niveauer</h2>
            </div>

            {/* Beginner Course */}
            <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
              <img 
                src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1920" 
                alt="Begynder kursus" 
                className="rounded-3xl shadow-xl w-full aspect-video object-cover"
                referrerPolicy="no-referrer"
              />
              <div>
                <SectionLabel>BEGYNDER</SectionLabel>
                <h3 className="text-3xl font-bold mb-6">En introduktion til Martinus Åndsvidenskab</h3>
                <div className="grid grid-cols-2 gap-4 mb-8 text-sm text-slate-500">
                  <div><span className="font-semibold text-slate-700">Dato:</span> Oplysning følger</div>
                  <div><span className="font-semibold text-slate-700">By:</span> Oplysning følger</div>
                  <div><span className="font-semibold text-slate-700">Adresse:</span> Oplysning følger</div>
                  <div><span className="font-semibold text-slate-700">Pris:</span> Oplysning følger</div>
                </div>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  Dette 1-dags kursus er en let og praktisk introduktion til åndsvidenskaben med særligt fokus på naturvidenskab. Vi kombinerer teori og øvelser og dykker ned i tre spændende hovedtemaer:
                </p>
                <ul className="space-y-4 mb-10">
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand mt-2" />
                    <p className="text-slate-600 font-medium">Den fysiske verden: <span className="font-normal">Lær at skelne mellem objektive fakta og de subjektive historier, du selv danner.</span></p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand mt-2" />
                    <p className="text-slate-600 font-medium">De 6 superkræfter: <span className="font-normal">Forstå din livskraft gennem energierne instinkt, tyngde, følelse, intelligens, intuition og hukommelse.</span></p>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand mt-2" />
                    <p className="text-slate-600 font-medium">Hvem er vi? <span className="font-normal">Bliv klogere på bevidstheden, din persontype, og hvordan vi selv er medskabere af vores oplevelser.</span></p>
                  </li>
                </ul>
                <Button onClick={() => openModal("En introduktion til Martinus Åndsvidenskab")}>
                  Tilmeld <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Advanced Course */}
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1">
                <SectionLabel>FORTSÆTTER</SectionLabel>
                <h3 className="text-3xl font-bold mb-6">Avanceret kursus i Martinus Åndsvidenskab</h3>
                <div className="grid grid-cols-2 gap-4 mb-8 text-sm text-slate-500">
                  <div><span className="font-semibold text-slate-700">Dato:</span> Oplysning følger</div>
                  <div><span className="font-semibold text-slate-700">By:</span> Oplysning følger</div>
                  <div><span className="font-semibold text-slate-700">Adresse:</span> Oplysning følger</div>
                  <div><span className="font-semibold text-slate-700">Pris:</span> Oplysning følger</div>
                </div>
                <p className="text-slate-600 mb-8 leading-relaxed">
                  Dette kursus tilbyder en grundig og trinvis gennemgang af de vigtigste kosmiske analyser. Med afsæt i Martinus tanker og Per Bruus-Jensens metodik forklares begreberne ud fra en naturvidenskabelig vinkel. Vi følger en 'abstraktionsmodel', der guider dig sikkert fra det konkrete til det abstrakte.
                </p>
                <Button onClick={() => openModal("Avanceret kursus i Martinus Åndsvidenskab")}>
                  Tilmeld <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=1920" 
                alt="Avanceret kursus" 
                className="rounded-3xl shadow-xl w-full aspect-video object-cover order-1 lg:order-2"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="om" className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <SectionLabel>BAG OM VIVFORTO</SectionLabel>
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900">Hvad er Vivforto?</h2>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
              <img 
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1920" 
                alt="Om Vivforto" 
                className="rounded-3xl shadow-xl w-full aspect-video object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="space-y-6 text-slate-600 leading-relaxed">
                <p>
                  Vivforto er etableret med det formål at formidle Martinus' åndsvidenskab til naturvidenskabeligt interesserede ved at skære unødvendig kompleksitet væk. Virksomhedens mission er at bygge bro mellem naturvidenskab og åndsvidenskab gennem en letforståelig og pædagogisk formidlingsmetode, så denne visdom ikke blot forbliver teoretisk, men kan anvendes i praksis i en nutidig kontekst.
                </p>
                <p>
                  Visionen bag er at skabe inspirerende fysiske kurser med fokus på nærvær og fællesskab, hvor teorien, gennem stærke pædagogiske principper, omsættes til en håndgribelig forståelse af livets principper, der støtter den enkeltes personlige udvikling.
                </p>
              </div>
            </div>

            {/* Video Section */}
            <div className="mb-32">
              <div className="text-center mb-12">
                <SectionLabel>SE MERE</SectionLabel>
                <h3 className="text-4xl font-bold">Introduktion til Vivforto</h3>
              </div>
              <div className="max-w-3xl mx-auto">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-video bg-slate-900">
                  <iframe 
                    className="absolute inset-0 w-full h-full"
                    src="https://www.youtube.com/embed/tPD2MT4acIU?si=vgeLOyJOMwK-3r7n" 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    referrerPolicy="strict-origin-when-cross-origin" 
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>

            {/* Teacher Section */}
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6 text-slate-600 leading-relaxed">
                <p>
                  Vivfortos underviser er Kenneth Starup Ibsen, der i mere end 30 år har beskæftiget sig intenst med Martinus' åndsvidenskab. Denne dybe interesse har ført til en solid baggrund og en stor viden, som han formidler med en naturlig sans for pædagogik og klarhed.
                </p>
                <p>
                  He er en velkendt skikkelse i miljøet og har holdt foredrag på både Martinus Institut i København og Martinus Center i Klint. Tidligere har han også været en del af rådet i Martinus-sagen.
                </p>
                <p>
                  Kenneth er særligt god til at beskrive essensen i Martinus' åndsvidenskab på en konkret og logisk måde, der taler til den moderne tænker. Han har en særlig forkærlighed for Per Bruus-Jensens systematik, som han anser for at være en effektiv metode til at gøre det komplekse stof let at tilgå.
                </p>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=1920" 
                alt="Underviser Kenneth Starup Ibsen" 
                className="rounded-3xl shadow-xl w-full aspect-video object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </section>

        {/* Inspiration Section */}
        <section className="bg-slate-50 py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <SectionLabel>INSPIRATIONSKILDER</SectionLabel>
              <h2 className="text-4xl lg:text-5xl font-bold text-slate-900">Martinus og Per Bruus-Jensen</h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
              <img 
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1920" 
                alt="Martinus" 
                className="rounded-3xl shadow-xl w-full aspect-video object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="space-y-6 text-slate-600 leading-relaxed">
                <p>
                  Martinus (1890–1981) voksede op under beskedne kår som plejebarn i den nordjyske by Sindal og havde kun en kort skolegang bag sig. Efter i sine yngre år at have arbejdet som blandt andet mejerist, vagtmand og postbud, oplevede han i 1921 som 30-årig en skelsættende "kosmisk indvielse" under en meditation. Denne oplevelse gav ham indsigt i den åndelige verden og overbeviste ham om, at alt liv dybest set er styret af kærlighed.
                </p>
                <p>
                  Resten af sit liv dedikerede han til utrætteligt at formulere og nedskrive et optimistisk og åndsvidenskabeligt verdensbillede. Han forfattede en lang række bøger, hvoraf hans hovedværk er Livets Bog i syv bind.
                </p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6 text-slate-600 leading-relaxed order-2 lg:order-1">
                <p>
                  Per Bruus-Jensen (1932–2022) var elev hos Martinus i en tiårig periode fra 1958 til 1968. I løbet af denne tid modtog han eneundervisning og fik en dybdegående indsigt i Martinus' tænkning.
                </p>
                <p>
                  Under elevtiden besvarede Martinus Pers mange spørgsmål, især om kosmologiens forenelighed med naturvidenskaben. I 1959 fik Per til opgave at udarbejde et korrespondancekursus, der systematisk fremstillede Martinus' verdensbillede. Dette førte til udviklingen af en række nye begreber, som i sidste ende resulterede i Pers hovedværk i fire bind, også kaldet "X-bøgerne".
                </p>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=1920" 
                alt="Per Bruus-Jensen" 
                className="rounded-3xl shadow-xl w-full aspect-video object-cover order-1 lg:order-2"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-20 mt-auto">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 mb-16">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center transform rotate-12">
                  <div className="w-4 h-4 bg-white rounded-full" />
                </div>
                <span className="text-2xl font-bold tracking-tight">Vivforto</span>
              </div>
              <p className="text-slate-400">Viden om livet</p>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-6">Navigation</h4>
              <ul className="space-y-4 text-slate-400">
                <li><a href="#kurser" className="hover:text-white transition-colors">Kursus</a></li>
                <li><a href="#om" className="hover:text-white transition-colors">Om</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6">Kontakt</h4>
              <ul className="space-y-4 text-slate-400">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:kenneth@vivforto.dk" className="hover:text-white transition-colors">kenneth@vivforto.dk</a>
                </li>
                <li>CVR: 39676885</li>
                <li className="flex items-center gap-2">
                  <Youtube className="w-4 h-4" />
                  <a href="#" className="hover:text-white transition-colors">YouTube</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
            <p>© 2024 Vivforto. Alle rettigheder forbeholdes.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">Privatlivspolitik</a>
              <a href="#" className="hover:text-white transition-colors">Vilkår</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
