import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Ban, BedDouble, CalendarDays, CalendarX, Car, Check, ChevronDown, Clock3, CloudLightning, CloudSun, Coffee, CreditCard, Droplets, Mail, MapPin, Menu, Mountain, Phone, Quote, Shield, Sparkles, Star, Utensils, Users, Wifi, Wind, X } from 'lucide-react';

const plans = [
  { code: 'EP', name: 'European Plan', detail: 'Room only — no meals included', price: 2300, short: 'Room only' },
  { code: 'CP', name: 'Continental Plan', detail: 'Room + Breakfast', price: 2800, short: '+ Breakfast' },
  { code: 'MAP', name: 'Modified American Plan', detail: 'Room + Breakfast + Dinner', price: 3500, short: '+ Breakfast & dinner' },
  { code: 'AP', name: 'American Plan', detail: 'Room + All Meals (Breakfast, Lunch & Dinner)', price: 4000, short: 'All meals' },
];

const rooms = [
  {
    id: '01',
    title: 'Deluxe Comfort Room',
    description: 'Perfect for solo travelers or couples seeking a cozy, elegant space. Features premium bedding, en-suite bathroom, and beautiful views of the surrounding greenery.',
    image: '/images/deluxe-room.webp',
    alt: 'Deluxe Comfort Room with queen bed, warm wood floors and a sitting area',
    features: ['Queen Bed', 'En-suite Bathroom', 'Garden View', 'Smart TV'],
  },
  {
    id: '02',
    title: 'Deluxe Plus Comfort Room',
    bookingName: 'Deluxe Comfort Room with View',
    description: 'Enjoy all the elegance of our Deluxe Comfort Room with the added luxury of stunning panoramic hillside views. Wake up to breathtaking scenery from your private vantage point.',
    image: '/images/mountain-room.webp',
    alt: 'Deluxe Plus Comfort Room with a bright queen bed and hillside views',
    features: ['Queen Bed', 'En-suite Bathroom', 'Panoramic Hill View', 'Smart TV'],
  },
];

const amenities = [
  { icon: Wifi, title: 'High-Speed WiFi' },
  { icon: Car, title: 'Secure Parking' },
  { icon: Wind, title: 'Air Conditioning' },
  { icon: Droplets, title: '24/7 Hot Water' },
  { icon: Coffee, title: 'Room Service' },
  { icon: Shield, title: '24/7 Security' },
  { icon: Utensils, title: 'In-house Dining' },
  { icon: Users, title: 'Concierge' },
];

// These are the fourteen entries and captions from the previous gallery, including its repeated views.
const photos = [
  { src: '/images/villa-exterior.webp', label: 'Exterior' },
  { src: '/images/lobby-lounge.webp', label: 'Dining' },
  { src: '/images/villa-garden.webp', label: 'Outside' },
  { src: '/images/villa-terrace.webp', label: 'Exterior' },
  { src: '/images/villa-courtyard.webp', label: 'Exterior' },
  { src: '/images/villa-exterior.webp', label: 'View' },
  { src: '/images/mountain-room.webp', label: 'Family Suite' },
  { src: '/images/deluxe-room.webp', label: 'Deluxe' },
  { src: '/images/suite.webp', label: 'Bathroom' },
  { src: '/images/lobby.webp', label: 'Lobby' },
  { src: '/images/lobby-dining.webp', label: 'Lobby' },
  { src: '/images/interior.webp', label: 'View' },
  { src: '/images/bathroom-ensuite.webp', label: 'Bathroom' },
  { src: '/images/suite.webp', label: 'Reception' },
];

const cancellationPolicies = [
  { icon: CreditCard, title: 'Advance Payment', text: '50% advance payment is required at the time of booking. This amount is non-refundable.' },
  { icon: Clock3, title: 'Balance Payment', text: 'The remaining 50% must be paid at least 8 days prior to your arrival date.' },
  { icon: CalendarX, title: 'Cancellation > 7 Days', text: 'Cancellations made more than 7 days before arrival will incur a 50% cancellation charge.' },
  { icon: Ban, title: 'Cancellation ≤ 7 Days', text: 'Cancellations within 7 days of arrival will be charged 100% of the booking amount.' },
  { icon: CalendarDays, title: 'Early Departure', text: 'No refund will be provided for early check-out or unused services during the stay.' },
  { icon: CloudLightning, title: 'External Circumstances', text: 'No refund for cancellations due to weather, road blockages, or other external factors.' },
];

const reviews = [
  { name: 'Arun & Meera Nair', location: 'Kochi, Kerala', date: 'February 2025', rating: 5, stay: 'Honeymoon Stay · EP Plan', initials: 'AM', text: "Absolutely magical experience! The room was immaculate, the views breathtaking, and the staff went above and beyond to make our honeymoon unforgettable. The personalized service made all the difference. We'll be back every anniversary." },
  { name: 'Rajesh Pillai', location: 'Bangalore, Karnataka', date: 'January 2025', rating: 5, stay: 'Weekend Getaway · AP Plan', initials: 'RP', text: 'A truly world-class experience at a very reasonable price. The all-meals plan was fantastic — the home-style Kerala food was exceptional. The staff remembered our preferences from day one. Highly recommend the Executive Suite.' },
  { name: 'Suresh & Family', location: 'Chennai, Tamil Nadu', date: 'December 2024', rating: 5, stay: 'Family Vacation · MAP Plan', initials: 'SF', text: 'We stayed in the Deluxe Comfort Room with View and it was perfect. Spacious, clean, and the kids loved the greenery and fresh air. The management was incredibly helpful with everything. Will be bringing the whole family again!' },
  { name: 'Priya Menon', location: 'Hyderabad, Telangana', date: 'November 2024', rating: 5, stay: 'Solo Retreat · CP Plan', initials: 'PM', text: 'I came here to disconnect, and Villa Jeevanam delivered exactly that. Peaceful, private, and luxurious without being pretentious. The breakfast was fresh and delicious every morning. The staff gave me all the space I needed — perfect.' },
  { name: 'Thomas & Anita George', location: 'Pune, Maharashtra', date: 'October 2024', rating: 5, stay: 'Anniversary Stay · AP Plan', initials: 'TA', text: 'We celebrated our 25th anniversary here and it was beyond our expectations. The team arranged a surprise candle-lit dinner for us without us even asking. Exceptional attention to detail from check-in to check-out.' },
  { name: 'Hari Krishnan', location: 'Trivandrum, Kerala', date: 'September 2024', rating: 4, stay: 'Business Trip · EP Plan', initials: 'HK', text: 'Stayed here for a short work trip and was pleasantly surprised. The WiFi was reliable, the room was quiet, and the check-in was seamless. The location is beautiful. The only minor thing — the coffee could be stronger! Otherwise excellent.' },
  { name: 'Divya & Sathish Kumar', location: 'Coimbatore, Tamil Nadu', date: 'August 2024', rating: 5, stay: 'Weekend Stay · MAP Plan', initials: 'DS', text: 'What a gem! The rooms are elegant, the food is outstanding, and the views are absolutely stunning. We loved every meal — especially the dinner. The staff is warm and attentive. This place sets the bar very high.' },
  { name: 'Anoop Mathew', location: 'Dubai, UAE', date: 'July 2024', rating: 5, stay: 'Vacation · AP Plan', initials: 'AN', text: "Flew in specifically to stay at Villa Jeevanam after a recommendation from a friend, and I wasn't disappointed. The all-inclusive plan is incredible value. The nature, the silence, the food — everything was perfect. A true escape." },
];

