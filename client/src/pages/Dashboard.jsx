import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  HardDrive,
  TrendingDown,
  Target,
  Trash2,
  RefreshCw,
  Search,
  LogOut
} from 'lucide-react';
import { getHistoryApi, getStatsApi, deleteHistoryApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({
    imagesProcessed: 0,
    totalOriginalSize: '0 Bytes',
    totalSavedSize: '0 Bytes',
    averageCompression: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOperation, setSelectedOperation] = useState('ALL');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadDashboardData();
  }, [user, navigate]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [historyRes, statsRes] = await Promise.all([
        getHistoryApi(),
        getStatsApi()
      ]);

      if (historyRes.success) setHistory(historyRes.data);
      if (statsRes.success) setStats(statsRes.data);
    } catch (error) {
      console.warn('Dashboard load error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await deleteHistoryApi(id);
      setHistory((prev) => prev.filter((item) => item.id !== id));
      const statsRes = await getStatsApi();
      if (statsRes.success) setStats(statsRes.data);
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const filteredHistory = history.filter((item) => {
    const matchesSearch = item.filename.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOp = selectedOperation === 'ALL' || item.operation === selectedOperation;
    return matchesSearch && matchesOp;
  });

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8 animate-fade-in">
      
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-[#0e1424]/90 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Welcome back, {user?.name || 'Creator'}
            </h1>
            <p className="text-xs text-slate-400 font-mono">{user?.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadDashboardData}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-rose-400 text-xs font-semibold border border-slate-800 transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 font-medium">Images Processed</span>
          <p className="text-2xl font-black text-white font-mono">{stats.imagesProcessed}</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 font-medium">Total Original Size</span>
          <p className="text-2xl font-black text-white font-mono">{stats.totalOriginalSize}</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 font-medium">Bandwidth Saved</span>
          <p className="text-2xl font-black text-emerald-400 font-mono">{stats.totalSavedSize}</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 font-medium">Average Reduction</span>
          <p className="text-2xl font-black text-indigo-300 font-mono">{stats.averageCompression}%</p>
        </div>
      </div>

      {/* History Table Container */}
      <div className="p-5 rounded-2xl bg-[#0e1424]/90 border border-slate-800 space-y-4">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-white">Processing History</h3>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search file..."
                className="w-full clean-input pl-8 py-1.5 text-xs font-mono"
              />
            </div>

            <select
              value={selectedOperation}
              onChange={(e) => setSelectedOperation(e.target.value)}
              className="clean-input py-1.5 text-xs"
            >
              <option value="ALL">All</option>
              <option value="COMPRESS">Compress</option>
              <option value="RESIZE">Resize</option>
              <option value="CONVERT">Convert</option>
              <option value="EDIT">Edit</option>
              <option value="BATCH">Batch</option>
            </select>
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500 space-y-2">
            <p>No history records found.</p>
            <Link to="/compress" className="text-indigo-400 hover:underline font-semibold block">
              Compress an image now
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                  <th className="pb-2 pl-2">Filename</th>
                  <th className="pb-2">Operation</th>
                  <th className="pb-2">Original</th>
                  <th className="pb-2">Final</th>
                  <th className="pb-2">Saved</th>
                  <th className="pb-2">Date</th>
                  <th className="pb-2 text-right pr-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="py-3 pl-2 font-semibold text-white max-w-xs truncate">{item.filename}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 border border-slate-800 text-slate-300">
                        {item.operation}
                      </span>
                    </td>
                    <td className="py-3 text-slate-400">{item.originalSize}</td>
                    <td className="py-3 font-bold text-emerald-400">{item.finalSize}</td>
                    <td className="py-3 text-emerald-400">{item.savingsPercent}%</td>
                    <td className="py-3 text-slate-500 text-[11px]">{new Date(item.date).toLocaleDateString()}</td>
                    <td className="py-3 text-right pr-2">
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                        title="Delete log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
}
