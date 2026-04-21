import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/coupang/header";
import { Footer } from "@/components/coupang/footer";
import { Leaf, Sparkles, Rocket, ShieldCheck, Heart, Package } from 'lucide-react';

// ─── LANGUAGE CONTENT ────────────────────────────────────────────────────────
const content = {
  en: {
    langLabel: "EN",
    badge: "100% Korean Domestic Grade",
    heroLine1: "The Authentic",
    heroLine2: "Korean Beauty",
    heroLine3: "Secret,",
    heroLine4: "Delivered to Your Doorstep!",
    heroIntro:
      "Hello and welcome! We are Samee and Sandu. Having lived in South Korea for several years, we've had the privilege of experiencing firsthand the secrets behind the radiant, healthy skin of the Korean people. Driven by a passion to share these high-quality products with our loved ones in Sri Lanka, we founded",
    heroIntroHighlight: ' "Samee and Sandu K-Beauty Secret."',
    commitmentTitle: "Our Exclusive Commitment",
    commitmentSubtitle: "The Korean Domestic Standard",
    commitmentBody:
      "Many companies manufacture products specifically for export markets at lower cost for wholesale distribution — and may not meet the stringent health regulations required within South Korea. At Samee and Sandu K-Beauty Secret, every product we source is different.",
    pillars: [
      {
        icon: <Leaf className="w-8 h-8 text-white" />,
        title: "Korean Domestic Grade",
        body: "Formulated for South Korean consumers, adhering to the strictest standards set by MFDS/KFDA.",
      },
      {
        icon: <Sparkles className="w-8 h-8 text-white" />,
        title: "Quality Over Cost",
        body: "Superior ingredient concentrations and efficacy — not mass-produced export versions.",
      },
      {
        icon: <Rocket className="w-8 h-8 text-white" />,
        title: "Direct Sourcing",
        body: "We live in Korea and source directly from official stores and pharmacies recommended by local specialists.",
      },
    ],
    whyTitle: "Why Choose Us?",
    whyItems: [
      {
        icon: <ShieldCheck className="w-7 h-7 text-[#E4405F]" />,
        title: "100% Authenticity",
        body: "Every item is original, sourced directly from official Korean manufacturers and authorized retailers.",
      },
      {
        icon: <Heart className="w-7 h-7 text-[#E4405F]" />,
        title: "Expert Curation",
        body: "We only introduce products that our family — especially Sandu and our daughter — personally use and trust.",
      },
      {
        icon: <Package className="w-7 h-7 text-[#E4405F]" />,
        title: "Direct Delivery",
        body: "No middlemen. Premium quality maintained from Korea straight to your hands in Sri Lanka.",
      },
    ],
    visionTitle: "Our Vision",
    visionBody:
      "Our mission is to move away from low-cost, mass-produced export items and provide you with the exact premium beauty secrets that Koreans use themselves — helping you achieve a healthier, more radiant lifestyle through the true standard of Korean excellence.",
    visionCta: "Experience the True Korean Standard with us today!",
    meetTitle: "Meet the Founders",
    meetBody: "Real people. Real experiences. Real Korean beauty — brought to your doorstep with love.",
    founderNames: "Samee & Sandu",
    founderRole: "Founders · K-Beauty Curators · Living in South Korea",
    founderQuote: '"Living in Korea changed us — and we want to share that secret with you."',
    familyTitle: "Our Family",
    familyLocation: "Sri Lanka · South Korea",
    familyQuote: '"Our daughter uses these products too — so we are absolutely certain about the quality."',
    shopNow: "Shop Now",
  },

  si: {
    langLabel: "සිං",
    badge: "100% කොරියානු දේශීය ශ්රේණිය",
    heroLine1: "සැබෑ",
    heroLine2: "කොරියානු රූපලාවන්ය",
    heroLine3: "රහස",
    heroLine4: "ඔබේ දෑතට!",
    heroIntro:
      "ආයුබෝවන්! අපි Samee සහ Sandu. වසර කිහිපයක සිට දකුණු කොරියාවේ පදිංචිව සිටින අපට, කොරියානු වැසියන්ගේ නිරෝගී සහ දීප්තිමත් සමේ රහස සමීපව අත්දැකීමට අවස්ථාව ලැබුණා. ඒ සැබෑ අත්දැකීම සහ කොරියාවේ උසස්ම නිෂ්පාදන ලංකාවේ ආදරණීයයන්ට ලබාදීමේ අරමුණින් ආරම්භ කළා",
    heroIntroHighlight: ' "Samee and Sandu K-Beauty Secret."',
    commitmentTitle: "අපේ සුවිශේෂී වගකීම",
    commitmentSubtitle: "කොරියානු දේශීය ප්රමිතිය",
    commitmentBody:
      "බොහෝ සමාගම් විදේශ වෙළඳපොළ ඉලක්ක කර අඩු පිරිවැයකින් නිෂ්පාදන සිදු කරයි. ඒවා කොරියානු රජයේ දැඩි සෞඛ්ය ප්රමිතීන්ට යටත් නොවිය හැකිය. Samee and Sandu K-Beauty Secret වෙතින් ඔබ ලබාගන්නා සෑම නිෂ්පාදනයක්ම වෙනස්.",
    pillars: [
      {
        icon: <Leaf className="w-8 h-8 text-white" />,
        title: "කොරියානු ජාතිකයන් සඳහාම",
        body: "KFDA හි දැඩි අධීක්ෂණය යටතේ නිපදවන ලද ඉහළම ගුණාත්මක නිෂ්පාදන.",
      },
      {
        icon: <Sparkles className="w-8 h-8 text-white" />,
        title: "ගුණාත්මක බව ප්රාමුඛ",
        body: "අඩු පිරිවැයකින් නිපදවන නිෂ්පාදනවලට වඩා ඉතා ඉහළ අමුද්රව්ය ගුණාත්මකභාවය.",
      },
      {
        icon: <Rocket className="w-8 h-8 text-white" />,
        title: "සෘජු ප්රභව",
        body: "කොරියාවේ හොඳම රෝහල් සහ විශේෂඥයන් නිර්දේශ කරන නිෂ්පාදන සෘජුවම.",
      },
    ],
    whyTitle: "අපි විශේෂ වෙන්නේ ඇයි?",
    whyItems: [
      {
        icon: <ShieldCheck className="w-7 h-7 text-[#E4405F]" />,
        title: "100% Authentic",
        body: "කොරියාවේ නිල අලෙවිසැල්වලින් සෘජුවම ලබාගන්නා බවට වගකීම සහතික කරමු.",
      },
      {
        icon: <Heart className="w-7 h-7 text-[#E4405F]" />,
        title: "Expert Curation",
        body: "සඳූ සහ අපේ දූ පැංචි පෞද්ගලිකව භාවිතා කර ගුණාත්මක බව අත්විඳි නිෂ්පාදන පමණක්.",
      },
      {
        icon: <Package className="w-7 h-7 text-[#E4405F]" />,
        title: "Direct Delivery",
        body: "අතරමැදියන් නොමැතිව කොරියාවේ සිට සෘජුවම ඔබ අතට.",
      },
    ],
    visionTitle: "අපේ දැක්ම",
    visionBody:
      "අඩු පිරිවැයකින් නිපදවන සාමාන්ය නිෂ්පාදන වෙනුවට, කොරියානු වැසියන් සැබෑ ලෙසම පාවිච්චි කරන ඒ උසස්ම රූපලාවන්ය රහස් ලංකාවට ලබා දී, ඔබවත් දීප්තිමත් සහ සෞඛ්ය සම්පන්න පුද්ගලයෙකු බවට පත් කිරීම.",
    visionCta: "සැබෑ කොරියානු ප්රමිතිය අත්විඳීමට අදම අප හා එක්වන්න!",
    meetTitle: "නිර්මාතෘවරුන් හමුවෙමු",
    meetBody: "සැබෑ අත්දැකීම. සැබෑ කොරියානු රූපලාවන්ය — ආදරයෙන් ඔබ අතට.",
    founderNames: "Samee සහ Sandu",
    founderRole: "නිර්මාතෘවරුන් · K-Beauty විශේෂඥයන් · දකුණු කොරියාවේ",
    founderQuote: '"කොරියාවේ ජීවිතය අප වෙනස් කළා — ඒ රහස ඔබ සමඟ බෙදාගැනීමට ආශාව ඇත."',
    familyTitle: "අපේ පවුල",
    familyLocation: "ශ්රී ලංකාව · දකුණු කොරියාව",
    familyQuote: '"අපේ දූ පැංචි ද මෙම නිෂ්පාදන භාවිතා කරන නිසා, ගුණාත්මකභාවය ගැන අපි නිශ්චිතයි."',
    shopNow: "දැන් සොයා ගන්න",
  },

  ta: {
    langLabel: "தமிழ்",
    badge: "100% கொரிய உள்நாட்டுத் தரம்",
    heroLine1: "உண்மையான",
    heroLine2: "கொரிய அழகுக் கலை",
    heroLine3: "இரகசியம்",
    heroLine4: "இப்போது உங்கள் கைகளில்!",
    heroIntro:
      "வணக்கம்! நாம் சமி மற்றும் சந்தூ. கடந்த சில வருடங்களாகத் தென்கொரியாவில் வசித்து வரும் எமக்கு, கொரிய மக்களின் ஆரோக்கியமான சருமத்தின் இரகசியத்தை கண்டறியும் வாய்ப்பு கிடைத்தது. அந்த அனுபவத்தை இலங்கையில் உள்ள எமது அன்புக்குரியவர்களிடம் கொண்டு சேர்க்கும் நோக்குடன் ஆரம்பித்தோம்",
    heroIntroHighlight: ' "Samee and Sandu K-Beauty Secret."',
    commitmentTitle: "எமது பிரத்யேக உறுதிமொழி",
    commitmentSubtitle: "கொரிய உள்நாட்டுத் தரம்",
    commitmentBody:
      "பல நிறுவனங்கள் வெளிநாட்டுச் சந்தைகளை இலக்காகக் கொண்டு குறைந்த செலவில் தயாரிப்புகளை மேற்கொள்கின்றன. இவை கொரிய சுகாதாரத் தரக்கட்டுப்பாடுகளுக்கு உட்படுத்தப்படுவதில்லை. Samee and Sandu K-Beauty Secret மூலம் ஒவ்வொரு தயாரிப்பும் வித்தியாசமானது.",
    pillars: [
      {
        icon: <Leaf className="w-8 h-8 text-white" />,
        title: "கொரிய மக்களுக்காகவே",
        body: "KFDA கடுமையான கண்காணிப்பு மற்றும் சட்டத் தரங்களுக்கு அமையத் தயாரிக்கப்பட்டவை.",
      },
      {
        icon: <Sparkles className="w-8 h-8 text-white" />,
        title: "தரத்திற்கு முன்னுரிமை",
        body: "குறைந்த செலவில் ஏற்றுமதிக்காகத் தயாரிக்கப்படும் தயாரிப்புகளை விட மிக உயர்வான மூலப்பொருட்கள்.",
      },
      {
        icon: <Rocket className="w-8 h-8 text-white" />,
        title: "நேரடி கொள்வனவு",
        body: "இங்குள்ள சிறந்த வைத்தியசாலைகள் பரிந்துரைக்கும் தயாரிப்புகளை நேரடியாகப் பெறுகிறோம்.",
      },
    ],
    whyTitle: "நாம் ஏன் தனித்துவமானவர்கள்?",
    whyItems: [
      {
        icon: <ShieldCheck className="w-7 h-7 text-[#E4405F]" />,
        title: "100% உண்மையானது",
        body: "கொரியாவின் உத்தியோகபூர்வ விற்பனை நிலையங்களிலிருந்து நேரடியாகப் பெற்றுக்கொள்ளப்பட்டவை.",
      },
      {
        icon: <Heart className="w-7 h-7 text-[#E4405F]" />,
        title: "நிபுணத்துவத் தெரிவு",
        body: "எமது குடும்பத்தினர் தனிப்பட்ட முறையில் பயன்படுத்தி தரத்தை உணர்ந்த தயாரிப்புகள் மட்டுமே.",
      },
      {
        icon: <Package className="w-7 h-7 text-[#E4405F]" />,
        title: "நேரடி விநியோகம்",
        body: "இடைத்தரகர்கள் இன்றி கொரியாவிலிருந்து நேரடியாக உங்களிடம்.",
      },
    ],
    visionTitle: "எமது நோக்கம்",
    visionBody:
      "குறைந்த செலவில் ஏற்றுமதிக்காகத் தயாரிக்கப்படும் சாதாரண தயாரிப்புகளுக்குப் பதிலாக, கொரிய மக்கள் உண்மையாகவே பயன்படுத்தும் உயர்தர அழகுக் கலை இரகசியங்களை இலங்கைக்குக் கொண்டு வந்து உங்களையும் ஆரோக்கியமான ஒருவராக மாற்றுவதே எமது நோக்கம்.",
    visionCta: "உண்மையான கொரியத் தரத்தை அனுபவிக்க இன்றே எமுடன் இணையுங்கள்!",
    meetTitle: "நிறுவனர்களை சந்தியுங்கள்",
    meetBody: "உண்மையான அனுபவம். உண்மையான கொரிய அழகு — அன்புடன் உங்கள் கைகளில்.",
    founderNames: "சமி மற்றும் சந்தூ",
    founderRole: "நிறுவனர்கள் · K-Beauty நிபுணர்கள் · தென்கொரியாவில் வசிக்கின்றோம்",
    founderQuote: '"கொரியாவில் வாழ்க்கை எம்மை மாற்றியது — அந்த இரகசியத்தை உங்களுடன் பகிர்ந்துகொள்ள விரும்புகிறோம்."',
    familyTitle: "எமது குடும்பம்",
    familyLocation: "இலங்கை · தென்கொரியா",
    familyQuote: '"எமது மகளும் இந்தத் தயாரிப்புகளை பயன்படுத்துவதால், தரம் பற்றி நாம் நிச்சயமாக இருக்கிறோம்."',
    shopNow: "இப்போது கண்டறியுங்கள்",
  },
};

