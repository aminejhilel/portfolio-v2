"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Briefcase,
  GraduationCap,
  MapPin,
  Calendar,
  Mail,
  Send,
  CheckCircle2,
  Zap,
  Wind,
  Thermometer,
  Wrench,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

// Inline LinkedIn SVG (brand icons removed from lucide-react)
function LinkedinIcon({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
  );
}
import StrokeText from "@/components/StrokeText";
import GridScan from "@/components/GridScan";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formState, setFormState] = useState({ name: "", email: "", subject: "", message: "" });
  const [activeCategory, setActiveCategory] = useState("all");

  const experiences = [
    {
      role: "Technicien de maintenance CVC",
      company: "CITY CLIM",
      type: "Stage",
      period: "juin 2025 - août 2025 · 3 mois",
      location: "Ville de Paris, Île-de-France, France · Sur site",
      description: "Installation et maintenance préventive et curative des systèmes de chauffage, ventilation et climatisation (CVC). Diagnostic des pannes, réglage des régulations thermiques et optimisation des flux d'air.",
      icon: Thermometer,
      skills: ["Chauffage", "Ventilation", "Climatisation", "Régulation thermique", "Dépannage CVC"]
    },
    {
      role: "Technicien de maintenance",
      company: "Merca Bestagri",
      type: "Stage",
      period: "oct. 2023 - avr. 2024 · 7 mois",
      location: "Oujda, Oriental, Maroc · Sur site",
      description: "Étude technique approfondie et dimensionnement des installations. Analyse des plans thermiques, calcul des charges thermiques, choix des équipements adaptés et schématisation des réseaux.",
      icon: Wrench,
      skills: ["Dimensionnement", "Étude technique", "Réseaux hydrauliques/aérauliques", "AutoCAD"]
    },
    {
      role: "Assistant Auditeur Énergétique",
      company: "LafargeHolcim Maroc",
      type: "Stage",
      period: "avr. 2023 - juin 2023 · 3 mois",
      location: "Oujda, Oriental, Maroc · Sur site",
      description: "Projet de fin d'études / Stage axé sur l'optimisation de la consommation d'énergie de l'usine. Analyse des factures énergétiques, réalisation de bilans thermiques et électriques, et proposition d'actions d'efficacité énergétique.",
      icon: Zap,
      skills: ["Audit énergétique", "Efficacité énergétique", "Bilans thermiques", "Optimisation de consommation"]
    },
    {
      role: "Technicien de maintenance",
      company: "LafargeHolcim Maroc",
      type: "Stage",
      period: "juil. 2022 - août 2022 · 2 mois",
      location: "Oujda, Oriental, Maroc · Sur site",
      description: "Maintenance préventive des armoires électriques et des équipements industriels. Remplacement des composants obsolètes, contrôle des connexions et des protections de puissance.",
      icon: Wind,
      skills: ["Maintenance électrique", "Armoires de commande", "Sécurité industrielle", "Automatisme"]
    }
  ];

  const education = [
    {
      degree: "Licence Professionnelle Génie Climatique",
      specialization: "Énergies Renouvelables et Efficacité Énergétique",
      institution: "Université de Picardie Jules Verne (UPJV)",
      period: "sept. 2024 - août 2025",
      location: "Amiens, Hauts-de-France, France",
      description: "Formation approfondie sur la conception CVC, l'audit et le diagnostic des bâtiments, le dimensionnement des installations de chauffage, climatisation et énergies vertes."
    },
    {
      degree: "Technicien Spécialisé en Efficacité Énergétique",
      specialization: "Énergies Renouvelables et Énergies Propres",
      institution: "IFMEREE (Institut de Formation aux Métiers des Energies Renouvelables)",
      period: "sept. 2021 - sept. 2023",
      location: "Oujda, Oriental, Maroc",
      description: "Apprentissage technique sur les systèmes solaires thermiques, photovoltaïques, l'éolien, l'efficacité énergétique industrielle et les systèmes électriques."
    }
  ];

  const skills = [
    { name: "CVC & Génie Climatique", level: 90, category: "technical" },
    { name: "Dimensionnement Thermique", level: 85, category: "technical" },
    { name: "Audit & Efficacité Énergétique", level: 80, category: "technical" },
    { name: "Énergies Renouvelables (Solaire/Éolien)", level: 85, category: "technical" },
    { name: "Maintenance Électrique & Armoires", level: 75, category: "technical" },
    { name: "AutoCAD & Dessin Technique", level: 80, category: "tools" },
    { name: "PVSyst & Dialux", level: 70, category: "tools" },
    { name: "Régulation & Automatisme", level: 75, category: "technical" },
    { name: "Français", level: 95, category: "languages" },
    { name: "Anglais Technique", level: 75, category: "languages" },
    { name: "Arabe (Langue Maternelle)", level: 100, category: "languages" }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formState.name && formState.email && formState.message) {
      setFormSubmitted(true);
      setTimeout(() => {
        setFormSubmitted(false);
        setFormState({ name: "", email: "", subject: "", message: "" });
      }, 5000);
    }
  };

  const filteredSkills = activeCategory === "all" 
    ? skills 
    : skills.filter(skill => skill.category === activeCategory);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header / Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-slate-800/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2 group">
            <span className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center font-bold text-lg text-white shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
              MB
            </span>
            <div className="flex flex-col">
              <span className="font-semibold text-white leading-none tracking-tight">Mohammed BENRABAH</span>
              <span className="text-xs text-teal-400">Génie Climatique & Éco-Énergétique</span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#presentation" className="text-sm font-medium text-slate-300 hover:text-teal-400 transition-colors">Présentation</a>
            <a href="#experiences" className="text-sm font-medium text-slate-300 hover:text-teal-400 transition-colors">Parcours Pro</a>
            <a href="#formations" className="text-sm font-medium text-slate-300 hover:text-teal-400 transition-colors">Formations</a>
            <a href="#competences" className="text-sm font-medium text-slate-300 hover:text-teal-400 transition-colors">Compétences</a>
            <a href="#contact" className="text-sm font-medium text-slate-300 hover:text-teal-400 transition-colors">Contact</a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-teal-500/10 hover:shadow-teal-500/25 transition-all duration-300 active:scale-95"
            >
              Me Contacter
            </a>
          </nav>

          {/* Mobile Nav Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-300 hover:bg-slate-900 transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-slate-950/98 backdrop-blur-xl flex flex-col justify-center px-6 md:hidden">
          <nav className="flex flex-col gap-6 text-center text-lg font-medium">
            <a 
              href="#presentation" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-teal-400 py-2 transition-colors"
            >
              Présentation
            </a>
            <a 
              href="#experiences" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-teal-400 py-2 transition-colors"
            >
              Parcours Pro
            </a>
            <a 
              href="#formations" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-teal-400 py-2 transition-colors"
            >
              Formations
            </a>
            <a 
              href="#competences" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-teal-400 py-2 transition-colors"
            >
              Compétences
            </a>
            <a 
              href="#contact" 
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-300 hover:text-teal-400 py-2 transition-colors"
            >
              Contact
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-4 inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg"
            >
              Me Contacter
            </a>
          </nav>
        </div>
      )}

      {/* ═══════════════ HERO SECTION ═══════════════ */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950 pt-16"
      >
        {/* ── GridScan full-screen background ── */}
        <div className="absolute inset-0">
          <GridScan
            sensitivity={0.55}
            lineThickness={1}
            linesColor="#2F293A"
            gridScale={0.1}
            scanColor="#FF9FFC"
            scanOpacity={0.4}
            enablePost
            bloomIntensity={0.6}
            chromaticAberration={0.002}
            noiseIntensity={0.01}
            lineJitter={0.1}
            scanGlow={0.5}
            scanSoftness={2}
            enableWebcam={false}
            showPreview={false}
          />
        </div>

        {/* ── Overlay vignette so text is readable ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, rgba(3,7,18,0.6) 100%)',
          }}
        />

        {/* ── Centered content ── */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center py-20">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#FF9FFC]/30 bg-[#FF9FFC]/5 text-[#FF9FFC] text-xs font-semibold uppercase tracking-widest mb-10">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF9FFC] animate-pulse" />
            Recherche d&apos;Alternance 2025
          </div>

          {/* Name — StrokeText: draw stroke then fill wipe */}
          <h1 className="sr-only">Mohammed BENRABAH — Apprenti Ingénieur Éco-Énergétique</h1>
          <div style={{ width: '100%' }} className="mb-2">
            <StrokeText
              text="Mohammed BENRABAH"
              strokeColor="#A78BFA"
              fillColor="#F8FAFC"
              strokeWidth={1.4}
              drawDuration={1.6}
              fillDelay={0.2}
              stagger={0.05}
              ease="power2.out"
              trigger="mount"
              fillMode="wipe"
              fontSize={128}
              fontWeight={800}
              letterSpacing={-4}
              reverse={false}
            />
          </div>

          {/* Speciality */}
          <div className="flex items-center gap-4 mb-8">
            <span
              className="h-px w-16"
              style={{ background: 'linear-gradient(to right, transparent, #FF9FFC)' }}
            />
            <p className="text-base sm:text-lg lg:text-xl text-slate-300 font-medium tracking-wide">
              Apprenti Ingénieur Éco-Énergétique &amp; CVC
            </p>
            <span
              className="h-px w-16"
              style={{ background: 'linear-gradient(to left, transparent, #FF9FFC)' }}
            />
          </div>

          {/* Short description */}
          <p className="text-slate-400 text-sm sm:text-base max-w-xl leading-relaxed mb-10">
            Spécialisé en{' '}
            <span className="text-white font-semibold">génie climatique</span>,{' '}
            <span className="text-white font-semibold">énergies renouvelables</span> et{' '}
            <span className="text-white font-semibold">efficacité énergétique</span>.{' '}
            En alternance chez{' '}
            <span style={{ color: '#FF9FFC' }} className="font-semibold">CITY CLIM</span>{' '}
            &amp; <span style={{ color: '#FF9FFC' }} className="font-semibold">UPJV Amiens</span>.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-semibold text-sm text-white transition-all duration-300 hover:scale-105 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #c084fc, #FF9FFC)',
                boxShadow: '0 0 32px rgba(255,159,252,0.3)',
              }}
            >
              <Mail size={16} />
              Me Contacter
            </a>
            <a
              href="#experiences"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-semibold text-sm text-slate-200 border border-slate-700/60 bg-slate-950/50 hover:border-[#FF9FFC]/40 hover:text-white transition-all duration-300 hover:scale-105"
              style={{ backdropFilter: 'blur(8px)' }}
            >
              <Briefcase size={16} />
              Mon Parcours
            </a>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-12 w-12 rounded-2xl border border-slate-700/60 bg-slate-950/50 text-slate-300 hover:text-[#FF9FFC] hover:border-[#FF9FFC]/40 transition-all duration-300 hover:scale-105"
              style={{ backdropFilter: 'blur(8px)' }}
              title="LinkedIn"
            >
              <LinkedinIcon size={18} />
            </a>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {[
              { label: 'Amiens · Paris · Oujda', icon: <MapPin size={12} className="text-[#FF9FFC]" /> },
              { label: 'CVC · Audit Énergétique', icon: <Thermometer size={12} className="text-[#FF9FFC]" /> },
              { label: '+500 relations LinkedIn', icon: <GraduationCap size={12} className="text-[#FF9FFC]" /> },
            ].map((tag) => (
              <span
                key={tag.label}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-slate-400 border border-slate-800/60 bg-slate-950/50"
                style={{ backdropFilter: 'blur(8px)' }}
              >
                {tag.icon}
                {tag.label}
              </span>
            ))}
          </div>

          {/* Stats bar */}
          <div
            className="w-full max-w-lg grid grid-cols-3 gap-4 text-center py-6 px-4 rounded-3xl border border-slate-800/60"
            style={{ background: 'rgba(3,7,18,0.6)', backdropFilter: 'blur(12px)' }}
          >
            {[
              { value: '4', label: 'Stages', color: '#FF9FFC' },
              { value: '2', label: 'Diplômes', color: '#c084fc' },
              { value: '+500', label: 'LinkedIn', color: '#818cf8' },
            ].map((s, i) => (
              <div key={s.label} className={`flex flex-col gap-1 ${i === 1 ? 'border-x border-slate-800/60' : ''}`}>
                <span className="text-3xl font-extrabold" style={{ color: s.color }}>{s.value}</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Scroll hint ── */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1" style={{ opacity: 0.5 }}>
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-[#FF9FFC] to-transparent animate-bounce" />
        </div>
      </section>


      {/* Main Sections Wrapper */}
      <main className="flex-1 bg-slate-950 py-16 space-y-24">
        
        {/* About Section */}
        <section id="presentation" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
          
          {/* Section Header */}
          <div className="flex flex-col items-center gap-4 text-center mb-16 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-xs font-semibold uppercase tracking-widest mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse" />
              À Propos
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
              L'Ingénierie au service de <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-[#FF9FFC] to-purple-400" style={{ backgroundSize: '200% auto', animation: 'gradientMove 5s linear infinite' }}>
                la Transition Écologique
              </span>
            </h2>
            <div className="mt-4 h-1 w-24 bg-gradient-to-r from-transparent via-[#FF9FFC] to-transparent rounded-full opacity-50" />
          </div>

          <div className="grid lg:grid-cols-12 gap-8 relative z-10">
            
            {/* Left Main Card */}
            <div className="lg:col-span-7 flex flex-col h-full group">
              <div className="relative h-full p-8 md:p-10 rounded-3xl border border-slate-700/60 bg-slate-900/40 backdrop-blur-xl overflow-hidden transition-all duration-500 hover:border-purple-500/50 hover:bg-slate-900/60 hover:shadow-[0_0_40px_rgba(167,139,250,0.15)] flex flex-col justify-center">
                
                {/* Decorative background glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-purple-500/20 transition-colors duration-500" />
                
                <h3 className="text-2xl font-bold text-white mb-6 relative">
                  Mon Objectif <span className="text-[#FF9FFC]">Professionnel</span>
                </h3>
                
                <div className="space-y-6 text-slate-300 leading-relaxed text-base md:text-lg relative">
                  <p>
                    En tant qu'apprenti ingénieur éco-énergétique, je combine une <strong className="text-white font-semibold">rigueur théorique</strong> avec de solides bases en diagnostic et étude.
                  </p>
                  <p>
                    Ayant réalisé plusieurs stages opérationnels dans l'installation et la maintenance <strong className="text-purple-300 font-semibold">CVC (Chauffage, Ventilation, Climatisation)</strong>, ainsi que dans l'audit industriel, j'apporte une double compétence pratique et analytique essentielle pour appréhender les systèmes énergétiques complexes.
                  </p>
                  <p>
                    Je recherche activement une alternance me permettant de concevoir et d'intégrer des technologies de pointe pour l'efficacité énergétique, en participant à la <strong className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9FFC] to-purple-400 font-bold">réduction concrète de l'empreinte carbone</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Cards Stack */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              {/* Domain 1 */}
              <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-md flex gap-4 transition-all hover:translate-x-2 hover:border-[#FF9FFC]/30 hover:bg-slate-800/80">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                  <Thermometer className="text-emerald-400" size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-1">Génie Climatique</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">CVC, réseaux fluides, conception, climatisation et systèmes de ventilation intelligents.</p>
                </div>
              </div>

              {/* Domain 2 */}
              <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-md flex gap-4 transition-all hover:translate-x-2 hover:border-[#FF9FFC]/30 hover:bg-slate-800/80">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center shrink-0 border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
                  <Zap className="text-cyan-400" size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-1">Efficacité Énergétique</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">Diagnostic énergétique, audit d'installations tertiaires et industrielles, plans de comptage.</p>
                </div>
              </div>

              {/* Domain 3 */}
              <div className="p-6 rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-md flex gap-4 transition-all hover:translate-x-2 hover:border-[#FF9FFC]/30 hover:bg-slate-800/80">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center shrink-0 border border-purple-500/20 shadow-[0_0_20px_rgba(167,139,250,0.1)]">
                  <Wind className="text-purple-400" size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-1">Transition Écologique</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">Intégration de solutions renouvelables, décarbonation et optimisation des ressources.</p>
                </div>
              </div>

              {/* CV Download CTA */}
              <a 
                href="#contact" 
                className="group relative mt-2 w-full p-[1px] rounded-2xl overflow-hidden cursor-pointer"
              >
                {/* Animated gradient border */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-[#FF9FFC] to-purple-500 opacity-70 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundSize: '200% auto', animation: 'gradientMove 3s linear infinite' }} />
                
                <div className="relative w-full h-full bg-slate-950 px-6 py-4 rounded-[15px] flex items-center justify-between transition-colors group-hover:bg-slate-900">
                  <span className="font-semibold text-white group-hover:text-[#FF9FFC] transition-colors">Télécharger mon CV (PDF)</span>
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                    <ChevronRight size={18} className="text-slate-400 group-hover:text-[#FF9FFC] group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              </a>

            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experiences" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
          <div className="flex flex-col gap-4 text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Expériences & Stages
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-teal-500 to-cyan-500 mx-auto rounded-full" />
            <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base">
              Mon parcours technique sur le terrain à travers des projets en France et au Maroc.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative border-l border-slate-800 ml-4 md:ml-32 space-y-12">
            {experiences.map((exp, index) => {
              const IconComp = exp.icon;
              return (
                <div key={index} className="relative pl-8 md:pl-12 group">
                  {/* Timeline Dot */}
                  <span className="absolute -left-3 top-1.5 h-6 w-6 rounded-full bg-slate-950 border-2 border-teal-500 flex items-center justify-center timeline-dot">
                    <IconComp size={12} className="text-teal-400" />
                  </span>

                  {/* Left Floating Info (Desktop only) */}
                  <div className="hidden md:block absolute -left-36 top-1.5 w-28 text-right">
                    <span className="text-xs font-semibold text-teal-400 block">{exp.type}</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">{exp.period.split("·")[0]}</span>
                  </div>

                  {/* Experience Card */}
                  <Card className="hover:border-teal-500/25 transition-all">
                    <CardContent className="pt-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <div>
                          <span className="md:hidden text-xs font-semibold text-teal-400 bg-teal-950/40 border border-teal-800/40 px-2 py-0.5 rounded-full mr-2">
                            {exp.type}
                          </span>
                          <h3 className="text-lg font-bold text-white inline-block">{exp.role}</h3>
                          <div className="text-sm font-semibold text-slate-300 mt-1 flex items-center gap-2">
                            <span>{exp.company}</span>
                            <span className="text-slate-600">•</span>
                            <span className="text-xs text-slate-400 font-normal">{exp.location.split("·")[0]}</span>
                          </div>
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-1.5 sm:text-right shrink-0">
                          <Calendar size={13} className="text-slate-500" />
                          <span>{exp.period}</span>
                        </div>
                      </div>

                      <p className="text-slate-300 text-sm leading-relaxed mb-4">
                        {exp.description}
                      </p>

                      <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-900">
                        {exp.skills.map((s, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800/80"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </section>

        {/* Education Section */}
        <section id="formations" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
          <div className="flex flex-col gap-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Cursus Académique
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto rounded-full" />
            <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base">
              Mes études supérieures spécialisées en efficacité énergétique et génie climatique.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {education.map((edu, index) => (
              <Card key={index} className="flex flex-col justify-between border-glow relative overflow-hidden group">
                {/* Visual light accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-cyan-500 opacity-60" />
                
                <CardContent className="pt-8 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block">
                          {edu.period}
                        </span>
                        <h3 className="text-xl font-bold text-white mt-1 group-hover:text-cyan-400 transition-colors">
                          {edu.degree}
                        </h3>
                        <p className="text-sm text-slate-300 font-medium mt-1">
                          {edu.specialization}
                        </p>
                      </div>
                      <span className="h-12 w-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                        <GraduationCap className="text-cyan-400" size={24} />
                      </span>
                    </div>

                    <p className="text-slate-300 text-sm leading-relaxed mt-4">
                      {edu.description}
                    </p>
                  </div>

                  <div className="mt-8 pt-4 border-t border-slate-900/60 flex items-center justify-between text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1">
                      <MapPin size={13} className="text-slate-500" />
                      {edu.location}
                    </span>
                    <span className="text-teal-400 font-bold">{edu.institution.split("(")[0].trim()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Skills Section */}
        <section id="competences" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
          <div className="flex flex-col gap-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Compétences Techniques
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-emerald-500 to-cyan-500 mx-auto rounded-full" />
            <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base">
              Mes habilitations, spécialisations techniques et maîtrise des outils industriels.
            </p>
          </div>

          {/* Skill Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                activeCategory === "all"
                  ? "bg-teal-500/10 border-teal-500 text-teal-400"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
              }`}
            >
              Toutes
            </button>
            <button
              onClick={() => setActiveCategory("technical")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                activeCategory === "technical"
                  ? "bg-teal-500/10 border-teal-500 text-teal-400"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
              }`}
            >
              Génie Climatique & Énergie
            </button>
            <button
              onClick={() => setActiveCategory("tools")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                activeCategory === "tools"
                  ? "bg-teal-500/10 border-teal-500 text-teal-400"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
              }`}
            >
              Logiciels & CAO
            </button>
            <button
              onClick={() => setActiveCategory("languages")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                activeCategory === "languages"
                  ? "bg-teal-500/10 border-teal-500 text-teal-400"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
              }`}
            >
              Langues
            </button>
          </div>

          {/* Skills Grid */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
                {filteredSkills.map((skill, index) => (
                  <div key={index} className="flex flex-col gap-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-slate-200">{skill.name}</span>
                      <span className="text-xs text-teal-400 font-mono">{skill.level}%</span>
                    </div>
                    {/* Progress Bar Container */}
                    <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800/40">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Contact Section */}
        <section id="contact" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
          <div className="flex flex-col gap-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Entrer en Contact
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full" />
            <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base">
              Une proposition d'alternance ou des questions techniques ? Écrivez-moi directement !
            </p>
          </div>

          <Card className="relative overflow-hidden">
            <CardContent className="pt-8">
              {formSubmitted ? (
                <div className="flex flex-col items-center justify-center text-center py-12 px-4 animate-fade-in">
                  <div className="h-16 w-16 bg-teal-500/10 border border-teal-500/30 rounded-2xl flex items-center justify-center mb-6">
                    <CheckCircle2 size={32} className="text-teal-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Message envoyé avec succès !</h3>
                  <p className="text-slate-300 text-sm max-w-sm">
                    Merci pour votre intérêt, Mohammed BENRABAH vous répondra dans les plus brefs délais.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="name" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Nom Complet
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={formState.name}
                        onChange={handleInputChange}
                        placeholder="Ex: Jean Dupont"
                        className="w-full h-11 px-4 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500/60 focus:ring-1 focus:ring-teal-500/30 transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="email" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Adresse E-mail
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        value={formState.email}
                        onChange={handleInputChange}
                        placeholder="Ex: jean.dupont@entreprise.com"
                        className="w-full h-11 px-4 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500/60 focus:ring-1 focus:ring-teal-500/30 transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="subject" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Objet
                    </label>
                    <input
                      type="text"
                      name="subject"
                      id="subject"
                      required
                      value={formState.subject}
                      onChange={handleInputChange}
                      placeholder="Ex: Proposition d'alternance - Assistant Ingénieur CVC"
                      className="w-full h-11 px-4 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500/60 focus:ring-1 focus:ring-teal-500/30 transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="message" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Message
                    </label>
                    <textarea
                      name="message"
                      id="message"
                      rows={5}
                      required
                      value={formState.message}
                      onChange={handleInputChange}
                      placeholder="Votre message..."
                      className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-teal-500/60 focus:ring-1 focus:ring-teal-500/30 transition-all resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full h-12 inline-flex items-center justify-center px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-sm font-semibold text-white shadow-lg shadow-teal-500/10 hover:shadow-teal-500/20 active:scale-98 transition-all"
                    >
                      <Send size={16} className="mr-2" />
                      Envoyer le Message
                    </button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center font-bold text-sm text-white shadow-md shadow-teal-500/10">
              MB
            </span>
            <span className="text-sm font-medium text-slate-400">
              &copy; {new Date().getFullYear()} Mohammed BENRABAH. Tous droits réservés.
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm text-slate-500">
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-colors flex items-center gap-1">
              <LinkedinIcon size={14} />
              LinkedIn
            </a>
            <span className="text-slate-800">|</span>
            <span className="flex items-center gap-1">
              Conçu pour l'Éco-Énergie
              <Zap size={12} className="text-emerald-400" />
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
