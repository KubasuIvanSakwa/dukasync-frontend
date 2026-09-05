import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuthStore } from '../../zustand/store'; 

const OrdersPage = () => {
    const { user, token, isAuthenticated } = useAuthStore();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user || !token) return;

            try {
                const response = await fetch(`https://dukasync-backend-fvw3.onrender.com/api/v1/order/${user._id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.status === 404) {
                    throw new Error("Records not found (404). Check if the user has orders or if the backend route is correct.");
                }

                if (!response.ok) {
                    const errData = await response.json().catch(() => ({}));
                    throw new Error(errData.message || `Server returned error ${response.status}`);
                }
                
                const result = await response.json();

                const fetchedOrders = result.data || result;
                setOrders(Array.isArray(fetchedOrders) ? fetchedOrders : []); 
                
            } catch (err) {
                console.error("Order fetch error:", err);
                setError(err.message || "Network error. Could not connect to the server.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, token]);

    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />;
    }

    return (
        <section className="min-h-screen bg-gray-50 font-sans flex flex-col">

            <div className="flex-1 w-full max-w-[1000px] mx-auto p-4 sm:p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Order History</h1>
                    <p className="text-gray-500 mt-2">View and track your past purchases.</p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20 text-gray-400 font-bold animate-pulse">
                        Loading your orders...
                    </div>
                ) : error ? (
                    <div className="bg-red-50 text-red-600 p-6 rounded-2xl font-bold border border-red-100 text-center">
                        {error}
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white rounded-[2rem] p-12 border border-gray-100 text-center shadow-sm flex flex-col items-center">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h2>
                        <p className="text-gray-500 mb-6">When you buy items, they will appear here.</p>
                        <Link to="/" className="px-6 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {orders.map((order) => {
                            // Calculate and format the total order price before returning JSX
                            const orderTotal = order.items.reduce((total, item) => {
                                const p = item.productId?.price || item.price || 0;
                                const q = Number(item.quantity) || 1;
                                return total + (p * q);
                            }, 0);
                            const formattedOrderTotal = Number(orderTotal).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

                            return (
                                <div key={order._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                    
                                    {/* Order Header */}
                                    <div className="bg-gray-50 p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Order ID</span>
                                            <span className="font-mono font-bold text-gray-900">{order._id}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-black uppercase tracking-wider rounded-full">
                                                {order.status || 'Processing'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div className="p-4 sm:p-6 flex flex-col gap-4">
                                        {order.items.map((item, index) => {
                                            const product = item.productId || item;
                                            const price = product.price || 0;
                                            const quantity = Number(item.quantity) || 1;
                                            
                                            // Format individual item total
                                            const formattedItemTotal = Number(price * quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

                                            return (
                                                <div key={index} className="flex items-center gap-4 py-2 border-b border-gray-50 last:border-0 last:pb-0">
                                                    <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                                                        {product.image && (
                                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                        <div>
                                                            <p className="font-bold text-gray-900">{product.name || 'Unknown Item'}</p>
                                                            <p className="text-sm text-gray-500 mt-0.5">Qty: {quantity}</p>
                                                        </div>
                                                        <p className="font-bold text-gray-900">
                                                            Ksh. {formattedItemTotal}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Order Footer */}
                                    <div className="bg-gray-50 p-4 sm:p-6 border-t border-gray-100 flex justify-between items-center">
                                        <span className="font-bold text-gray-500">Total Paid</span>
                                        <span className="text-2xl font-black text-gray-900 tracking-tighter">
                                            Ksh. {formattedOrderTotal}
                                        </span>
                                    </div>

                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
};

export default OrdersPage;