// ─── IMAGES — replace with your Cloudinary URLs ──────────────────────────────
const GALLERY_IMAGES = [
  "/gallery/Youtube photo.jpg.jpeg",
  "/gallery/IMG_2117 copy.jpg.jpeg",
  "/gallery/IMG_2328 copy.jpg.jpeg",
  "/gallery/IMG_2393 copy.jpg.jpeg",
  "/gallery/IMG_2514 copy.jpg.jpeg",
  "/gallery/IMG_2767 copy.jpg.jpeg",
  "/gallery/IMG_5547.JPG.jpeg",
  "/gallery/IMG_5550.JPG.jpeg"
];
const HERO_BG_IMAGE   = "/gallery/Youtube photo.jpg.jpeg";
const VISION_BG_IMAGE = "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1600&q=80";

// ─── COMPONENT ───────────────────────────────────────────────────────────────
export default function AboutPage() {
  const [lang, setLang] = useState("en");
  const t = content[lang];

  return (
    <div className="font-sans bg-gray-50 text-gray-900 overflow-x-hidden">
      <Header />

      {/* ── LANGUAGE SWITCHER ── */}
      <div className="sticky top-0 z-50 flex justify-end gap-2 px-6 py-3 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        {["en", "si", "ta"].map((l) => (
          <button
            key={l}
            onClick={() => setLang(l)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest border transition-all duration-200 font-sans cursor-pointer
              ${lang === l
                ? "bg-[#E4405F] text-white border-[#E4405F] shadow-sm"
                : "bg-transparent text-gray-600 border-gray-300 hover:bg-gray-100"
              }`}
          >
            {content[l].langLabel}
          </button>
        ))}
      </div>

      {/* ── HERO ── */}
      <section className="relative min-h-[75vh] flex items-center overflow-hidden">
        <img
          src={HERO_BG_IMAGE}
          alt="K-Beauty"
          className="absolute inset-0 w-full h-full object-cover brightness-[0.5]"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/30 to-transparent" />
        <div className="relative z-10 max-w-2xl px-8 py-24" style={{ marginLeft: "clamp(1.5rem, 8vw, 8rem)" }}>
          <span className="inline-block px-4 py-1.5 mb-6 rounded-full text-xs tracking-[0.15em] uppercase font-sans font-semibold text-white border border-white/30 bg-[#E4405F]/80">
            {t.badge}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight mb-6">
            {t.heroLine1}
            <br />
            {t.heroLine2}
            <br />
            {t.heroLine3}
            <br />
            <span className="italic text-[#ffced6]">{t.heroLine4}</span>
          </h1>
          <p className="text-base md:text-lg text-white/80 leading-relaxed max-w-xl">
            {t.heroIntro}
            <strong className="text-white ml-1">{t.heroIntroHighlight}</strong>
          </p>
        </div>
      </section>

      {/* ── GALLERY SECTION ── */}
      <section className="py-20 px-0 bg-white overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 mb-12 text-center">
          <p className="text-xs font-sans font-bold tracking-[0.2em] uppercase text-[#E4405F] mb-2">
            {t.meetTitle}
          </p>
          <p className="text-gray-500 text-lg leading-relaxed max-w-xl mx-auto">
            {t.meetBody}
          </p>
        </div>

        {/* Scrolling Gallery */}
        <div className="relative w-full flex overflow-hidden group">
          <style>
            {`
              @keyframes scroll {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .animate-marquee {
                display: flex;
                width: max-content;
                animation: scroll 40s linear infinite;
              }
              .group-hover\\:pause-animation:hover .animate-marquee {
                animation-play-state: paused;
              }
            `}
          </style>
          
          {/* Gradient Masks for smooth fading at the edges */}
          <div className="absolute top-0 bottom-0 left-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <div className="group-hover:pause-animation flex w-full">
            <div className="animate-marquee gap-6 px-3">
              {/* Double the array for seamless looping */}
              {[...GALLERY_IMAGES, ...GALLERY_IMAGES].map((img, idx) => (
                <div key={idx} className="w-[260px] md:w-[320px] h-[340px] md:h-[420px] flex-shrink-0 rounded-2xl overflow-hidden shadow-sm border border-gray-100 transition-transform duration-500 hover:scale-[1.03] cursor-pointer">
                  <img src={img} alt="Gallery item" className="w-full h-full object-cover hover:brightness-110 transition-all duration-300" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── OUR COMMITMENT ── */}
      <section className="py-20 px-6 bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-sans font-bold tracking-[0.2em] uppercase text-gray-400 mb-2">
            {t.commitmentTitle}
          </p>
          <h2 className="text-3xl md:text-4xl font-light text-white mb-5 leading-snug">
            {t.commitmentSubtitle}
          </h2>
          <p className="text-white/65 text-base leading-relaxed max-w-2xl mb-12">
            {t.commitmentBody}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {t.pillars.map((p, i) => (
              <div key={i} className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mb-5">
                  {p.icon}
                </div>
                <h4 className="text-white font-semibold text-base mb-3 leading-snug">{p.title}</h4>
                <p className="text-white/60 text-sm leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-sans font-bold tracking-[0.2em] uppercase text-[#E4405F] mb-10 text-center">
            {t.whyTitle}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-7">
            {t.whyItems.map((w, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 text-center border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
              >
                <div className="w-14 h-14 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto mb-5">
                  {w.icon}
                </div>
                <h4 className="font-semibold text-gray-900 text-base mb-2">{w.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{w.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VISION BANNER ── */}
      <section className="relative min-h-[480px] flex items-center justify-center overflow-hidden text-center">
        <img
          src={VISION_BG_IMAGE}
          alt="Vision"
          className="absolute inset-0 w-full h-full object-cover brightness-[0.2]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/90" />
        <div className="relative z-10 max-w-2xl px-8 py-20">
          <h2 className="text-3xl md:text-4xl font-light text-white mb-5 leading-snug">
            {t.visionTitle}
          </h2>
          <p className="text-white/75 text-base leading-loose mb-5">{t.visionBody}</p>
          <p className="text-gray-300 italic text-sm leading-relaxed mb-10">{t.visionCta}</p>
          <Link
            to="/"
            className="inline-block px-10 py-3.5 rounded-full bg-[#E4405F] text-white font-sans font-semibold text-sm tracking-widest uppercase shadow-lg hover:shadow-[#E4405F]/40 hover:scale-105 transition-all duration-200"
          >
            {t.shopNow}
          </Link>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
