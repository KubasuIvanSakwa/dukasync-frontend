import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../zustand/store'; 

const Badge = ({ text, icon }) => (
  <div className="border text-black font-bold text-xs px-4 py-2 rounded-full inline-flex items-center gap-2">
    <span>{icon} {text}</span>
  </div>
);

export const RestockQueueTable = () => {
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [restocks, setRestocks] = useState([]);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchRestocks = async () => {
    try {
      const response = await fetch('https://dukasync-backend-fvw3.onrender.com/api/v1/restock', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (response.ok) {
        setRestocks(result.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch restocks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestocks();
    const interval = setInterval(fetchRestocks, 10000);
    return () => clearInterval(interval);
  }, [token]);

  const handleSimulateReply = async (orderId) => {
    try {
      const response = await fetch(`https://dukasync-backend-fvw3.onrender.com/api/v1/restock/${orderId}`, {
        method: "PUT", //[cite: 1]
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: "CONFIRMED" }) //[cite: 1]
      });
      
      if (response.ok) {
        // Optimistically update the UI. The sorting logic will immediately push it down.
        setRestocks((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: 'CONFIRMED' } : order
          )
        );
      }
    } catch (error) {
      console.error("Failed to confirm restock:", error);
    }
  };

  // 1. Sort the restocks: PENDING first, then CONFIRMED, DELIVERED, FAILED
  const statusPriority = { PENDING: 1, CONFIRMED: 2, DELIVERED: 3, FAILED: 4 };
  const sortedRestocks = [...restocks].sort((a, b) => {
    const priorityA = statusPriority[a.status] || 99;
    const priorityB = statusPriority[b.status] || 99;
    if (priorityA === priorityB) {
      // If statuses are equal, sort newest first
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    }
    return priorityA - priorityB;
  });

  // 2. Pagination Math
  const totalPages = Math.ceil(sortedRestocks.length / itemsPerPage);
  const currentItems = sortedRestocks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-white rounded-[0.6rem] p-4 sm:p-6 lg:col-span-3 shadow-sm flex flex-col min-h-[400px]">
      
      <div className="flex justify-between items-center mb-6">
        <Badge  text="Restock Queue" />
        <span className="text-gray-400 font-bold text-xl cursor-pointer hover:text-gray-600 transition-colors">
          ⋮
        </span>
      </div>
      
      <div className="flex-1 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
            ) : currentItems.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-12 text-center text-gray-400 font-medium">
                  System idle. Waiting for inventory trigger.
                </td>
              </tr>
            ) : (
              currentItems.map((order) => (
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
                    {order.product?.name || 'Unknown Product'}
                  </td>
                  
                  <td className="py-4 font-medium text-gray-700">
                    {order.quantityRequested} Units
                  </td>
                  
                  <td className="py-4">
                    {order.status === 'PENDING' ? (
                      <button 
                        onClick={() => handleSimulateReply(order._id)}
                        className="text-xs px-3 py-1.5 bg-[#111111] hover:bg-black text-white font-bold rounded-lg transition-all active:scale-95 shadow-sm hover:shadow"
                      >
                        Confirm
                      </button>
                    ) : (
                      <span className="text-emerald-600 font-bold inline-flex items-center gap-1">
                        ✓ {order.status === 'DELIVERED' ? 'Delivered' : 'Synced'}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {!loading && sortedRestocks.length > 0 && (
        <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100 text-sm text-gray-500">
          <span className="font-medium">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedRestocks.length)} of {sortedRestocks.length}
          </span>
          <div className="flex gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-gray-700 transition-colors"
            >
              Prev
            </button>
            <button 
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-gray-700 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestockQueueTable;