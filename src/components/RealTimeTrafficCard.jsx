import React, { useState, useEffect } from 'react';
import { Pie, PieChart, Tooltip } from 'recharts';
import { useAuthStore } from '../../zustand/store';

const Badge = ({ text, icon }) => (
  <div className="border text-black font-bold text-xs px-4 py-2 rounded-full inline-flex items-center gap-2 w-fit">
    <span>{icon} {text}</span>
  </div>
);

const chartData = [
  { name: 'Critical', value: 80, fill: '#ff0000' },
  { name: 'Moderate', value: 45, fill: '#00ff00' },
  { name: 'High', value: 25, fill: '#0000ff' },
];

const NEEDLE_BASE_RADIUS_PX = 5;
const NEEDLE_COLOR = '#d0d000';
const Needle = ({ cx, cy, midAngle, innerRadius, outerRadius }) => {
  const needleBaseCenterX = cx;
  const needleBaseCenterY = cy;
  const needleLength = innerRadius + (outerRadius - innerRadius) / 2;

  return (
    <g>
      <circle
        cx={needleBaseCenterX}
        cy={needleBaseCenterY}
        r={NEEDLE_BASE_RADIUS_PX}
        fill={NEEDLE_COLOR}
      />
      <path
        d={`M${needleBaseCenterX},${needleBaseCenterY}l${needleLength},0`}
        strokeWidth={2}
        stroke={NEEDLE_COLOR}
        fill={NEEDLE_COLOR}
        style={{
          transform: `rotate(-${midAngle}deg)`,
          transformOrigin: `${needleBaseCenterX}px ${needleBaseCenterY}px`,
          transition: 'transform 0.5s ease-out', 
        }}
      />
    </g>
  );
};

const HalfPie = (props) => (
  <Pie
    {...props}
    stroke="none"
    dataKey="value"
    startAngle={180}
    endAngle={0}
    data={chartData}
    cx={100}
    cy={100}
    innerRadius={50}
    outerRadius={100}
  />
);

export default function RealTimeTrafficCard({ isAnimationActive = true }) {
  const { token } = useAuthStore();
  const [activeCount, setActiveCount] = useState(0); 
  const [timeLabel, setTimeLabel] = useState('Hourly');
  const [maxCapacity, setMaxCapacity] = useState(10); 

  useEffect(() => {
    const fetchOrderVelocity = async () => {
      if (!token) return;

      try {
        const response = await fetch('https://dukasync-backend-fvw3.onrender.com/api/v1/order/admin/all', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) return;
        const result = await response.json();
        const orders = result.data || result || [];

        const now = new Date();
        const msInHour = 60 * 60 * 1000;
        
        // Define exact periods for comparison
        const hourAgo = new Date(now.getTime() - msInHour);
        const twoHoursAgo = new Date(now.getTime() - (2 * msInHour));
        
        const dayAgo = new Date(now.getTime() - (24 * msInHour));
        const twoDaysAgo = new Date(now.getTime() - (48 * msInHour));
        
        const weekAgo = new Date(now.getTime() - (7 * 24 * msInHour));
        const twoWeeksAgo = new Date(now.getTime() - (14 * 24 * msInHour));
        
        const monthAgo = new Date(now.getTime() - (30 * 24 * msInHour));
        const twoMonthsAgo = new Date(now.getTime() - (60 * 24 * msInHour));

        // Helper to count orders within a specific window
        const countInWindow = (start, end) => orders.filter(o => {
            const time = new Date(o.createdAt).getTime();
            return time >= start.getTime() && time < end.getTime();
        }).length;

        let currentCount = 0;
        let previousCount = 0;
        let currentLabel = 'Hourly';

        // Cascade to find the most relevant timeframe
        if (countInWindow(hourAgo, now) > 0) {
          currentCount = countInWindow(hourAgo, now);
          previousCount = countInWindow(twoHoursAgo, hourAgo);
          currentLabel = 'Hourly';
        } else if (countInWindow(dayAgo, now) > 0) {
          currentCount = countInWindow(dayAgo, now);
          previousCount = countInWindow(twoDaysAgo, dayAgo);
          currentLabel = 'Daily';
        } else if (countInWindow(weekAgo, now) > 0) {
          currentCount = countInWindow(weekAgo, now);
          previousCount = countInWindow(twoWeeksAgo, weekAgo);
          currentLabel = 'Weekly';
        } else if (countInWindow(monthAgo, now) > 0) {
          currentCount = countInWindow(monthAgo, now);
          previousCount = countInWindow(twoMonthsAgo, monthAgo);
          currentLabel = 'Monthly';
        }

        setActiveCount(currentCount);
        setTimeLabel(currentLabel);
        
        // Scale Peak = (Previous Period) + (Current Period)
        // We fallback to 10 if both are 0 so the chart needle remains grounded
        const calculatedPeak = currentCount + previousCount;
        setMaxCapacity(calculatedPeak > 0 ? calculatedPeak : 10);

      } catch (error) {
        console.error("Traffic tracking error:", error);
      }
    };

    fetchOrderVelocity();
    const interval = setInterval(fetchOrderVelocity, 60000);
    return () => clearInterval(interval);
  }, [token]);

  // Prevents division by zero
  const safeMax = maxCapacity > 0 ? maxCapacity : 1;
  const percentage = Math.min(Math.max(activeCount, 0), safeMax) / safeMax;
  const liveAngle = 180 * (1 - percentage);

  return (
    <div className="bg-white rounded-[0.6rem] p-6 shadow-sm h-[320px] flex flex-col justify-between transition-shadow duration-300 hover:shadow-md">
      
      <div className="flex justify-between items-start w-full">
        <Badge text="Order Velocity" />
        
      </div>

      <div className="w-full h-[120px] flex items-center justify-center relative mt-2 select-none pointer-events-none">
        <PieChart width={210} height={120} style={{ margin: '0 auto' }}>
          <HalfPie isAnimationActive={isAnimationActive} />
          <Pie
            isAnimationActive={isAnimationActive}
            stroke="none"
            dataKey="value"
            startAngle={180}
            endAngle={0}
            data={[{ value: 1 }]} 
            cx={100}
            cy={100}
            innerRadius={50}
            outerRadius={100}
            fill="transparent"
            activeIndex={0}
            activeShape={(props) => <Needle {...props} midAngle={liveAngle} />}
          />
          <Tooltip defaultIndex={0} content={() => null} active />
        </PieChart>
      </div>

      <div className="border-t border-gray-100 pt-3 flex flex-col items-center text-center w-full">
        <p className="text-4xl font-extrabold tracking-tighter text-gray-900 font-mono transition-all duration-300">
          {activeCount.toLocaleString()}
        </p>
        <p className="text-gray-400 font-bold text-[10px] tracking-wider uppercase mt-0.5">
          {timeLabel} Orders (Scale Peak: {maxCapacity})
        </p>
      </div>

    </div>
  );
}