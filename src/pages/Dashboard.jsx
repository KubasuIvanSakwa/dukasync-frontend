import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../zustand/store'; // Adjust path based on your folder structure
import SystemActivityCard from '../components/Charts'
import StockLevelCard from '../components/StockLevelCard';
import RestockQueueTable from '../components/RestockQueueTable';
import DeliveriesUpdateCard from '../components/DeliveriesUpdateCard';
import RealTimeTrafficCard from '../components/RealTimeTrafficCard';

function Dashboard() {
    const navigate = useNavigate();
    const logout = useAuthStore((state) => state.logout);



    const handleLogout = () => {
        logout();
        navigate('/auth');
    };


    return (
        <section className="min-h-screen p-8 flex items-center justify-center font-sans">
            <div className="w-full max-w-[1400px] grid grid-cols-1 lg:grid-cols-4 gap-6">             
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between items-center lg:col-span-4">
                    <div className="w-full flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-black text-gray-900">Welcome</h3>
                            <p className="text-xs text-gray-500 mt-0.5">Grab a coffee!</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-6 py-3 bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded-xl text-sm transition-colors"
                        >
                            Log Out
                        </button>
                    </div>
                </div>
                <SystemActivityCard />
                <StockLevelCard />
                <RealTimeTrafficCard />
                <RestockQueueTable />
                <DeliveriesUpdateCard />

            </div>
        </section>
    );
}

export default Dashboard;