import React, { useState } from 'react';
import { Calculator as CalcIcon, RefreshCw, ArrowRightLeft } from 'lucide-react';
import { calculateImageSizeUnits } from '../utils/formatters';

export default function Calculator() {
  const [val, setVal] = useState('100');
  const [unit, setUnit] = useState('KB');

  const parsedVal = parseFloat(val) || 0;
  let bytes = 0;
  if (unit === 'Bytes') bytes = parsedVal;
  else if (unit === 'KB') bytes = parsedVal * 1024;
  else if (unit === 'MB') bytes = parsedVal * 1024 * 1024;
  else if (unit === 'GB') bytes = parsedVal * 1024 * 1024 * 1024;

  const result = calculateImageSizeUnits(bytes);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10 animate-fade-in">
      
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300">
          <CalcIcon className="w-3.5 h-3.5" /> Unit Converter
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Image Size <span className="text-indigo-400">Calculator</span>
        </h1>
        <p className="text-sm text-slate-400">
          Convert seamlessly across binary Bytes, KB, MB, and GB.
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-[#0e1424]/90 border border-slate-800 shadow-2xl space-y-6">
        
        {/* Input */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Enter Value</label>
            <input
              type="number"
              value={val}
              onChange={(e) => setVal(e.target.value)}
              className="w-full clean-input text-base font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Source Unit</label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full clean-input text-base"
            >
              <option value="Bytes">Bytes (B)</option>
              <option value="KB">Kilobytes (KB)</option>
              <option value="MB">Megabytes (MB)</option>
              <option value="GB">Gigabytes (GB)</option>
            </select>
          </div>
        </div>

        {/* Output Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-mono">Bytes</span>
            <p className="text-sm font-bold text-white font-mono mt-1 break-all">{result.bytes.toLocaleString()}</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-mono">Kilobytes</span>
            <p className="text-sm font-bold text-indigo-400 font-mono mt-1">{result.kb} KB</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-mono">Megabytes</span>
            <p className="text-sm font-bold text-white font-mono mt-1">{result.mb} MB</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[11px] text-slate-400 block font-mono">Gigabytes</span>
            <p className="text-sm font-bold text-white font-mono mt-1">{result.gb} GB</p>
          </div>
        </div>

      </div>

    </div>
  );
}
