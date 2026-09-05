import { useState, useEffect } from 'react';
import { Area, AreaChart, XAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useAuthStore } from '../../zustand/store';

export const SystemActivityCard = () => {
  const { token } = useAuthStore();
  const [chartData, setChartData] = useState([
    { day: "Mon", RE: 0, OR: 0 },
    { day: "Tue", RE: 0, OR: 0 },
    { day: "Wed", RE: 0, OR: 0 },
    { day: "Thur", RE: 0, OR: 0 },
    { day: "Fri", RE: 0, OR: 0 },
    { day: "Sat", RE: 0, OR: 0 },
    { day: "Sun", RE: 0, OR: 0 }
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSystemActivity = async () => {
      try {
        // 1. Fetch orders securely
        const ordersRes = await fetch('https://dukasync-backend-fvw3.onrender.com/api/v1/order/admin/all', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        let orders = [];
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          orders = ordersData.data || ordersData || [];
        }

        // 2. Safely fetch restocks with fallback if endpoint doesn't exist yet
        let restocks = [];
        try {
          const restocksRes = await fetch('https://dukasync-backend-fvw3.onrender.com/api/v1/restocks');
          if (restocksRes.ok) {
            const restocksData = await restocksRes.json();
            restocks = restocksData.data || restocksData || [];
          }
        } catch (err) {
          console.warn("Restocks endpoint unavailable, defaulting to 0.");
        }

        const daysTracker = {
          "Mon": { RE: 0, OR: 0 },
          "Tue": { RE: 0, OR: 0 },
          "Wed": { RE: 0, OR: 0 },
          "Thur": { RE: 0, OR: 0 },
          "Fri": { RE: 0, OR: 0 },
          "Sat": { RE: 0, OR: 0 },
          "Sun": { RE: 0, OR: 0 }
        };

        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];

        orders.forEach(order => {
          if (order.createdAt) {
            const date = new Date(order.createdAt);
            const dayName = dayNames[date.getDay()];
            if (daysTracker[dayName]) {
              daysTracker[dayName].OR += 1;
            }
          }
        });

        restocks.forEach(restock => {
          const timestamp = restock.createdAt || restock.date;
          if (timestamp) {
            const date = new Date(timestamp);
            const dayName = dayNames[date.getDay()];
            if (daysTracker[dayName]) {
              daysTracker[dayName].RE += 1;
            }
          }
        });

        const formattedData = Object.keys(daysTracker).map(day => ({
          day,
          RE: daysTracker[day].RE,
          OR: daysTracker[day].OR
        }));

        setChartData(formattedData);
      } catch (error) {
        console.error("Failed to load system activity chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSystemActivity();
  }, [token]);

  return (
    <div className="bg-white rounded-[0.6rem] p-6 lg:col-span-2 shadow-sm flex flex-col justify-between h-[320px] min-w-[300px]">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-400 font-semibold text-sm">Chart</p>
          <p className="text-xl tracking-tighter text-gray-400">
            <span className='text-[#82ca9d]'>Orders</span>/<span className='text-[#8884d8]'>Restocks</span>
          </p>
        </div>
        <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">system</span>
      </div>

      <div className="w-full flex-grow h-[120px] mt-2 mb-2">
        {loading ? (
          <div className="flex items-center justify-center h-full text-xs text-gray-400 animate-pulse font-bold">
            Syncing activity...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" hide={true} /> 
              <Tooltip />
              <Area
                type="monotone"
                dataKey="RE"
                stroke="#8884d8"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorUv)"
                isAnimationActive={true}
              />
              <Area
                type="monotone"
                dataKey="OR"
                stroke="#82ca9d"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPv)"
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default SystemActivityCard;