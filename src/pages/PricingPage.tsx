import React, { useState } from 'react';
import { Check, ArrowRight, Copy, Wallet, X, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { RoutePath } from '../components/Header';

interface PricingPageProps {
  onNavigate: (path: RoutePath, reportId?: string) => void;
}

interface CryptoWallet {
  symbol: 'BTC' | 'SOL' | 'ETH' | 'NEAR';
  name: string;
  network: string;
  address: string;
  badge: string;
  note: string;
}

const CRYPTO_WALLETS: CryptoWallet[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    network: 'Bitcoin Native (SegWit)',
    address: 'bc1qz66ap86pqc8866f6neappvr83kldtw2p5mx2fz',
    badge: 'bg-amber-100/80 text-amber-900 border-amber-300',
    note: 'Send any BTC amount via Bitcoin mainnet',
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    network: 'Solana Mainnet',
    address: '9kVqqoG33PuJNAyRBXVBKYZUkfF671VXMj7eUzW9RcWE',
    badge: 'bg-purple-100/80 text-purple-900 border-purple-300',
    note: 'Instant, low-fee transfer on Solana',
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    network: 'Ethereum Mainnet (ERC-20)',
    address: '0xF2F583C3eA1f3e3AebD440e40e93b4A8339cE48e',
    badge: 'bg-blue-100/80 text-blue-900 border-blue-300',
    note: 'Send ETH or USDC/USDT on Ethereum',
  },
  {
    symbol: 'NEAR',
    name: 'NEAR Protocol',
    network: 'NEAR Mainnet',
    address: 'd86ffbe30249fdf3a6841ce4b1efd115c31773cb2837904665437c82e3bc81ff',
    badge: 'bg-emerald-100/80 text-emerald-900 border-emerald-300',
    note: 'Direct fast transfer on NEAR protocol',
  },
];

