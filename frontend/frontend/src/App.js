import { useState, useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import { Phone, Mail, MapPin, Instagram, Facebook, Menu, X, Clock, Award, Heart, Sparkles, Image, Trash2, Plus, Edit, LogOut, Save } from "lucide-react";
 // backend URL from env
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Services data from A version price list
const servicesData = {
  szempilla: {
    title: "Szempillaépítés",
    image: "https://images.unsplash.com/photo-1645735123314-d11fcfdd0000?w=800&q=80",
    items: [
    { name: "Klasszikus Szempillaépítés", duration: "150 perc", price: "12.000 Ft" },
    { name: "Volume Szempillaépítés", duration: "180 perc", price: "15.000 Ft" },
    { name: "Extra styling Szempillaépítés", duration: "180 perc", price: "16.000 Ft" },
    { name: "Szempilla Eltávolítás", duration: "30 perc", price: "3.000 Ft" },
    { name: "Töltés (3 hét)", duration: "120 perc", price: "10.000 Ft" },
    { name: "Töltés (4-5 hét)", duration: "120 perc", price: "14.000 Ft" },
    { name: "Szempilla Lifting", duration: "60 perc", price: "10.000 Ft" }]

  },
  szemoldok: {
    title: "Szemöldök Kezelések",
    image: "https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=800&q=80",
    items: [
    { name: "Szemöldök Festés", duration: "20 perc", price: "2.000 Ft" },
    { name: "Szemöldök Formázás + Festés", duration: "30 perc", price: "3.000 Ft" },
    { name: "Szemöldök Laminálás", duration: "60 perc", price: "10.000 Ft" }]

  },
  smink: {
    title: "Smink Szolgáltatások",
    image: "https://images.unsplash.com/photo-1692856184951-8e06bba6b4b5?w=800&q=80",
    items: [
    { name: "Nappali Smink", duration: "45 perc", price: "8.000 Ft" },
    { name: "Alkalmi Smink", duration: "60 perc", price: "12.000 Ft" },
    { name: "Bridal Smink Próba", duration: "90 perc", price: "15.000 Ft" },
    { name: "Bridal Smink", duration: "90 perc", price: "15.000 Ft" },
    { name: "Smink Korrekció", duration: "30 perc", price: "5.000 Ft" },
    { name: "Smink Oktatás (1 óra)", duration: "60 perc", price: "10.000 Ft" },
    { name: "Smink Oktatás (2 óra)", duration: "120 perc", price: "18.000 Ft" }]

  },
  arckezeles: {
    title: "Arckezelések",
    image: "https://images.unsplash.com/photo-1596178060671-7a80dc8059ea?w=800&q=80",
    items: [
    { name: "Hidrodermabrasio + Arcmaszk", duration: "45 perc", price: "12.000 Ft" },
    { name: "Spray Kezelés + Arcmaszk", duration: "45 perc", price: "11.000 Ft" },
    { name: "Ultrahang Arckezelés", duration: "45 perc", price: "13.000 Ft" },
    { name: "RF Arckezelés (Ránctalanítás)", duration: "45 perc", price: "15.000 Ft" },
    { name: "Hidegkalapács Kezelés", duration: "30 perc", price: "8.000 Ft" },
    { name: "Komplex Arckezelés", duration: "75 perc", price: "24.000 Ft" },
    { name: "Premium Arckezelés", duration: "90 perc", price: "32.000 Ft" }]

  },
  waposon: {
    title: "Arcmasszázs Kezelések",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80",
    items: [
    { name: "Frissítő Arcmasszázs", duration: "30 perc", price: "6.000 Ft" },
    { name: "Japán Arcmasszázs + Dekoltázs", duration: "45 perc", price: "10.000 Ft" },
    { name: "Face Lifting Arcmasszázs + Dekoltázs", duration: "60 perc", price: "12.000 Ft" }]

  },
  csomagok: {
    title: "Kombinált Csomagok",
    image: "https://images.unsplash.com/photo-1601002257790-ebe0966a85ae?w=800&q=80",
    items: [
    { name: "\"Lash & Makeup\" Csomag", duration: "150 perc", price: "25.000 Ft" },
    { name: "\"Art of Beauty\" Csomag", duration: "180 perc", price: "38.000 Ft" },
    { name: "\"Bridal Beauty\" Csomag", duration: "210 perc", price: "52.000 Ft" },
    { name: "\"Express Beauty\" Csomag", duration: "90 perc", price: "14.000 Ft" },
    { name: "\"Lash & Brow Art\" Csomag", duration: "120 perc", price: "18.000 Ft" },
    { name: "Arcfiatalítás Sorozat (4 kezelés)", duration: "4x90 perc", price: "120.000 Ft" }]

  }
};

const loyaltyLevels = [
{ name: "Bronz", condition: "5+ kezelés", discount: "5%" },
{ name: "Ezüst", condition: "10+ kezelés", discount: "10%" },
{ name: "Arany", condition: "20+ kezelés", discount: "15%" },
{ name: "Platina", condition: "30+ kezelés", discount: "20%" }];


// Navigation Component
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
  { href: "#szolgaltatasok", label: "Szolgáltatások" },
  { href: "#galeria", label: "Galéria" },
  { href: "#rolam", label: "Rólam" },
  { href: "#husegprogram", label: "Hűségprogram" },
  { href: "#kapcsolat", label: "Kapcsolat" }];


  return (
    <nav
      data-testid="main-navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? "bg-[#F9F7F2]/95 backdrop-blur-sm shadow-sm" : "bg-[#F9F7F2]/80 backdrop-blur-sm"}`
      }>

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-20">
          <a href="#" className="md:text-2xl font-serif text-xl tracking-tight text-[#D4AF37]" data-testid="logo">ANITA 
            <span className="text-[#1A1A1A]">|</span> <span className="text-[#1A1A1A]">Art of Beauty</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) =>
            <a
              key={link.href}
              href={link.href}
              className="nav-link font-sans text-[#1A1A1A] hover:text-gold"
              data-testid={`nav-${link.label.toLowerCase()}`}>

                {link.label}
              </a>
            )}
            <a href="tel:+36309223271" className="btn-primary" data-testid="nav-cta">
              Időpont
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            data-testid="mobile-menu-toggle">

            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen &&
        <div className="md:hidden absolute top-20 left-0 right-0 bg-[#F9F7F2] border-t border-beige py-6 px-6 animate-fade-in" data-testid="mobile-menu">
            <div className="flex flex-col gap-6">
              {navLinks.map((link) =>
            <a
              key={link.href}
              href={link.href}
              className="font-sans text-sm uppercase tracking-widest text-charcoal hover:text-gold"
              onClick={() => setIsOpen(false)}>

                  {link.label}
                </a>
            )}
              <a href="tel:+36309223271" className="btn-primary text-center mt-4">
                Időpont Foglalás
              </a>
            </div>
          </div>
        }
      </div>
    </nav>);

};

