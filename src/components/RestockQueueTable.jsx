import React, { useState, useEffect } from 'react';

const Badge = ({ text, icon }) => (
  <div className="border text-black font-bold text-xs px-4 py-2 rounded-full inline-flex items-center gap-2">
    {/* {icon && <span>{icon}</span>} */}
    <span>{text}</span>
  </div>
);

export const RestockQueueTable = () => {
  const [loading, setLoading] = useState(true);
  const [restocks, setRestocks] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRestocks([
        {
          _id: "ORD-9824X",
          product: { name: "Wireless Earbuds Pro" },
          quantityRequested: 45,
          status: "PENDING",
          supplier: "SUPP-01"
        },
        {
          _id: "ORD-1102A",
          product: { name: "USB-C Charging Hub" },
          quantityRequested: 120,
          status: "PENDING",
          supplier: "SUPP-04"
        },
        {
          _id: "ORD-5541K",
          product: { name: "Ergonomic Desk Chair" },
          quantityRequested: 12,
          status: "CONFIRMED",
          supplier: "SUPP-02"
        },
        {
          _id: "ORD-3091M",
          product: { name: "Mechanical Keyboard" },
          quantityRequested: 25,
          status: "PENDING",
          supplier: "SUPP-01"
        }
      ]);
      setLoading(false);
    }, 1200); 

    return () => clearTimeout(timer);
  }, []);

  const handleSimulateReply = (orderId, supplierId) => {
    setRestocks((prevOrders) =>
      prevOrders.map((order) =>
        order._id === orderId ? { ...order, status: 'CONFIRMED' } : order
      )
    );
  };

  return (
    <div className="bg-white rounded-[0.6rem] p-4 sm:p-6 lg:col-span-3 shadow-sm h-auto min-h-[300px]">
      
      <div className="flex justify-between items-center mb-6">
        <Badge icon="📋" text="Restock Queue" />
        <span className="text-gray-400 font-bold text-xl cursor-pointer hover:text-gray-600 transition-colors">
          ⋮
        </span>
      </div>
      
      {/* 
        Applied cross-browser scrollbar hiding utility classes:
        1. [&::-webkit-scrollbar]:hidden (Chrome, Safari, iOS)
        2. [-ms-overflow-style:none] (IE and Edge)
        3. [scrollbar-width:none] (Firefox)
      */}
      <div className="overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        
        <table className="w-full text-left border-collapse min-w-[500px] whitespace-nowrap">
          <thead>
            <tr className="text-gray-400 text-sm border-b border-gray-100">
              <th className="pb-4 font-semibold w-1/3">Order Details</th>
              <th className="pb-4 font-semibold w-1/3">Product</th>
              <th className="pb-4 font-semibold w-1/6">Qty</th>
              <th className="pb-4 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {loading ? (
              <tr>
                <td colSpan="4" className="py-12 text-center text-gray-400 font-medium">
                  <div className="inline-block animate-pulse">Loading stock database pipeline...</div>
                </td>
              </tr>
            ) : restocks.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-12 text-center text-gray-400 font-medium">
                  System idle. Waiting for inventory trigger.
                </td>
              </tr>
            ) : (
              restocks.map((order) => (
                <tr 
                  key={order._id} 
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/70 transition-colors"
                >
                  <td className="py-4 pr-4">
                    <div className="flex flex-col gap-0.5">
                      <span className={`text-[10px] font-extrabold tracking-wider uppercase ${
                        order.status === 'CONFIRMED' ? 'text-emerald-500' : 'text-amber-500'
                      }`}>
                        {order.status || 'PENDING'}
                      </span>
                      <span className="font-mono text-gray-500 truncate max-w-[120px]">
                        {order._id}
                      </span>
                    </div>
                  </td>
                  
                  <td className="py-4 font-bold text-gray-900 pr-4">
                    {order.product?.name || order.product}
                  </td>
                  
                  <td className="py-4 font-medium text-gray-700">
                    {order.quantityRequested} Units
                  </td>
                  
                  <td className="py-4">
                    {order.status !== 'CONFIRMED' ? (
                      <button 
                        onClick={() => handleSimulateReply(order._id, order.supplier?._id || order.supplier)}
                        className="text-xs px-3 py-1.5 bg-[#111111] hover:bg-black text-white font-bold rounded-lg transition-all active:scale-95 shadow-sm hover:shadow"
                      >
                        Reply "YES"
                      </button>
                    ) : (
                      <span className="text-emerald-600 font-bold inline-flex items-center gap-1">
                        ✓ Synced
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RestockQueueTable;