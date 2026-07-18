import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Phone,
  MapPin,
  Clock,
  Star,
  Trash2,
  Plus,
  Minus,
  Calculator,
  Calendar,
  ChevronDown,
  ChevronUp,
  Check,
  CheckCircle2,
  X,
  ShieldCheck,
  TrendingUp,
  Coins,
  Recycle,
  HelpCircle,
  User,
  ClipboardList,
  AlertCircle,
  Search,
  ArrowRight,
  Info,
  Map,
  Hammer,
  Layers,
  Flame,
  Disc,
  Crown,
  Utensils,
  Cable,
  Link as LinkIcon,
  Battery,
  Snowflake,
  Server,
  WashingMachine,
  Monitor,
  Settings
} from 'lucide-react';
import { SCRAP_ITEMS, BHUBANESWAR_AREAS, REVIEWS, FAQS } from './data';
import { ScrapItem, BookingRequest } from './types';

// Helper component to render dynamic icons safely
const ScrapIcon = ({ name, className = "w-6 h-6" }: { name: string; className?: string }) => {
  switch (name) {
    case 'Hammer': return <Hammer className={className} />;
    case 'Layers': return <Layers className={className} />;
    case 'Flame': return <Flame className={className} />;
    case 'Disc': return <Disc className={className} />;
    case 'Crown': return <Crown className={className} />;
    case 'Utensils': return <Utensils className={className} />;
    case 'Cable': return <Cable className={className} />;
    case 'Link': return <LinkIcon className={className} />;
    case 'Battery': return <Battery className={className} />;
    case 'Snowflake': return <Snowflake className={className} />;
    case 'Server': return <Server className={className} />;
    case 'WashingMachine': return <WashingMachine className={className} />;
    case 'Monitor': return <Monitor className={className} />;
    case 'Settings': return <Settings className={className} />;
    default: return <Recycle className={className} />;
  }
};

