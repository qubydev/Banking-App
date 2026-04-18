import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';

export default function Transfer() {
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState({
    fromAccount: '',
    toAccount: '',
    amount: '',
    description: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/accounts').then(res => {
      setAccounts(res.data);
      if (res.data.length > 0) {
        setForm(f => ({ ...f, fromAccount: res.data[0].accountNumber }));
      }
    }).catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      await api.post('/api/accounts/transfer', {
        ...form,
        amount: parseFloat(form.amount)
      });
      setMessage('Transfer successful!');
      setForm(f => ({ ...f, toAccount: '', amount: '', description: '' }));
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Transfer failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    /* Main Container: Matches Navbar and Dashboard alignment */
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[85vh]">
      
      <div className="flex justify-center">
        {/* Card: Responsive width (full on mobile, 440px on desktop) */}
        <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-xl border border-slate-100 w-full max-w-md">
          
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">💸 Transfer Funds</h2>
            <p className="text-slate-500 text-sm">Send money to another account instantly</p>
          </div>

          {message && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2 animate-pulse">
              <span>✅</span> {message} Redirecting...
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
              <span>❌</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* From Account */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
                From Account
              </label>
              <select
                name="fromAccount"
                value={form.fromAccount}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3 outline-none transition-all"
                required
              >
                {accounts.map(a => (
                  <option key={a.id} value={a.accountNumber}>
                    {a.accountNumber} — ₹{Number(a.balance).toLocaleString('en-IN')}
                  </option>
                ))}
              </select>
            </div>

            {/* To Account */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
                To Account Number
              </label>
              <input
                name="toAccount"
                placeholder="e.g. ACC1002"
                value={form.toAccount}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3 outline-none transition-all"
                required
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
                Amount (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">₹</span>
                <input
                  name="amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3 pl-7 outline-none transition-all font-semibold"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
                Description (optional)
              </label>
              <input
                name="description"
                placeholder="e.g. Rent, Groceries..."
                value={form.description}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3 outline-none transition-all"
              />
            </div>

            <div className="pt-4 space-y-3">
              <button
                type="submit"
                disabled={loading}
                className={`w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-xl text-sm px-5 py-4 text-center transition-all active:scale-[0.98] shadow-lg shadow-blue-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Processing...
                  </span>
                ) : 'Send Money'}
              </button>

              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="w-full text-slate-500 bg-white border border-slate-200 hover:bg-slate-50 font-medium rounded-xl text-sm px-5 py-3 transition-colors"
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}