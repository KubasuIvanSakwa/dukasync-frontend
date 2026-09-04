import { useState, useEffect } from 'react';
import SystemActivityCard from '../components/Charts'
import StockLevelCard from '../components/StockLevelCard';
import RestockQueueTable from '../components/RestockQueueTable';
import DeliveriesUpdateCard from '../components/DeliveriesUpdateCard';
import RealTimeTrafficCard from '../components/RealTimeTrafficCard';

function Dashboard() {
    const [restocks, setRestocks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRestocks = async () => {
        try {
            const response = await fetch('http://localhost:5500/api/restocks'); 
            if (response.ok) {
                const data = await response.json();
                setRestocks(data);
            }
        } catch (error) {
            console.error("Failed to fetch restocks:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRestocks();
        const interval = setInterval(fetchRestocks, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleSimulateReply = async (restockId, supplierId) => {
        try {
            const response = await fetch(`http://localhost:5500/api/restocks/webhook/${supplierId}/reply`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId: restockId, text: "YES" })
            });
            if (response.ok) fetchRestocks();
        } catch (error) {
            console.error("Webhook simulation failed:", error);
        }
    };

    const confirmedCount = restocks.filter(r => r.status === 'CONFIRMED').length;
    // const pendingCount = restocks.filter(r => r.status === 'PENDING').length;

    // Reusable black pill badge component from the image
    const Badge = ({ icon, text }) => (
        <div className="border text-black font-bold text-xs px-4 py-2 rounded-full inline-flex items-center gap-2 mb-6">
            {/* <span>{icon}</span> */}
            <span>{text}</span>
        </div>
    );

    return (
        <section className="min-h-screen p-8 flex items-center justify-center font-sans">
            <div className="w-full max-w-[1400px] grid grid-cols-1 lg:grid-cols-4 gap-6">              
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