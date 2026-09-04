import React, { useState, useEffect } from 'react';
import { Pie, PieChart, Tooltip } from 'recharts';

// Reusable System Badge Component
const Badge = ({ text, icon }) => (
  <div className="border text-black font-bold text-xs px-4 py-2 rounded-full inline-flex items-center gap-2 w-fit">
    <span>{text}</span>
  </div>
);

// #region Sample data - Red -> Green -> Blue
const chartData = [
  { name: 'A', value: 80, fill: '#ff0000' },
  { name: 'B', value: 45, fill: '#00ff00' },
  { name: 'C', value: 25, fill: '#0000ff' },
];

// #endregion
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
  // 1. Initial states: Start with 15 visitors and a max capacity (blue line) of 20
  const [activeSessions, setActiveSessions] = useState(15); 
  const [maxCapacity, setMaxCapacity] = useState(20); 

  // 2. Hourly background simulation loop
  useEffect(() => {
    // 3,600,000 ms = 1 hour (Note: Change this to 3000 temporarily if you want to test the animation quickly)
    const interval = setInterval(() => {
      // Mocking hourly data. Replace this with your actual database fetch.
      const nextSessions = Math.floor(Math.random() * 30); 
      
      setActiveSessions(nextSessions);
      
      // Auto-scaling logic: If new traffic beats the previous high, expand the scale
      setMaxCapacity(prevMax => Math.max(prevMax, nextSessions));
    }, 3600000); 

    return () => clearInterval(interval);
  }, []);

  // 3. Mathematical Formula mapped to the dynamic maxCapacity instead of a hardcoded 2000
  const safeMax = maxCapacity > 0 ? maxCapacity : 1; // Prevents division by zero
  const percentage = Math.min(Math.max(activeSessions, 0), safeMax) / safeMax;
  const liveAngle = 180 * (1 - percentage);

  return (
    <div className="bg-white rounded-[0.6rem] p-6 shadow-sm h-[320px] flex flex-col justify-between transition-shadow duration-300 hover:shadow-md">
      
      {/* Top Header Section */}
      <div className="flex justify-between items-start w-full">
        <Badge icon="📈" text="Hourly Traffic" />
        <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-md mt-1">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping" />
          <span className="text-[10px] font-extrabold tracking-wider text-blue-600 uppercase">Live</span>
        </div>
      </div>

      {/* Middle Section: Speedometer Container */}
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

      {/* Bottom Section: Numerical Traffic Display */}
      <div className="border-t border-gray-100 pt-3 flex flex-col items-center text-center w-full">
        <p className="text-4xl font-extrabold tracking-tighter text-gray-900 font-mono transition-all duration-300">
          {activeSessions.toLocaleString()}
        </p>
        <p className="text-gray-400 font-bold text-[10px] tracking-wider uppercase mt-0.5">
          Hourly Visitors (Peak: {maxCapacity})
        </p>
      </div>

    </div>
  );
}