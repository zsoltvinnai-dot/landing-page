import { useState, useEffect, useRef } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import { Phone, Mail, MapPin, Instagram, Facebook, Menu, X, Clock, Award, Heart, Sparkles, ChevronDown } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Services data from A version price list
const servicesData = {
  szempilla: {
    title: "Szempilla Építés",
    image: "https://images.unsplash.com/photo-1652201767864-49472c48b145?w=800&q=80",
    items: [
    { name: "Klasszikus Szempilla Építés", duration: "150 perc", price: "12.000 Ft" },
    { name: "Volume Szempilla Építés", duration: "180 perc", price: "15.000 Ft" },
    { name: "Extra styling Szempilla Építés", duration: "180 perc", price: "16.000 Ft" },
    { name: "Szempilla Eltávolítás", duration: "30 perc", price: "3.000 Ft" },
    { name: "Karbantartás (3 hét)", duration: "120 perc", price: "10.000 Ft" },
    { name: "Karbantartás (4-5 hét)", duration: "120 perc", price: "14.000 Ft" }
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
  { href: "#rolam", label: "Rólam" },
  { href: "#husegprogram", label: "Hűségprogram" },
  { href: "#kapcsolat", label: "Kapcsolat" }];


  return (
    <nav
      data-testid="main-navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? "bg-[#F9F7F2]/95 backdrop-blur-sm shadow-sm" : "bg-transparent"}`
      }>

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-20">
          <a href="#" className="md:text-2xl font-serif text-xl tracking-tight !text-[#D4AF37]" data-testid="logo">ANITA 
            <span className="text-gold">|</span> Art of Beauty
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) =>
            <a
              key={link.href}
              href={link.href}
              className="nav-link font-sans text-charcoal hover:text-gold"
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
          backgroundImage: `url('https://images.unsplash.com/photo-1562322140-8baeececf3df?w=1920&q=80')`
        }} />

      <div className="hero-overlay" />
      <div className="grain-overlay absolute inset-0" />

      <div className="relative z-10 min-h-screen flex flex-col justify-end pb-24 md:pb-32 px-6 md:px-12">
        <div className="max-w-4xl !bg-[rgba(0,0,0,0.01)]">
          <span className="editorial-label animate-fade-in-up opacity-0 !text-[#000000]" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
            Mosonmagyaróvár
          </span>
          <h1 className="editorial-h1 mt-4 mb-6 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}>
            A szépség <br />
            <span className="italic">művészete</span>
          </h1>
          <p className="editorial-body max-w-xl animate-fade-in-up mb-8 opacity-0 !text-[#000000]" style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}>
            Professzionális szempilla építés, sminkelés és arckezelések prémium
            minőségben. Fedezd fel a természetes szépséged Anita Art of Beauty
            szalonban.
          </p>
          <div className="flex flex-wrap gap-4 opacity-0 animate-fade-in-up" style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}>
            <a href="#szolgaltatasok" className="btn-primary" data-testid="hero-services-btn">
              Szolgáltatások
            </a>
            <a href="#kapcsolat" className="btn-secondary" data-testid="hero-contact-btn">
              Kapcsolat
            </a>
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
                src="https://images.unsplash.com/photo-1601002257790-ebe0966a85ae?w=800&q=80"
                alt="Anita Art of Beauty szalon"
                className="w-full h-full object-cover"
                data-testid="about-image" />

            </div>
          </div>
        </div>
      </div>
    </section>);

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
            className="loyalty-badge bg-white/5 border-white/10 hover:border-gold"
            data-testid={`loyalty-${level.name.toLowerCase()}`}>

              <span className="text-gold text-4xl md:text-5xl font-serif">{level.discount}</span>
              <h3 className="font-serif text-xl mt-4 mb-2">{level.name}</h3>
              <p className="text-sm text-white/50">{level.condition}</p>
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
              Szempilla építés, professzionális sminkelés és prémium arckezelések
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
      </div>
    </footer>);

};

// Main Landing Page Component
const LandingPage = () => {
  return (
    <>
      <Navigation />
      <main>
        <HeroSection />
        <ServicesSection />
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
      </Routes>
    </BrowserRouter>);

}

export default App;