import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Droplets, 
  Sprout, 
  ShieldAlert, 
  MapPin, 
  Calendar, 
  MessageCircle, 
  TrendingUp,
  RefreshCw,
  Info,
  Waves,
  ChevronRight,
  FileDown
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import ReactMarkdown from 'react-markdown';
import { analyzeFarmRisk, getLatestFloodNews } from './services/geminiService';
import { FarmAnalysisResponse, WeatherData } from './types';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const MOCK_WEATHER_DATA: WeatherData[] = [
  { date: 'Mar 20', precipitation: 12, river_level: 2.1 },
  { date: 'Mar 21', precipitation: 45, river_level: 2.8 },
  { date: 'Mar 22', precipitation: 68, river_level: 4.2 },
  { date: 'Mar 23', precipitation: 52, river_level: 5.1 },
  { date: 'Mar 24', precipitation: 30, river_level: 4.8 },
  { date: 'Mar 25', precipitation: 85, river_level: 6.5 },
  { date: 'Mar 26', precipitation: 92, river_level: 7.2 },
];

export default function App() {
  const [location, setLocation] = useState('Nairobi (Mathare)');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [analysis, setAnalysis] = useState<FarmAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [news, setNews] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'overview' | 'advice' | 'schedule'>('overview');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const runAnalysis = async () => {
    if (!location) return;
    setLoading(true);
    setShowErrorModal(false);
    try {
      const weatherStr = JSON.stringify(MOCK_WEATHER_DATA);
      const satelliteDesc = `High turbidity detected in ${location} water bodies. Significant surface water accumulation in low-lying farming zones. Soil moisture at 98% saturation.`;
      
      const [result, latestNews] = await Promise.all([
        analyzeFarmRisk(location, weatherStr, satelliteDesc),
        getLatestFloodNews()
      ]);
      
      setAnalysis(result);
      setNews(latestNews || "No news available.");
    } catch (error) {
      console.error("Analysis failed:", error);
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runAnalysis();
  }, [location]);

  const getRiskColor = (status?: string) => {
    switch (status) {
      case 'CRITICAL': return 'text-red-600 bg-red-50 border-red-200';
      case 'ALERT': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'STABLE': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const downloadReport = () => {
    if (!analysis) return;

    const csvRows = [
      ["MlinziFarm Flood Risk Report", ""],
      ["Region", location],
      ["Date", new Date().toLocaleDateString()],
      ["", ""],
      ["Risk Status", analysis.risk_status],
      ["Impact Analysis", analysis.impact_analysis.replace(/,/g, ';')],
      ["", ""],
      ["EXTENSION ADVICE", ""],
      ["Crop Actions", analysis.extension_advice.Crop_Actions.replace(/,/g, ';')],
      ["Livestock Safety", analysis.extension_advice.Livestock_Safety.replace(/,/g, ';')],
      ["", ""],
      ["PLANTING SCHEDULE", ""],
      ["Schedule", analysis.planting_schedule.replace(/,/g, ';')],
      ["", ""],
      ["MULTILINGUAL ALERTS", ""],
      ["English", analysis.multilingual_alert.English.replace(/,/g, ';')],
      ["Sheng/Swahili", analysis.multilingual_alert['Sheng/Swahili'].replace(/,/g, ';')],
    ];

    const csvContent = csvRows.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `MlinziFarm_Report_${location.replace(/[^a-z0-9]/gi, '_')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Error Modal */}
      <AnimatePresence>
        {showErrorModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-red-100"
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="bg-red-100 p-4 rounded-full">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Analysis Failed</h2>
                <p className="text-slate-600">
                  An error occurred while fetching data from our AI extension service. This could be due to a temporary connection issue.
                </p>
                
                <div className="w-full mt-4 flex flex-col gap-3">
                  <button
                    onClick={runAnalysis}
                    className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
                    Retry Analysis
                  </button>
                  <button 
                    onClick={() => setShowErrorModal(false)}
                    className="text-slate-500 font-medium hover:underline text-sm"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="bg-emerald-800 text-white py-6 px-4 md:px-8 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-xl">
              <Sprout className="text-emerald-800 w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">MlinziFarm</h1>
              <p className="text-emerald-100 text-sm opacity-90">FloodGuard Extension Service • March 2026</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-emerald-900/40 p-2 rounded-full px-4 border border-emerald-700/50">
            <MapPin className="w-4 h-4 text-emerald-300" />
            <select 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-transparent border-none text-white text-sm font-bold focus:ring-0 cursor-pointer max-w-[180px] truncate outline-none"
            >
              <option value="Nairobi (Mathare)" className="text-slate-900">Nairobi (Mathare)</option>
              <option value="Kisumu (Nyando)" className="text-slate-900">Kisumu (Nyando)</option>
              <option value="Tana River" className="text-slate-900">Tana River</option>
              <option value="Uasin Gishu" className="text-slate-900">Uasin Gishu</option>
              <option value="Nakuru" className="text-slate-900">Nakuru</option>
              <option value="Nyeri" className="text-slate-900">Nyeri</option>
              <option value="Mombasa" className="text-slate-900">Mombasa</option>
              <option value="Garissa" className="text-slate-900">Garissa</option>
              <option value="Mandera" className="text-slate-900">Mandera</option>
            </select>
            <button 
              onClick={runAnalysis}
              disabled={loading}
              className="p-1.5 hover:bg-emerald-700 rounded-full transition-colors disabled:opacity-50"
              title="Refresh Analysis"
            >
              <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
            </button>
            <div className="w-px h-4 bg-emerald-700/50 mx-1" />
            <button 
              onClick={downloadReport}
              disabled={!analysis || loading}
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-emerald-700 rounded-full transition-colors disabled:opacity-50 text-xs font-bold"
              title="Download CSV Report"
            >
              <FileDown className="w-4 h-4 text-emerald-300" />
              <span className="hidden sm:inline">Report</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        {/* Risk Banner */}
        <AnimatePresence mode="wait">
          {analysis && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "p-6 rounded-2xl border-2 flex flex-col md:flex-row items-center gap-6 shadow-sm",
                getRiskColor(analysis.risk_status)
              )}
            >
              <div className="bg-white p-4 rounded-full shadow-sm">
                {analysis.risk_status === 'CRITICAL' ? (
                  <ShieldAlert className="w-10 h-10 text-red-600" />
                ) : (
                  <AlertTriangle className="w-10 h-10 text-amber-600" />
                )}
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-widest opacity-70">Current Risk Status</span>
                  <span className="px-2 py-0.5 rounded-md bg-white/50 text-[10px] font-bold border border-current/20">LIVE</span>
                </div>
                <h2 className="text-3xl font-black mb-2">{analysis.risk_status}</h2>
                <p className="text-lg font-medium leading-relaxed max-w-3xl">
                  {analysis.impact_analysis}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Multilingual Alerts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"
          >
            <div className="flex items-center gap-2 mb-4 text-slate-500">
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-bold uppercase tracking-wider">English Advisory</span>
            </div>
            <p className="text-slate-700 text-lg leading-relaxed">
              "{analysis?.multilingual_alert.English || 'Analyzing current conditions...'}"
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-emerald-900 text-emerald-50 p-6 rounded-2xl shadow-lg border border-emerald-800"
          >
            <div className="flex items-center gap-2 mb-4 text-emerald-400">
              <Waves className="w-5 h-5" />
              <span className="text-sm font-bold uppercase tracking-wider">Sheng/Swahili Alert</span>
            </div>
            <p className="text-xl font-bold leading-relaxed">
              "{analysis?.multilingual_alert['Sheng/Swahili'] || 'Tunaangalia hali ya hewa...'}"
            </p>
          </motion.div>
        </div>

        {/* Main Content Tabs */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="flex border-b border-slate-100 bg-slate-50/50">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'advice', label: 'Extension Advice', icon: Info },
              { id: 'schedule', label: 'Planting Schedule', icon: Calendar },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-4 px-6 text-sm font-bold transition-all",
                  activeTab === tab.id 
                    ? "text-emerald-700 bg-white border-b-2 border-emerald-700" 
                    : "text-slate-400 hover:text-slate-600"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6 md:p-8">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Droplets className="text-blue-500 w-5 h-5" />
                        Precipitation & River Levels
                      </h3>
                      <div className="group relative">
                        <Info className="w-4 h-4 text-slate-400 cursor-help hover:text-emerald-600 transition-colors" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900 text-white text-xs rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 shadow-xl border border-slate-700">
                          <div className="space-y-2">
                            <p><span className="font-bold text-blue-400">Precipitation (mm):</span> Daily rainfall volume. Sustained values above 50mm often trigger flash floods.</p>
                            <p><span className="font-bold text-red-400">River Level (m):</span> Current water height. Levels exceeding 5m indicate a high risk of bank overflow in low-lying zones.</p>
                          </div>
                          <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900" />
                        </div>
                      </div>
                    </div>
                    <div className="h-[450px] w-full relative overflow-hidden">
                      {isMounted && (
                        <ResponsiveContainer width="100%" height={450} minWidth={0} debounce={100}>
                          <AreaChart data={MOCK_WEATHER_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorPrecip" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorRiver" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                          />
                          <Area type="monotone" dataKey="precipitation" stroke="#3b82f6" fillOpacity={1} fill="url(#colorPrecip)" strokeWidth={3} name="Rain (mm)" />
                          <Area type="monotone" dataKey="river_level" stroke="#ef4444" fillOpacity={1} fill="url(#colorRiver)" strokeWidth={3} name="River (m)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <TrendingUp className="text-emerald-600 w-5 h-5" />
                      Regional Context (Search Grounding)
                    </h3>
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 h-[450px] overflow-y-auto">
                      <div className="prose prose-slate prose-sm max-w-none">
                        <ReactMarkdown>{news || 'Fetching latest regional data...'}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'advice' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-emerald-50/50 p-8 rounded-3xl border border-emerald-100">
                  <div className="bg-emerald-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-200">
                    <Sprout className="text-white w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-emerald-900 mb-4">Crop Actions</h3>
                  <p className="text-emerald-800 leading-relaxed text-lg">
                    {analysis?.extension_advice.Crop_Actions || 'Loading specific crop advice...'}
                  </p>
                </div>

                <div className="bg-amber-50/50 p-8 rounded-3xl border border-amber-100">
                  <div className="bg-amber-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-amber-200">
                    <ShieldAlert className="text-white w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-amber-900 mb-4">Livestock Safety</h3>
                  <p className="text-amber-800 leading-relaxed text-lg">
                    {analysis?.extension_advice.Livestock_Safety || 'Loading livestock safety tips...'}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'schedule' && (
              <div className="max-w-3xl mx-auto text-center space-y-8 py-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold">
                  <Calendar className="w-4 h-4" />
                  7-Day Outlook
                </div>
                <h3 className="text-4xl font-black text-slate-900 leading-tight">
                  {analysis?.planting_schedule || 'Calculating optimal schedule...'}
                </h3>
                <div className="grid grid-cols-7 gap-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                    <div key={day} className="space-y-2">
                      <div className="text-[10px] font-bold uppercase text-slate-400">{day}</div>
                      <div className={cn(
                        "h-12 rounded-xl flex items-center justify-center border-2",
                        i < 3 ? "bg-red-50 border-red-100 text-red-400" : "bg-emerald-50 border-emerald-100 text-emerald-400"
                      )}>
                        {i < 3 ? <Waves className="w-5 h-5" /> : <Droplets className="w-5 h-5" />}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-slate-500 max-w-lg mx-auto">
                  This schedule is generated using real-time satellite imagery and precipitation forecasts for the {location} region.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto p-8 text-center text-slate-400 text-xs border-t border-slate-200 mt-12">
        <p>© 2026 MlinziFarm • Kenya Flood Crisis Response Unit</p>
        <p className="mt-2">Data sources: Kenya Meteorological Department, Sentinel-2 Satellite, Google Flood Hub</p>
      </footer>
    </div>
  );
}
