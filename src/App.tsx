/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Mail, Youtube, ExternalLink, Play, X, CheckCircle2, Menu } from "lucide-react";

interface Video {
  id: string;
  title: string;
  description: string;
  youtubeUrl: string;
  embedUrl: string;
}

const VIDEOS: Video[] = [
  {
    id: "IIslA5y3VQw",
    title: "Introduktion til Vivforto",
    description: "Hør om Vivforto og missionen om at bygge bro mellem naturvidenskab og Martinus' åndsvidenskab.",
    youtubeUrl: "https://youtu.be/IIslA5y3VQw",
    embedUrl: "https://www.youtube.com/embed/IIslA5y3VQw"
  },
  {
    id: "6B-YOK1FAiU",
    title: "1. Vor oplevelse af verden",
    description: "Rejsen begynder her...",
    youtubeUrl: "https://youtu.be/6B-YOK1FAiU",
    embedUrl: "https://www.youtube.com/embed/6B-YOK1FAiU"
  }
];

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

const RegistrationModal = ({ isOpen, onClose, courseTitle, courseDate }: { isOpen: boolean; onClose: () => void; courseTitle: string; courseDate: string }) => {
  const [formData, setFormData] = useState({ name: "", email: "", website: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Honeypot check: If 'website' is filled, it's likely a bot
    if (formData.website) {
      console.log("Bot detected!");
      onClose();
      return;
    }

    // Email obfuscation to prevent bot scraping
    const user = "kenneth";
    const domain = "vivforto.dk";
    const email = `${user}@${domain}`;
    
    // Construct mailto link with pre-filled data
    const subject = encodeURIComponent(`Tilmelding: ${courseTitle}`);
    const body = encodeURIComponent(
      `Hej Kenneth,\n\nJeg vil gerne tilmelde mig kurset: ${courseTitle}\nStartdato: ${courseDate}\n\nNavn: ${formData.name}\nE-mail: ${formData.email}\n\nMed venlig hilsen,\n${formData.name}`
    );
    
    // Open the user's email client in a new tab
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_blank');

    // Close modal and reset form
    onClose();
    setFormData({ name: "", email: "", website: "" });
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
                  <label className="block text-sm font-medium text-slate-700 mb-1">Navn</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand focus:ring-2 focus:ring-brand/20 outline-none transition-all"
                    placeholder="f.eks. Ida Jensen"
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
                <Button className="w-full justify-center mt-4">
                  Send tilmelding <ArrowRight className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default function App() {
  const [modalConfig, setModalConfig] = useState({ isOpen: false, courseTitle: "", courseDate: "" });
  const [currentView, setCurrentView] = useState<'forside' | 'kurser' | 'om' | 'videoer'>('forside');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === "#videoer") {
        setCurrentView("videoer");
        window.scrollTo(0, 0);
      } else if (hash === "#kurser" || hash === "#kursus") {
        setCurrentView("kurser");
        window.scrollTo(0, 0);
      } else if (hash === "#om") {
        setCurrentView("om");
        window.scrollTo(0, 0);
      } else if (hash === "#forside") {
        setCurrentView("forside");
        window.scrollTo(0, 0);
      } else {
        setCurrentView("forside");
      }
    };
    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const openModal = (courseTitle: string, courseDate: string) => {
    setModalConfig({ isOpen: true, courseTitle, courseDate });
  };

  const navigateTo = (view: 'forside' | 'kurser' | 'om' | 'videoer') => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.location.hash = view;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <RegistrationModal 
        isOpen={modalConfig.isOpen} 
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })} 
        courseTitle={modalConfig.courseTitle}
        courseDate={modalConfig.courseDate}
      />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button onClick={() => navigateTo('forside')} className="flex items-center gap-2 cursor-pointer">
            <img 
              src="https://res.cloudinary.com/duoz7qnsj/image/upload/v1775205367/Logo_kxswjc.png" 
              alt="Vivforto Logo" 
              className="h-10 w-auto"
              referrerPolicy="no-referrer"
            />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => navigateTo('forside')} 
              className={`font-medium transition-colors cursor-pointer ${currentView === 'forside' ? 'text-brand font-semibold' : 'text-slate-600 hover:text-brand'}`}
            >
              Forside
            </button>
            <button 
              onClick={() => navigateTo('kurser')} 
              className={`font-medium transition-colors cursor-pointer ${currentView === 'kurser' ? 'text-brand font-semibold' : 'text-slate-600 hover:text-brand'}`}
            >
              Kurser
            </button>
            <button 
              onClick={() => navigateTo('om')} 
              className={`font-medium transition-colors cursor-pointer ${currentView === 'om' ? 'text-brand font-semibold' : 'text-slate-600 hover:text-brand'}`}
            >
              Om
            </button>
            <button 
              onClick={() => navigateTo('videoer')} 
              className={`font-medium transition-colors cursor-pointer ${currentView === 'videoer' ? 'text-brand font-semibold' : 'text-slate-600 hover:text-brand'}`}
            >
              Videoer
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-700 hover:text-brand transition-colors cursor-pointer rounded-lg hover:bg-slate-50"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden bg-white border-b border-slate-100 overflow-hidden px-6 py-4 flex flex-col gap-2 shadow-lg"
            >
              <button 
                onClick={() => navigateTo('forside')} 
                className={`text-left py-2 px-3 rounded-lg font-medium transition-colors cursor-pointer ${currentView === 'forside' ? 'text-brand bg-brand/5 font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-brand'}`}
              >
                Forside
              </button>
              <button 
                onClick={() => navigateTo('kurser')} 
                className={`text-left py-2 px-3 rounded-lg font-medium transition-colors cursor-pointer ${currentView === 'kurser' ? 'text-brand bg-brand/5 font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-brand'}`}
              >
                Kurser
              </button>
              <button 
                onClick={() => navigateTo('om')} 
                className={`text-left py-2 px-3 rounded-lg font-medium transition-colors cursor-pointer ${currentView === 'om' ? 'text-brand bg-brand/5 font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-brand'}`}
              >
                Om
              </button>
              <button 
                onClick={() => navigateTo('videoer')} 
                className={`text-left py-2 px-3 rounded-lg font-medium transition-colors cursor-pointer ${currentView === 'videoer' ? 'text-brand bg-brand/5 font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-brand'}`}
              >
                Videoer
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-grow pt-20">
        {currentView === 'forside' ? (
          <section className="py-16 lg:py-24">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center"
            >
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-slate-900 leading-tight mb-8 break-words">
                  Udforsk Martinus Åndsvidenskab
                </h1>
                <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                  Naturvidenskab møder åndsvidenskab
                </p>
                <p className="text-lg text-slate-500 mb-10 leading-relaxed max-w-lg">
                  Har du en dyb interesse for naturvidenskab, men samtidig mærker en nysgerrighed efter, hvad der ligger ud over den fysiske verden? Så er du kommet til det rette sted. Hos Vivforto kombinerer vi det bedste fra de to verdener.
                </p>
              </div>
              <div>
                <img 
                  src="https://res.cloudinary.com/duoz7qnsj/image/upload/v1775152480/WebBillede-1_zjyhfs.jpg" 
                  alt="Vivforto - Mælkebøtte bryder gennem asfalt" 
                  className="rounded-3xl shadow-2xl w-full aspect-[4/3] object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
          </section>
        ) : currentView === 'kurser' ? (
          <section className="py-16 lg:py-24">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto px-6"
            >
              <div className="text-center mb-20">
                <SectionLabel>VIVFORTOS KURSER</SectionLabel>
                <h1 className="text-4xl lg:text-5xl font-bold text-slate-900">Kurser på flere niveauer</h1>
              </div>

              {/* Beginner Course */}
              <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
                <img 
                  src="https://res.cloudinary.com/duoz7qnsj/image/upload/v1775196457/WebBillede-2_qj7pwp.png" 
                  alt="En introduktion til Martinus Åndsvidenskab" 
                  className="rounded-3xl shadow-xl w-full aspect-video object-cover"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <SectionLabel>BEGYNDER</SectionLabel>
                  <h3 className="text-3xl font-bold mb-6">En introduktion til Martinus Åndsvidenskab</h3>
                  <div className="grid grid-cols-2 gap-4 mb-8 text-sm text-slate-500">
                    <div><span className="font-semibold text-slate-700">Dato og tid:</span> Oktober 2026. Dato og tid meldes ud senere</div>
                    <div><span className="font-semibold text-slate-700">Pris:</span> Gratis</div>
                    <div><span className="font-semibold text-slate-700">Sted:</span> København</div>
                    <div><span className="font-semibold text-slate-700">Adresse:</span> Meldes ud senere</div>
                  </div>
                  <p className="text-slate-600 mb-8 leading-relaxed">
                    Dette 1-dags-kursus er en let og praktisk introduktion til åndsvidenskaben. Vi kombinerer teori og øvelser og dykker ned i tre spændende hovedtemaer:
                  </p>
                  <ul className="space-y-4 mb-10">
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand mt-2" />
                      <p className="text-slate-600 font-medium">Den fysiske verden: <span className="font-normal">Lær at skelne mellem objektive fakta og de subjektive historier, du selv danner.</span></p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand mt-2" />
                      <p className="text-slate-600 font-medium">De seks superkræfter: <span className="font-normal">Forstå din livskraft gennem energierne instinkt, tyngde, følelse, intelligens, intuition og hukommelse.</span></p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand mt-2" />
                      <p className="text-slate-600 font-medium">Hvem er vi? <span className="font-normal">Bliv klogere på, hvordan vi selv er medskabere af vores oplevelser. Kend din personlighedstype og dine egne præferencer.</span></p>
                    </li>
                  </ul>
                  <Button onClick={() => openModal("En introduktion til Martinus Åndsvidenskab", "Oktober 2026. Dato og tid meldes ud senere")}>
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
                  <Button onClick={() => openModal("Avanceret kursus i Martinus Åndsvidenskab", "Oplysning følger")}>
                    Tilmeld <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
                <img 
                  src="https://res.cloudinary.com/duoz7qnsj/image/upload/v1775196650/WebBillede-3_wtyogw.png" 
                  alt="Avanceret kursus i Martinus Åndsvidenskab" 
                  className="rounded-3xl shadow-xl w-full aspect-video object-cover order-1 lg:order-2"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
          </section>
        ) : currentView === 'om' ? (
          <section className="py-16 lg:py-24">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto px-6"
            >
              <div className="text-center mb-20">
                <SectionLabel>BAG OM VIVFORTO</SectionLabel>
                <h1 className="text-4xl lg:text-5xl font-bold text-slate-900">Hvad er Vivforto?</h1>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
                <img 
                  src="https://res.cloudinary.com/duoz7qnsj/image/upload/v1775197107/WebBillede-4_skioni.jpg" 
                  alt="Hvad er Vivforto?" 
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
                  <h2 className="text-4xl font-bold">Introduktion til Vivforto</h2>
                </div>
                <div className="max-w-3xl mx-auto">
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-video bg-slate-900">
                    <iframe 
                      className="absolute inset-0 w-full h-full"
                      src="https://www.youtube.com/embed/IIslA5y3VQw" 
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
              <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
                <div className="space-y-6 text-slate-600 leading-relaxed">
                  <p>
                    Vivfortos underviser er Kenneth Starup Ibsen, der i mere end 30 år har beskæftiget sig intenst med Martinus' åndsvidenskab. Denne dybe interesse har ført til en solid baggrund og en stor viden, som han formidler med en naturlig sans for pædagogik og klarhed.
                  </p>
                  <p>
                    Han er en velkendt skikkelse i miljøet og har holdt foredrag på både Martinus Institut i København og Martinus Center i Klint. Tidligere har han også været en del af rådet i Martinus-sagen.
                  </p>
                  <p>
                    Kenneth er særligt god til at beskrive essensen i Martinus' åndsvidenskab på en konkret og logisk måde, der taler til den moderne tænker. Han har en særlig forkærlighed for Per Bruus-Jensens systematik, som han anser for at være en effektiv metode til at gøre det komplekse stof let at tilgå.
                  </p>
                </div>
                <img 
                  src="https://res.cloudinary.com/duoz7qnsj/image/upload/v1775197480/WebBillede-5_f2zh10.png" 
                  alt="Underviser Kenneth Starup Ibsen" 
                  className="rounded-3xl shadow-xl w-full aspect-video object-contain bg-slate-100"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Inspiration Section */}
              <div className="pt-16 border-t border-slate-100">
                <div className="text-center mb-20">
                  <SectionLabel>INSPIRATIONSKILDER</SectionLabel>
                  <h2 className="text-4xl lg:text-5xl font-bold text-slate-900">Martinus og Per Bruus-Jensen</h2>
                </div>

                <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
                  <img 
                    src="https://res.cloudinary.com/duoz7qnsj/image/upload/v1775198612/WebBillede-61_d994kd.jpg" 
                    alt="Martinus" 
                    className="rounded-3xl shadow-xl w-full aspect-video object-contain bg-slate-100"
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
                    src="https://res.cloudinary.com/duoz7qnsj/image/upload/v1775199015/WebBillede-71_brqkh2.jpg" 
                    alt="Per Bruus-Jensen" 
                    className="rounded-3xl shadow-xl w-full aspect-video object-contain bg-slate-100 order-1 lg:order-2"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </motion.div>
          </section>
        ) : (
          <section className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-12 text-center lg:text-left">
                <SectionLabel>VIDEOER</SectionLabel>
                <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                  Lær om livet
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
                  Udforsk de seneste videoer og oplæg om Martinus Åndsvidenskab og brobygningen til naturvidenskab.
                </p>
              </div>

              <div className="flex flex-col gap-10 max-w-4xl mx-auto">
                {VIDEOS.map((video) => (
                  <div key={video.id} className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 flex flex-col justify-between">
                    <div>
                      <div className="relative rounded-2xl overflow-hidden shadow-md aspect-video bg-slate-900 mb-6">
                        <iframe 
                          className="absolute inset-0 w-full h-full"
                          src={video.embedUrl} 
                          title={video.title} 
                          frameBorder="0" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                          referrerPolicy="strict-origin-when-cross-origin" 
                          allowFullScreen
                        ></iframe>
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-3">{video.title}</h2>
                      <p className="text-slate-600 leading-relaxed mb-6">{video.description}</p>
                    </div>
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <a 
                        href={video.youtubeUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-2 text-brand font-medium hover:underline text-sm"
                      >
                        <Youtube className="w-4 h-4 text-red-600" />
                        Åbn i YouTube
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-20 mt-auto">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 mb-16">
            <div>
              <button onClick={() => navigateTo('forside')} className="flex items-center gap-2 mb-4 cursor-pointer">
                <img 
                  src="https://res.cloudinary.com/duoz7qnsj/image/upload/v1775205367/Logo_kxswjc.png" 
                  alt="Vivforto Logo" 
                  className="h-10 w-auto brightness-0 invert"
                  referrerPolicy="no-referrer"
                />
              </button>
              <p className="text-slate-400">Viden om livet</p>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-6">Navigation</h4>
              <ul className="space-y-4 text-slate-400">
                <li>
                  <button onClick={() => navigateTo('forside')} className="hover:text-white transition-colors cursor-pointer">
                    Forside
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('kurser')} className="hover:text-white transition-colors cursor-pointer">
                    Kurser
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('om')} className="hover:text-white transition-colors cursor-pointer">
                    Om
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('videoer')} className="hover:text-white transition-colors cursor-pointer">
                    Videoer
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6">Kontakt</h4>
              <ul className="space-y-4 text-slate-400">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <button 
                    onClick={() => {
                      const user = "kenneth";
                      const domain = "vivforto.dk";
                      window.open(`mailto:${user}@${domain}`, '_blank');
                    }}
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    kenneth@vivforto.dk
                  </button>
                </li>
                <li>CVR: 39676885</li>
                <li className="flex items-center gap-2">
                  <Youtube className="w-4 h-4" />
                  <a href="https://youtu.be/IIslA5y3VQw" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">YouTube</a>
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
