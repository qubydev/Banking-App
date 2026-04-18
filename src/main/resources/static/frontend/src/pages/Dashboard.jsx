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
        <p className="text-lg font-medium animate-pulse">
          Loading your accounts...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6">

      {/* Header */}
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 mb-6">
        Welcome back, <span className="text-blue-600">{user?.username}</span> 👋
      </h2>

      {/* Accounts */}
      <h3 className="text-md sm:text-lg font-semibold text-slate-700 mb-3">
        Your Accounts
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        {accounts.length === 0 ? (
          <p className="text-slate-500">No accounts found.</p>
        ) : (
          accounts.map(acc => (
            <div
              key={acc.id}
              onClick={() => handleAccountSelect(acc)}
              className={`rounded-xl p-5 cursor-pointer transition-all text-white 
              bg-gradient-to-br from-slate-900 to-blue-900 
              ${selectedAccount?.id === acc.id
                  ? 'ring-2 ring-blue-400 scale-[1.02]'
                  : 'hover:scale-[1.02]'
                }`}
            >
              <p className="text-xs text-blue-200 uppercase font-semibold">
                {acc.accountType}
              </p>

              <p className="text-xs sm:text-sm tracking-wider text-slate-300 my-2">
                {acc.accountNumber}
              </p>

              <p className="text-xl sm:text-2xl md:text-3xl font-bold">
                ₹{Number(acc.balance).toFixed(2)}
              </p>

              <p className="text-[10px] sm:text-xs text-slate-400 mt-1">
                Available Balance
              </p>
            </div>
          ))
        )}
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow border">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 mb-5">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-800">
              Recent Transactions
            </h3>

            {selectedAccount && (
              <p className="text-xs sm:text-sm text-slate-500">
                Account: {selectedAccount.accountNumber}
              </p>
            )}
          </div>

          {transactions.length > 0 && (
            <button
              onClick={() => navigate(`/history/${selectedAccount?.accountNumber}`)}
              className="border px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 w-full sm:w-auto"
            >
              View All →
            </button>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
            ↓ Credit
          </span>
          <span className="bg-red-50 text-red-700 px-2 py-1 rounded-full text-xs font-semibold">
            ↑ Debit
          </span>
        </div>

        {/* Transactions List */}
        {transactions.length === 0 ? (
          <p className="text-center text-slate-400 py-8">
            No transactions yet.
          </p>
        ) : (
          <div className="divide-y">
            {transactions.map(tx => {
              const isCredit = tx.direction === 'CREDIT';

              return (
                <div
                  key={tx.id}
                  className="py-3 flex flex-col sm:flex-row sm:justify-between gap-2"
                >
                  {/* Left */}
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {tx.description || 'No description'}
                    </p>

                    <p className="text-xs text-slate-500">
                      {isCredit
                        ? `From: ${tx.fromAccount}`
                        : `To: ${tx.toAccount}`}
                    </p>
                  </div>

                  {/* Right */}
                  <div className="flex justify-between sm:flex-col sm:items-end">
                    <p className={`font-bold ${isCredit ? 'text-green-600' : 'text-red-600'}`}>
                      {isCredit ? '+' : '-'}₹{Number(tx.amount).toFixed(2)}
                    </p>

                    <p className="text-[10px] text-slate-400">
                      {new Date(tx.createdAt).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}