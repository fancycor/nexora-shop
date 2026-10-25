import React, { useState } from 'react';
import { X, Copy, Check, Database, ShieldAlert, Sparkles, ExternalLink, Terminal } from 'lucide-react';

interface SupabaseSetupGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  isConfigured: boolean;
}

export const SupabaseSetupGuideModal: React.FC<SupabaseSetupGuideModalProps> = ({
  isOpen,
  onClose,
  isConfigured
}) => {
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);

  if (!isOpen) return null;

  const sqlScript = `-- 1. Create the persistent orders table in Supabase
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    customer_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    delivery_zone TEXT NOT NULL,
    delivery_charge NUMERIC NOT NULL,
    delivery_notes TEXT,
    items JSONB NOT NULL,
    subtotal NUMERIC NOT NULL,
    total NUMERIC NOT NULL,
    payment_method TEXT NOT NULL,
    status TEXT DEFAULT 'Pending' NOT NULL,
    estimated_delivery TEXT
);

-- 2. Protect customer data with Row Level Security (RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 3. Only the secure server backend (using SUPABASE_SERVICE_ROLE_KEY)
-- has permission to read and insert orders. This prevents any public user
-- or competitor from scraping your customers' phone numbers and addresses!`;

  const envSnippet = `# Add these to your backend .env file or Cloud Run secrets:
SUPABASE_URL="https://YOUR_PROJECT_REF.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOi..."
ADMIN_PASSWORD="your-strong-admin-password"`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlScript);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleCopyEnv = () => {
    navigator.clipboard.writeText(envSnippet);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 my-6 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">
                  Supabase Database Setup Guide
                </h3>
                {isConfigured ? (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    🟢 Connected
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                    ⚡ Setup Needed
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Beginner-friendly step-by-step guide to saving customer orders persistently
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs sm:text-sm text-slate-600">
          {/* Status Box */}
          {!isConfigured ? (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900">
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm text-amber-950">
                    Current Mode: In-Memory Local Test Storage
                  </p>
                  <p className="text-xs mt-1 leading-relaxed text-amber-800">
                    Because Supabase credentials are not yet configured in the environment, your app is currently storing orders in server test memory. Orders work for your preview session, but will reset whenever the server restarts. Follow the 3 steps below to connect a free permanent database!
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900">
              <div className="flex items-center gap-2 font-bold text-sm text-emerald-950">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Supabase is connected and actively saving orders!</span>
              </div>
              <p className="text-xs mt-1 text-emerald-800">
                All customer Cash on Delivery orders are now permanently synchronized in your Supabase PostgreSQL cloud database.
              </p>
            </div>
          )}

          {/* Step 1 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                1
              </span>
              <h4 className="font-bold text-slate-900 text-sm">
                Create a Free Project on Supabase
              </h4>
            </div>
            <p className="text-xs pl-8 text-slate-600">
              Go to{' '}
              <a
                href="https://supabase.com"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-600 font-semibold underline inline-flex items-center gap-1 hover:text-emerald-700"
              >
                supabase.com <ExternalLink className="w-3 h-3" />
              </a>{' '}
              and sign up for free (using GitHub or Email). Click <strong>&ldquo;New Project&rdquo;</strong>, give it a name (e.g. <em>Nexora-Shop</em>), choose the nearest region (e.g. Singapore / South Asia), and set a database password.
            </p>
          </div>

          {/* Step 2 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h4 className="font-bold text-slate-900 text-sm">
                  Run the SQL Script in Supabase SQL Editor
                </h4>
              </div>
              <button
                onClick={handleCopySql}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-bold transition-colors cursor-pointer"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'Copied!' : 'Copy SQL'}</span>
              </button>
            </div>
            <p className="text-xs pl-8 text-slate-600">
              In your Supabase dashboard sidebar, click <strong>SQL Editor</strong> &rarr; <strong>New Query</strong>, paste the SQL below, and click <strong>Run</strong>:
            </p>
            <div className="pl-8">
              <pre className="p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
                {sqlScript}
              </pre>
            </div>
          </div>

          {/* Step 3 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <h4 className="font-bold text-slate-900 text-sm">
                  Add Secret Keys on the Server (Never in Frontend!)
                </h4>
              </div>
              <button
                onClick={handleCopyEnv}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-bold transition-colors cursor-pointer"
              >
                {copiedEnv ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedEnv ? 'Copied!' : 'Copy Env'}</span>
              </button>
            </div>
            <p className="text-xs pl-8 text-slate-600">
              In Supabase, go to <strong>Project Settings &rarr; API</strong>. Find your <strong>Project URL</strong> and <strong>service_role secret</strong>. Add them into your server environment (or <code>.env</code> file):
            </p>
            <div className="pl-8">
              <pre className="p-3 bg-slate-900 text-emerald-300 rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
                {envSnippet}
              </pre>
            </div>
            <div className="pl-8 pt-1">
              <p className="text-[11px] text-slate-500 bg-slate-100 p-2.5 rounded-lg border border-slate-200 leading-relaxed">
                🔒 <strong>Why Server-Side?</strong> Customer names, phone numbers, and home addresses are sensitive. By keeping the <code>SUPABASE_SERVICE_ROLE_KEY</code> strictly inside the Express server, client browsers never see the secret database key.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                4
              </span>
              <h4 className="font-bold text-slate-900 text-sm">
                Restart Server & Enjoy Persistent Orders
              </h4>
            </div>
            <p className="text-xs pl-8 text-slate-600">
              When the server starts with those credentials, Nexora Shop will automatically detect Supabase and show <strong>&ldquo;Connected to Supabase Cloud Database&rdquo;</strong> in your Admin Dashboard!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};