export const PricingPage: React.FC<PricingPageProps> = ({ onNavigate }) => {
  const [selectedCoin, setSelectedCoin] = useState<'BTC' | 'SOL' | 'ETH' | 'NEAR'>('BTC');
  const [copiedSymbol, setCopiedSymbol] = useState<string | null>(null);
  const [showWalletsModal, setShowWalletsModal] = useState<boolean>(false);

  const activeWallet = CRYPTO_WALLETS.find((w) => w.symbol === selectedCoin) || CRYPTO_WALLETS[0];

  const handleCopy = (symbol: string, address: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(address).catch(() => {});
    }
    setCopiedSymbol(symbol);
    setTimeout(() => {
      setCopiedSymbol((curr) => (curr === symbol ? null : curr));
    }, 2200);
  };
  return (
    <div className="max-w-5xl mx-auto px-6 py-16 space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <p className="text-xs font-medium text-zinc-500">Transparent Pricing</p>
        <h1 className="mt-2 text-4xl sm:text-5xl font-editorial text-zinc-900 tracking-tight">
          Cheaper than brunch. More honest than your group chat.
        </h1>
        <p className="mt-4 text-sm sm:text-base text-zinc-600">
          Your full 8-section relationship report, quantitative receipt check, and interactive follow-up Q&A with Indus are completely free.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl border border-zinc-900 p-8 flex flex-col justify-between shadow-2xs">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-zinc-900">For Individuals & Friends</p>
              <span className="text-xs font-mono text-emerald-700">UNLOCKED TODAY</span>
            </div>
            <h2 className="mt-2 text-3xl font-editorial text-zinc-900">The Full Verdict</h2>
            <div className="mt-4 flex items-baseline gap-1 font-mono tabular-nums">
              <span className="text-4xl font-semibold text-zinc-900">$0</span>
              <span className="text-xs text-zinc-500">/ full chat report</span>
            </div>
            <p className="mt-3 text-xs text-zinc-600 leading-relaxed">
              Everything you need to decode a situationship, ex, best friend, or chaotic trip-planning group chat.
            </p>

            <ul className="mt-6 pt-6 border-t border-zinc-100 space-y-3 text-xs text-zinc-700">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-zinc-900 shrink-0" />
                <span>Up to 50,000 recent tokens analyzed per chat export</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-zinc-900 shrink-0" />
                <span>All 8 sections: Overview, The Numbers, Character Profiles, The Shift, Subtext, Awards & Verdict</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-zinc-900 shrink-0" />
                <span>“What To Do Next” actionable blueprint</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-zinc-900 shrink-0" />
                <span>Interactive follow-up Q&A with Indus</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-zinc-900 shrink-0" />
                <span>Private shareable report link & PDF print view</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => onNavigate('/setup')}
            className="mt-8 w-full py-3.5 px-6 rounded-full bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
          >
            <span>Analyze a Chat for Free</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200/90 p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-zinc-500">Help Us Run This Project</p>
              <span className="text-xs font-mono text-zinc-400">PROJECT SUPPORTER</span>
            </div>
            <h2 className="mt-2 text-3xl font-editorial text-zinc-900">The Project Supporter Pass</h2>
            <div className="mt-4 flex items-baseline gap-1 font-mono tabular-nums">
              <span className="text-4xl font-semibold text-zinc-900">$4.99</span>
              <span className="text-xs text-zinc-500">/ voluntary contribution</span>
            </div>
            <p className="mt-3 text-xs text-zinc-600 leading-relaxed">
              Helping us run this project and keep Whatarewe completely free, private, and independent. An optional contribution that directly covers AI compute costs while unlocking multi-year archives up to 250,000 messages and cross-chat comparisons.
            </p>

            <ul className="mt-6 pt-6 border-t border-zinc-100 space-y-3 text-xs text-zinc-700">
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-zinc-700 shrink-0" />
                <span>Everything in The Full Verdict</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-zinc-700 shrink-0" />
                <span>Helping us run this project & maintain private AI compute infrastructure</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-zinc-700 shrink-0" />
                <span>Cross-chat attachment style comparison across 3+ threads</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-zinc-700 shrink-0" />
                <span>Full multi-year timeline without token truncation up to 250,000 messages</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-zinc-700 shrink-0" />
                <span>Unlimited follow-up coaching with Indus</span>
              </li>
            </ul>

            {/* Crypto Payment Method Section */}
            <div className="mt-6 pt-6 border-t border-zinc-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-zinc-900" />
                  <span className="text-xs font-semibold text-zinc-900">Payment Method: Crypto Wallets</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowWalletsModal(true)}
                  className="text-[11px] font-medium text-zinc-600 hover:text-zinc-900 underline underline-offset-2 cursor-pointer transition-colors"
                >
                  View All (4)
                </button>
              </div>

              {/* Coin Tabs */}
              <div className="grid grid-cols-4 gap-1.5 p-1 bg-zinc-100/90 rounded-xl border border-zinc-200/70">
                {CRYPTO_WALLETS.map((wallet) => {
                  const isActive = selectedCoin === wallet.symbol;
                  return (
                    <button
                      key={wallet.symbol}
                      type="button"
                      onClick={() => setSelectedCoin(wallet.symbol)}
                      className={`py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                        isActive
                          ? 'bg-white text-zinc-900 shadow-2xs border border-zinc-200/90'
                          : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60'
                      }`}
                    >
                      <span className="font-mono text-xs">{wallet.symbol}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Wallet Details Box */}
              <div className="mt-3 p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${activeWallet.badge}`}>
                      {activeWallet.symbol}
                    </span>
                    <span className="font-medium text-zinc-900">{activeWallet.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">{activeWallet.network}</span>
                </div>

                <div className="flex items-center gap-2 bg-white border border-zinc-200/90 rounded-lg p-2.5 shadow-2xs">
                  <span className="text-[11px] font-mono text-zinc-800 break-all select-all flex-1 leading-relaxed">
                    {activeWallet.address}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(activeWallet.symbol, activeWallet.address)}
                    className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-md transition-colors cursor-pointer text-[11px] font-medium shadow-2xs"
                    title={`Copy ${activeWallet.symbol} Address`}
                  >
                    {copiedSymbol === activeWallet.symbol ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-0.5">
                  <span>{activeWallet.note}</span>
                  <span className="font-mono text-[10px] text-emerald-700 font-medium">Voluntary ~$4.99</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-2.5">
            <button
              onClick={() => setShowWalletsModal(true)}
              className="w-full py-3.5 px-6 rounded-full bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors cursor-pointer inline-flex items-center justify-center gap-2 shadow-2xs"
            >
              <Wallet className="w-4 h-4" />
              <span>Pay with Crypto / All Wallets</span>
            </button>
            <button
              onClick={() => onNavigate('/setup')}
              className="w-full py-3 px-6 rounded-full bg-[#FAF9F6] border border-zinc-300 text-zinc-900 text-xs font-semibold hover:bg-zinc-100 transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
            >
              <span>Support Project & Continue to Setup →</span>
            </button>
          </div>
        </div>
      </div>

      {/* All Crypto Wallets Modal */}
      {showWalletsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="bg-white rounded-2xl max-w-xl w-full border border-zinc-200 p-6 sm:p-8 shadow-xl max-h-[90vh] overflow-y-auto space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  <Wallet className="w-3.5 h-3.5 text-zinc-800" />
                  <span>The Project Supporter Pass</span>
                </div>
                <h3 className="text-2xl font-editorial text-zinc-900 mt-1">
                  Crypto Payment Addresses
                </h3>
                <p className="text-xs text-zinc-600 mt-1.5">
                  Send your contribution (~$4.99 or any custom amount) directly to any of the verified addresses below to help us run this project and keep Whatarewe online.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowWalletsModal(false)}
                className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-500 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5">
              {CRYPTO_WALLETS.map((wallet) => (
                <div
                  key={wallet.symbol}
                  className="p-4 rounded-xl border border-zinc-200/90 bg-zinc-50/50 hover:bg-white hover:border-zinc-300 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full border ${wallet.badge}`}>
                        {wallet.symbol}
                      </span>
                      <span className="text-sm font-semibold text-zinc-900">{wallet.name}</span>
                    </div>
                    <span className="text-[11px] font-mono text-zinc-500">{wallet.network}</span>
                  </div>

                  <div className="flex items-center gap-2 bg-white border border-zinc-200 rounded-lg p-2.5 shadow-2xs">
                    <span className="text-xs font-mono text-zinc-800 break-all select-all flex-1 leading-relaxed">
                      {wallet.address}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(wallet.symbol, wallet.address)}
                      className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-md transition-colors cursor-pointer text-xs font-medium"
                    >
                      {copiedSymbol === wallet.symbol ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-0.5">
                    <span>{wallet.note}</span>
                    <span className="text-emerald-700 font-medium">Voluntary Support</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-amber-950">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>Private & Direct On-Chain Contribution</span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-800">
                100% of contributions directly pay for API inferences, background server uptime, and token compute. Once sent, you can continue to upload any chat export for deep-dive analysis.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowWalletsModal(false)}
                className="px-5 py-2.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowWalletsModal(false);
                  onNavigate('/setup');
                }}
                className="px-6 py-2.5 rounded-full bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors cursor-pointer inline-flex items-center gap-2"
              >
                <span>Continue to Chat Setup</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
