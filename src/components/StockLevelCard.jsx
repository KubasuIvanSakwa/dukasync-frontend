import { useState, useEffect } from 'react';

// Reusable Badge Component
const Badge = ({ text, severity }) => {
  // Dynamic badge coloring based on stock danger levels
  const getBadgeColor = () => {
    if (severity === 'Critical') return 'border-red-200 bg-red-50 text-red-700';
    if (severity === 'Warning') return 'border-amber-200 bg-amber-50 text-amber-700';
    return 'border-emerald-200 bg-emerald-50 text-emerald-700';
  };

  return (
    <div className={`border font-bold text-xs px-4 py-1.5 rounded-full inline-flex items-center gap-2 mb-4 w-fit transition-colors duration-300 ${getBadgeColor()}`}>
      <span>{text}</span>
    </div>
  );
};

export const StockLevelCard = () => {
  // 1. Setup mock state for tracking live-updating changes
  const [stockPercentage, setStockPercentage] = useState(10);
  const [severity, setSeverity] = useState('Critical');
  const [description, setDescription] = useState('Reorder threshold met');

  useEffect(() => {
    const mockDataTimeline = [
      { percentage: 10, severity: 'Critical', desc: 'Reorder threshold met' },
      { percentage: 35, severity: 'Warning', desc: 'Running low soon' },
      { percentage: 80, severity: 'Healthy', desc: 'Inventory fully stocked' },
    ];

    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % mockDataTimeline.length;
      const current = mockDataTimeline[index];
      
      setStockPercentage(current.percentage);
      setSeverity(current.severity);
      setDescription(current.desc);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // 3. Math calculation for dynamic battery/status bar rendering
  // Divides percentage into 10 block steps (e.g., 80% = 8 active blocks)
  const activeBlocksCount = Math.ceil(stockPercentage / 10);

  // Dynamic color selection for the progress bar bars
  const getBarColor = () => {
    if (severity === 'Critical') return 'bg-red-500';
    if (severity === 'Warning') return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="bg-white rounded-[0.6rem] p-6 shadow-sm h-[320px] flex flex-col justify-between transition-shadow duration-300 hover:shadow-md">
      {/* Top Header Information */}
      <div className="flex flex-col">
        <Badge text={`Stock Level - ${stockPercentage}%`} severity={severity} />
        <h2 className="text-4xl font-bold tracking-tighter mt-2 transition-all duration-300">
          {severity}
        </h2>
        <p className="text-gray-400 font-semibold mt-1 text-sm">
          {description}
        </p>
      </div>
      
      {/* Interactive Status Bars (E-cycle layout) */}
      <div className="mt-auto flex gap-1.5 w-full">
        {[...Array(10)].map((_, i) => {
          const isActive = i < activeBlocksCount;
          return (
            <div 
              key={i} 
              className={`h-8 flex-1 rounded-[3px] transition-all duration-500 ${
                isActive ? getBarColor() : 'bg-gray-100'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default StockLevelCard;
