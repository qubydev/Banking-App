import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await api.get('/api/accounts');
        setAccounts(res.data);
        if (res.data.length > 0) {
          setSelectedAccount(res.data[0]);
          await fetchTransactions(res.data[0].accountNumber);
        }
      } catch (err) {
        console.error('Failed to fetch accounts', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  const fetchTransactions = async (accountNumber) => {
    try {
      const res = await api.get(`/api/accounts/${accountNumber}/transactions/recent`);
      setTransactions(res.data);
    } catch (err) {
      console.error('Failed to fetch transactions', err);
    }
  };

  const handleAccountSelect = (account) => {
    setSelectedAccount(account);
    fetchTransactions(account.accountNumber);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-slate-500">
        <p className="text-lg font-medium">Loading your accounts...</p>
      </div>
    );
  }

  return (
    /* 1. CONTAINER ALIGNMENT:
      Using max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 to perfectly match the Navbar 
    */
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Welcome Header */}
      <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-8">
        Welcome back, <span className="text-blue-600">{user?.username}</span> 👋
      </h2>

      {/* Account Cards */}
      <h3 className="text-lg font-semibold text-slate-700 mb-4">Your Accounts</h3>
      
      {/* 2. RESPONSIVE GRID:
        1 column on mobile, 2 on tablets, 3 on desktops 
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {accounts.length === 0 ? (
          <p className="text-slate-500">No accounts found.</p>
        ) : (
          accounts.map(acc => (
            <div
              key={acc.id}
              onClick={() => handleAccountSelect(acc)}
              className={`bg-gradient-to-br from-slate-900 to-blue-900 text-white rounded-2xl p-6 cursor-pointer transition-all hover:shadow-lg ${
                selectedAccount?.id === acc.id 
                  ? 'ring-4 ring-blue-400 scale-[1.02]' 
                  : 'hover:scale-[1.02]'
              }`}
            >
              <p className="text-xs text-blue-200 uppercase tracking-wider mb-1 font-semibold">
                {acc.accountType}
              </p>
              <p className="text-sm tracking-widest text-slate-300 mb-4">
                {acc.accountNumber}
              </p>
              <p className="text-3xl font-bold mb-1">
                ₹{Number(acc.balance).toFixed(2)}
              </p>
              <p className="text-xs text-slate-400">Available Balance</p>
            </div>
          ))
        )}
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-md border border-slate-100">
        
        {/* Header & View All Button Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-800">
              Recent Transactions
            </h3>
            {selectedAccount && (
              <span className="text-sm text-slate-500 font-medium">
                Account: {selectedAccount.accountNumber}
              </span>
            )}
          </div>
          
          {transactions.length > 0 && (
            <button
              onClick={() => navigate(`/history/${selectedAccount?.accountNumber}`)}
              className="text-blue-700 border-2 border-blue-100 hover:bg-blue-50 px-5 py-2 rounded-xl text-sm font-semibold transition-colors w-full sm:w-auto"
            >
              View All →
            </button>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mb-6">
          <span className="bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full text-xs font-bold tracking-wide">
            ↓ Incoming (Credit)
          </span>
          <span className="bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded-full text-xs font-bold tracking-wide">
            ↑ Outgoing (Debit)
          </span>
        </div>

        {/* Transactions List */}
        <div className="flex flex-col">
          {transactions.length === 0 ? (
            <p className="text-slate-400 text-center py-12">No transactions yet.</p>
          ) : (
            transactions.map(tx => {
              const isCredit = tx.direction === 'CREDIT';
              return (
                <div 
                  key={tx.id} 
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 border-b border-slate-100 last:border-0 gap-2 sm:gap-0"
                >
                  {/* Left side */}
                  <div className="flex flex-col gap-1.5">
                    <div className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full w-fit tracking-wider ${
                      isCredit ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {isCredit ? '↓ CREDIT' : '↑ DEBIT'}
                    </div>

                    <p className="text-slate-800 text-sm font-semibold mt-1">
                      {tx.description || 'No description'}
                    </p>

                    <p className="text-slate-500 text-xs font-medium">
                      {isCredit ? `From: ${tx.fromAccount}` : `To: ${tx.toAccount}`}
                    </p>
                  </div>

                  {/* Right side */}
                  <div className="sm:text-right flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-end mt-2 sm:mt-0">
                    <p className={`font-bold text-lg ${
                      isCredit ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {isCredit ? '+' : '-'}₹{Number(tx.amount).toFixed(2)}
                    </p>
                    
                    <div className="text-right">
                      <p className="text-slate-400 text-xs font-medium">
                        {new Date(tx.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </p>
                      <p className="text-slate-400 text-[10px]">
                        {new Date(tx.createdAt).toLocaleTimeString('en-IN', {
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}