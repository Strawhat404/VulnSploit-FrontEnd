import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Clock, Plus, Trash2, ToggleLeft, ToggleRight, Calendar } from 'lucide-react';
import api from '../lib/axios';

const CARD_BG = 'bg-[#0d0d0f]';
const BORDER = 'border-[#1a1d26]';

const SCAN_TYPES = [
  { value: 'quick', label: 'Quick Scan' }, { value: 'full', label: 'Full Scan' },
  { value: 'nikto', label: 'Nikto' }, { value: 'gobuster', label: 'Gobuster' },
  { value: 'nuclei', label: 'Nuclei' }, { value: 'whatweb', label: 'WhatWeb' },
  { value: 'subfinder', label: 'Subfinder' }, { value: 'wpscan', label: 'WPScan' },
  { value: 'testssl', label: 'TestSSL' }, { value: 'headers', label: 'Headers Check' },
  { value: 'sqlmap', label: 'SQLMap' }, { value: 'full_recon', label: 'Full Recon' },
];

const PRESET_CRONS = [
  { label: 'Every hour', value: '0 * * * *' },
  { label: 'Daily at 2am', value: '0 2 * * *' },
  { label: 'Weekly on Monday', value: '0 2 * * 1' },
  { label: 'Every 6 hours', value: '0 */6 * * *' },
];

export default function ScheduledScans() {
  const [schedules, setSchedules] = useState([]);
  const [form, setForm] = useState({ target: '', scan_type: 'quick', cron: '' });
  const [showForm, setShowForm] = useState(false);

  const fetch = () => api.get('/api/scheduled-scans/').then((r) => setSchedules(r.data?.results ?? r.data)).catch(() => {});

  useEffect(() => { fetch(); }, []);

  const create = async (e) => {
    e.preventDefault();
    await api.post('/api/scheduled-scans/', form);
    setForm({ target: '', scan_type: 'quick', cron: '' });
    setShowForm(false);
    fetch();
  };

  const toggle = async (s) => {
    await api.put(`/api/scheduled-scans/${s.id}/`, { is_active: !s.is_active });
    fetch();
  };

  const remove = async (id) => {
    if (!confirm('Delete this schedule?')) return;
    await api.delete(`/api/scheduled-scans/${id}/`);
    fetch();
  };

  return (
    <div className="min-h-screen bg-black pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-600 font-mono mb-1">
              <Terminal className="w-3 h-3 text-blue-400" />
              <span>root@vulnsploit:~$ schedule</span>
            </div>
            <h1 className="text-2xl font-bold text-white">SCHEDULED <span className="text-blue-400">SCANS</span></h1>
          </div>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-bold tracking-widest rounded hover:bg-blue-500 transition-all">
            <Plus className="w-4 h-4" /> ADD SCHEDULE
          </button>
        </motion.div>

        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`mb-6 p-5 rounded-lg ${CARD_BG} border ${BORDER}`}>
            <h2 className="text-sm font-mono text-gray-400 mb-4">NEW SCHEDULE</h2>
            <form onSubmit={create} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-600 font-mono mb-1">TARGET</label>
                <input type="text" required value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} placeholder="example.com" className="w-full bg-[#050507] border border-[#1a1d26] rounded px-3 py-2 text-sm font-mono text-white placeholder-gray-700 focus:outline-none focus:border-blue-500/50" />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 font-mono mb-1">SCAN TYPE</label>
                  <select value={form.scan_type} onChange={(e) => setForm({ ...form, scan_type: e.target.value })} className="w-full bg-[#050507] border border-[#1a1d26] rounded px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-blue-500/50">
                    {SCAN_TYPES.map((t) => (<option key={t.value} value={t.value}>{t.label}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 font-mono mb-1">SCHEDULE</label>
                  <input type="text" required value={form.cron} onChange={(e) => setForm({ ...form, cron: e.target.value })} placeholder="0 2 * * *" className="w-full bg-[#050507] border border-[#1a1d26] rounded px-3 py-2 text-sm font-mono text-white placeholder-gray-700 focus:outline-none focus:border-blue-500/50" />
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {PRESET_CRONS.map((p) => (
                  <button key={p.value} type="button" onClick={() => setForm({ ...form, cron: p.value })} className={`px-3 py-1.5 rounded text-xs font-mono border transition-all ${form.cron === p.value ? 'border-blue-500/30 bg-blue-500/10 text-blue-400' : 'border-[#1a1d26] text-gray-500 hover:text-gray-300'}`}>
                    {p.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white text-xs font-bold tracking-widest rounded hover:bg-blue-500 transition-all">CREATE</button>
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border border-[#1a1d26] text-gray-500 text-xs font-mono rounded hover:text-white transition-all">CANCEL</button>
              </div>
            </form>
          </motion.div>
        )}

        {schedules.length === 0 ? (
          <div className={`p-12 text-center rounded-lg ${CARD_BG} border ${BORDER}`}>
            <div className="text-gray-600 font-mono text-sm mb-4">No scheduled scans.</div>
            <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-blue-600 text-white text-xs font-bold tracking-widest rounded hover:bg-blue-500 transition-all">CREATE A SCHEDULE</button>
          </div>
        ) : (
          <div className={`rounded-lg ${CARD_BG} border ${BORDER} overflow-hidden`}>
            <div className={`grid grid-cols-12 gap-2 px-5 py-3 border-b ${BORDER} text-xs text-gray-600 font-mono tracking-widest`}>
              <div className="col-span-3">TARGET</div>
              <div className="col-span-2">TYPE</div>
              <div className="col-span-3">SCHEDULE</div>
              <div className="col-span-2">STATUS</div>
              <div className="col-span-2 text-right">ACTIONS</div>
            </div>
            <div className={`divide-y ${BORDER}`}>
              {schedules.map((s) => (
                <div key={s.id} className={`grid grid-cols-12 gap-2 px-5 py-3.5 items-center hover:bg-blue-500/5 transition-colors`}>
                  <div className="col-span-3"><p className="text-sm font-mono text-white truncate">{s.target}</p></div>
                  <div className="col-span-2"><p className="text-xs font-mono text-gray-400">{s.scan_type}</p></div>
                  <div className="col-span-3 flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-gray-600" />
                    <p className="text-xs font-mono text-gray-400">{s.cron}</p>
                  </div>
                  <div className="col-span-2">
                    <span className={`text-xs font-mono px-2 py-0.5 rounded ${s.is_active ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-500'}`}>
                      {s.is_active ? 'Active' : 'Paused'}
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center justify-end gap-2">
                    <button onClick={() => toggle(s)} className="p-1.5 rounded border border-[#1a1d26] text-gray-500 hover:text-blue-400 transition-all">
                      {s.is_active ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => remove(s.id)} className="p-1.5 rounded border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