// Hero Section
const HeroSection = () => {
  return (
    <section className="hero-section" data-testid="hero-section">
      <div
        className="hero-bg"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1648967711484-c08ed128dbae?w=1920&q=80')`
        }} />

      <div className="hero-overlay-elegant" />
      <div className="grain-overlay absolute inset-0" />

      <div className="relative z-10 min-h-screen flex flex-col justify-center md:justify-end pb-16 md:pb-32 px-6 md:px-12">
        <div className="max-w-2xl">
          <div className="hero-text-box p-8 md:p-12">
            <h1 className="editorial-h1 mb-6 opacity-0 animate-fade-in-up text-[#1A1A1A]" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
              A szépség <br />
              <span className="italic">művészete</span>
            </h1>
            <p className="editorial-body max-w-xl animate-fade-in-up mb-8 opacity-0 text-[#3A3A3A]" style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}>
              Professzionális szempillaépítés, sminkelés és arckezelések prémium
              minőségben. Fedezd fel a természetes szépséged Anita Art of Beauty
              szalonban.
            </p>
            <div className="flex flex-wrap gap-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}>
              <a href="#szolgaltatasok" className="btn-primary" data-testid="hero-services-btn">
                Szolgáltatások
              </a>
              <a href="#kapcsolat" className="btn-secondary" data-testid="hero-contact-btn">
                Kapcsolat
              </a>
            </div>
          </div>
        </div>

        <div className="scroll-indicator hidden md:block" />
      </div>
    </section>);

};

// Services Section with Tabs
const ServicesSection = () => {
  const [activeTab, setActiveTab] = useState("szempilla");

  return (
    <section id="szolgaltatasok" className="section-padding bg-cream" data-testid="services-section">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-16 md:mb-24">
          <span className="editorial-label">Szolgáltatások</span>
          <div className="flex items-end justify-between mt-4">
            <h2 className="editorial-h2">
              Árlista <span className="italic">és</span> Kezelések
            </h2>
            <div className="gold-line hidden md:block" />
          </div>
        </div>

        {/* Services Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full flex flex-wrap justify-start gap-2 md:gap-6 bg-transparent mb-12 h-auto" data-testid="services-tabs">
            {Object.entries(servicesData).map(([key, data]) =>
            <TabsTrigger
              key={key}
              value={key}
              className={`service-tab px-4 py-2 text-xs uppercase tracking-widest bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none ${
              activeTab === key ? "active text-gold" : "text-charcoal"}`
              }
              data-testid={`tab-${key}`}>

                {data.title.split(" ")[0]}
              </TabsTrigger>
            )}
          </TabsList>

          {Object.entries(servicesData).map(([key, data]) =>
          <TabsContent key={key} value={key} className="mt-0">
              <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
                {/* Image */}
                <div className="img-zoom aspect-[3/4] md:aspect-square lg:aspect-[3/4]">
                  <img
                  src={data.image}
                  alt={data.title}
                  className="w-full h-full object-cover"
                  data-testid={`service-image-${key}`} />

                </div>

                {/* Price List */}
                <div className="flex flex-col justify-center">
                  <h3 className="editorial-h3 mb-8">{data.title}</h3>
                  <div className="space-y-1">
                    {data.items.map((item, idx) =>
                  <div key={idx} className="price-row group" data-testid={`price-item-${key}-${idx}`}>
                        <div className="flex-1">
                          <span className="font-sans text-sm md:text-base text-charcoal group-hover:text-gold transition-colors duration-300">
                            {item.name}
                          </span>
                          <span className="block text-xs text-[#5A5A5A] mt-0.5">
                            {item.duration}
                          </span>
                        </div>
                        <span className="font-sans font-bold text-sm md:text-base whitespace-nowrap ml-4">
                          {item.price}
                        </span>
                      </div>
                  )}
                  </div>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </section>);

};

