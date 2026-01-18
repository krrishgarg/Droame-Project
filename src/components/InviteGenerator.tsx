'use client';

import React, { useState } from 'react';

// Your API URL
const API_URL = "https://dsrtvy8wfe.execute-api.eu-north-1.amazonaws.com/";

interface GeneratorProps {
    adminCode: string;
}

export default function InviteGenerator({ adminCode }: GeneratorProps) {
    const [isOpen, setIsOpen] = useState(false); // Controls if the form is visible
    const [name, setName] = useState('');
    const [details, setDetails] = useState('');
    const [generatedCode, setGeneratedCode] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        setLoading(true);
        setError('');
        setGeneratedCode(null);

        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'generate',
                    creator_code: adminCode,
                    new_name: name,
                    new_details: details
                }),
            });

            const data = await res.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to generate code');
            }

            setGeneratedCode(data.new_code);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // 1. If Closed, show just the Button
    if (!isOpen) {
        return (
            <div className="fixed bottom-10 right-10 z-50">
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-black text-white px-6 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
                >
                    <span>+</span> Generate Invite Code
                </button>
            </div>
        );
    }

    // 2. If Open, show the Modal Form
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative animate-in fade-in zoom-in duration-200">

                {/* Close Button (X) */}
                <button
                    onClick={() => { setIsOpen(false); setGeneratedCode(null); setName(''); }}
                    className="absolute top-4 right-4 text-gray-400 hover:text-black font-bold text-xl"
                >
                    ✕
                </button>

                <h3 className="text-2xl font-bold mb-1 text-black">New Invite</h3>
                <p className="text-sm text-gray-500 mb-6">Create access for a new investor.</p>

                {/* Input Fields */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Ratan Tata"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-black text-black"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Context / Notes</label>
                        <input
                            type="text"
                            placeholder="e.g. Met at Tech Summit"
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-black text-black"
                        />
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={loading || !name}
                        className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-900 disabled:opacity-50 transition-all mt-2"
                    >
                        {loading ? 'Generating...' : 'Create Access Code'}
                    </button>
                </div>

                {/* Success Display */}
                {generatedCode && (
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl text-center animate-in slide-in-from-bottom-2">
                        <p className="text-xs text-green-700 font-bold mb-2 tracking-widest uppercase">Access Code Ready</p>
                        <p className="text-3xl font-mono font-black text-black tracking-wider select-all cursor-pointer"
                            onClick={() => navigator.clipboard.writeText(generatedCode)}>
                            {generatedCode}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-2">Click code to copy</p>
                    </div>
                )}

                {/* Error Display */}
                {error && (
                    <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 text-center">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}