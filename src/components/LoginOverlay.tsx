"use client";
import { useState } from 'react';

export default function LoginOverlay({ onLogin }: { onLogin: (data: any) => void }) {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // REPLACE THIS WITH YOUR ACTUAL API GATEWAY URL LATER
    const API_URL = "https://dsrtvy8wfe.execute-api.eu-north-1.amazonaws.com";

    const handleLogin = async () => {
        setLoading(true);
        setError('');

        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'login', code: code })
            });

            const data = await res.json();

            if (data.success) {
                onLogin(data.data); // Pass user data back to main page
            } else {
                setError('Invalid Access Code');
            }
        } catch (err) {
            setError('Connection failed');
        }
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
            <div className="bg-white p-8 rounded-xl max-w-sm w-full text-center">
                <h2 className="text-2xl font-bold mb-4 text-black">Enter Access Code</h2>

                <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="DROAME-XXXX"
                    className="w-full p-3 border border-gray-300 rounded mb-4 text-black text-center text-lg tracking-widest"
                />

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full bg-black text-white py-3 rounded font-bold hover:bg-gray-800 transition"
                >
                    {loading ? 'Verifying...' : 'ENTER'}
                </button>
            </div>
        </div>
    );
}