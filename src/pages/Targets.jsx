import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus, Edit3, Trash2, Zap, Terminal, Globe,
  Server, Link, Network, Tag,
} from 'lucide-react';
import { useTargets, useCreateTarget, useUpdateTarget, useDeleteTarget } from '../hooks/useTargets';

const CARD_BG = 'bg-[#0d0d0f]';
const BORDER = 'border-[#1a1d26]';

function guessTargetType(value) {
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(value)) return 'ip';
  if (/^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/.test(value)) return 'cidr';
  if (/^https?:\/\//.test(value)) return 'url';
  return 'domain';
}

const TYPE_ICONS = { domain: Globe, ip: Server, url: Link, cidr: Network };
const TYPE_COLORS = { domain: 'text-blue-400', ip: 'text-cyan-400', url: 'text-amber-400', cidr: 'text-purple-400' };
const TYPE_LABELS = { domain: 'Domain', ip: 'IP', url: 'URL', cidr: 'CIDR' };

export default function Targets() {
  const navigate = useNavigate();
  const { data: targets = [], isLoading } = useTargets();
  const createTarget = useCreateTarget();
  const updateTarget = useUpdateTarget();
  const deleteTarget = useDeleteTarget();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', value: '', notes: '', tags: '' });

  const resetForm = () => {
    setForm({ name: '', value: '', notes: '', tags: '' });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...form,
      target_type: guessTargetType(form.value),
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    };
    if (editing) {
      await updateTarget.mutateAsync({ id: editing, ...data });
    } else {
      await createTarget.mutateAsync(data);
    }
    resetForm();
  };

  const handleEdit = (t) => {
    setForm({ name: t.name, value: t.value, notes: t.notes || '', tags: (t.tags || []).join(', ') });
    setEditing(t.id);
    setShowForm(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black pb-12 px-4 flex items-center justify-center">
        <Terminal className="w-5 h-5 text-blue-400/30 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-600 font-mono mb-1">
              <Terminal className="w-3 h-3 text-blue-400" />
              <span>root@vulnsploit:~$ targets</span>
            </div>
            <h1 className="text-2xl font-bold text-white">ASSET <span className="text-blue-400">TARGETS</span></h1>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-bold tracking-widest rounded hover:bg-blue-500 transition-all"
          >
            <Plus className="w-4 h-4" /> ADD TARGET
          </button>
        </motion.div>

        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`mb-6 p-5 rounded-lg ${CARD_BG} border ${BORDER}`}>
            <h2 className="text-sm font-mono text-gray-400 mb-4">{editing ? 'EDIT TARGET' : 'NEW TARGET'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 font-mono mb-1">NAME</label>
                  <input
                    type="text" required value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Production API, Dev Server..."
                    className="w-full bg-[#050507] border border-[#1a1d26] rounded px-3 py-2 text-sm font-mono text-white placeholder-gray-700 focus:outline-none focus:border-blue-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 font-mono mb-1">VALUE</label>
                  <input
                    type="text" required value={form.value}
                    onChange={(e) => setForm({ ...form, value: e.target.value })}
                    placeholder="example.com, 192.168.1.1, https://..."
                    className="w-full bg-[#050507] border border-[#1a1d26] rounded px-3 py-2 text-sm font-mono text-white placeholder-gray-700 focus:outline-none focus:border-blue-500/50"
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-600 font-mono mb-1">TAGS (comma-separated)</label>
                  <input
                    type="text" value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    placeholder="production, critical, web"
                    className="w-full bg-[#050507] border border-[#1a1d26] rounded px-3 py-2 text-sm font-mono text-white placeholder-gray-700 focus:outline-none focus:border-blue-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 font-mono mb-1">TYPE (auto-detected)</label>
                  <div className="w-full bg-[#050507] border border-[#1a1d26] rounded px-3 py-2 text-sm font-mono text-gray-500">
                    {form.value ? guessTargetType(form.value) : '—'}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-600 font-mono mb-1">NOTES</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={2}
                  className="w-full bg-[#050507] border border-[#1a1d26] rounded px-3 py-2 text-sm font-mono text-white placeholder-gray-700 focus:outline-none focus:border-blue-500/50"
                />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white text-xs font-bold tracking-widest rounded hover:bg-blue-500 transition-all">
                  {editing ? 'UPDATE' : 'CREATE'}
                </button>
                <button type="button" onClick={resetForm} className="px-4 py-2 border border-[#1a1d26] text-gray-500 text-xs font-mono rounded hover:text-white transition-all">
                  CANCEL
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {targets.length === 0 ? (
          <div className={`p-12 text-center rounded-lg ${CARD_BG} border ${BORDER}`}>
            <div className="text-gray-600 font-mono text-sm mb-4">No targets saved yet.</div>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-600 text-white text-xs font-bold tracking-widest rounded hover:bg-blue-500 transition-all"
            >
              ADD YOUR FIRST TARGET
            </button>
          </div>
        ) : (
          <div className={`rounded-lg ${CARD_BG} border ${BORDER} overflow-hidden`}>
            <div className={`grid grid-cols-12 gap-2 px-5 py-3 border-b ${BORDER} text-xs text-gray-600 font-mono tracking-widest`}>
              <div className="col-span-3">NAME</div>
              <div className="col-span-4">VALUE</div>
              <div className="col-span-1">TYPE</div>
              <div className="col-span-2">TAGS</div>
              <div className="col-span-2 text-right">ACTIONS</div>
            </div>
            <div className={`divide-y ${BORDER}`}>
              {targets.map((t) => {
                const TypeIcon = TYPE_ICONS[t.target_type] || Globe;
                const typeColor = TYPE_COLORS[t.target_type] || 'text-gray-400';
                return (
                  <div key={t.id} className={`grid grid-cols-12 gap-2 px-5 py-3.5 items-center hover:bg-blue-500/5 transition-colors`}>
                    <div className="col-span-3">
                      <p className="text-sm text-white font-mono truncate">{t.name}</p>
                    </div>
                    <div className="col-span-4">
                      <p className="text-sm text-gray-400 font-mono truncate">{t.value}</p>
                    </div>
                    <div className="col-span-1">
                      <div className={`flex items-center gap-1 ${typeColor}`}>
                        <TypeIcon className="w-3 h-3" />
                        <span className="text-xs font-mono">{TYPE_LABELS[t.target_type]}</span>
                      </div>
                    </div>
                    <div className="col-span-2 flex gap-1 flex-wrap">
                      {(t.tags || []).slice(0, 3).map((tag) => (
                        <span key={tag} className="text-xs px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="col-span-2 flex items-center justify-end gap-2">
                      <button
                        onClick={() => navigate(`/scan?target=${encodeURIComponent(t.value)}`)}
                        className="p-1.5 rounded border border-blue-500/20 text-blue-400 hover:bg-blue-500/10 transition-all"
                        title="Scan now"
                      >
                        <Zap className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleEdit(t)}
                        className="p-1.5 rounded border border-[#1a1d26] text-gray-500 hover:text-white hover:border-gray-600 transition-all"
                        title="Edit"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => { if (confirm('Delete this target?')) deleteTarget.mutate(t.id); }}
                        className="p-1.5 rounded border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
