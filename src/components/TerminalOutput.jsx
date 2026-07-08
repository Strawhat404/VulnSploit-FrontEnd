import { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

const terminalTheme = {
  'code[class*="language-"]': { color: '#93c5fd', background: 'none', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.78rem', lineHeight: '1.65' },
  'pre[class*="language-"]': { color: '#93c5fd', background: 'transparent', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.78rem', lineHeight: '1.65', padding: 0, margin: 0, overflow: 'visible' },
  comment:     { color: '#4a4a5a' },
  string:      { color: '#67e8f9' },
  number:      { color: '#f59e0b' },
  keyword:     { color: '#f472b6' },
  operator:    { color: '#60a5fa' },
  punctuation: { color: '#6b7280' },
};

export default function TerminalOutput({ content, title = 'OUTPUT', isJson = false }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(
      typeof content === 'string' ? content : JSON.stringify(content, null, 2)
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayContent =
    typeof content === 'string'
      ? content
      : JSON.stringify(content, null, 2);

  return (
    // Outer wrapper: fixed height, no overflow — the box never grows
    <div className="rounded-lg border border-theme flex flex-col h-[420px]">

      {/* ── Header bar — fixed, never scrolls ── */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-theme-term-hd border-b border-theme flex-shrink-0 rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500/60" />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Terminal className="w-3 h-3 text-blue-400" />
            <span className="text-blue-400/60 tracking-widest font-mono">{title}</span>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-blue-400 transition-colors px-2 py-1 rounded hover:bg-blue-500/10"
        >
          {copied
            ? <><Check className="w-3 h-3 text-blue-400" /><span className="text-blue-400">Copied</span></>
            : <><Copy className="w-3 h-3" /><span>Copy</span></>
          }
        </button>
      </div>

      {/* ── Scrollable content — fills remaining height, logs scroll inside ── */}
      <div className="flex-1 bg-theme-input overflow-y-auto overflow-x-hidden min-h-0">
        {isJson && typeof content !== 'string' ? (
          <div className="p-4">
            <SyntaxHighlighter
              language="json"
              style={terminalTheme}
              customStyle={{ margin: 0, background: 'transparent', padding: 0 }}
              wrapLongLines
            >
              {JSON.stringify(content, null, 2)}
            </SyntaxHighlighter>
          </div>
        ) : (
          <pre className="p-4 text-xs font-mono text-blue-200/80 leading-relaxed whitespace-pre-wrap break-words">
            {displayContent || (
              <span className="text-gray-600 italic">No output yet...</span>
            )}
          </pre>
        )}
      </div>

      {/* ── Footer — fixed, never scrolls ── */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-theme-card border-t border-theme flex-shrink-0 rounded-b-lg">
        <span className="text-xs text-gray-700 font-mono">
          {displayContent ? `${displayContent.split('\n').length} lines` : '0 lines'}
        </span>
        <span className="text-xs text-gray-700 font-mono">
          {displayContent ? `${(new Blob([displayContent]).size / 1024).toFixed(1)} KB` : '0 KB'}
        </span>
      </div>
    </div>
  );
}