const fade = { hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } } };

function Reveal({ children, className = '', delay = 0 }) {
  const reduce = useReducedMotion();
  return <motion.div className={className} variants={fade} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} transition={{ delay }} style={reduce ? { opacity: 1, y: 0 } : undefined}>{children}</motion.div>;
}

function Brand({ inverse = false }) {
  return <a href="/" className={`brand ${inverse ? 'brand-inverse' : ''}`} aria-label="Jeevanam Villa home"><img className="brand-symbol" src="/images/jeevanam-logo.png" alt="" /><span className="brand-copy"><span>JEEVANAM</span><small>VILLA · LEH</small></span></a>;
}

function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  useEffect(() => {
    let cancelled = false;
    const loadWeather = async () => {
      try {
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=34.1526&longitude=77.5771&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&timezone=Asia%2FKolkata');
        if (!response.ok) throw new Error('Weather unavailable');
        const data = await response.json();
        if (!cancelled) setWeather(data.current);
      } catch { if (!cancelled) setWeather(null); }
    };
    loadWeather();
    const timer = window.setInterval(loadWeather, 15 * 60 * 1000);
    return () => { cancelled = true; window.clearInterval(timer); };
  }, []);
  const code = weather?.weather_code;
  const condition = code === 0 ? 'Clear' : code === 1 ? 'Mostly clear' : code === 2 ? 'Partly cloudy' : code === 3 ? 'Overcast' : [45, 48].includes(code) ? 'Fog' : [51, 53, 55, 56, 57].includes(code) ? 'Drizzle' : [61, 63, 65, 66, 67, 80, 81, 82].includes(code) ? 'Rain' : [71, 73, 75, 77, 85, 86].includes(code) ? 'Snow' : [95, 96, 99].includes(code) ? 'Thunderstorms' : 'Local conditions';
  const label = weather ? `${Math.round(weather.temperature_2m)}°C · ${condition} · feels like ${Math.round(weather.apparent_temperature)}°C` : 'Weather loading';
  return <div className="weather-widget" aria-label={`Current weather for Leh, Ladakh: ${label}`} title={`Current weather · Open-Meteo${weather ? ` · Feels like ${Math.round(weather.apparent_temperature)}°C · Wind ${Math.round(weather.wind_speed_10m)} km/h` : ''}`}>
    <CloudSun size={17} aria-hidden="true" /><span className="weather-place">LEH, LADAKH</span><strong>{weather ? `${Math.round(weather.temperature_2m)}°` : '—°'}</strong><span className="weather-condition">{weather ? condition : 'Current weather'}</span>
  </div>;
}

function Navigation() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 40); window.addEventListener('scroll', onScroll, { passive: true }); onScroll(); return () => window.removeEventListener('scroll', onScroll); }, []);
  useEffect(() => { document.body.classList.toggle('menu-open', open); return () => document.body.classList.remove('menu-open'); }, [open]);
  const links = [['Home', '/'], ['Rooms', '/rooms'], ['Rates', '/rates'], ['Experiences', '/experiences'], ['Reviews', '/reviews'], ['Location', '/location']];
  return <>
    <header className={`nav-shell ${scrolled ? 'is-scrolled' : ''}`}><nav className="nav-inner" aria-label="Main navigation"><Brand /><div className="nav-links">{links.map(([label, href]) => <a href={href} key={href} className={window.location.pathname.replace(/\/$/, '') === href.replace(/\/$/, '') ? 'is-active' : undefined} aria-current={window.location.pathname.replace(/\/$/, '') === href.replace(/\/$/, '') ? 'page' : undefined}>{label}</a>)}</div><div className="nav-actions"><WeatherWidget /><a className="nav-book" href="/book">Book your stay <ArrowUpRight size={15} /></a></div><button className="menu-toggle" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'}>{open ? <X /> : <Menu />}</button></nav></header>
    <AnimatePresence>{open && <motion.div className="mobile-menu" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }}><div className="mobile-menu-top"><Brand /><button className="menu-toggle" onClick={() => setOpen(false)} aria-label="Close menu"><X /></button></div><div className="mobile-menu-links">{links.map(([label, href], i) => <motion.a key={href} href={href} onClick={() => setOpen(false)} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>{label}<ArrowUpRight size={20} /></motion.a>)}<a href="/book" onClick={() => setOpen(false)} className="mobile-cta">Plan your stay <ArrowUpRight size={18} /></a></div><p className="mobile-note">A little closer to the mountains. <span>Leh, Ladakh</span></p></motion.div>}</AnimatePresence>
  </>;
}

