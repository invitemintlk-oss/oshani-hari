import React, { useState } from 'react';
import { Toaster, toast } from 'sonner';
import { Link2, Copy, MessageCircle, Heart } from 'lucide-react';
import {
  PREFIXES,
  PrefixCode,
  buildDisplayName,
  buildInviteLink,
  buildMessage,
  BRIDE_NAME,
  GROOM_NAME,
} from '../guest';

export const AdminPage: React.FC = () => {
  const [prefix, setPrefix] = useState<PrefixCode>('mr');
  const [guestName, setGuestName] = useState('');
  const [generated, setGenerated] = useState<{ link: string; displayName: string; message: string } | null>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const displayName = buildDisplayName(prefix, guestName);
    if (!displayName) {
      toast.error('Please enter a guest name');
      return;
    }
    const link = buildInviteLink(window.location.origin, prefix, guestName);
    setGenerated({ link, displayName, message: buildMessage(displayName, link) });
  };

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for browsers that block the async clipboard API
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    toast.success(label);
  };

  const inputClass =
    'w-full bg-white px-5 py-3 rounded-xl border border-brand-gold/40 focus:ring-2 focus:ring-brand-gold/30 focus:border-brand-mocha/40 outline-none font-sans text-brand-mocha';
  const buttonBase =
    'flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-sans text-xs font-bold uppercase tracking-[0.15em] transition-all disabled:opacity-40 disabled:cursor-not-allowed';

  return (
    <div className="min-h-screen bg-brand-champagne font-sans text-brand-mocha px-4 py-10 sm:py-16">
      <Toaster position="top-center" richColors />
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <Heart className="w-6 h-6 mx-auto mb-4 text-brand-gold fill-brand-gold/20" />
          <h1 className="font-display text-3xl sm:text-4xl mb-2">
            {BRIDE_NAME} & {GROOM_NAME}
          </h1>
          <p className="text-xs uppercase tracking-[0.3em] text-brand-sand font-semibold">Invitation Link Generator</p>
        </div>

        <form
          onSubmit={handleGenerate}
          className="bg-white/90 rounded-2xl border border-brand-gold/30 shadow-[0_20px_40px_rgba(197,160,89,0.12)] p-6 sm:p-8 space-y-5"
        >
          <div>
            <label className="block text-[11px] uppercase tracking-[0.2em] font-bold text-brand-sand mb-2">Select Prefix</label>
            <select className={inputClass} value={prefix} onChange={(e) => setPrefix(e.target.value as PrefixCode)}>
              {PREFIXES.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-[0.2em] font-bold text-brand-sand mb-2">Guest Name</label>
            <input
              className={inputClass}
              type="text"
              placeholder="e.g. Sanjaya"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <button type="submit" className={`${buttonBase} bg-brand-mocha text-white hover:bg-brand-mocha/90`}>
              <Link2 className="w-4 h-4" /> Generate Link
            </button>
            <button
              type="button"
              disabled={!generated}
              onClick={() => generated && copy(generated.link, 'Link copied!')}
              className={`${buttonBase} border border-brand-gold/50 bg-white hover:bg-brand-gold/10`}
            >
              <Copy className="w-4 h-4" /> Copy Link Only
            </button>
            <button
              type="button"
              disabled={!generated}
              onClick={() => generated && copy(generated.message, 'Message copied!')}
              className={`${buttonBase} border border-brand-gold/50 bg-white hover:bg-brand-gold/10`}
            >
              <MessageCircle className="w-4 h-4" /> Copy Full Message
            </button>
          </div>
        </form>

        {generated && (
          <div className="mt-8 space-y-5">
            <div className="bg-white/90 rounded-2xl border border-brand-gold/30 p-6">
              <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-brand-sand mb-2">Generated Link</p>
              <a
                href={generated.link}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all text-brand-mocha underline decoration-brand-gold/50 underline-offset-4"
              >
                {generated.link}
              </a>
            </div>

            <div className="bg-white/90 rounded-2xl border border-brand-gold/30 p-6">
              <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-brand-sand mb-2">Message Preview</p>
              <p className="font-serif text-xl mb-4">Dear {generated.displayName} ❤️</p>
              <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-brand-mocha/90 bg-brand-champagne rounded-xl p-4 border border-brand-gold/20">
                {generated.message}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
