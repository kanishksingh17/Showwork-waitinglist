
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface EmailRecord {
    id: number;
    email: string;
    created_at: string;
}

const Dashboard = () => {
    const [emails, setEmails] = useState<EmailRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchEmails();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    const fetchEmails = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('emails')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
            }

            setEmails(data || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8 text-slate-900">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Waitlist Dashboard</h1>
                    <div className="space-x-2">
                        <button
                            onClick={fetchEmails}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                        >
                            Refresh
                        </button>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 text-sm font-medium"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>

                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500 mb-4">Error: {error}</p>}

                {!loading && !error && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-500 uppercase font-medium">
                                <tr>
                                    <th className="px-4 py-3">Email</th>
                                    <th className="px-4 py-3">Date Added</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 border-t border-slate-100">
                                {emails.length === 0 ? (
                                    <tr>
                                        <td colSpan={2} className="px-4 py-4 text-center text-slate-500">
                                            No emails found.
                                        </td>
                                    </tr>
                                ) : (
                                    emails.map((record) => (
                                        <tr key={record.id} className="hover:bg-slate-50">
                                            <td className="px-4 py-3 font-medium text-slate-900">{record.email}</td>
                                            <td className="px-4 py-3 text-slate-500">
                                                {record.created_at ? format(new Date(record.created_at), 'MMM d, yyyy h:mm a') : 'N/A'}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
                <div className="mt-4 text-xs text-slate-400">
                    Total count: {emails.length}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
