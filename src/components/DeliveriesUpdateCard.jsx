import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../zustand/store'; // Adjust path as needed

// Reusable Badge Component
const Badge = ({ text }) => (
  <div className="border text-black font-bold text-xs px-4 py-2 rounded-full inline-flex items-center gap-2 mb-6 w-fit">
    <span>{text}</span>
  </div>
);

export const DeliveriesUpdateCard = () => {
  const { token } = useAuthStore();
  const [confirmedUnits, setConfirmedUnits] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfirmedDeliveries = async () => {
      if (!token) return;

      try {
        const response = await fetch('https://dukasync-backend-fvw3.onrender.com/api/v1/restock', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const result = await response.json();
          const restocks = result.data || [];
          
          // Filter for 'CONFIRMED' status and sum up the requested units
          const incomingUnits = restocks
            .filter(order => order.status === 'CONFIRMED')
            .reduce((sum, order) => sum + (Number(order.quantityRequested) || 0), 0);
            
          setConfirmedUnits(incomingUnits);
        }
      } catch (error) {
        console.error("Failed to fetch delivery updates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConfirmedDeliveries();
    
    // Polls every 10 seconds to stay perfectly in sync with your RestockQueueTable
    const interval = setInterval(fetchConfirmedDeliveries, 10000);
    return () => clearInterval(interval);
  }, [token]);

  return (
    <div className="bg-white rounded-[0.6rem] p-6 shadow-sm h-auto max-h-[300px] flex flex-col justify-between transition-shadow duration-300 hover:shadow-md">
      
      {/* Top Header Section */}
      <div className="flex flex-col">
        <Badge text="Deliveries Update" />
      </div>
      
      {/* Main Delivery Metric Panel */}
      <div className="mb-4 flex flex-col justify-end flex-grow">
        <p className="text-gray-400 font-medium mb-1 text-sm tracking-tight">
          Confirmed & En Route
        </p>
        <div className="flex items-baseline gap-2">
          {/* Giant light-blue text layout matching the primary dashboard theme */}
          <span className={`text-7xl font-normal text-[#82a4ff] tracking-tighter transition-all duration-500 transform ease-out select-none ${loading ? 'animate-pulse' : ''}`}>
            {loading ? '...' : confirmedUnits.toLocaleString()} 
          </span>
          <span className="text-2xl font-bold text-gray-900 tracking-tight">Units</span>
        </div>
      </div>
      
    </div>
  );
};

export default DeliveriesUpdateCard;