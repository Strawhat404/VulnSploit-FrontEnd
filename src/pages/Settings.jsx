import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Terminal, Save, Lock, Mail, Bell, CheckCircle, Key, Plus, Trash2, Copy,
} from 'lucide-react';
import api from '../lib/axios';
import { useAuthStore } from '../store/authStore';

const CARD_BG = 'bg-[#0d0d0f]';
const BORDER = 'border-[#1a1d26]';

export default function Settings() {
  const { username } = useAuthStore();
  const [profile, setProfile] = useState({ email: '', notify_scan_complete: true, notify_report_ready: true });
  const [pwForm, setPwForm] = useState({ old_password: '', new_password: '' });
  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [msg, setMsg] = useState('');
  const [apiKeys, setApiKeys] = useState([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [showNewKey, setShowNewKey] = useState(false);
  const [newKeyValue, setNewKeyValue] = useState('');

  useEffect(() => {
    api.get('/api/api-keys/').then((res) => setApiKeys(res.data?.results ?? res.data)).catch(() => {});
  }, []);

  const createKey = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/api-keys/', { name: newKeyName });
      setNewKeyValue(res.data.raw_key);
      setApiKeys([res.data, ...apiKeys]);
      setNewKeyName('');
    } catch (err) {
      setMsg(err.response?.data?.detail || 'Failed to create key.');
    }
  };

  const deleteKey = async (id) => {
    if (!confirm('Revoke this API key? This cannot be undone.')) return;
    try {
      await api.delete(`/api/api-keys/${id}/`);
      setApiKeys(apiKeys.filter((k) => k.id !== id));
    } catch {
      setMsg('Failed to revoke key.');
    }
  };

  const copyKey = () => {
    navigator.clipboard.writeText(newKeyValue);
    setMsg('API key copied to clipboard.');
  };

  useEffect(() => {
    api.get('/api/profile/').then((res) => {
      setProfile({ email: res.data.email || '', notify_scan_complete: res.data.notify_scan_complete, notify_report_ready: res.data.notify_report_ready });
    }).catch(() => {});
  }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/api/profile/', profile);
      setMsg('Settings saved.');
    } catch {
      setMsg('Failed to save.');
    }
    setSaving(false);
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setChangingPw(true);
    try {
      await api.post('/api/change-password/', pwForm);
      setMsg('Password changed.');
      setPwForm({ old_password: '', new_password: '' });
    } catch (err) {
      setMsg(err.response?.data?.detail || 'Failed to change password.');
    }
    setChangingPw(false);
  };

  return (
    <div className="min-h-screen bg-black pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-2 text-xs text-gray-600 font-mono mb-1">
            <Terminal className="w-3 h-3 text-blue-400" />
            <span>root@vulnsploit:~$ settings</span>
          </div>
          <h1 className="text-2xl font-bold text-white">USER <span className="text-blue-400">SETTINGS</span></h1>
        </motion.div>

        {msg && (
          <div className="flex items-center gap-2 px-4 py-3 mb-4 rounded border border-green-500/20 bg-green-500/5 text-green-400 text-xs font-mono">
            <CheckCircle className="w-4 h-4" /> {msg}
          </div>
        )}

        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`p-5 rounded-lg ${CARD_BG} border ${BORDER}`}>
            <div className="flex items-center gap-2 mb-4">
              <Mail className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-gray-400 tracking-widest font-mono">PROFILE</span>
            </div>
            <form onSubmit={saveProfile} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-600 font-mono mb-1">USERNAME</label>
                <input type="text" value={username || ''} disabled className="w-full bg-[#050507] border border-[#1a1d26] rounded px-3 py-2 text-sm font-mono text-gray-500" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 font-mono mb-1">EMAIL</label>
                <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} placeholder="you@example.com" className="w-full bg-[#050507] border border-[#1a1d26] rounded px-3 py-2 text-sm font-mono text-white placeholder-gray-700 focus:outline-none focus:border-blue-500/50" />
              </div>
              <div className="space-y-2">
                <span className="text-xs text-gray-600 font-mono">NOTIFICATIONS</span>
                <label className="flex items-center gap-3 px-3 py-2 rounded border border-[#1a1d26] cursor-pointer hover:border-blue-500/20 transition-all">
                  <input type="checkbox" checked={profile.notify_scan_complete} onChange={(e) => setProfile({ ...profile, notify_scan_complete: e.target.checked })} className="accent-blue-500" />
                  <span className="text-xs font-mono text-gray-400">Email when scan completes</span>
                </label>
                <label className="flex items-center gap-3 px-3 py-2 rounded border border-[#1a1d26] cursor-pointer hover:border-blue-500/20 transition-all">
                  <input type="checkbox" checked={profile.notify_report_ready} onChange={(e) => setProfile({ ...profile, notify_report_ready: e.target.checked })} className="accent-blue-500" />
                  <span className="text-xs font-mono text-gray-400">Email when report is ready</span>
                </label>
              </div>
              <button type="submit" disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-bold tracking-widest rounded hover:bg-blue-500 disabled:opacity-40 transition-all">
                <Save className="w-3.5 h-3.5" /> {saving ? 'SAVING...' : 'SAVE'}
              </button>
            </form>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={`p-5 rounded-lg ${CARD_BG} border ${BORDER}`}>
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-gray-400 tracking-widest font-mono">CHANGE PASSWORD</span>
            </div>
            <form onSubmit={changePassword} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-600 font-mono mb-1">CURRENT PASSWORD</label>
                <input type="password" value={pwForm.old_password} onChange={(e) => setPwForm({ ...pwForm, old_password: e.target.value })} required className="w-full bg-[#050507] border border-[#1a1d26] rounded px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-blue-500/50" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 font-mono mb-1">NEW PASSWORD</label>
                <input type="password" value={pwForm.new_password} onChange={(e) => setPwForm({ ...pwForm, new_password: e.target.value })} required minLength={8} className="w-full bg-[#050507] border border-[#1a1d26] rounded px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-blue-500/50" />
              </div>
              <button type="submit" disabled={changingPw} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white text-xs font-bold tracking-widest rounded hover:bg-cyan-500 disabled:opacity-40 transition-all">
                <Lock className="w-3.5 h-3.5" /> {changingPw ? 'CHANGING...' : 'CHANGE PASSWORD'}
              </button>
            </form>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={`p-5 rounded-lg ${CARD_BG} border ${BORDER}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-400" />
                <span className="text-xs text-gray-400 tracking-widest font-mono">API KEYS</span>
              </div>
              <button
                onClick={() => { setShowNewKey(true); setNewKeyValue(''); }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 text-white text-xs font-bold tracking-widest rounded hover:bg-amber-500 transition-all"
              >
                <Plus className="w-3 h-3" /> NEW KEY
              </button>
            </div>

            {newKeyValue && (
              <div className="mb-4 p-4 rounded border border-amber-500/20 bg-amber-500/5">
                <p className="text-xs font-mono text-amber-400 mb-2">Key created! Copy it now — you won't see it again.</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 bg-black rounded text-sm font-mono text-amber-300 break-all">{newKeyValue}</code>
                  <button onClick={copyKey} className="p-2 rounded border border-amber-500/20 text-amber-400 hover:bg-amber-500/10 transition-all">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {showNewKey && !newKeyValue && (
              <form onSubmit={createKey} className="mb-4 flex gap-2">
                <input
                  type="text" value={newKeyName} required
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g. CI/CD Pipeline"
                  className="flex-1 bg-[#050507] border border-[#1a1d26] rounded px-3 py-2 text-sm font-mono text-white placeholder-gray-700 focus:outline-none focus:border-amber-500/50"
                />
                <button type="submit" className="px-4 py-2 bg-amber-600 text-white text-xs font-bold tracking-widest rounded hover:bg-amber-500 transition-all">
                  CREATE
                </button>
                <button type="button" onClick={() => setShowNewKey(false)} className="px-3 py-2 border border-[#1a1d26] text-gray-500 text-xs font-mono rounded hover:text-white transition-all">
                  CANCEL
                </button>
              </form>
            )}

            {apiKeys.length === 0 ? (
              <div className="text-center py-6 text-gray-600 text-xs font-mono">No API keys created yet.</div>
            ) : (
              <div className="space-y-2">
                {apiKeys.map((key) => (
                  <div key={key.id} className="flex items-center justify-between px-3 py-2.5 rounded border border-[#1a1d26]">
                    <div className="flex items-center gap-3">
                      <Key className="w-3.5 h-3.5 text-amber-400/50" />
                      <div>
                        <p className="text-sm font-mono text-white">{key.name}</p>
                        <p className="text-xs font-mono text-gray-600">
                          {key.prefix}... · {key.is_active ? 'Active' : 'Revoked'}
                          {key.last_used_at && ` · Last used ${new Date(key.last_used_at).toLocaleDateString()}`}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteKey(key.id)}
                      className="p-1.5 rounded border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all"
                      title="Revoke"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
