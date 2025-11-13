import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { walletService } from '../../../services/walletService';
import { toast } from 'react-toastify';
import { Wallet as WalletIcon, ArrowUpCircle, ArrowDownCircle, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import TransactionDetailModal from './TransactionDetailModal';
import { formatDateSafe } from '../../../utils/DateUtil';

const Wallet = () => {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const [transactions, setTransactions] = useState([]);
  const [txLoading, setTxLoading] = useState(true);
  const [txPage, setTxPage] = useState(0);
  const [txTotalPages, setTxTotalPages] = useState(0);
  const [selectedTx, setSelectedTx] = useState(null);

  const user = useAuthStore((s) => s.user);
  const isRider = user.role.toUpperCase() === 'RIDER';

  const fetchTransactions = useCallback(async (page) => {
    setTxLoading(true);
    try {
      const data = await walletService.getMyTransactions(page);
      setTransactions(data.content || []);
      setTxPage(data.number);
      setTxTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error(error.message || "Could not load transactions.");
    } finally {
      setTxLoading(false);
    }
  }, []);

  // --- Data Fetching ---
  const fetchWallet = useCallback(async () => {
    try {
      setLoading(true);
      const data = await walletService.getWallet();
      setWallet(data);
    } catch (error) {
      console.error("Error fetching wallet:", error);
      toast.error(error.message || "Could not load wallet data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWallet();
    fetchTransactions();
  }, [fetchWallet]);

  useEffect(() => {
    !isProcessing && fetchTransactions();
  }, [isProcessing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    setIsProcessing(true);
    
    try {
      let updatedWallet;
      if (isRider) {
        updatedWallet = await walletService.addFunds(amt);
        toast.success(`₹${amt} added to your wallet!`);
      } else {
        updatedWallet = await walletService.withdrawFunds(amt);
        toast.success(`₹${amt} withdrawn from your wallet.`);
      }
      setWallet(updatedWallet);
      setAmount('');
    } catch (error) {
      console.error("Transaction error:", error);
      toast.error(error.response?.data || error.message || "Transaction failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTxPageChange = (newPage) => {
    if (newPage >= 0 && newPage < txTotalPages) {
      fetchTransactions(newPage);
    }
  };
  
  const inputBase = "w-full h-12 px-4 rounded-xl bg-[#1a1a1a] border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20";
  const buttonLabel = isRider ? "Add Funds" : "Withdraw Funds";
  const ButtonIcon = isRider ? ArrowUpCircle : ArrowDownCircle;
  const buttonColor = isRider 
    ? "bg-emerald-600 hover:bg-emerald-500" 
    : "bg-blue-600 hover:bg-blue-500";

  return (
    <>
      <div className="p-6 text-white min-h-full">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-semibold mb-2">My Wallet</h1>
          <p className="text-gray-400">Manage your balance and transactions.</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <Loader2 className="h-12 w-12 animate-spin text-white/70" />
          </div>
        ) : !wallet ? (
          <div className="bg-[#141414] rounded-2xl p-12 text-center border border-red-500/30">
            <h3 className="text-xl font-semibold text-red-300">Wallet Not Found</h3>
            <p className="text-gray-400 mt-2">
              We could not find a wallet for your account. Please contact support.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Balance Display */}
            <div className="bg-[#141414] rounded-2xl border border-white/10 p-8 flex flex-col justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wide">
                  Available Balance
                </p>
                <div className="my-4">
                  <span className="text-6xl font-bold text-white">
                    ₹{wallet.balance.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <WalletIcon className="w-4 h-4" />
                <span>Wallet ID: {wallet.id}</span>
              </div>
            </div>
            
            {/* Action Form */}
            <div className="bg-[#141414] rounded-2xl border border-white/10 p-8">
              <h3 className="text-xl font-semibold text-white mb-6">
                {isRider ? "Load Your Wallet" : "Withdraw Funds"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={isRider ? "e.g., 500" : "e.g., 1000"}
                    step="0.01"
                    min="0"
                    required
                    className={inputBase}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isProcessing}
                  className={`w-full h-12 rounded-xl font-semibold text-white transition disabled:opacity-50 flex items-center justify-center gap-2 ${buttonColor}`}
                >
                  {isProcessing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <ButtonIcon className="w-5 h-5" />
                  )}
                  <span>{isProcessing ? "Processing..." : buttonLabel}</span>
                </button>
              </form>
            </div>

          </div>
        )}

        <div className="bg-[#141414] rounded-2xl border border-white/10 p-8 mt-8">
            <h3 className="text-xl font-semibold text-white mb-6">
              Recent Transactions
            </h3>
            {txLoading ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-white/70" />
              </div>
            ) : transactions.length === 0 ? (
              <p className="text-center text-white/50 py-10">No transactions found.</p>
            ) : (
              <div className="space-y-4">
                {transactions.map(tx => (
                  <TransactionRow 
                    key={tx.id} 
                    tx={tx} 
                    userId={user.id} 
                    onClick={() => setSelectedTx(tx)}
                  />
                ))}
              </div>
            )}
            
            {/* Pagination for Transactions */}
            {txTotalPages > 1 && (
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/10">
                <span className="text-sm text-white/50">
                  Page {txPage + 1} of {txTotalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleTxPageChange(txPage - 1)}
                    disabled={txPage === 0 || txLoading}
                    className="h-9 w-9 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleTxPageChange(txPage + 1)}
                    disabled={txPage + 1 >= txTotalPages || txLoading}
                    className="h-9 w-9 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- 5. RENDER THE MODAL --- */}
        {selectedTx && (
          <TransactionDetailModal
            transaction={selectedTx}
            onClose={() => setSelectedTx(null)}
            userRole={user.role}
          />
        )}
    </>
  );
};

const TransactionRow = ({ tx, userId, onClick }) => {
  let isCredit = false;
  let amount = `₹${tx.amount.toFixed(2)}`;
  let color = "text-white/90";
  let label = "Transaction";
  let name = "";
  let Icon = ArrowUpCircle;

  if (tx.type === 'DEPOSIT') {
    isCredit = true;
    label = "Wallet Top-up";
    name = "From your bank";
  } else if (tx.type === 'WITHDRAWAL') {
    isCredit = false;
    label = "Withdrawal";
    name = "To your bank";
  } else {
    isCredit = tx.driverId === userId;
    const rideFareSubtotal = (tx.baseFare || 0) + 
                         (tx.distanceFare || 0) + 
                         (tx.surchargeFees || 0) -
                         (tx.commissionFee || 0);
    if (isCredit) {
      label = "Ride Payout from";
      name = tx.riderName;
      amount = `+₹${rideFareSubtotal.toFixed(2)}`;
    } else {
      label = "Ride Payment to";
      name = tx.driverName;
      amount = `-₹${tx.amount.toFixed(2)}`;
    }
  }

  if (isCredit) {
    color = "text-emerald-400";
    Icon = ArrowUpCircle;
  } else {
    color = "text-red-400";
    Icon = ArrowDownCircle;
  }

  return (
    <button 
      onClick={onClick}
      className="w-full p-4 rounded-lg bg-[#1f1f1f] border border-white/10 hover:bg-white/5 transition flex items-center justify-between"
    >
      <div className="flex items-center gap-4">
        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
          isCredit ? 'bg-emerald-500/20' : 'bg-red-500/20'
        }`}>
          <Icon size={20} className={color} />
        </div>
        <div className="text-left">
          <p className="text-sm font-medium text-white/90">{label} {name}</p>
          <p className="text-xs text-white/50">{formatDateSafe(tx.timestamp, {variant: "datetime"})}</p>
        </div>
      </div>
      <div className={`text-lg font-semibold ${color}`}>
        {amount}
      </div>
    </button>
  );
};

export default Wallet;