import React, { useState, useEffect } from 'react';

// Reusable Badge Component (matching your system style layout)
const Badge = ({ text, icon }) => (
  <div className="border text-black font-bold text-xs px-4 py-2 rounded-full inline-flex items-center gap-2 mb-6 w-fit">
    <span>{text}</span>
  </div>
);

export const DeliveriesUpdateCard = () => {
  // 1. Setup mock state for tracking live deliveries
  const [confirmedCount, setConfirmedCount] = useState(4);

  // 2. Simulation Logic: Simulates incoming delivery status adjustments every 5 seconds
  useEffect(() => {
    const deliveryCycles = 0;
    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % deliveryCycles.length;
      setConfirmedCount(deliveryCycles[index]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-[0.6rem] p-6 shadow-sm h-auto max-h-[300px] flex flex-col justify-between transition-shadow duration-300 hover:shadow-md">
      {/* Top Header Section */}
      <div className="flex flex-col">
        <Badge icon="📦" text="Deliveries Update" />
      </div>
      
      {/* Main Delivery Metric Panel */}
      <div className="mb-4 flex flex-col justify-end flex-grow">
        <p className="text-gray-400 font-medium mb-1 text-sm tracking-tight">In a week</p>
        <div className="flex items-baseline gap-2">
          {/* Giant light-blue text layout matching the primary dashboard theme */}
          <span className="text-7xl font-normal text-[#82a4ff] tracking-tighter transition-all duration-500 transform ease-out select-none">
            {confirmedCount * 50} 
          </span>
          <span className="text-2xl font-bold text-gray-900 tracking-tight">Units</span>
        </div>
      </div>
    </div>
  );
};

export default DeliveriesUpdateCard;