export default function App() {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState<'pickup' | 'rates' | 'bookings'>('pickup');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Calculator Quantities Map: { [itemId]: quantity }
  const [calculatorQuantities, setCalculatorQuantities] = useState<Record<string, number>>({});
  
  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    address: '',
    area: BHUBANESWAR_AREAS[0],
    date: '',
    timeSlot: '10:00 AM - 01:00 PM'
  });

  // Saved Bookings (from LocalStorage)
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  
  // Success Booking Modal State
  const [successBooking, setSuccessBooking] = useState<BookingRequest | null>(null);
  const [trackingBookingId, setTrackingBookingId] = useState<string | null>(null);

  // FAQ open index state
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(null);

  // Real-time local clock
  const [currentTime, setCurrentTime] = useState(new Date('2026-07-18T06:37:00-07:00'));

  // --- EFFECTS ---
  // Load bookings from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('sdb_bookings');
    if (saved) {
      try {
        setBookings(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing bookings from localStorage", e);
      }
    }
  }, []);

  // Sync bookings to LocalStorage on change
  const saveBookings = (updatedBookings: BookingRequest[]) => {
    setBookings(updatedBookings);
    localStorage.setItem('sdb_bookings', JSON.stringify(updatedBookings));
  };

  // Real-time Clock interval
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(prev => new Date(prev.getTime() + 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // --- DYNAMIC COMPUTATIONS ---
  // Filter scrap items by search query and category
  const filteredScrapItems = useMemo(() => {
    return SCRAP_ITEMS.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Unique categories list
  const categories = useMemo(() => {
    return ['All', 'Metal', 'Appliances', 'E-Waste', 'Machinery'];
  }, []);

  // Calculator helper computations
  const calculatorList = useMemo(() => {
    return Object.entries(calculatorQuantities)
      .map(([id, qty]) => {
        const item = SCRAP_ITEMS.find(i => i.id === id);
        const quantity = Number(qty);
        return {
          item,
          quantity,
          value: item ? item.rate * quantity : 0
        };
      })
      .filter(entry => entry.item !== undefined && entry.quantity > 0) as { item: ScrapItem; quantity: number; value: number }[];
  }, [calculatorQuantities]);

  const estimatedTotalValue = useMemo(() => {
    return calculatorList.reduce((sum, entry) => sum + entry.value, 0);
  }, [calculatorList]);

  // Time formatting
  const formattedTime = useMemo(() => {
    return currentTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  }, [currentTime]);

  // --- ACTIONS & HANDLERS ---
  const handleQuantityChange = (id: string, change: number) => {
    setCalculatorQuantities(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + change);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: next };
    });
  };

  const handleSliderChange = (id: string, value: number) => {
    setCalculatorQuantities(prev => {
      if (value <= 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: value };
    });
  };

  const handleResetCalculator = () => {
    setCalculatorQuantities({});
  };

  const handleRemoveFromCalculator = (id: string) => {
    setCalculatorQuantities(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({ ...prev, [name]: value }));
  };

  const handleBookPickup = (e: React.FormEvent) => {
    e.preventDefault();

    if (calculatorList.length === 0) {
      alert("Please add at least one scrap item to your list before booking.");
      return;
    }

    if (!bookingForm.name || !bookingForm.phone || !bookingForm.address) {
      alert("Please fill in your name, mobile number, and address.");
      return;
    }

    // Generate random reference number SDB-751-[4 digit random]
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `SDB-751-${randomNum}`;

    const newBooking: BookingRequest = {
      id: bookingId,
      name: bookingForm.name,
      phone: bookingForm.phone,
      address: bookingForm.address,
      area: bookingForm.area,
      date: bookingForm.date || new Date(currentTime.getTime() + 86400000).toISOString().split('T')[0], // Tomorrow's date default
      timeSlot: bookingForm.timeSlot,
      items: calculatorList.map(entry => ({
        scrapItemId: entry.item.id,
        name: entry.item.name,
        quantity: entry.quantity,
        rate: entry.item.rate,
        unit: entry.item.unit,
        estimatedValue: entry.value
      })),
      totalValue: estimatedTotalValue,
      status: 'Pending',
      createdAt: currentTime.toISOString()
    };

    const updatedBookings = [newBooking, ...bookings];
    saveBookings(updatedBookings);
    setSuccessBooking(newBooking);
    
    // Reset Calculator & Form
    setCalculatorQuantities({});
    setBookingForm({
      name: '',
      phone: '',
      address: '',
      area: BHUBANESWAR_AREAS[0],
      date: '',
      timeSlot: '10:00 AM - 01:00 PM'
    });
  };

  const handleCancelBooking = (id: string) => {
    if (window.confirm("Are you sure you want to cancel this pickup request?")) {
      const updated = bookings.map(b => {
        if (b.id === id) {
          return { ...b, status: 'Cancelled' as const };
        }
        return b;
      });
      saveBookings(updated);
    }
  };

  // Pre-populate calculator from rates page quick-action
  const handleQuickAdd = (item: ScrapItem) => {
    handleQuantityChange(item.id, item.unit === 'unit' ? 1 : 10);
    setActiveTab('pickup');
    
    // Scroll to calculator
    const calcSection = document.getElementById('calc-box');
    if (calcSection) {
      calcSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* --- TOP BANNER / LIVE TICKER --- */}
      <div className="bg-emerald-950 text-emerald-100 text-xs py-2 px-4 flex flex-wrap justify-between items-center border-b border-emerald-900/40 gap-2">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 font-medium bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded-full text-[10px] tracking-wide uppercase border border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Daily Market Demand
          </span>
          <span className="hidden sm:inline font-mono opacity-80">
            Highly Wanted Materials: <span className="text-emerald-400">Copper Wires</span> | <span className="text-emerald-400">Aluminium Utensils</span> | <span className="text-emerald-400">Inverter Batteries</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-mono">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Bhubaneswar Time: {formattedTime}</span>
          </div>
          <span className="bg-emerald-800/80 text-emerald-200 px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider">
            24 HRS PICKUP
          </span>
        </div>
      </div>

      {/* --- MAIN HEADER --- */}
      <header id="main-header" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3 self-start sm:self-center">
            <div className="w-11 h-11 bg-gradient-to-tr from-emerald-600 to-emerald-500 rounded-xl flex items-center justify-center shadow-md shadow-emerald-500/20 text-white">
              <Recycle className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-none">
                  Scrap Dealer Bhubaneswar
                </h1>
              </div>
              <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                Unit-3, Kharvela Nagar, Bhubaneswar
              </p>
            </div>
          </div>

          {/* Rating, Services Quick & Primary Call CTA */}
          <div className="flex flex-wrap items-center justify-end gap-3 sm:gap-4 w-full sm:w-auto">
            {/* Rating badge */}
            <div className="bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg flex items-center gap-2">
              <div className="flex items-center text-amber-500">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-800 leading-none">4.6 ★</p>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">8 Verified Reviews</p>
              </div>
            </div>

            {/* Double Contact Hotline */}
            <div className="flex flex-col text-right hidden lg:block">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Quick Pickup Line</p>
              <a href="tel:7735142007" className="text-sm font-bold text-slate-900 hover:text-emerald-600 transition-colors flex items-center gap-1.5 justify-end">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                +91 7735142007
              </a>
            </div>

            <a
              id="cta-call-header"
              href="tel:7735142007"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-lg text-sm transition-all duration-150 shadow-sm flex items-center gap-1.5 shrink-0 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Phone className="w-4 h-4" />
              Call Now
            </a>
          </div>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-emerald-950 text-white py-12 lg:py-20 px-4 sm:px-6 lg:px-8">
        
        {/* Decorative Grid Overlays */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Odisha's Top Rated Recycler
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.1] tracking-tight">
              We Buy All Types of Scrap. <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-300">Top Cash Paid instantly!</span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Skip the hassle of local manual carts. Get 100% transparent weighing with digital smart scales, direct doorstep pickup anywhere in Bhubaneswar, and premium on-the-spot cash or UPI payments!
            </p>

            {/* Value Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 max-w-xl mx-auto lg:mx-0">
              <div className="bg-white/5 border border-white/10 p-3 rounded-xl backdrop-blur-sm text-left">
                <Coins className="w-5 h-5 text-amber-400 mb-1" />
                <h4 className="text-xs font-bold text-white">Best Rates Paid</h4>
                <p className="text-[10px] text-slate-400">Regularly updated market price</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-3 rounded-xl backdrop-blur-sm text-left">
                <Recycle className="w-5 h-5 text-emerald-400 mb-1" />
                <h4 className="text-xs font-bold text-white">100% Eco-Recycling</h4>
                <p className="text-[10px] text-slate-400">Zero landfill processing</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-3 rounded-xl backdrop-blur-sm text-left col-span-2 sm:col-span-1">
                <MapPin className="w-5 h-5 text-emerald-400 mb-1" />
                <h4 className="text-xs font-bold text-white">Free Home Pickup</h4>
                <p className="text-[10px] text-slate-400">Doorstep load & lift service</p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                id="cta-scroll-calc"
                onClick={() => {
                  setActiveTab('pickup');
                  document.getElementById('portal-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-700/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <Calculator className="w-5 h-5" />
                Use Scrap Calculator
              </button>
              <a
                id="cta-call-hero"
                href="tel:7735142007"
                className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold px-6 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Phone className="w-5 h-5 text-amber-400" />
                Call +91 7735142007
              </a>
            </div>
          </div>

          {/* Hero Visual Block */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            <div className="bg-gradient-to-tr from-emerald-900/60 to-slate-800/80 p-6 rounded-2xl border border-emerald-500/20 backdrop-blur-md shadow-2xl relative">
              <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-4">
                <span className="text-xs font-bold tracking-wider text-emerald-300 uppercase">Accepted Scrap Guide</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-mono font-bold">2026 LIST</span>
              </div>
              
              <div className="space-y-3">
                {[
                  { name: 'Copper Scrap', status: 'Best Spot Value', trend: 'High Demand' },
                  { name: 'Brass Scrap', status: 'Best Spot Value', trend: 'High Demand' },
                  { name: 'Aluminium Scrap', status: 'Best Spot Value', trend: 'High Demand' },
                  { name: 'Iron Heavy Scrap', status: 'Best Spot Value', trend: 'Stable Demand' },
                  { name: 'Battery Scrap', status: 'Best Spot Value', trend: 'High Demand' }
                ].map((row, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 px-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <span className="text-xs font-medium text-slate-200">{row.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-emerald-400">{row.status}</span>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                        {row.trend}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 text-center">
                <button
                  id="cta-scroll-rates"
                  onClick={() => {
                    setActiveTab('rates');
                    document.getElementById('portal-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-xs text-emerald-300 hover:text-emerald-200 font-bold flex items-center gap-1.5 mx-auto transition-colors"
                >
                  View All 14 Accepted Scraps
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            
            {/* Quick floating stat badge */}
            <div className="absolute -bottom-4 -left-4 bg-amber-500 text-slate-950 px-4 py-2.5 rounded-xl shadow-lg border border-amber-400/30 flex items-center gap-2 max-w-[190px]">
              <Recycle className="w-5 h-5 shrink-0" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider leading-none text-slate-800">Bhubaneswar Eco Stat</p>
                <p className="text-xs font-extrabold mt-0.5">850+ Tons Recycled</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* --- PORTAL / MAIN PORTAL TAB WRAPPER --- */}
      <section id="portal-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow scroll-mt-20">
        
        {/* Portal Tabs Selector */}
        <div className="flex border-b border-slate-200 mb-8 overflow-x-auto scrollbar-none gap-2">
          <button
            id="tab-pickup"
            onClick={() => {
              setActiveTab('pickup');
              setTrackingBookingId(null);
            }}
            className={`flex items-center gap-2 pb-4 px-4 font-bold text-sm border-b-2 transition-all cursor-pointer shrink-0 ${activeTab === 'pickup' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            <Calculator className="w-4.5 h-4.5" />
            Pickup Request & Scheduler
          </button>
          <button
            id="tab-rates"
            onClick={() => {
              setActiveTab('rates');
              setTrackingBookingId(null);
            }}
            className={`flex items-center gap-2 pb-4 px-4 font-bold text-sm border-b-2 transition-all cursor-pointer shrink-0 ${activeTab === 'rates' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            <Coins className="w-4.5 h-4.5" />
            Accepted Scraps & Services Directory
          </button>
          <button
            id="tab-bookings"
            onClick={() => setActiveTab('bookings')}
            className={`flex items-center gap-2 pb-4 px-4 font-bold text-sm border-b-2 transition-all cursor-pointer shrink-0 relative ${activeTab === 'bookings' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            <ClipboardList className="w-4.5 h-4.5" />
            My Pickup Requests
            {bookings.length > 0 && (
              <span className="absolute right-0 top-1/2 -translate-y-7 bg-emerald-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {bookings.length}
              </span>
            )}
          </button>
        </div>

        {/* Tab Contents */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            
            {/* 1. PICKUP CALCULATOR & SCHEDULER TAB */}
            {activeTab === 'pickup' && (
              <motion.div
                key="pickup-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="grid lg:grid-cols-12 gap-8"
              >
                {/* LEFT COLUMN: The Interactive Estimator Grid */}
                <div id="calc-box" className="lg:col-span-7 space-y-6">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-100">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                          <Calculator className="w-5 h-5 text-emerald-600" />
                          Step 1: Build Your Pickup Request List
                        </h3>
                        <p className="text-xs text-slate-500">Choose scrap categories and adjust quantities to add them to your collection request.</p>
                      </div>
                      <button
                        id="btn-reset-calc"
                        onClick={handleResetCalculator}
                        disabled={calculatorList.length === 0}
                        className="text-xs font-bold text-slate-500 hover:text-rose-600 disabled:opacity-50 disabled:hover:text-slate-500 transition-colors flex items-center gap-1 self-start sm:self-center"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Clear All
                      </button>
                    </div>

                    {/* Category Filter Pills */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          id={`filter-cat-${cat.toLowerCase()}`}
                          onClick={() => setSelectedCategory(cat)}
                          className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${selectedCategory === cat ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    {/* Search inside prices */}
                    <div className="relative mb-5">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search for scrap item (e.g. Copper, AC, Fridge)..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white transition-all placeholder:text-slate-400"
                      />
                    </div>

                    {/* Grid of Sliders and Counters */}
                    <div className="grid sm:grid-cols-2 gap-4 max-h-[550px] overflow-y-auto pr-1">
                      {filteredScrapItems.map((item) => {
                        const quantity = calculatorQuantities[item.id] || 0;
                        const value = item.rate * quantity;
                        
                        return (
                          <div
                            key={item.id}
                            id={`calc-item-${item.id}`}
                            className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${quantity > 0 ? 'bg-emerald-50/50 border-emerald-200/80 ring-1 ring-emerald-100 shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                          >
                            <div className="flex justify-between items-start gap-2 mb-3">
                              <div className="flex items-center gap-2.5">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${quantity > 0 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                                  <ScrapIcon name={item.iconName} className="w-4.5 h-4.5" />
                                </div>
                                <div>
                                  <h4 className="text-xs font-bold text-slate-900 leading-tight">{item.name}</h4>
                                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                                    Market rate: <span className="text-emerald-700 font-bold">Best Price / {item.unit}</span>
                                  </p>
                                </div>
                              </div>
                              {quantity > 0 && (
                                <button
                                  id={`remove-item-${item.id}`}
                                  onClick={() => handleRemoveFromCalculator(item.id)}
                                  className="text-slate-400 hover:text-rose-600 transition-colors"
                                  title="Remove from estimation"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                            </div>

                            {/* Quantity Control Panel */}
                            <div className="space-y-3">
                              {/* Sliders for intuitive weight input, plus buttons */}
                              <div className="flex items-center justify-between gap-2 bg-slate-50 rounded-lg p-1.5 border border-slate-200">
                                <button
                                  type="button"
                                  id={`btn-dec-${item.id}`}
                                  onClick={() => handleQuantityChange(item.id, item.unit === 'unit' ? -1 : -5)}
                                  className="w-7 h-7 bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-md flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                                >
                                  <Minus className="w-3.5 h-3.5" />
                                </button>
                                
                                <div className="flex items-baseline gap-1">
                                  <input
                                    type="number"
                                    id={`input-qty-${item.id}`}
                                    min="0"
                                    value={quantity || ''}
                                    placeholder="0"
                                    onChange={(e) => handleSliderChange(item.id, Number(e.target.value))}
                                    className="w-12 bg-transparent text-center font-mono font-extrabold text-sm text-slate-900 focus:outline-none placeholder:text-slate-300"
                                  />
                                  <span className="text-[10px] font-bold text-slate-400 uppercase">{item.unit}</span>
                                </div>

                                <button
                                  type="button"
                                  id={`btn-inc-${item.id}`}
                                  onClick={() => handleQuantityChange(item.id, item.unit === 'unit' ? 1 : 5)}
                                  className="w-7 h-7 bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-md flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Slider track for weights */}
                              {item.unit === 'kg' ? (
                                <div className="px-1.5">
                                  <input
                                    type="range"
                                    id={`slider-qty-${item.id}`}
                                    min="0"
                                    max="150"
                                    step="5"
                                    value={quantity}
                                    onChange={(e) => handleSliderChange(item.id, Number(e.target.value))}
                                    className="w-full accent-emerald-600 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                                  />
                                  <div className="flex justify-between text-[8px] text-slate-400 font-bold font-mono mt-0.5">
                                    <span>0 kg</span>
                                    <span>50 kg</span>
                                    <span>100 kg</span>
                                    <span>150+ kg</span>
                                  </div>
                                </div>
                              ) : (
                                <div className="px-1.5">
                                  <input
                                    type="range"
                                    id={`slider-qty-${item.id}`}
                                    min="0"
                                    max="10"
                                    step="1"
                                    value={quantity}
                                    onChange={(e) => handleSliderChange(item.id, Number(e.target.value))}
                                    className="w-full accent-emerald-600 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                                  />
                                  <div className="flex justify-between text-[8px] text-slate-400 font-bold font-mono mt-0.5">
                                    <span>0 Units</span>
                                    <span>5 Units</span>
                                    <span>10 Units</span>
                                  </div>
                                </div>
                              )}

                              {/* Payout subtotal indicator */}
                              <div className="flex justify-between items-center pt-1 border-t border-dashed border-slate-200">
                                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Estimated Payout</span>
                                <span className={`text-xs font-bold ${quantity > 0 ? 'text-emerald-700 font-sans' : 'text-slate-400 font-sans'}`}>
                                  {quantity > 0 ? 'Highest Spot Rate' : '—'}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: Summary and Booking Form */}
                <div className="lg:col-span-5 space-y-6">
                  
                  {/* Calculation Summary Panel */}
                  <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-md">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-4 flex items-center gap-2">
                      <ClipboardList className="w-4 h-4" />
                      Calculated Pickup List
                    </h3>

                    {calculatorList.length === 0 ? (
                      <div className="py-6 text-center space-y-3">
                        <Calculator className="w-10 h-10 text-slate-600 mx-auto opacity-60" />
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-slate-300">Calculator is Empty</p>
                          <p className="text-[10px] text-slate-500 max-w-[250px] mx-auto">
                            Adjust quantities of scrap materials on the left to start building your pickup request!
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="max-h-[220px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                          {calculatorList.map(({ item, quantity, value }) => (
                            <div key={item.id} className="flex items-center justify-between py-2 px-3 bg-white/5 rounded-xl border border-white/5">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                                  <ScrapIcon name={item.iconName} className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-white">{item.name}</p>
                                  <p className="text-[10px] text-slate-400 font-sans font-semibold">
                                    Quantity: {quantity} {item.unit}
                                  </p>
                                </div>
                              </div>
                              <span className="text-xs font-bold text-emerald-300">
                                Daily Market Rate
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-4 border-t border-dashed border-white/10 space-y-2">
                          <div className="flex justify-between items-center text-xs text-slate-400">
                            <span>Service Charge</span>
                            <span className="text-emerald-400 font-bold uppercase tracking-wide bg-emerald-500/10 px-2 py-0.5 rounded text-[10px]">
                              FREE PICKUP
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-xs text-slate-400">
                            <span>Precision Weighing Fee</span>
                            <span className="text-emerald-400 font-bold uppercase tracking-wide bg-emerald-500/10 px-2 py-0.5 rounded text-[10px]">
                              100% FREE
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-baseline pt-2">
                            <span className="text-xs font-bold text-white">Estimated Total Payout:</span>
                            <div className="text-right">
                              <span className="text-sm font-bold text-amber-400 block">
                                Highest Daily Market Price
                              </span>
                              <p className="text-[9px] text-slate-400 font-medium mt-1">Paid on the spot via Cash, UPI, or Bank Transfer</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Booking Form Card */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-emerald-600" />
                      Step 2: Schedule Free Doorstep Pickup
                    </h3>

                    <form onSubmit={handleBookPickup} className="space-y-4">
                      
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={bookingForm.name}
                          onChange={handleFormInputChange}
                          placeholder="Enter your full name"
                          className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none transition-all placeholder:text-slate-400 font-medium text-slate-950"
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                            Mobile Number (UPI linked preferred) *
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            required
                            pattern="[0-9]{10}"
                            value={bookingForm.phone}
                            onChange={handleFormInputChange}
                            placeholder="10-digit phone number"
                            className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none transition-all placeholder:text-slate-400 font-mono font-medium text-slate-950"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                            Area in Bhubaneswar *
                          </label>
                          <div className="relative">
                            <select
                              name="area"
                              value={bookingForm.area}
                              onChange={handleFormInputChange}
                              className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 rounded-xl pl-3.5 pr-8 py-2.5 text-xs focus:outline-none transition-all font-medium text-slate-950 appearance-none cursor-pointer"
                            >
                              {BHUBANESWAR_AREAS.map(area => (
                                <option key={area} value={area}>{area}</option>
                              ))}
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                          Full Doorstep Address *
                        </label>
                        <input
                          type="text"
                          name="address"
                          required
                          value={bookingForm.address}
                          onChange={handleFormInputChange}
                          placeholder="House No, Apartment, Street, Landmark details"
                          className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none transition-all placeholder:text-slate-400 font-medium text-slate-950"
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                            Preferred Pickup Date
                          </label>
                          <input
                            type="date"
                            name="date"
                            min={new Date(currentTime.getTime() + 86400000).toISOString().split('T')[0]} // Min is tomorrow
                            value={bookingForm.date}
                            onChange={handleFormInputChange}
                            className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none transition-all text-slate-950 font-medium cursor-pointer"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                            Preferred Time Slot
                          </label>
                          <div className="relative">
                            <select
                              name="timeSlot"
                              value={bookingForm.timeSlot}
                              onChange={handleFormInputChange}
                              className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 rounded-xl pl-3.5 pr-8 py-2.5 text-xs focus:outline-none transition-all font-medium text-slate-950 appearance-none cursor-pointer"
                            >
                              <option value="10:00 AM - 01:00 PM">Morning (10 AM - 1 PM)</option>
                              <option value="01:00 PM - 04:00 PM">Afternoon (1 PM - 4 PM)</option>
                              <option value="04:00 PM - 07:00 PM">Evening (4 PM - 7 PM)</option>
                              <option value="07:00 PM - 10:00 PM">Night Slot (7 PM - 10 PM)</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        id="btn-submit-booking"
                        disabled={calculatorList.length === 0}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-md shadow-emerald-700/10 flex items-center justify-center gap-2 mt-2 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                      >
                        <CheckCircle2 className="w-4.5 h-4.5" />
                        Book Free Doorstep Pickup
                      </button>

                      <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        By booking, you agree to our 100% precise weighing & price policy.
                      </p>
                    </form>
                  </div>

                </div>
              </motion.div>
            )}

            {/* 2. VERIFIED RATES & SERVICES DIRECTORY TAB */}
            {activeTab === 'rates' && (
              <motion.div
                key="rates-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Coins className="w-5 h-5 text-emerald-600" />
                      Accepted Scrap Materials Guide
                    </h3>
                    <p className="text-xs text-slate-500">We collect all standard metal, appliance, and machinery scrap materials for eco-friendly recycling.</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        id={`rates-cat-${cat.toLowerCase()}`}
                        onClick={() => setSelectedCategory(cat)}
                        className={`text-xs px-3.5 py-2 rounded-lg font-bold transition-all cursor-pointer ${selectedCategory === cat ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid of All 14 Items */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredScrapItems.map((item) => (
                    <div
                      key={item.id}
                      id={`rates-item-${item.id}`}
                      className="bg-white p-4 rounded-xl border border-slate-200/80 hover:border-emerald-500/40 transition-all duration-150 flex flex-col justify-between group shadow-sm"
                    >
                      <div>
                        {/* Upper line */}
                        <div className="flex justify-between items-start gap-2 mb-3">
                          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                            <ScrapIcon name={item.iconName} className="w-5 h-5" />
                          </div>
                          
                          <div className="text-right">
                            <span className="text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold uppercase">
                              {item.category}
                            </span>
                          </div>
                        </div>

                        {/* Title & Price */}
                        <div className="mb-2">
                          <h4 className="text-sm font-extrabold text-slate-900 leading-none mb-1 group-hover:text-emerald-700 transition-colors">
                            {item.name}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-emerald-700">
                              Best Market Value / {item.unit}
                            </span>
                            
                            {/* Demand flags */}
                            {(item.id === 'copper-scrap' || item.id === 'aluminium-scrap' || item.id === 'electric-wire-scrap') && (
                              <span className="text-[8px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                <TrendingUp className="w-2.5 h-2.5" /> High Demand
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-slate-500 text-[11px] leading-relaxed mb-4">
                          {item.description}
                        </p>
                      </div>

                      {/* Quick Add CTA */}
                      <button
                        type="button"
                        id={`btn-quick-add-${item.id}`}
                        onClick={() => handleQuickAdd(item)}
                        className="w-full bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 text-emerald-700 font-bold text-xs py-2 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer group-hover:shadow-sm"
                      >
                        <Calculator className="w-3.5 h-3.5" />
                        Add to Pickup Request
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 3. TRACK & MANAGE BOOKINGS TAB */}
            {activeTab === 'bookings' && (
              <motion.div
                key="bookings-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >
                {bookings.length === 0 ? (
                  <div className="bg-white p-12 text-center rounded-2xl border border-slate-200/80 shadow-sm max-w-xl mx-auto space-y-4">
                    <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                      <ClipboardList className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-base font-bold text-slate-800">No Pickup Requests Yet</h3>
                      <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                        Once you build an estimation using our calculator and schedule a pickup, your active and historic pickup requests will appear here for easy tracking!
                      </p>
                    </div>
                    <button
                      id="btn-goto-calculator"
                      onClick={() => setActiveTab('pickup')}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-lg transition-all shadow-sm cursor-pointer"
                    >
                      Open Pickup Calculator
                    </button>
                  </div>
                ) : (
                  <div className="grid lg:grid-cols-12 gap-8">
                    {/* Booking List Pane */}
                    <div className="lg:col-span-6 space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                          Your Booking History ({bookings.length})
                        </h3>
                        <p className="text-[10px] text-slate-400 font-medium">Click on a booking to track live progress</p>
                      </div>

                      <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
                        {bookings.map((booking) => {
                          const isTracking = trackingBookingId === booking.id || (!trackingBookingId && bookings[0].id === booking.id);
                          
                          return (
                            <div
                              key={booking.id}
                              id={`booking-card-${booking.id}`}
                              onClick={() => setTrackingBookingId(booking.id)}
                              className={`p-4 rounded-xl border text-left cursor-pointer transition-all relative ${isTracking ? 'bg-white border-emerald-500 ring-1 ring-emerald-400 shadow-md' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                                    {booking.id}
                                  </span>
                                  <p className="text-[10px] text-slate-400 font-medium mt-1">
                                    Created: {new Date(booking.createdAt).toLocaleDateString()} at {new Date(booking.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                  booking.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                                  booking.status === 'Cancelled' ? 'bg-slate-100 text-slate-500' :
                                  booking.status === 'Pickup Assigned' ? 'bg-blue-100 text-blue-800' :
                                  booking.status === 'Confirmed' ? 'bg-indigo-100 text-indigo-800' :
                                  'bg-amber-100 text-amber-800'
                                }`}>
                                  {booking.status}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-2 my-2 py-2 border-t border-b border-dashed border-slate-100">
                                <div>
                                  <p className="text-[9px] text-slate-400 uppercase tracking-wider">Pickup Schedule</p>
                                  <p className="text-xs font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                                    {booking.date}
                                  </p>
                                  <p className="text-[10px] text-slate-500 pl-4.5">{booking.timeSlot}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-[9px] text-slate-400 uppercase tracking-wider">Estimated Payout</p>
                                  <p className="text-xs font-bold text-emerald-700 mt-1">
                                    Daily Market Rates
                                  </p>
                                  <p className="text-[9px] text-slate-400 mt-0.5">{booking.items.length} items listed</p>
                                </div>
                              </div>

                              <div className="flex justify-between items-center pt-1 text-[11px]">
                                <span className="text-slate-500 truncate max-w-[250px] flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                  {booking.area}
                                </span>
                                {booking.status !== 'Completed' && booking.status !== 'Cancelled' && (
                                  <button
                                    id={`cancel-booking-${booking.id}`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCancelBooking(booking.id);
                                    }}
                                    className="text-slate-400 hover:text-rose-600 transition-colors font-bold text-[10px] bg-slate-50 hover:bg-rose-50 px-2 py-1 rounded border border-slate-100 hover:border-rose-100 cursor-pointer"
                                  >
                                    Cancel Request
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Live Progress Tracker Pane */}
                    <div className="lg:col-span-6">
                      {(() => {
                        const activeTrackId = trackingBookingId || bookings[0]?.id;
                        const trackingBooking = bookings.find(b => b.id === activeTrackId);
                        
                        if (!trackingBooking) return null;

                        const steps = [
                          { label: 'Request Received', desc: 'Our team is reviewing your estimated scrap list.', status: 'Pending' },
                          { label: 'Booking Confirmed', desc: 'Pickup details confirmed. Our supervisor will call you.', status: 'Confirmed' },
                          { label: 'Pickup Executive Dispatched', desc: 'Pickup executive and digital scale vehicle is on-the-way.', status: 'Pickup Assigned' },
                          { label: 'Precision Weighing & Paid', desc: 'Heavy material weighed on certified scale. Cash/UPI paid.', status: 'Completed' }
                        ];

                        // Calculate current step index
                        let currentStepIndex = 0;
                        if (trackingBooking.status === 'Confirmed') currentStepIndex = 1;
                        if (trackingBooking.status === 'Pickup Assigned') currentStepIndex = 2;
                        if (trackingBooking.status === 'Completed') currentStepIndex = 3;
                        const isCancelled = trackingBooking.status === 'Cancelled';

                        return (
                          <div id="booking-tracker" className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-md space-y-5">
                            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                              <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Live Request Tracking</p>
                                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-1.5 mt-0.5">
                                  Reference: <span className="text-emerald-700 font-mono">{trackingBooking.id}</span>
                                </h3>
                              </div>
                              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${isCancelled ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
                                {trackingBooking.status}
                              </span>
                            </div>

                            {/* Cancelled screen override */}
                            {isCancelled ? (
                              <div className="py-8 text-center space-y-3">
                                <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto border border-rose-100">
                                  <AlertCircle className="w-6 h-6" />
                                </div>
                                <div className="space-y-1">
                                  <h4 className="text-sm font-bold text-slate-800">Pickup Request Cancelled</h4>
                                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                                    This request has been cancelled and will not be scheduled. If this was accidental, please create a new request or call us directly.
                                  </p>
                                </div>
                              </div>
                            ) : (
                              /* Timeline Steps */
                              <div className="space-y-6 relative before:absolute before:left-5 before:top-2.5 before:bottom-2.5 before:w-0.5 before:bg-slate-100">
                                {steps.map((step, idx) => {
                                  const isDone = idx <= currentStepIndex;
                                  const isCurrent = idx === currentStepIndex;
                                  
                                  return (
                                    <div key={idx} className="flex gap-4 relative">
                                      {/* Timeline dot */}
                                      <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 z-10 transition-all ${
                                        isDone
                                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                                          : 'bg-white border-slate-200 text-slate-400'
                                      }`}>
                                        {isDone ? (
                                          <Check className="w-5 h-5 stroke-[3px]" />
                                        ) : (
                                          <span className="text-xs font-bold font-mono">{idx + 1}</span>
                                        )}
                                      </div>

                                      {/* Step details */}
                                      <div className="pt-0.5">
                                        <h4 className={`text-xs font-bold transition-colors ${isCurrent ? 'text-emerald-700' : isDone ? 'text-slate-800 font-semibold' : 'text-slate-400'}`}>
                                          {step.label}
                                          {isCurrent && (
                                            <span className="ml-2 inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[9px] px-1.5 py-0.5 rounded-full font-bold animate-pulse">
                                              ACTIVE STEP
                                            </span>
                                          )}
                                        </h4>
                                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                                          {step.desc}
                                        </p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {/* Booking detailed list */}
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 mt-4 space-y-3">
                              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Estimated Items Ledger</h4>
                              <div className="divide-y divide-slate-200/80">
                                {trackingBooking.items.map((it, idx) => (
                                  <div key={idx} className="flex justify-between py-2 text-xs">
                                    <div>
                                      <p className="font-bold text-slate-800">{it.name}</p>
                                      <p className="text-[10px] text-slate-400 font-sans">Quantity: {it.quantity} {it.unit}</p>
                                    </div>
                                    <span className="font-semibold text-slate-800 text-[11px]">Daily Market Price</span>
                                  </div>
                                ))}
                              </div>
                              <div className="flex justify-between items-baseline pt-2 border-t border-dashed border-slate-200 text-sm">
                                <span className="font-bold text-slate-900">Estimated Pay:</span>
                                <span className="font-bold text-emerald-700 text-xs">Highest Spot Price</span>
                              </div>
                            </div>

                            {/* Help Desk Callout */}
                            <div className="border border-amber-100 bg-amber-50/50 p-3.5 rounded-xl flex items-start gap-2.5">
                              <Info className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
                              <div className="text-xs text-slate-700 leading-relaxed">
                                <p className="font-bold">Need assistance with your scheduled pickup?</p>
                                <p className="mt-0.5">Please quote reference <span className="font-mono font-bold text-slate-900">{trackingBooking.id}</span> when calling our help desk at <a href="tel:7735142007" className="font-bold text-emerald-700 hover:underline">+91 7735142007</a>.</p>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </section>

      {/* --- TRANSPARENCY / WHY CHOOSE US SECTION --- */}
      <section className="bg-white border-t border-b border-slate-200/80 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
              100% Honest Scrap Policy
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Bhubaneswar's Most Transparent Scrap Dealer
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm">
              We started Scrap Dealer Bhubaneswar to build long-term trust. We have zero hidden deduction or weight manipulation tricks.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
                title: 'Certified Digital Scales',
                desc: 'All weights measured on high-accuracy digital industrial scales verified by standard weight authorities.'
              },
              {
                icon: <Coins className="w-6 h-6 text-amber-500" />,
                title: 'On-The-Spot Payments',
                desc: 'Get paid instantly via UPI (GPay, PhonePe, Paytm), Net Banking, or hard Cash right inside your premises.'
              },
              {
                icon: <Recycle className="w-6 h-6 text-emerald-600" />,
                title: 'Free Heavy Lifting',
                desc: 'Our staff will handle the dismantling, lifting, loading and transportation completely free of cost.'
              },
              {
                icon: <User className="w-6 h-6 text-slate-700" />,
                title: 'Verified Staff Professionals',
                desc: 'Background-checked, polite, and uniformed pickup executive team ensuring safety and smooth service.'
              }
            ].map((card, idx) => (
              <div key={idx} className="p-5 rounded-xl bg-slate-50 border border-slate-200/60 hover:bg-slate-50/50 transition-all text-left">
                <div className="w-11 h-11 bg-white border border-slate-200 rounded-lg flex items-center justify-center shadow-sm mb-4">
                  {card.icon}
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1.5">{card.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- REVIEWS & TESTIMONIALS --- */}
      <section className="bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                What Local Bhubaneswar Customers Say
              </h2>
              <p className="text-xs text-slate-500 mt-1">Verified reviews from householders, workshop owners, and corporate offices.</p>
            </div>
            <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl flex items-center gap-3 shrink-0">
              <span className="text-xl font-extrabold text-slate-900">4.6/5</span>
              <div className="border-l border-slate-200 pl-3">
                <div className="flex items-center text-amber-500">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-3.5 h-3.5 fill-current" />)}
                </div>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">8 Verified Google Reviews</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {REVIEWS.map((rev) => (
              <div key={rev.id} className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between text-left">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs uppercase">
                        {rev.authorName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 leading-none">{rev.authorName}</h4>
                        <p className="text-[9px] text-slate-400 mt-0.5">{rev.location}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-amber-500 gap-0.5 mb-2">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </div>
                <p className="text-[9px] text-slate-400 font-semibold font-mono mt-4 pt-2 border-t border-slate-100 text-right">
                  Reviewed: {rev.date}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FAQS ACCORDION --- */}
      <section className="bg-white py-12 px-4 sm:px-6 lg:px-8 border-t border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm">
              Everything you need to know about our doorstep scrap collection process.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = faqOpenIndex === idx;
              
              return (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-xl overflow-hidden transition-all duration-150"
                >
                  <button
                    type="button"
                    id={`faq-btn-${idx}`}
                    onClick={() => setFaqOpenIndex(isOpen ? null : idx)}
                    className="w-full bg-slate-50/50 hover:bg-slate-50 py-3.5 px-4 text-left flex justify-between items-center gap-4 transition-colors font-bold text-xs sm:text-sm text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      {faq.question}
                    </span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />}
                  </button>
                  
                  {isOpen && (
                    <div className="px-4 py-3 bg-white border-t border-slate-100 text-[11px] sm:text-xs text-slate-600 leading-relaxed text-left">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- CONTACT & LOCATION GRID --- */}
      <section id="contact-section" className="bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Contact Details Card */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between text-left space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded font-bold uppercase">
                  Main Shop & Office
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-2 leading-none">
                  Scrap Dealer Bhubaneswar
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs leading-relaxed text-slate-700">
                    <p className="font-bold text-slate-900">Address Location:</p>
                    <p className="mt-0.5">Unit-3, Kharvela Nagar,</p>
                    <p>Bhubaneswar, Odisha 751001</p>
                    <p className="text-[10px] text-slate-400 mt-1">Near Unit-3 Exhibition Ground / Capital Police Station area</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs leading-relaxed text-slate-700 w-full">
                    <p className="font-bold text-slate-900">Phone Hotlines:</p>
                    
                    <div className="grid sm:grid-cols-2 gap-2 mt-1">
                      <a href="tel:7735142007" className="p-2 bg-slate-50 border border-slate-100 hover:border-emerald-200 rounded-lg hover:bg-emerald-50/30 transition-all block group">
                        <span className="text-[9px] text-slate-400 font-bold block">PRIMARY PICKUP</span>
                        <span className="font-bold text-slate-800 text-xs flex items-center gap-1 group-hover:text-emerald-700 mt-0.5">
                          7735142007
                        </span>
                      </a>
                      
                      <a href="tel:7735142007" className="p-2 bg-slate-50 border border-slate-100 hover:border-emerald-200 rounded-lg hover:bg-emerald-50/30 transition-all block group">
                        <span className="text-[9px] text-slate-400 font-bold block">SUPPORT / OFFICE</span>
                        <span className="font-bold text-slate-800 text-xs flex items-center gap-1 group-hover:text-emerald-700 mt-0.5">
                          7735142007
                        </span>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs leading-relaxed text-slate-700">
                    <p className="font-bold text-slate-900">Operation Hours:</p>
                    <p className="mt-0.5 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Open 24 Hours / 7 Days a week
                    </p>
                    <p className="text-[10px] text-slate-400">Pickup execution scheduled daily 8:00 AM - 10:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Dial Buttons */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
              <a
                href="tel:7735142007"
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 rounded-lg text-center shadow-sm flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                Call Pickup Line
              </a>
              <a
                href="tel:7735142007"
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2.5 rounded-lg text-center flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-slate-600" />
                Call Office
              </a>
            </div>
          </div>

          {/* Interactive Mock Map/Visual Area Coverage Card */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between text-left relative overflow-hidden space-y-4">
            <div className="absolute top-0 right-0 p-4 bg-emerald-50 text-emerald-800 border-b border-l border-emerald-100 rounded-bl-xl text-[10px] font-mono font-bold tracking-wider uppercase">
              BHUBANESWAR EXPANSION 2026
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                <Map className="w-5 h-5 text-emerald-600" />
                Service Coverage Map
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                We operate multiple dispatch vehicles around Bhubaneswar to execute quick pickups within 2-3 hours of booking confirmation!
              </p>
            </div>

            {/* Visual map placeholder with coordinates */}
            <div className="bg-slate-100 h-64 rounded-xl relative border border-slate-200 overflow-hidden flex flex-col justify-between p-4 bg-cover bg-center">
              
              {/* Fake Map Grid lines and map visual decoration */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <div className="w-48 h-48 rounded-full border border-emerald-500/50 animate-ping" />
              </div>
              
              <div className="relative z-10 flex flex-wrap gap-2 pointer-events-none max-w-sm">
                <span className="bg-white/90 backdrop-blur-sm border border-slate-200 text-[9px] font-bold text-slate-700 px-2 py-0.5 rounded shadow-sm">
                  📍 Kharvela Nagar (Unit-3)
                </span>
                <span className="bg-white/90 backdrop-blur-sm border border-slate-200 text-[9px] font-bold text-slate-700 px-2 py-0.5 rounded shadow-sm">
                  📍 Patia
                </span>
                <span className="bg-white/90 backdrop-blur-sm border border-slate-200 text-[9px] font-bold text-slate-700 px-2 py-0.5 rounded shadow-sm">
                  📍 Nayapalli
                </span>
                <span className="bg-white/90 backdrop-blur-sm border border-slate-200 text-[9px] font-bold text-slate-700 px-2 py-0.5 rounded shadow-sm">
                  📍 Saheed Nagar
                </span>
                <span className="bg-white/90 backdrop-blur-sm border border-slate-200 text-[9px] font-bold text-slate-700 px-2 py-0.5 rounded shadow-sm">
                  📍 Chandrasekharpur
                </span>
              </div>

              {/* Central Map Marker */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="relative">
                  <div className="absolute -inset-2 bg-emerald-500/30 rounded-full animate-ping" />
                  <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white border-2 border-white shadow-md relative">
                    <Recycle className="w-5 h-5 animate-spin-slow" />
                  </div>
                </div>
                <span className="bg-slate-900/90 text-white text-[9px] font-extrabold px-2 py-0.5 rounded mt-2 uppercase shadow-md border border-slate-700 tracking-wider">
                  Our Hub: Kharvela Nagar
                </span>
              </div>

              {/* Lower Overlay */}
              <div className="relative z-10 bg-slate-900/85 backdrop-blur-sm text-white p-3 rounded-xl border border-slate-700 max-w-md self-start text-left mt-auto">
                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Bhubaneswar Hub Address</p>
                <p className="text-xs font-medium text-slate-200 mt-0.5">Unit-3, Kharvela Nagar, Bhubaneswar, Odisha 751001</p>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 font-medium">
              * Outside municipal limits? For heavy industrial scraps (lathes, boiler shells, heavy structures), we provide pickup across all of Odisha including Cuttack, Khurda, and Puri districts.
            </p>
          </div>

        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-900 text-white border-t border-slate-800 py-10 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 text-left">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow">
                <Recycle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold tracking-tight">Scrap Dealer Bhubaneswar</h3>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Bhubaneswar's premier eco-friendly scrap collector. Turning metal, e-waste, and decommissioned machinery back into productive raw materials.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3">Accepted Metals</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>Copper Wires & Heavy Busbars</li>
              <li>Aluminium Utensils & Castings</li>
              <li>Brass Valves & Turnings</li>
              <li>Stainless Steel Utensils</li>
              <li>Iron Melting Scrap & Old Beams</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3">Home Appliances</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>Split & Window Air Conditioners</li>
              <li>Refrigerators & Home Freezers</li>
              <li>Washing Machines & Dryers</li>
              <li>Lead Acid Inverter Batteries</li>
              <li>Old PC Monitors & CPUs</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3">Instant Booking</h4>
            <p className="text-slate-400 text-xs">List items, set approximate weights, and schedule your pickup in minutes using our portal.</p>
            <button
              id="footer-btn-book"
              onClick={() => {
                setActiveTab('pickup');
                document.getElementById('portal-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-lg transition-all shadow-sm flex items-center gap-1 cursor-pointer"
            >
              <Calculator className="w-4 h-4" /> Book Doorstep Pickup
            </button>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800 text-center flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Scrap Dealer Bhubaneswar. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-300 transition-colors">Odisha Pollution Control Compliant</span>
            <span>•</span>
            <span className="hover:text-slate-300 transition-colors font-mono">GST Verified Recycler</span>
          </div>
        </div>
      </footer>

      {/* --- FLOATING DIAL ACTION ON MOBILE VIEWPORTS --- */}
      <div className="fixed bottom-4 right-4 z-40 lg:hidden flex flex-col gap-2">
        <a
          id="btn-floating-call"
          href="tel:7735142007"
          className="bg-amber-500 text-slate-950 font-extrabold w-12 h-12 rounded-full flex items-center justify-center shadow-lg border border-amber-400/50 hover:bg-amber-600 active:scale-95 transition-all"
          title="Call Now"
        >
          <Phone className="w-5 h-5" />
        </a>
      </div>

      {/* --- SUCCESS MODAL OVERLAY --- */}
      <AnimatePresence>
        {successBooking && (
          <motion.div
            key="success-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xl max-w-md w-full text-center relative"
            >
              <button
                id="btn-close-modal"
                onClick={() => {
                  setSuccessBooking(null);
                  setActiveTab('bookings'); // Direct user to see live status tracking
                  setTrackingBookingId(successBooking.id);
                  document.getElementById('portal-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                <Check className="w-8 h-8 stroke-[3px]" />
              </div>

              <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-100 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                Pickup Scheduled Successfully!
              </span>

              <h3 className="text-lg font-extrabold text-slate-900 mt-3 mb-1">
                Booking Reference: <span className="text-emerald-700 font-mono">{successBooking.id}</span>
              </h3>
              
              <p className="text-xs text-slate-500 leading-relaxed px-2 mb-4">
                Thank you, <span className="font-bold text-slate-800">{successBooking.name}</span>. We have scheduled your doorstep evaluation for <span className="font-bold text-slate-800">{successBooking.date}</span> during <span className="font-bold text-slate-800">{successBooking.timeSlot}</span>.
              </p>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 mb-5 text-left space-y-2">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Bhubaneswar Area:</span>
                  <span className="font-bold text-slate-800">{successBooking.area}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Est. Items Weight/Count:</span>
                  <span className="font-bold text-slate-800">{successBooking.items.length} items listed</span>
                </div>
                <div className="flex justify-between text-xs items-baseline pt-1 border-t border-dashed border-slate-200">
                  <span className="font-bold text-slate-800">Payment:</span>
                  <span className="font-bold text-emerald-700 text-xs">
                    Highest Market Rate
                  </span>
                </div>
              </div>

              <div className="border border-amber-100 bg-amber-50/50 p-3.5 rounded-xl flex items-start gap-2.5 text-left mb-5">
                <Clock className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-[11px] text-slate-700 leading-normal">
                  <p className="font-bold text-slate-900">What happens next?</p>
                  <p className="mt-0.5">Our supervisor will call your mobile <span className="font-mono font-bold text-slate-900">{successBooking.phone}</span> in 15-30 minutes to verify items and finalize the truck route.</p>
                </div>
              </div>

              <button
                id="btn-modal-track"
                onClick={() => {
                  setSuccessBooking(null);
                  setActiveTab('bookings'); // Go to bookings
                  setTrackingBookingId(successBooking.id);
                  document.getElementById('portal-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md shadow-emerald-700/10 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Track Live Request Status
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
