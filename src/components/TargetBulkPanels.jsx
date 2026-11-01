import { useState } from 'react';
import PropTypes from 'prop-types';
import { useBulkCreateTargets, useBulkVerifyTargets } from '../hooks/useTargets';

const BORDER = 'border-[#1a1d26]';
const MAX_BULK_ADD = 100;
export const MAX_BULK_VERIFY = 20;

const targetShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  value: PropTypes.string.isRequired,
  target_type: PropTypes.string,
  verification: PropTypes.shape({
    dns: PropTypes.shape({ name: PropTypes.string, value: PropTypes.string }),
    http: PropTypes.shape({ url: PropTypes.string, content: PropTypes.string }),
  }),
});

const STATUS_STYLE = {
  created: 'text-green-400',
  exists: 'text-gray-500',
  invalid: 'text-red-400',
};

function errorText(err, fallback) {
  const d = err?.response?.data;
  return d?.detail || d?.values?.[0] || fallback;
}

// Paste a list of hosts (one per line) and add them all.
export function BulkAddPanel({ onClose }) {
  const bulk = useBulkCreateTargets();
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const tooMany = lines.length > MAX_BULK_ADD;

  const submit = async () => {
    setError('');
    setResult(null);
    try {
      const data = await bulk.mutateAsync(lines);
      setResult(data);
      if (data.invalid === 0) setText('');
    } catch (err) {
      setError(errorText(err, 'Could not add targets.'));
    }
  };

  return (
    <div className={`mb-6 p-5 rounded-lg bg-[#0d0d0f] border ${BORDER} space-y-3 text-xs font-mono`}>
      <h2 className="text-sm text-gray-400">ADD MULTIPLE TARGETS</h2>
      <p className="text-gray-500">
        One per line: domains, IP addresses or URLs. Subdomains of a domain you verify with a DNS
        record are covered automatically, so you only need to add the parent domain.
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
        placeholder={'example.com\napi.example.com\n93.184.216.34'}
        className="w-full bg-[#050507] border border-[#1a1d26] rounded px-3 py-2 text-sm text-white placeholder-gray-700 focus:outline-none focus:border-blue-500/50"
      />
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={submit}
          disabled={lines.length === 0 || tooMany || bulk.isPending}
          className="px-4 py-2 bg-blue-600 text-white font-bold tracking-widest rounded hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {bulk.isPending ? 'ADDING...' : `ADD ${lines.length || ''}`.trim()}
        </button>
        <button type="button" onClick={onClose} className={`px-4 py-2 border ${BORDER} text-gray-500 rounded hover:text-white`}>
          CLOSE
        </button>
        {tooMany && <span className="text-red-400">At most {MAX_BULK_ADD} at a time.</span>}
      </div>

      {error && <p className="text-red-400">{error}</p>}

      {result && (
        <div className="space-y-1">
          <p className="text-gray-400">
            {result.created} added, {result.existing} already existed, {result.invalid} rejected.
          </p>
          {result.results
            .filter((r) => r.status !== 'created')
            .map((r) => (
              <p key={r.value} className={STATUS_STYLE[r.status]}>
                {r.value} — {r.status === 'exists' ? 'already added' : r.detail}
              </p>
            ))}
        </div>
      )}
    </div>
  );
}
BulkAddPanel.propTypes = { onClose: PropTypes.func.isRequired };

// Verify every unverified target with one method, showing what to publish for each.
export function BulkVerifyPanel({ targets, onClose }) {
  const bulk = useBulkVerifyTargets();
  const [method, setMethod] = useState('dns');
  const [confirmed, setConfirmed] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const usable = targets.filter((t) =>
    t.verification && (method === 'http' || t.verification.dns));
  const skipped = targets.length - usable.length;
  const batch = usable.slice(0, MAX_BULK_VERIFY);

  const submit = async () => {
    setError('');
    setResult(null);
    try {
      setResult(await bulk.mutateAsync({ ids: batch.map((t) => t.id), method }));
    } catch (err) {
      setError(errorText(err, 'Verification failed.'));
    }
  };

  return (
    <div className={`mb-6 p-5 rounded-lg bg-[#0d0d0f] border ${BORDER} space-y-3 text-xs font-mono`}>
      <h2 className="text-sm text-gray-400">VERIFY MULTIPLE TARGETS</h2>

      {targets.length === 0 ? (
        <p className="text-gray-500">Every target is already verified or covered.</p>
      ) : (
        <>
          <p className="text-gray-500">
            Publish the value shown for each target, then press Verify. A DNS record on a parent
            domain also covers its subdomains, so verify the parent and skip the rest.
          </p>

          <div className="flex gap-2">
            {['dns', 'http'].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => { setMethod(m); setResult(null); }}
                className={`px-3 py-1.5 rounded border ${method === m ? 'border-blue-500/50 text-blue-400' : `${BORDER} text-gray-500`}`}
              >
                {m === 'dns' ? 'DNS TXT records' : 'Files on your sites'}
              </button>
            ))}
          </div>

          <div className={`rounded border ${BORDER} divide-y divide-[#1a1d26] max-h-64 overflow-y-auto`}>
            {batch.map((t) => (
              <div key={t.id} className="px-3 py-2 space-y-0.5">
                <p className="text-white">{t.value}</p>
                {method === 'dns' ? (
                  <p className="text-gray-500 break-all">
                    TXT <span className="text-blue-300">{t.verification.dns.name}</span> ={' '}
                    <span className="text-blue-300">{t.verification.dns.value}</span>
                  </p>
                ) : (
                  <p className="text-gray-500 break-all">
                    <span className="text-blue-300">{t.verification.http.url}</span> contains{' '}
                    <span className="text-blue-300">{t.verification.http.content}</span>
                  </p>
                )}
                {result && (() => {
                  const r = result.results.find((x) => x.id === t.id);
                  return r && (
                    <p className={r.verified ? 'text-green-400' : 'text-red-400'}>
                      {r.verified ? '✓ verified' : `✗ ${r.detail}`}
                    </p>
                  );
                })()}
              </div>
            ))}
          </div>

          {skipped > 0 && (
            <p className="text-yellow-500/80">
              {skipped} target{skipped > 1 ? 's' : ''} can&apos;t use this method (for example IP
              addresses need the file method) and {skipped > 1 ? 'are' : 'is'} not listed.
            </p>
          )}
          {usable.length > MAX_BULK_VERIFY && (
            <p className="text-yellow-500/80">
              Showing the first {MAX_BULK_VERIFY} of {usable.length}. Run it again for the rest.
            </p>
          )}

          <label className="flex items-start gap-2 text-gray-400 cursor-pointer">
            <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-0.5" />
            <span>I confirm I own these targets or have explicit written permission to test them.</span>
          </label>

          {error && <p className="text-red-400">{error}</p>}
          {result && (
            <p className="text-gray-400">{result.verified} verified, {result.failed} not yet.</p>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={submit}
              disabled={!confirmed || batch.length === 0 || bulk.isPending}
              className="px-4 py-2 bg-blue-600 text-white font-bold tracking-widest rounded hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {bulk.isPending ? 'CHECKING...' : `VERIFY ${batch.length}`}
            </button>
            <button type="button" onClick={onClose} className={`px-4 py-2 border ${BORDER} text-gray-500 rounded hover:text-white`}>
              CLOSE
            </button>
          </div>
        </>
      )}
    </div>
  );
}
BulkVerifyPanel.propTypes = {
  targets: PropTypes.arrayOf(targetShape).isRequired,
  onClose: PropTypes.func.isRequired,
};