// About Section
const AboutSection = () => {
  return (
    <section id="rolam" className="section-padding" data-testid="about-section">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Text Content */}
          <div className="order-2 lg:order-1">
            <span className="editorial-label">Rólam</span>
            <h2 className="editorial-h2 mt-4 mb-8">
              Brattengeier <span className="italic">Anita</span>
            </h2>
            <div className="space-y-6 editorial-body">
              <p>
                Több éves tapasztalattal rendelkező szépségspecialista vagyok,
                aki a szempilla építés, professzionális sminkelés és modern
                arckezelések terén szerzett szaktudást.
              </p>
              <p>
                Szalonom Mosonmagyaróvár szívében, a Fő utcán található, ahol
                minden vendégem számára személyre szabott szolgáltatásokat
                nyújtok nyugodt, elegáns környezetben.
              </p>
              <p>
                Célom, hogy minden vendégem természetes szépségét kiemeljem,
                miközben a legmodernebb technikákat és prémium minőségű
                alapanyagokat használom.
              </p>
            </div>
            <div className="gold-line mt-8" />

            {/* Features */}
            <div className="grid grid-cols-2 gap-6 mt-12">
              <div className="flex items-start gap-3">
                <Sparkles className="text-gold mt-1" size={20} />
                <div>
                  <h4 className="font-sans font-bold text-sm uppercase tracking-wide">Prémium Minőség</h4>
                  <p className="text-xs text-[#5A5A5A] mt-1">Csak a legjobb alapanyagok</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Heart className="text-gold mt-1" size={20} />
                <div>
                  <h4 className="font-sans font-bold text-sm uppercase tracking-wide">Személyre Szabott</h4>
                  <p className="text-xs text-[#5A5A5A] mt-1">Egyéni igényekhez igazítva</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Award className="text-gold mt-1" size={20} />
                <div>
                  <h4 className="font-sans font-bold text-sm uppercase tracking-wide">Szakértelem</h4>
                  <p className="text-xs text-[#5A5A5A] mt-1">Évek tapasztalata</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="text-gold mt-1" size={20} />
                <div>
                  <h4 className="font-sans font-bold text-sm uppercase tracking-wide">Rugalmas Időpontok</h4>
                  <p className="text-xs text-[#5A5A5A] mt-1">Alkalmazkodó nyitvatartás</p>
                </div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="order-1 lg:order-2">
            <div className="img-zoom aspect-[3/4]">
              <img
                src="https://customer-assets.emergentagent.com/job_beauty-landing-22/artifacts/insodsqu_copy_FB491B37-E632-4709-95D2-C5206AA2B8A0.JPEG"
                alt="Brattengeier Anita - Anita Art of Beauty"
                className="w-full h-full object-cover object-top"
                data-testid="about-image" />

            </div>
          </div>
        </div>
      </div>
    </section>);

};