function Hero() {
  const heroRef = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.14]);
  return <section className="hero" id="home"><motion.div ref={heroRef} className="hero-photo" style={{ y: reduce ? 0 : imageY, scale: reduce ? 1 : imageScale }} role="img" aria-label="Jeevanam Villa's traditional stone and timber façade under a blue Ladakh sky"><video className="hero-video" src="/videos/jeevanam-villa.mp4" poster="/images/villa-exterior.webp" autoPlay muted loop playsInline preload="metadata" aria-hidden="true" onCanPlay={(event) => event.currentTarget.classList.add('is-ready')} onError={(event) => event.currentTarget.classList.add('video-unavailable')} /></motion.div><div className="hero-scrim" /><div className="hero-grain" /><div className="hero-content"><motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.16 }} className="eyebrow hero-eyebrow"><span className="eyebrow-mark" /> WELCOME TO LEH</motion.div><motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}>A little closer<br />to the <em>mountains.</em></motion.h1><motion.p className="hero-intro" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.42 }}>A premium villa nestled in the hills of Ladakh —<br className="desktop-only" /> where nature meets refined hospitality.</motion.p><motion.div className="hero-actions" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.55 }}><a className="button button-light" href="/book">Book your stay <ArrowUpRight size={17} /></a><a className="hero-quiet-link" href="/rooms">Explore both rooms <ArrowDown size={15} /></a></motion.div></div><div className="hero-caption"><span>34°08′51″N&nbsp; 77°34′25″E</span><span>LEH, LADAKH · 3,500M ABOVE SEA LEVEL</span></div><div className="hero-side-note"><span className="side-line" /> TAKE THE SCENIC ROUTE</div><motion.a className="hero-scroll" href="/#story" aria-label="Scroll to discover" animate={{ y: [0, 7, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}><ArrowDown size={18} /></motion.a></section>;
}

function Intro() {
  return <>
    <section className="stats-strip"><div className="stats-inner">{[{ value: '20', label: 'Premium rooms' }, { value: '4+', label: 'Meal plans' }, { value: '5★', label: 'Guest rating' }].map((item, i) => <Reveal key={item.label} delay={i * 0.07}><div className="stat"><strong>{item.value}</strong><span>{item.label}</span></div></Reveal>)}</div></section>
    <section className="intro section-pad" id="story"><div className="intro-top"><Reveal><span className="eyebrow"><span className="eyebrow-mark" /> A PLACE TO FIND YOUR BEARINGS</span></Reveal><Reveal delay={0.08}><span className="intro-coordinate">LEH, LADAKH<br />INDIA · 194101</span></Reveal></div><Reveal className="intro-title-wrap"><h2 className="intro-title">A sanctuary designed<br />for <em>comfort & calm.</em></h2></Reveal><div className="intro-bottom"><Reveal><blockquote className="story-quote">“We travel, some of us forever, to seek other states, other lives, other souls.” <span>— Anaïs Nin</span></blockquote><p>We heartily welcome you to our villa. If you choose to spend your holidays with us, we promise a lifetime memory.</p><p>Jeevanam Villa waits for explorers and travellers to experience the mystifying land and people of Ladakh. Just 5 minutes from the Airport and 1.5 km from the Main Leh Market, we welcome you to experience the local hospitality and simplicity.</p></Reveal><Reveal delay={0.1}><a className="text-link" href="/rooms">Explore our rooms <ArrowUpRight size={16} /></a></Reveal></div></section>
  </>;
}

function Stay() {
  return <section className="stay-section section-pad" id="rooms"><div className="rooms-heading"><Reveal><span className="eyebrow"><span className="eyebrow-mark" /> ACCOMMODATIONS · 20 ROOMS</span><h2>Find your kind<br />of <em>comfortable.</em></h2></Reveal><Reveal delay={0.1}><p>Two thoughtfully designed room styles, each with the details that make a high-altitude stay feel easy. Choose a cosy garden outlook or wake to open hillside views.</p></Reveal></div><div className="rooms-list">{rooms.map((room, i) => <Reveal key={room.id} delay={i * 0.08} className={`room-card room-card-${i + 1}`}><div className="room-image"><img src={room.image} alt={room.alt} loading="lazy" /><span className="room-number">ROOM {room.id}</span><span className="room-image-caption">JEEVANAM VILLA · LEH</span></div><div className="room-copy"><span className="room-kicker">{i === 0 ? 'A QUIET PLACE TO LAND' : 'WAKE UP TO THE HILLS'}</span><h3>{room.title}</h3><p className="room-alias">{room.bookingName ? 'Also listed for booking as “Deluxe Comfort Room with View”.' : 'A considered stay for solo travellers and couples.'}</p><p className="room-description">{room.description}</p><div className="room-features">{room.features.map((feature) => <span key={feature}><Check size={13} /> {feature}</span>)}</div><a className="text-link" href={`/book?room=${encodeURIComponent(room.bookingName || room.title)}`}>Reserve this room <ArrowUpRight size={16} /></a></div></Reveal>)}</div></section>;
}

function Amenities() {
  return <section className="amenities-section section-pad" id="amenities"><div className="section-head"><Reveal><span className="eyebrow"><span className="eyebrow-mark" /> THOUGHTFUL DETAILS</span><h2>Everything you need.<br /><em>Nothing you don’t.</em></h2></Reveal><Reveal delay={0.1}><p>Settle in and find your rhythm. These are the comforts and services included in a Jeevanam stay.</p></Reveal></div><div className="amenities-grid">{amenities.map(({ icon: Icon, title }, i) => <Reveal key={title} delay={(i % 4) * 0.05}><article className="amenity-card"><div className="amenity-icon"><Icon size={21} strokeWidth={1.35} /></div><span className="amenity-index">0{i + 1}</span><h3>{title}</h3><span className="amenity-rule" /></article></Reveal>)}</div></section>;
}

function MealPlans() {
  const extraBed = [900, 1120, 1400, 1600];
  const childNoBed = [500, 700, 1000, 1200];
  return <section className="plans-section section-pad" id="tariff"><div className="plans-heading"><Reveal><span className="eyebrow"><span className="eyebrow-mark" /> TARIFF & PLANS</span><h2>Good days.<br /><em>Good meals.</em></h2></Reveal><Reveal delay={0.1}><p>Choose the meal plan that suits your stay. All rates are per room, per night.</p></Reveal></div><div className="plans-grid">{plans.map((plan, i) => <Reveal key={plan.code} delay={i * 0.05}><article className={`plan-card ${i === 1 ? 'plan-featured' : ''}`}><span className="plan-code">{plan.code}</span><h3>{plan.name}</h3><p>{plan.detail}</p><div className="plan-price"><span>₹</span>{plan.price.toLocaleString('en-IN')}<small> / night</small></div><a href={`/book?plan=${plan.code}`}>Choose this plan <ArrowUpRight size={14} /></a></article></Reveal>)}</div><Reveal className="rates-table-wrap"><div className="rates-table-title"><div><span className="eyebrow"><span className="eyebrow-mark" /> STANDARD ROOM · PER NIGHT RATES</span><h3>Room rates & family stays</h3></div><span className="rates-badge">INR · ₹</span></div><div className="rates-overflow"><table className="rates-table"><thead><tr><th>Category</th><th>EP <small>Room Only</small></th><th>CP <small>+ Breakfast</small></th><th>MAP <small>+ B&amp;D</small></th><th>AP <small>All Meals</small></th></tr></thead><tbody><tr><th>Room Rate</th>{plans.map((p) => <td key={p.code}>₹{p.price.toLocaleString('en-IN')}</td>)}</tr><tr><th>Extra Bed <small>Child 5–12 yrs</small></th>{extraBed.map((v, i) => <td key={i}>₹{v.toLocaleString('en-IN')}</td>)}</tr><tr><th>Child Without Bed <small>5–12 yrs</small></th>{childNoBed.map((v, i) => <td key={i}>₹{v.toLocaleString('en-IN')}</td>)}</tr><tr><th>Child Below 5 Yrs</th><td colSpan="4"><span className="complimentary">Complimentary</span></td></tr></tbody></table></div><div className="tariff-notes"><span><Check size={14} /> Applicable GST extra on all rates</span><span><Clock3 size={14} /> Tariff lists check-in / check-out: 08:00 AM</span><span><CreditCard size={14} /> Valid government ID required at check-in</span></div></Reveal><p className="plans-note">Guide rates from the supplied tariff. Please contact us to confirm current pricing and availability.</p></section>;
}

function Cancellation() {
  return <section className="policy-section section-pad"><div className="section-head"><Reveal><span className="eyebrow"><span className="eyebrow-mark" /> BEFORE YOU CONFIRM</span><h2>Our cancellation<br /><em>policy.</em></h2></Reveal><Reveal delay={0.1}><p>Please review the original payment and cancellation terms before confirming a booking.</p></Reveal></div><div className="policy-grid">{cancellationPolicies.map(({ icon: Icon, title, text }, i) => <Reveal key={title} delay={(i % 3) * 0.05}><article className="policy-card"><div className="policy-icon"><Icon size={18} /></div><span className="policy-index">0{i + 1}</span><h3>{title}</h3><p>{text}</p></article></Reveal>)}</div><Reveal><div className="policy-note"><Sparkles size={17} /><p>By proceeding with a booking, guests acknowledge and agree to the above cancellation and payment terms. For special circumstances, please contact us at <a href="tel:+919797982421">+91 97979 82421</a>.</p></div></Reveal></section>;
}

function LocalLife() {
  return <section className="local-section"><div className="local-image" role="img" aria-label="Jeevanam Villa's traditional timber and stone exterior in Leh" /><div className="local-copy"><Reveal><span className="eyebrow eyebrow-light"><span className="eyebrow-mark" /> OUT HERE, TIME HAS A DIFFERENT FEELING</span><h2>Come for the<br /><em>wide-open.</em><br />Stay for the little things.</h2><p>Prayer flags in the breeze. Sun spilling over the courtyard. A story shared over dinner. We’re here to help you find the parts of Leh you’ll carry home with you.</p><a className="text-link text-link-light" href="/experiences#gallery">A peek around the villa <ArrowUpRight size={16} /></a></Reveal></div><span className="local-index">LADAKH, AT ITS OWN PACE <span>·</span> 34°08′N</span></section>;
}

function Gallery() {
  const [selected, setSelected] = useState(-1);
  const current = photos[selected];
  useEffect(() => {
    if (selected < 0) return;
    const onKey = (event) => { if (event.key === 'Escape') setSelected(-1); if (event.key === 'ArrowRight') setSelected((s) => (s + 1) % photos.length); if (event.key === 'ArrowLeft') setSelected((s) => (s + photos.length - 1) % photos.length); };
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
  }, [selected]);
  return <section className="gallery-section section-pad" id="gallery"><div className="section-head"><Reveal><span className="eyebrow"><span className="eyebrow-mark" /> VISUAL JOURNEY</span><h2>Little moments.<br /><em>Big horizons.</em></h2></Reveal><Reveal delay={0.1}><p>A glimpse into life at Villa Jeevanam — from elegant interiors to the villa and views around it.</p></Reveal></div><div className="gallery-grid">{photos.map((photo, i) => <Reveal key={`${photo.src}-${i}`} delay={(i % 4) * 0.04} className={`gallery-card gallery-card-${i + 1}`}><button className="gallery-photo" onClick={() => setSelected(i)} aria-label={`View ${photo.label} photo ${i + 1}`}><img src={photo.src} alt={`${photo.label} at Villa Jeevanam`} loading="lazy" /><span className="gallery-open"><ArrowUpRight size={20} /></span><span className="gallery-label">{photo.label}</span></button><div className="gallery-card-meta"><span>{photo.label}</span><span>{String(i + 1).padStart(2, '0')}</span></div></Reveal>)}</div><div className="gallery-foot"><span>14 PHOTOS · AROUND JEEVANAM <span className="sun-dot">✳</span></span><a className="text-link" href="/book">Come see for yourself <ArrowUpRight size={16} /></a></div>
    <AnimatePresence>{selected >= 0 && current && <motion.div className="lightbox" role="dialog" aria-modal="true" aria-label="Villa Jeevanam photo gallery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(-1)}><div className="lightbox-top"><div><span>{current.label}</span><small>{selected + 1} / {photos.length}</small></div><button className="lightbox-close" aria-label="Close photo" onClick={() => setSelected(-1)}><X /></button></div><button className="lightbox-arrow lightbox-prev" aria-label="Previous photo" onClick={(e) => { e.stopPropagation(); setSelected((selected + photos.length - 1) % photos.length); }}><ArrowLeft /></button><motion.img key={`${current.src}-${selected}`} src={current.src} alt={`${current.label} at Villa Jeevanam`} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} onClick={(e) => e.stopPropagation()} /><button className="lightbox-arrow lightbox-next" aria-label="Next photo" onClick={(e) => { e.stopPropagation(); setSelected((selected + 1) % photos.length); }}><ArrowRight /></button><div className="lightbox-thumbs">{photos.map((photo, i) => <button key={`${photo.src}-${i}`} onClick={(e) => { e.stopPropagation(); setSelected(i); }} className={i === selected ? 'is-selected' : ''} aria-label={`Show ${photo.label} photo ${i + 1}`}><img src={photo.src} alt="" /></button>)}</div></motion.div>}</AnimatePresence>
  </section>;
}

function StarRow({ rating, size = 14 }) {
  return <div className="review-stars" aria-label={`${rating} out of 5 stars`}>{[1, 2, 3, 4, 5].map((n) => <Star key={n} size={size} className={n <= rating ? 'star-filled' : 'star-empty'} />)}</div>;
}

function Reviews() {
  return <section className="reviews-section section-pad" id="reviews"><div className="section-head"><Reveal><span className="eyebrow"><span className="eyebrow-mark" /> WHAT GUESTS SAY</span><h2>Good stays.<br /><em>Good stories.</em></h2></Reveal><Reveal delay={0.1}><p>Hear from the guests who have experienced Villa Jeevanam's hospitality firsthand.</p></Reveal></div><Reveal className="home-testimonial"><div className="review-stars">{[1, 2, 3, 4, 5].map((n) => <Star size={16} key={n} className="star-filled" />)}</div><blockquote>“An absolutely magical experience. The rooms are immaculate, the food is incredible, and the staff makes you feel like family. Will definitely return.”</blockquote><span>— Arun &amp; Meera, Honeymoon Guests</span></Reveal><Reveal className="rating-panel"><div className="rating-score"><strong>4.9</strong><StarRow rating={5} size={18} /><span>8 verified reviews</span></div><div className="rating-breakdown">{[5, 4, 3, 2, 1].map((stars) => { const count = stars === 5 ? 7 : stars === 4 ? 1 : 0; return <div className="rating-line" key={stars}><span>{stars}</span><Star size={11} className="star-filled" /><div><motion.i initial={{ width: 0 }} whileInView={{ width: `${count / reviews.length * 100}%` }} viewport={{ once: true }} transition={{ duration: 0.85 }} /></div><span>{count}</span></div>; })}</div><div className="rating-badges">{[['Service', 'Excellent'], ['Cleanliness', 'Spotless'], ['Food', 'Outstanding'], ['Value', 'Great']].map(([a, b]) => <div key={a}><strong>{b}</strong><span>{a}</span></div>)}</div></Reveal><div className="reviews-grid">{reviews.map((review, i) => <Reveal key={review.initials} delay={(i % 2) * 0.06}><article className="review-card"><div className="review-card-top"><div className="review-person"><span className={`review-avatar avatar-${i + 1}`}>{review.initials}</span><div><h3>{review.name}</h3><span>{review.location}</span></div></div><div className="review-rating"><StarRow rating={review.rating} /><time>{review.date}</time></div></div><span className="review-stay">{review.stay}</span><div className="review-copy"><Quote size={19} /><p>{review.text}</p></div></article></Reveal>)}</div><Reveal className="reviews-cta"><div className="review-stars">{[1, 2, 3, 4, 5].map((n) => <Star size={19} key={n} className="star-filled" />)}</div><h3>Ready to create your own story?</h3><p>Join our growing family of happy guests. Book your stay at Villa Jeevanam today.</p><a className="button button-dark" href="/book">Book your stay <ArrowUpRight size={16} /></a></Reveal></section>;
}

function Explore() {
  const cards = [
    { title: 'Our Rooms', text: 'Explore our carefully designed rooms — from cozy deluxe suites to spacious family havens.', href: '/rooms', image: '/images/mountain-room.webp', number: '01' },
    { title: 'Photo Gallery', text: 'A visual journey through Villa Jeevanam — interiors, dining, views, and more.', href: '/experiences#gallery', image: '/images/lobby-dining.webp', number: '02' },
    { title: 'Guest Reviews', text: 'Hear what our guests have to say about their stay at Villa Jeevanam.', href: '/reviews#reviews', image: '/images/villa-terrace.webp', number: '03' },
  ];
  return <section className="explore-section section-pad"><div className="section-head"><Reveal><span className="eyebrow"><span className="eyebrow-mark" /> DISCOVER</span><h2>Explore Villa<br /><em>Jeevanam.</em></h2></Reveal></div><div className="explore-grid">{cards.map((card, i) => <Reveal key={card.number} delay={i * 0.07}><a href={card.href} className="explore-card"><div className="explore-image"><img src={card.image} alt="" loading="lazy" /><span>{card.number}</span></div><h3>{card.title} <ArrowUpRight size={16} /></h3><p>{card.text}</p><span className="explore-link">Explore <ArrowRight size={14} /></span></a></Reveal>)}</div></section>;
}

function Details() {
  const details = [{ icon: Clock3, label: 'CHECK-IN · CONTACT PAGE', value: '09:00 AM' }, { icon: Clock3, label: 'CHECK-IN · TARIFF PAGE', value: '08:00 AM' }, { icon: MapPin, label: 'GETTING HERE', value: '5 min from Leh Airport' }, { icon: Mountain, label: 'LEH MARKET', value: '1.5 km away' }];
  return <section className="details-section"><div className="details-lead"><Reveal><span className="eyebrow eyebrow-light"><span className="eyebrow-mark" /> GOOD TO KNOW BEFORE YOU GO</span><h2>The easy<br /><em>bits.</em></h2></Reveal></div><div className="details-grid">{details.map((item, i) => <Reveal key={item.label} delay={i * 0.05}><div className="detail-card"><item.icon size={19} strokeWidth={1.5} /><span>{item.label}</span><p>{item.value}</p></div></Reveal>)}</div></section>;
}

function Location() {
  const mapSrc = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13207.614530750294!2d77.5549853!3d34.1488075!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38fd9550fe2bc215%3A0x8694eebb24659e9d!2sJeevanam%20Villa%20Leh!5e0!3m2!1sen!2sin!4v1774618559008!5m2!1sen!2sin';
  return <section className="location-section section-pad" id="location"><Reveal><span className="eyebrow"><span className="eyebrow-mark" /> YOUR BASE IN THE MOUNTAINS</span></Reveal><div className="location-grid"><Reveal><h2>Close to town.<br /><em>A world away.</em></h2><p className="body-copy">Jeevanam Villa is on GH Road, Skara Yokma, Leh, Ladakh — just 5 minutes from the airport and 1.5 km from the main market. We’ll help you get settled in.</p><div className="location-meta"><span><MapPin size={16} /> GH Road, Skara Yokma<br />Leh, Ladakh 194101, India</span><a className="text-link" href="https://maps.google.com/?q=Jeevanam+Villa+Leh" target="_blank" rel="noreferrer">Open in Maps <ArrowUpRight size={16} /></a></div></Reveal><Reveal delay={0.12}><div className="map-embed"><iframe src={mapSrc} title="Jeevanam Villa Leh location map" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen /><a className="map-link" href="https://maps.google.com/?q=Jeevanam+Villa+Leh" target="_blank" rel="noreferrer">Open the map <ArrowUpRight size={15} /></a></div><p className="map-note">Jeevanam Villa Leh · 34°08′51″N, 77°34′25″E</p></Reveal></div></section>;
}

const priceFor = (code) => plans.find((p) => p.code === code)?.price || 0;
const extraBedFor = { EP: 900, CP: 1120, MAP: 1400, AP: 1600 };
const childRateFor = { EP: 500, CP: 700, MAP: 1000, AP: 1200 };
const nightsBetween = (checkIn, checkOut) => checkIn && checkOut ? Math.max(0, Math.round((new Date(`${checkOut}T00:00:00`).getTime() - new Date(`${checkIn}T00:00:00`).getTime()) / 86400000)) : 0;
const fmtDate = (value) => value ? new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';

function Booking() {
  const [sent, setSent] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [booking, setBooking] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedRoom = params.get('room') || '';
    const requestedPlan = params.get('plan') || '';
    const validRoom = rooms.some((room) => (room.bookingName || room.title) === requestedRoom) ? requestedRoom : '';
    const validPlan = plans.some((plan) => plan.code === requestedPlan) ? requestedPlan : '';
    return { name: '', phone: '', email: '', roomType: validRoom, plan: validPlan, numRooms: '', adults: '', children512: '0', childrenBelow5: '0', extraBed: 'no', checkIn: '', checkOut: '', requests: '' };
  });
  const today = new Date().toISOString().split('T')[0];
  const nights = nightsBetween(booking.checkIn, booking.checkOut);
  const estimatedTotal = useMemo(() => booking.plan && nights > 0 ? (priceFor(booking.plan) * (Number(booking.numRooms) || 1) + (booking.extraBed === 'yes' ? extraBedFor[booking.plan] : 0) + childRateFor[booking.plan] * Number(booking.children512 || 0)) * nights : null, [booking.plan, booking.numRooms, booking.extraBed, booking.children512, nights]);

  useEffect(() => {
    const selectPlan = (event) => setBooking((current) => ({ ...current, plan: event.detail }));
    const selectRoom = (event) => setBooking((current) => ({ ...current, roomType: event.detail }));
    window.addEventListener('jeevanam:select-plan', selectPlan);
    window.addEventListener('jeevanam:select-room', selectRoom);
    return () => { window.removeEventListener('jeevanam:select-plan', selectPlan); window.removeEventListener('jeevanam:select-room', selectRoom); };
  }, []);

  const update = (event) => setBooking((current) => ({ ...current, [event.target.name]: event.target.value, ...(event.target.name === 'checkIn' ? { checkOut: '' } : {}) }));
  const submit = async (event) => {
    event.preventDefault();
    const plan = plans.find((item) => item.code === booking.plan);
    const message = [
      'New Booking Request - Villa Jeevanam', '',
      `Name: ${booking.name || '-'}`, `Phone: ${booking.phone || '-'}`, `Email: ${booking.email || '-'}`, '',
      `Room Type: ${booking.roomType || '-'}`, `Plan: ${plan ? `${plan.code} - ${plan.name} (${plan.detail})` : '-'}`, `Rooms: ${booking.numRooms || '-'}`, '',
      `Adults: ${booking.adults || '-'}`, `Children (5-12): ${booking.children512 || '0'}`, `Children (<5): ${booking.childrenBelow5 || '0'}`, `Extra Bed: ${booking.extraBed === 'yes' ? 'Yes' : 'No'}`, '',
      `Check-in: ${fmtDate(booking.checkIn)}`, `Check-out: ${fmtDate(booking.checkOut)}`, ...(nights ? [`Duration: ${nights} night${nights === 1 ? '' : 's'}`] : []), '', `Special Request: ${booking.requests || '-'}`,
    ].join('\n');
    window.open(`https://wa.me/919797982421?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    setSent(true);
    try {
      const response = await fetch('/api/send-booking', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...booking, nights, estimatedTotal }) });
      const result = await response.json();
      setEmailSent(Boolean(response.ok && result.success));
    } catch { setEmailSent(false); }
  };
  const reset = () => { setSent(false); setEmailSent(false); setBooking({ name: '', phone: '', email: '', roomType: '', plan: '', numRooms: '', adults: '', children512: '0', childrenBelow5: '0', extraBed: 'no', checkIn: '', checkOut: '', requests: '' }); };
  const select = (name, label, values, placeholder = 'Select') => <label>{label}<span className="select-wrap"><ChevronDown size={15} /><select name={name} value={booking[name]} onChange={update} required={name !== 'children512' && name !== 'childrenBelow5'}><option value="" disabled>{placeholder}</option>{values.map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select></span></label>;
  return <section className="booking-section" id="book"><div className="booking-text"><Reveal><span className="eyebrow eyebrow-light"><span className="eyebrow-mark" /> REACH OUT · RESERVATIONS</span><h2>Let's get you<br /><em>up here.</em></h2><p>Rooms are available year-round. Choose your dates and plan, and send us a reservation request. Our team will contact you to confirm the details.</p><div className="contact-details"><a href="tel:+919797982421"><Phone size={17} /><span><small>CALL US · MON–SUN, 7 AM–10 PM</small><strong>+91 97979 82421</strong></span></a><a href="mailto:villajeevanam@gmail.com"><Mail size={17} /><span><small>EMAIL US · WE REPLY WITHIN 24 HOURS</small><strong>villajeevanam@gmail.com</strong></span></a><div><MapPin size={17} /><span><small>FIND US</small><strong>GH Road, Skara Yokma · Leh, Ladakh 194101</strong></span></div></div><a className="whatsapp-contact" href="https://wa.me/919797982421" target="_blank" rel="noreferrer"><MessageIcon /><span><strong>Chat on WhatsApp</strong><small>Quick response — usually within minutes · +91 97979 82421</small></span><ArrowUpRight size={16} /></a></Reveal></div>
    <Reveal delay={0.1} className="booking-form-wrap"><form className="booking-form" onSubmit={submit}><AnimatePresence mode="wait">{sent ? <motion.div key="success" className="booking-success" initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}><div className="success-mark"><Check size={25} /></div><span className="form-kicker">YOUR DETAILS ARE READY</span><h3>Thank you, {booking.name.split(' ')[0]}.</h3><p>WhatsApp is opening with the full booking request. Our team will confirm your room, plan and dates.</p><div className="success-status"><span><MessageIcon /> WhatsApp request prepared</span><span><Mail size={15} /> {emailSent ? 'Booking email sent to hotel' : 'Email delivery is available when the booking service is configured'}</span></div><button type="button" className="text-link" onClick={reset}>Submit another booking <ArrowUpRight size={15} /></button></motion.div> : <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><div className="form-header"><div><span className="form-kicker">A FEW DETAILS TO GET STARTED</span><h3>Book your stay</h3></div><span className="form-star">✳</span></div><div className="form-section-title"><Users size={14} /><span>GUEST INFORMATION</span></div><div className="form-fields"><label>Full Name *<input name="name" value={booking.name} onChange={update} placeholder="Your full name" autoComplete="name" required minLength="2" /></label><label>Phone Number *<input name="phone" value={booking.phone} onChange={update} type="tel" placeholder="+91 98765 43210" autoComplete="tel" required minLength="10" /></label><label className="field-wide">Email <small>(optional)</small><input name="email" value={booking.email} onChange={update} type="email" placeholder="you@example.com" autoComplete="email" /></label></div><div className="form-divider" /><div className="form-section-title"><BedDouble size={14} /><span>ROOM & PLAN</span></div><div className="form-fields">{select('roomType', 'Room Type *', [['Deluxe Comfort Room', 'Deluxe Comfort Room'], ['Deluxe Comfort Room with View', 'Deluxe Comfort Room with View']])}{select('plan', 'Meal Plan *', plans.map((p) => [p.code, `${p.code} — ${p.short} (₹${p.price.toLocaleString('en-IN')}/night)`]))}{select('numRooms', 'Number of Rooms *', [1, 2, 3, 4, 5].map((n) => [String(n), `${n} Room${n > 1 ? 's' : ''}`]))}{select('adults', 'Adults *', Array.from({ length: 10 }, (_, i) => [String(i + 1), `${i + 1} Adult${i ? 's' : ''}`]))}{select('children512', 'Children (5–12 yrs)', Array.from({ length: 6 }, (_, i) => [String(i), `${i} Child${i === 1 ? '' : 'ren'}`]))}{select('childrenBelow5', 'Children (below 5 yrs)', Array.from({ length: 6 }, (_, i) => [String(i), `${i} Child${i === 1 ? '' : 'ren'}`]))}<div className="field-wide extra-bed-field"><span>Extra Bed Required?</span><div className="extra-bed-choice">{[['no', 'No extra bed'], ['yes', 'Yes, add extra bed']].map(([value, label]) => <label className={booking.extraBed === value ? 'selected' : ''} key={value}><input type="radio" name="extraBed" value={value} checked={booking.extraBed === value} onChange={update} />{label}</label>)}</div></div></div><div className="form-divider" /><div className="form-section-title"><CalendarDays size={14} /><span>YOUR DATES</span></div><div className="form-fields"><label>Check-in Date *<input name="checkIn" type="date" value={booking.checkIn} onChange={update} min={today} required /></label><label>Check-out Date *<input name="checkOut" type="date" value={booking.checkOut} onChange={update} min={booking.checkIn || today} required /></label></div><AnimatePresence>{estimatedTotal !== null && estimatedTotal > 0 && <motion.div className="estimate-panel" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}><div><span>ESTIMATED TOTAL</span><small>{nights} night{nights > 1 ? 's' : ''} · {plans.find((p) => p.code === booking.plan)?.name}{booking.extraBed === 'yes' ? ' · + extra bed' : ''}</small></div><strong>₹{estimatedTotal.toLocaleString('en-IN')}<small>+ applicable GST</small></strong></motion.div>}</AnimatePresence><div className="form-divider" /><label className="requests-label">Special Requests <small>(optional)</small><textarea name="requests" value={booking.requests} onChange={update} placeholder="Dietary needs, accessibility requirements, celebration arrangements..." /></label><button className="button button-dark form-submit" type="submit">Send booking request <ArrowUpRight size={17} /></button><div className="booking-advance"><CreditCard size={14} /><p>50% advance is required to confirm. Our team will contact you shortly to complete the reservation.</p></div><p className="form-small">Your request opens WhatsApp with all booking details. Email notification is also supported on the deployed booking service.</p></motion.div>}</AnimatePresence></form></Reveal>
  </section>;
}

function Footer() {
  return <footer className="footer"><div className="footer-top"><div><Brand inverse /><p className="footer-blurb">A little closer to the mountains.<br />A little more like home.</p></div><div className="footer-nav"><div><span>EXPLORE</span><a href="/#story">The villa</a><a href="/rooms">Rooms & tariff</a><a href="/rooms#amenities">Amenities</a><a href="/experiences#gallery">Gallery</a><a href="/reviews#reviews">Reviews</a><a href="/location#location">Find us</a></div><div><span>SAY HELLO</span><a href="tel:+919797982421">+91 97979 82421</a><a href="mailto:villajeevanam@gmail.com">villajeevanam@gmail.com</a><a href="https://wa.me/919797982421" target="_blank" rel="noreferrer">WhatsApp us <ArrowUpRight size={13} /></a></div></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} JEEVANAM VILLA · LEH, LADAKH</span><span>MADE WITH CARE, IN THE HIMALAYAS <span className="sun-dot">✳</span></span><a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="18" cy="6" r=".8" fill="currentColor"/></svg></a></div></footer>;
}

export default function App() {
  const { scrollYProgress } = useScroll();
  const reduceMotion = useReducedMotion();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 32, restDelta: 0.001 });
  const [routeLocation, setRouteLocation] = useState(() => `${window.location.pathname}${window.location.search}${window.location.hash}`);
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  const page = {
    '/': { title: 'Jeevanam Villa | Boutique Hotel in Leh, Ladakh', description: 'Stay at Jeevanam Villa, a boutique hotel in Leh, Ladakh. Explore comfortable rooms, local hospitality, meal plans and direct booking near Leh Airport.', content: <><Hero /><Intro /><Explore /></> },
    '/rooms': { title: 'Rooms | Jeevanam Villa, Leh', description: 'Compare the Deluxe Comfort Room and Deluxe Plus Comfort Room at Jeevanam Villa in Leh, Ladakh, with room features and hillside views.', content: <><Stay /><Amenities /></> },
    '/rates': { title: 'Room Rates & Meal Plans | Jeevanam Villa, Leh', description: 'See Jeevanam Villa room rates, meal plans and booking policies for your stay in Leh, Ladakh.', content: <><MealPlans /><Cancellation /></> },
    '/experiences': { title: 'Villa Gallery & Experiences | Jeevanam Villa, Leh', description: 'Explore the villa, dining spaces, rooms and views around Jeevanam Villa in Leh, Ladakh.', content: <><LocalLife /><Gallery /></> },
    '/reviews': { title: 'Guest Reviews | Jeevanam Villa, Leh', description: 'Read guest feedback about stays, service, cleanliness and dining at Jeevanam Villa in Leh, Ladakh.', content: <Reviews /> },
    '/location': { title: 'Location & Directions | Jeevanam Villa, Leh', description: 'Find Jeevanam Villa on GH Road in Skara Yokma, Leh, Ladakh, near Leh Airport and the main Leh Market.', content: <><Details /><Location /></> },
    '/book': { title: 'Book Your Stay | Jeevanam Villa, Leh', description: 'Request a room at Jeevanam Villa in Leh, Ladakh. Choose your dates, room and meal plan, then contact our reservations team directly.', content: <Booking /> },
  }[path];
  useEffect(() => {
    if (!page) return;
    const canonicalUrl = `https://villajeevanam.com${path === '/' ? '/' : path}`;
    document.title = page.title;
    const setMeta = (selector, attribute, value) => {
      const element = document.head.querySelector(selector);
      if (element) element.setAttribute(attribute, value);
    };
    setMeta('meta[name="description"]', 'content', page.description);
    setMeta('meta[property="og:title"]', 'content', page.title);
    setMeta('meta[property="og:description"]', 'content', page.description);
    setMeta('meta[property="og:url"]', 'content', canonicalUrl);
    setMeta('meta[name="twitter:title"]', 'content', page.title);
    setMeta('meta[name="twitter:description"]', 'content', page.description);
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);
  }, [path]);
  useEffect(() => {
    const routedPaths = new Set(['/', '/rooms', '/rates', '/experiences', '/reviews', '/location', '/book']);
    const onDocumentClick = (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest('a[href]') : null;
      if (!anchor || anchor.target || anchor.hasAttribute('download')) return;
      const destination = new URL(anchor.href, window.location.href);
      const destinationPath = destination.pathname.replace(/\/+$/, '') || '/';
      if (destination.origin !== window.location.origin || !routedPaths.has(destinationPath)) return;
      if (destination.pathname === window.location.pathname && destination.search === window.location.search) return;
      event.preventDefault();
      window.history.pushState({}, '', `${destination.pathname}${destination.search}${destination.hash}`);
      setRouteLocation(`${destination.pathname}${destination.search}${destination.hash}`);
    };
    const onPopState = () => setRouteLocation(`${window.location.pathname}${window.location.search}${window.location.hash}`);
    document.addEventListener('click', onDocumentClick);
    window.addEventListener('popstate', onPopState);
    return () => { document.removeEventListener('click', onDocumentClick); window.removeEventListener('popstate', onPopState); };
  }, []);
  useEffect(() => {
    document.title = `${page?.title || 'Page not found'} · Jeevanam Villa, Leh`;
    const hash = decodeURIComponent(window.location.hash.slice(1));
    const timer = window.setTimeout(() => {
      if (hash) document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      else if (routeLocation !== `${window.location.pathname}${window.location.search}${window.location.hash}` || window.scrollY > 0) window.scrollTo({ top: 0, behavior: 'smooth' });
    }, hash ? 310 : 220);
    return () => window.clearTimeout(timer);
  }, [routeLocation]);
  const pageContent = page ? page.content : <section className="not-found section-pad"><span className="eyebrow"><span className="eyebrow-mark" /> JEEVANAM VILLA · LEH</span><h1>That page isn’t here.</h1><p>Choose a destination from the navigation to continue exploring.</p><a className="button button-dark" href="/">Back to home <ArrowUpRight size={16} /></a></section>;
  return <><motion.div className="scroll-progress" style={{ scaleX: progress }} /><Navigation /><AnimatePresence mode="wait" initial={false}><motion.main key={routeLocation} className={`page page-${path === '/' ? 'home' : path.slice(1)}`} initial={reduceMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }} transition={{ duration: reduceMotion ? 0.12 : 0.24, ease: [0.22, 1, 0.36, 1] }}>{pageContent}</motion.main></AnimatePresence><Footer /><a className="floating-whatsapp" href="https://wa.me/919797982421" target="_blank" rel="noreferrer" aria-label="Chat with Jeevanam Villa on WhatsApp"><span className="whatsapp-pulse" /><MessageIcon /></a></>;
}
function MessageIcon() { return <svg viewBox="0 0 24 24" width="23" height="23" fill="currentColor" aria-hidden="true"><path d="M20.52 3.48A11.86 11.86 0 0 0 12.08 0C5.48 0 .11 5.37.11 11.97c0 2.11.55 4.17 1.6 5.98L0 24l6.19-1.62a11.96 11.96 0 0 0 5.89 1.5h.01c6.59 0 11.96-5.37 11.97-11.97a11.9 11.9 0 0 0-3.54-8.43ZM12.09 21.85h-.01a9.89 9.89 0 0 1-5.04-1.38l-.36-.22-3.67.97.98-3.58-.24-.37a9.91 9.91 0 0 1-1.52-5.3c0-5.5 4.47-9.97 9.96-9.97a9.9 9.9 0 0 1 7.06 2.93 9.91 9.91 0 0 1 2.92 7.06c0 5.5-4.47 9.97-9.97 9.97Zm5.47-7.47c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.95 1.18-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.68-2.08-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51h-.58c-.2 0-.52.08-.8.38-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.22 3.07c.15.2 2.1 3.21 5.08 4.5.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.78-.73 2.03-1.43.25-.7.25-1.3.17-1.43-.07-.12-.27-.2-.57-.35Z" /></svg>; }