// Gallery Section
const GallerySection = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      const response = await axios.get(`${API}/gallery`);
      setImages(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching gallery:", error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ["Szempillaépítés", "Smink", "Arckezelés", "Szemöldök"];

  return (
    <section id="galeria" className="section-padding" data-testid="gallery-section">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 md:mb-24">
          <span className="editorial-label">Munkáim</span>
          <div className="flex items-end justify-between mt-4">
            <h2 className="editorial-h2">Galéria</h2>
            <div className="gold-line hidden md:block" />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="editorial-body">Betöltés...</p>
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-12 bg-[#F2EBE0] rounded">
            <Image size={48} className="mx-auto text-gold mb-4" />
            <p className="editorial-body">Hamarosan feltöltöm a munkáimat!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div key={image.id} className="img-zoom aspect-square group relative">
                <img
                  src={image.image_url}
                  alt={image.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div>
                    <p className="text-white font-sans text-sm font-bold">{image.title}</p>
                    <p className="text-white/70 text-xs">{image.category}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

// Loyalty Section
const LoyaltySection = () => {
  return (
    <section id="husegprogram" className="section-padding bg-[#1A1A1A] text-white" data-testid="loyalty-section">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 md:mb-24">
          <span className="editorial-label">Törzsvendég Program</span>
          <h2 className="editorial-h2 mt-4 text-white">
            Hűségprogram
          </h2>
          <p className="editorial-body text-white/60 max-w-2xl mx-auto mt-6">
            Értékeljük hűségedet! Minél többször látogatsz el hozzánk, annál
            nagyobb kedvezményeket kaphatsz.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loyaltyLevels.map((level, idx) =>
          <div
            key={idx}
            className="loyalty-badge bg-[#2A2A2A] border-[#D4AF37]/40 hover:border-gold"
            data-testid={`loyalty-${level.name.toLowerCase()}`}>

              <span className="text-gold text-4xl md:text-5xl font-serif">{level.discount}</span>
              <h3 className="font-serif text-xl mt-4 mb-2 text-white">{level.name}</h3>
              <p className="text-sm text-white/70">{level.condition}</p>
            </div>
          )}
        </div>

        <div className="mt-16 p-8 bg-gold/10 border border-gold/30 text-center">
          <p className="font-sans text-sm uppercase tracking-widest text-gold mb-2">Referral Program</p>
          <p className="editorial-body text-white/80">
            Ajánlj barátot és mindketten kapjatok <span className="text-gold font-bold">10% kedvezményt</span> a következő kezelésre!
          </p>
        </div>
      </div>
    </section>);

};

// Contact Section
const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(`${API}/contact`, formData);
      if (response.data.success) {
        toast.success(response.data.message);
        setFormData({ name: "", email: "", phone: "", message: "" });
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || "Hiba történt az üzenet küldése során.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section id="kapcsolat" className="section-padding bg-cream" data-testid="contact-section">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Contact Info & Map */}
          <div>
            <span className="editorial-label">Kapcsolat</span>
            <h2 className="editorial-h2 mt-4 mb-8">
              Látogass <span className="italic">el</span>
            </h2>

            {/* Contact Details */}
            <div className="space-y-6 mb-12">
              <a
                href="https://maps.google.com/?q=9200+Mosonmagyaróvár,+Fő+u+17"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 group"
                data-testid="contact-address">

                <MapPin className="text-gold mt-1 flex-shrink-0" size={20} />
                <div>
                  <span className="font-sans font-bold text-sm uppercase tracking-wide block mb-1">Cím</span>
                  <span className="editorial-body group-hover:text-gold transition-colors">
                    9200 Mosonmagyaróvár, Fő u 17.
                  </span>
                </div>
              </a>

              <a
                href="tel:+36309223271"
                className="flex items-start gap-4 group"
                data-testid="contact-phone">

                <Phone className="text-gold mt-1 flex-shrink-0" size={20} />
                <div>
                  <span className="font-sans font-bold text-sm uppercase tracking-wide block mb-1">Telefon</span>
                  <span className="editorial-body group-hover:text-gold transition-colors">
                    +36 30 922 3271
                  </span>
                </div>
              </a>

              <a
                href="mailto:anitabrattengeier@gmail.com"
                className="flex items-start gap-4 group"
                data-testid="contact-email">

                <Mail className="text-gold mt-1 flex-shrink-0" size={20} />
                <div>
                  <span className="font-sans font-bold text-sm uppercase tracking-wide block mb-1">Email</span>
                  <span className="editorial-body group-hover:text-gold transition-colors">
                    anitabrattengeier@gmail.com
                  </span>
                </div>
              </a>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 mb-12">
              <a
                href="https://instagram.com/brattengeieranita"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                data-testid="social-instagram">

                <Instagram size={20} />
              </a>
              <a
                href="https://facebook.com/AnitaLashandMakeUpMovar"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                data-testid="social-facebook">

                <Facebook size={20} />
              </a>
            </div>

            {/* Map */}
            <div className="map-container aspect-video">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1333.5489!2d17.2694!3d47.8728!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476c3e7a6d2a0001%3A0x1!2sFő+u.+17%2C+Mosonmagyaróvár%2C+9200!5e0!3m2!1shu!2shu"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Anita Art of Beauty - Mosonmagyaróvár"
                data-testid="contact-map" />

            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:pt-12">
            <h3 className="editorial-h3 mb-8">Írj nekem</h3>
            <p className="editorial-body mb-12">
              Kérdésed van, vagy időpontot szeretnél egyeztetni? Küldj üzenetet
              és hamarosan válaszolok.
            </p>

            <form onSubmit={handleSubmit} className="space-y-8" data-testid="contact-form">
              <div>
                <label className="font-sans text-xs uppercase tracking-widest mb-2 block">
                  Név *
                </label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input-editorial w-full bg-transparent border-0 border-b border-[#1A1A1A] rounded-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder="Az Ön neve"
                  data-testid="form-name" />

              </div>

              <div>
                <label className="font-sans text-xs uppercase tracking-widest mb-2 block">
                  Email *
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input-editorial w-full bg-transparent border-0 border-b border-[#1A1A1A] rounded-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder="email@pelda.hu"
                  data-testid="form-email" />

              </div>

              <div>
                <label className="font-sans text-xs uppercase tracking-widest mb-2 block">
                  Telefonszám
                </label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-editorial w-full bg-transparent border-0 border-b border-[#1A1A1A] rounded-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder="+36 30 123 4567"
                  data-testid="form-phone" />

              </div>

              <div>
                <label className="font-sans text-xs uppercase tracking-widest mb-2 block">
                  Üzenet *
                </label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="input-editorial w-full bg-transparent border-0 border-b border-[#1A1A1A] rounded-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none"
                  placeholder="Miben segíthetek?"
                  data-testid="form-message" />

              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full md:w-auto"
                data-testid="form-submit">

                {isSubmitting ? "Küldés..." : "Üzenet Küldése"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>);

};

// Footer
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1A1A1A] text-white py-16 px-6 md:px-12" data-testid="footer">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-2xl mb-4">
              ANITA <span className="text-gold">|</span> Art of Beauty
            </h3>
            <p className="text-sm text-white/50 leading-relaxed">
              Szempillaépítés, professzionális sminkelés és prémium arckezelések
              Mosonmagyaróváron.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-sans text-xs uppercase tracking-widest text-gold mb-6">
              Navigáció
            </h4>
            <div className="flex flex-col gap-3">
              <a href="#szolgaltatasok" className="text-sm text-white/70 hover:text-gold transition-colors">
                Szolgáltatások
              </a>
              <a href="#rolam" className="text-sm text-white/70 hover:text-gold transition-colors">
                Rólam
              </a>
              <a href="#husegprogram" className="text-sm text-white/70 hover:text-gold transition-colors">
                Hűségprogram
              </a>
              <a href="#kapcsolat" className="text-sm text-white/70 hover:text-gold transition-colors">
                Kapcsolat
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-sans text-xs uppercase tracking-widest text-gold mb-6">
              Elérhetőség
            </h4>
            <div className="space-y-3 text-sm text-white/70">
              <p>9200 Mosonmagyaróvár, Fő u 17.</p>
              <p>+36 30 922 3271</p>
              <p>anitabrattengeier@gmail.com</p>
            </div>
            <div className="flex gap-4 mt-6">
              <a
                href="https://instagram.com/brattengeieranita"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-gold transition-colors">

                <Instagram size={20} />
              </a>
              <a
                href="https://facebook.com/AnitaLashandMakeUpMovar"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-gold transition-colors">

                <Facebook size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/40">
            © {currentYear} Anita Art of Beauty. Minden jog fenntartva.
          </p>
          <p className="text-xs text-white/40">
            Kozmetikus · Szempillás · Sminkes — Mosonmagyaróvár
          </p>
        </div>
                <div className="flex gap-4">
                  <a href="/aszf" className="text-xs text-white/40 hover:text-[#D4AF37] transition-colors">ÁSZF</a>
                  <a href="/adatvedelem" className="text-xs text-white/40 hover:text-[#D4AF37] transition-colors">Adatvédelem</a>
                  <a href="/cookie" className="text-xs text-white/40 hover:text-[#D4AF37] transition-colors">Cookie</a>
                </div>
      </div>
    </footer>);

};

// Admin Login Component
const AdminLogin = () => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${API}/admin/login`, { password });
      if (response.data.success) {
        localStorage.setItem("adminAuth", "true");
        toast.success("Sikeres bejelentkezés!");
        navigate("/admin/dashboard");
      }
    } catch (error) {
      toast.error("Hibás jelszó!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2] flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white p-8 border border-[#E6DCCF]">
        <h1 className="font-serif text-3xl mb-2 text-center">Admin Belépés</h1>
        <p className="text-center text-[#5A5A5A] mb-8">ANITA | Art of Beauty</p>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="font-sans text-xs uppercase tracking-widest mb-2 block">Jelszó</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-editorial w-full bg-transparent border-0 border-b border-[#1A1A1A] rounded-none"
              placeholder="Admin jelszó"
              required
              data-testid="admin-password"
            />
          </div>
          <Button type="submit" className="btn-primary w-full" disabled={isLoading} data-testid="admin-login-btn">
            {isLoading ? "Bejelentkezés..." : "Belépés"}
          </Button>
        </form>
        
        <a href="/" className="block text-center mt-6 text-sm text-[#5A5A5A] hover:text-gold">
          ← Vissza a főoldalra
        </a>
      </div>
      <Toaster position="bottom-right" richColors />
    </div>
  );
};

// Admin Dashboard Component
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("gallery");
  const [galleryImages, setGalleryImages] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [newImage, setNewImage] = useState({ title: "", category: "Szempillaépítés", image_url: "" });
  const [newPromo, setNewPromo] = useState({ title: "", description: "", discount_percent: "", valid_until: "", active: true });

  useEffect(() => {
    const isAuth = localStorage.getItem("adminAuth");
    if (!isAuth) {
      navigate("/admin");
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const [galleryRes, promosRes] = await Promise.all([
        axios.get(`${API}/gallery`),
        axios.get(`${API}/promotions/all`)
      ]);
      setGalleryImages(Array.isArray(galleryRes.data) ? galleryRes.data : []);
      setPromotions(Array.isArray(promosRes.data) ? promosRes.data : []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    navigate("/admin");
  };

  const handleAddImage = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/gallery`, newImage);
      toast.success("Kép hozzáadva!");
      setNewImage({ title: "", category: "Szempillaépítés", image_url: "" });
      fetchData();
    } catch (error) {
      toast.error("Hiba a kép hozzáadásakor");
    }
  };

  const handleDeleteImage = async (id) => {
    if (!window.confirm("Biztosan törölni szeretnéd?")) return;
    try {
      await axios.delete(`${API}/gallery/${id}`);
      toast.success("Kép törölve!");
      fetchData();
    } catch (error) {
      toast.error("Hiba a törléskor");
    }
  };

  const handleAddPromo = async (e) => {
    e.preventDefault();
    try {
      const promoData = {
        ...newPromo,
        discount_percent: newPromo.discount_percent ? parseInt(newPromo.discount_percent) : null
      };
      await axios.post(`${API}/promotions`, promoData);
      toast.success("Akció hozzáadva!");
      setNewPromo({ title: "", description: "", discount_percent: "", valid_until: "", active: true });
      fetchData();
    } catch (error) {
      toast.error("Hiba az akció hozzáadásakor");
    }
  };

  const handleDeletePromo = async (id) => {
    if (!window.confirm("Biztosan törölni szeretnéd?")) return;
    try {
      await axios.delete(`${API}/promotions/${id}`);
      toast.success("Akció törölve!");
      fetchData();
    } catch (error) {
      toast.error("Hiba a törléskor");
    }
  };

  const categories = ["Szempillaépítés", "Smink", "Arckezelés", "Szemöldök"];

  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      {/* Admin Header */}
      <header className="bg-[#1A1A1A] text-white py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="font-serif text-xl">
            <span className="text-gold">ANITA</span> Admin Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <a href="/" className="text-sm text-white/70 hover:text-gold">Megtekintés</a>
            <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-white/70 hover:text-gold">
              <LogOut size={16} /> Kijelentkezés
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-8 px-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8 bg-white border border-[#E6DCCF]">
            <TabsTrigger value="gallery" className="data-[state=active]:bg-gold data-[state=active]:text-white">
              Galéria
            </TabsTrigger>
            <TabsTrigger value="promotions" className="data-[state=active]:bg-gold data-[state=active]:text-white">
              Akciók
            </TabsTrigger>
          </TabsList>

          {/* Gallery Tab */}
          <TabsContent value="gallery">
            <div className="bg-white p-6 border border-[#E6DCCF] mb-8">
              <h2 className="font-serif text-2xl mb-6">Új Kép Hozzáadása</h2>
              <form onSubmit={handleAddImage} className="grid md:grid-cols-4 gap-4">
                <Input
                  placeholder="Kép címe"
                  value={newImage.title}
                  onChange={(e) => setNewImage({...newImage, title: e.target.value})}
                  required
                  data-testid="gallery-title"
                />
                <select
                  value={newImage.category}
                  onChange={(e) => setNewImage({...newImage, category: e.target.value})}
                  className="border border-[#E6DCCF] px-3 py-2 bg-white"
                  data-testid="gallery-category"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <Input
                  placeholder="Kép URL"
                  value={newImage.image_url}
                  onChange={(e) => setNewImage({...newImage, image_url: e.target.value})}
                  required
                  data-testid="gallery-url"
                />
                <Button type="submit" className="btn-primary" data-testid="gallery-add-btn">
                  <Plus size={16} className="mr-2" /> Hozzáadás
                </Button>
              </form>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {galleryImages.map((image) => (
                <div key={image.id} className="relative group bg-white border border-[#E6DCCF] overflow-hidden">
                  <img src={image.image_url} alt={image.title} className="w-full aspect-square object-cover" />
                  <div className="p-3">
                    <p className="font-bold text-sm">{image.title}</p>
                    <p className="text-xs text-[#5A5A5A]">{image.category}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteImage(image.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    data-testid={`delete-image-${image.id}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {galleryImages.length === 0 && (
              <div className="text-center py-12 bg-white border border-[#E6DCCF]">
                <Image size={48} className="mx-auto text-[#E6DCCF] mb-4" />
                <p className="text-[#5A5A5A]">Még nincsenek képek. Adj hozzá az első képet!</p>
              </div>
            )}
          </TabsContent>

          {/* Promotions Tab */}
          <TabsContent value="promotions">
            <div className="bg-white p-6 border border-[#E6DCCF] mb-8">
              <h2 className="font-serif text-2xl mb-6">Új Akció Hozzáadása</h2>
              <form onSubmit={handleAddPromo} className="grid md:grid-cols-2 gap-4">
                <Input
                  placeholder="Akció címe"
                  value={newPromo.title}
                  onChange={(e) => setNewPromo({...newPromo, title: e.target.value})}
                  required
                  data-testid="promo-title"
                />
                <Input
                  placeholder="Kedvezmény % (opcionális)"
                  type="number"
                  value={newPromo.discount_percent}
                  onChange={(e) => setNewPromo({...newPromo, discount_percent: e.target.value})}
                  data-testid="promo-discount"
                />
                <Textarea
                  placeholder="Leírás"
                  value={newPromo.description}
                  onChange={(e) => setNewPromo({...newPromo, description: e.target.value})}
                  required
                  className="md:col-span-2"
                  data-testid="promo-description"
                />
                <Input
                  placeholder="Érvényesség (pl. 2024.12.31)"
                  value={newPromo.valid_until}
                  onChange={(e) => setNewPromo({...newPromo, valid_until: e.target.value})}
                  data-testid="promo-valid"
                />
                <Button type="submit" className="btn-primary" data-testid="promo-add-btn">
                  <Plus size={16} className="mr-2" /> Akció Hozzáadása
                </Button>
              </form>
            </div>

            <div className="space-y-4">
              {promotions.map((promo) => (
                <div key={promo.id} className="bg-white p-6 border border-[#E6DCCF] flex justify-between items-start">
                  <div>
                    <h3 className="font-serif text-xl mb-2">{promo.title}</h3>
                    <p className="text-[#5A5A5A] mb-2">{promo.description}</p>
                    <div className="flex gap-4 text-sm">
                      {promo.discount_percent && (
                        <span className="text-gold font-bold">{promo.discount_percent}% kedvezmény</span>
                      )}
                      {promo.valid_until && (
                        <span className="text-[#5A5A5A]">Érvényes: {promo.valid_until}</span>
                      )}
                      <span className={promo.active ? "text-green-600" : "text-red-600"}>
                        {promo.active ? "Aktív" : "Inaktív"}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeletePromo(promo.id)}
                    className="text-red-500 hover:text-red-700 p-2"
                    data-testid={`delete-promo-${promo.id}`}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>

            {promotions.length === 0 && (
              <div className="text-center py-12 bg-white border border-[#E6DCCF]">
                <p className="text-[#5A5A5A]">Még nincsenek akciók. Adj hozzá az első akciót!</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <Toaster position="bottom-right" richColors />
    </div>
  );
};


// ÁSZF Page Component
const ASZFPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      <div className="bg-[#1A1A1A] py-4 px-6 flex items-center justify-between">
        <button onClick={() => navigate('/')} className="text-white/70 hover:text-[#D4AF37] text-sm transition-colors flex items-center gap-2">
          ← Vissza a főoldalra
        </button>
        <span className="text-white font-serif text-lg">ANITA | Art of Beauty</span>
      </div>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="font-serif text-4xl mb-2 text-[#1A1A1A]">Általános Szerződési Feltételek</h1>
        <p className="text-[#1A1A1A]/50 text-sm mb-10">Utoljára frissítve: 2026. január 1.</p>

        <div className="space-y-8 text-[#1A1A1A]/80 leading-relaxed">
          <section>
            <h2 className="font-serif text-2xl text-[#1A1A1A] mb-3">1. Az ÁSZF hatálya és elfogadása</h2>
            <p>Jelen Általános Szerződési Feltételek (továbbiakban: ÁSZF) az Anita Art of Beauty szépségszalon (továbbiakban: Szolgáltató) és az ügyfelek (továbbiakban: Ügyfél) között létrejövő jogviszonyra vonatkoznak. Az időpontfoglalással vagy a szolgáltatások igénybevételével az Ügyfél elfogadja jelen ÁSZF rendelkezéseit.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#1A1A1A] mb-3">2. Szolgáltató adatai</h2>
            <p><strong>Neve:</strong> Anita Art of Beauty</p>
            <p><strong>Vezető:</strong> Brattengeier Anita</p>
            <p><strong>Székhely:</strong> 9200 Mosonmagyaróvár, Fő u. 17.</p>
            <p><strong>E-mail:</strong> anitabrattengeier@gmail.com</p>
            <p><strong>Telefon:</strong> +36 30 922 3271</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#1A1A1A] mb-3">3. Időpontfoglalás és lemondás</h2>
            <p>Az Ügyfél időpontot foglalhat telefonon, e-mailben vagy a weboldalon keresztül. Az időpont lemondását legkésőbb 24 órával a kezelés előtt kell jelezni. A 24 óránál rövidebb időn belüli lemondás esetén a Szolgáltató fenntartja a jogot a kezelés díjának részleges vagy teljes kiszámlázására. Az el nem foglalt időpont és a foglalás nélküli megjelenés esetén a Szolgáltató a szolgáltatás megtagadásának jogát fenntartja.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#1A1A1A] mb-3">4. Árak és fizetési feltételek</h2>
            <p>Az aktuális árlista a weboldalon és a szalonban megtekinthető. A Szolgáltató fenntartja az árak megváltoztatásának jogát, amelyről az Ügyfeleket előzetesen értesíti. A fizetés készpénzben vagy banki átutalással történhet. A kezelések díja a helyszínen esedékes.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#1A1A1A] mb-3">5. Szavatosság és panaszkezelés</h2>
            <p>A Szolgáltató vállalja, hogy a kezeléseket szakszerűen és az egészségügyi előírásoknak megfelelően végzi. Amennyiben az Ügyfél a szolgáltatással kapcsolatban kifogást emel, azt a kezelést követő 48 órán belül jelezheti a Szolgáltató felé. A Szolgáltató kötelezi magát, hogy a panaszokat haladéktalanul kivizsgálja és az észszerű megoldást megtalálja.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#1A1A1A] mb-3">6. Egészségügyi nyilatkozat</h2>
            <p>Az Ügyfél köteles tájékoztatni a Szolgáltatót minden, a kezelés szempontjából releváns egészségügyi állapotáról (allergiák, bőrproblémák, terhesség stb.). A valótlan vagy hiányos tájékoztatásból eredő károkért a Szolgáltató felelősséget nem vállal.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#1A1A1A] mb-3">7. Hűségprogram feltételei</h2>
            <p>A hűségprogram keretében gyűjtött pontok nem válthatók készpénzre. A pontok felhasználhatók a weboldalon megjelölt szolgáltatások kedvezményes igénybevételéhez. A Szolgáltató fenntartja a hűségprogram feltételeinek módosítási jogát, amelyről az ügyfeleket tájékoztatja.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#1A1A1A] mb-3">8. Vegyes rendelkezések</h2>
            <p>Jelen ÁSZF-re a magyar jog az irányadó. A felek közötti esetleges jogvitákat elsősorban tárgyalásos úton kísérlik meg rendezni. Amennyiben ez nem vezet eredményre, a hatáskörrel és illetékességgel rendelkező bíróság jár el. A Szolgáltató fenntartja az ÁSZF módosításának jogát. A módosítások a weboldalon való közzétételtől hatályosak.</p>
          </section>
        </div>
      </div>
      <footer className="bg-[#1A1A1A] text-white/40 text-center py-6 text-xs mt-12">
        <p>© 2026 Anita Art of Beauty. Minden jog fenntartva.</p>
      </footer>
    </div>
  );
};

// Adatvédelmi Tájékoztató (GDPR) Component
const GDPRPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      <div className="bg-[#1A1A1A] py-4 px-6 flex items-center justify-between">
        <button onClick={() => navigate('/')} className="text-white/70 hover:text-[#D4AF37] text-sm transition-colors flex items-center gap-2">
          ← Vissza a főoldalra
        </button>
        <span className="text-white font-serif text-lg">ANITA | Art of Beauty</span>
      </div>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="font-serif text-4xl mb-2 text-[#1A1A1A]">Adatvédelmi Tájékoztató</h1>
        <p className="text-[#1A1A1A]/50 text-sm mb-10">Utoljára frissítve: 2026. január 1. | GDPR megfelelő</p>

        <div className="space-y-8 text-[#1A1A1A]/80 leading-relaxed">
          <section>
            <h2 className="font-serif text-2xl text-[#1A1A1A] mb-3">1. Adatkezelő adatai</h2>
            <p><strong>Adatkezelő neve:</strong> Brattengeier Anita (Anita Art of Beauty)</p>
            <p><strong>Cím:</strong> 9200 Mosonmagyaróvár, Fő u. 17.</p>
            <p><strong>E-mail:</strong> anitabrattengeier@gmail.com</p>
            <p><strong>Telefon:</strong> +36 30 922 3271</p>
            <p className="mt-2">Az adatkezelő az érintett adatait az Európai Parlament és a Tanács (EU) 2016/679 rendelete (GDPR) és az információs önrendelkezési jogról és az információszabadságról szóló 2011. évi CXII. törvény (Infotv.) rendelkezéseinek megfelelően kezeli.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#1A1A1A] mb-3">2. Kezelt személyes adatok és célok</h2>
            <p><strong>Időpontfoglalás és ügyfélnyilvántartás esetén:</strong> Név, telefonszám, e-mail cím, esetlegesen egészségügyi adat (allergia, bőrápolási szokások). Cél: időpont-egyeztetés, ügyfélkapcsolat, emlékeztető küldés. Jogalap: szerződés teljesítése (GDPR 6. cikk (1) b) pont).</p>
            <p className="mt-2"><strong>Kapcsolatfelvételi üzenetek esetén:</strong> Név, e-mail cím, üzenet tartalma. Cél: az érdeklődő megkeresésének megválaszolása. Jogalap: az érintett hozzájárulása (GDPR 6. cikk (1) a) pont).</p>
            <p className="mt-2"><strong>Hűségprogram esetén:</strong> Név, telefonszám, a felhasznált/megszerzett pontok. Cél: a hűségprogram működtetése. Jogalap: szerződés teljesítése.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#1A1A1A] mb-3">3. Az adatkezelés időtartama</h2>
            <p>Az ügyfél személyes adatait az adatkezelő az üzleti kapcsolat megszűnésétől számított 5 évig, a számviteli adatokat az irányadó jogszabályi előírások szerint (általában 8 évig) tárolja. A hozzájárulás alapján kezelt adatokat a hozzájárulás visszavonásáig kezeli.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#1A1A1A] mb-3">4. Az érintett jogai</h2>
            <p>Az érintett jogosult: hozzáférni személyes adataihoz; kérni azok helyesbítését; kérni azok törlését ("elfeledtetéshez való jog"); kérni az adatkezelés korlátozását; adathordozhatósághoz való jogát érvényesíteni; tiltakozni az adatkezelés ellen. Az érintett jogait az adatkezelő e-mail vagy postai úton kérheti érvényesíteni. Az adatkezelő a kérelmekre 30 napon belül válaszol. Jogorvoslati lehetőség: Nemzeti Adatvédelmi és Információszabadság Hatóság (NAIH), naih.hu, 1363 Budapest, Pf. 9.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#1A1A1A] mb-3">5. Adatbiztonság</h2>
            <p>Az adatkezelő megfelelő technikai és szervezési intézkedéseket tesz a személyes adatok védelme érdekében. Az adatokat biztonságos szerveren tárolja, és harmadik félnek csak törvényi kötelezés esetén adja át. Az adatkezelő adatfeldolgozókat vehet igénybe (pl. e-mail szolgáltató), amelyekről kérésre tájékoztatást nyújt.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#1A1A1A] mb-3">6. Sütik (cookie-k)</h2>
            <p>Weboldalunk sütik használatáról részletes tájékoztatást a <a href="/cookie" className="text-[#D4AF37] underline">Cookie Tájékoztatóban</a> talál.</p>
          </section>
        </div>
      </div>
      <footer className="bg-[#1A1A1A] text-white/40 text-center py-6 text-xs mt-12">
        <p>© 2026 Anita Art of Beauty. Minden jog fenntartva.</p>
      </footer>
    </div>
  );
};

// Cookie Tájékoztató Component
const CookiePage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      <div className="bg-[#1A1A1A] py-4 px-6 flex items-center justify-between">
        <button onClick={() => navigate('/')} className="text-white/70 hover:text-[#D4AF37] text-sm transition-colors flex items-center gap-2">
          ← Vissza a főoldalra
        </button>
        <span className="text-white font-serif text-lg">ANITA | Art of Beauty</span>
      </div>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="font-serif text-4xl mb-2 text-[#1A1A1A]">Cookie (Süti) Tájékoztató</h1>
        <p className="text-[#1A1A1A]/50 text-sm mb-10">Utoljára frissítve: 2026. január 1.</p>

        <div className="space-y-8 text-[#1A1A1A]/80 leading-relaxed">
          <section>
            <h2 className="font-serif text-2xl text-[#1A1A1A] mb-3">1. Mi az a cookie (süti)?</h2>
            <p>A cookie (süti) egy kis szöveges fájl, amelyet a weboldal az Ön böngészőjében helyez el. A sütik segítenek a weboldal megfelelő működésében, javítják a felhasználói élményt, és lehetővé teszik a látogatási szokások elemzését.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#1A1A1A] mb-3">2. Általunk használt sütik típusai</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse mt-2">
                <thead>
                  <tr className="bg-[#1A1A1A]/10">
                    <th className="text-left p-3 font-sans text-sm">Süti neve</th>
                    <th className="text-left p-3 font-sans text-sm">Típus</th>
                    <th className="text-left p-3 font-sans text-sm">Cél</th>
                    <th className="text-left p-3 font-sans text-sm">Lejárat</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-[#1A1A1A]/10">
                    <td className="p-3 text-sm">adminAuth</td>
                    <td className="p-3 text-sm">Szükséges</td>
                    <td className="p-3 text-sm">Admin bejelentkezés tárolása</td>
                    <td className="p-3 text-sm">Munkamenet végéig</td>
                  </tr>
                  <tr className="border-t border-[#1A1A1A]/10">
                    <td className="p-3 text-sm">_ga, _gid</td>
                    <td className="p-3 text-sm">Analitikai</td>
                    <td className="p-3 text-sm">Látogatói statisztikák (ha aktív)</td>
                    <td className="p-3 text-sm">2 év / 24 óra</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#1A1A1A] mb-3">3. Szükséges (elengedhetetlen) sütik</h2>
            <p>Ezek a sütik a weboldal alapvető működéséhez szükségesek, így azokat nem lehet visszautasítani. Személyes adatot nem tárolnak és nem azonosítják Önt.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#1A1A1A] mb-3">4. Hogyan kezelheti a sütiket?</h2>
            <p>A legtöbb böngésző alapértelmezés szerint engedélyezi a sütik fogadását. Ön bármikor megváltoztathatja böngészőjének beállításait a sütik elutasítása vagy törlése érdekében. Kérjük, vegye figyelembe, hogy a sütik letiltása esetén előfordulhat, hogy a weboldal egyes funkciói nem működnek megfelelően.</p>
            <p className="mt-2">A cookie-kezelés böngészőnkénti beállításairól a következő linkeken tájékozódhat: <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] underline">Chrome</a>, <a href="https://support.mozilla.org/hu/kb/sutik-informaciok-amelyeket-weboldalak-tarolnak" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] underline">Firefox</a>, <a href="https://support.apple.com/hu-hu/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] underline">Safari</a>.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-[#1A1A1A] mb-3">5. Kapcsolat</h2>
            <p>Ha kérdése van a cookie-kezeléssel kapcsolatban, kérjük, vegye fel velünk a kapcsolatot: <a href="mailto:anitabrattengeier@gmail.com" className="text-[#D4AF37] underline">anitabrattengeier@gmail.com</a></p>
          </section>
        </div>
      </div>
      <footer className="bg-[#1A1A1A] text-white/40 text-center py-6 text-xs mt-12">
        <p>© 2026 Anita Art of Beauty. Minden jog fenntartva.</p>
      </footer>
    </div>
  );
};

// Main Landing Page Component
const LandingPage = () => {
  return (
    <>
      <Navigation />
      <main>
        <HeroSection />
        <ServicesSection />
        <GallerySection />
        <AboutSection />
        <LoyaltySection />
        <ContactSection />
      </main>
      <Footer />
      <Toaster position="bottom-right" richColors />
    </>);

};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/aszf" element={<ASZFPage />} />
                <Route path="/adatvedelem" element={<GDPRPage />} />
                <Route path="/cookie" element={<CookiePage />} />
      </Routes>
    </BrowserRouter>);

}

export default App;
