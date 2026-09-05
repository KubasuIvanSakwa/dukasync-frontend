import { useEffect } from 'react';
import { useFetchProducts } from '../../zustand/store'; 

const Badge = ({ text, severity }) => {
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
  const { products, loading, fetchProducts } = useFetchProducts();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // 1. Aggregate calculations: Sum of all stock vs Sum of all thresholds
  const totalProducts = products.length;
  
  const totalStock = products.reduce(
    (sum, product) => sum + (Number(product.stockQuantity) || 0), 
    0
  );
  
  const totalThreshold = products.reduce(
    (sum, product) => sum + (Number(product.reorderThreshold) || 0), 
    0
  );

  // 2. Health percentage calculation
  // We use 1.5x the threshold as the "100% Healthy" benchmark. 
  // If your stock matches your threshold exactly, you are at 66% (Warning/Critical border).
  let stockPercentage = 0;
  if (totalProducts > 0) {
      if (totalThreshold > 0) {
          stockPercentage = Math.min(100, Math.round((totalStock / (totalThreshold * 1.5)) * 100));
      } else {
          stockPercentage = 100; // If no thresholds are set, assume 100% healthy
      }
  }

  // 3. Dynamic severity based on the aggregated totals
  let severity = 'Healthy';
  let description = 'Inventory fully stocked';

  if (loading) {
    severity = 'Healthy';
    description = 'Evaluating inventory...';
  } else if (totalProducts === 0) {
    severity = 'Warning';
    description = 'No products in inventory';
  } else if (totalStock <= totalThreshold) {
    severity = 'Critical';
    description = `Total stock (${totalStock}) hit system threshold (${totalThreshold})`;
  } else if (totalStock <= totalThreshold * 1.5) {
    severity = 'Warning';
    description = `Store-wide stock is nearing thresholds`;
  }

  // 4. FIX: Force at least 1 active block if products exist so it shows RED instead of pure gray
  const activeBlocksCount = totalProducts === 0 ? 0 : Math.max(1, Math.ceil(stockPercentage / 10));

  const getBarColor = () => {
    if (severity === 'Critical') return 'bg-red-500';
    if (severity === 'Warning') return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="bg-white rounded-[0.6rem] p-6 shadow-sm h-[320px] flex flex-col justify-between transition-shadow duration-300 hover:shadow-md">
      
      <div className="flex flex-col">
        <Badge text={loading ? 'Syncing...' : `System Health - ${stockPercentage}%`} severity={severity} />
        <h2 className="text-4xl font-bold tracking-tighter mt-2 transition-all duration-300">
          {loading ? '...' : severity}
        </h2>
        <p className="text-gray-400 font-semibold mt-1 text-sm">
          {description}
        </p>
      </div>
      
      <div className="mt-auto flex gap-1.5 w-full">
        {[...Array(10)].map((_, i) => {
          const isActive = loading ? true : i < activeBlocksCount;
          
          return (
            <div 
              key={i} 
              className={`h-8 flex-1 rounded-[3px] transition-all duration-500 ${
                isActive 
                  ? (loading ? 'bg-gray-200 animate-pulse' : getBarColor()) 
                  : 'bg-gray-100'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default StockLevelCard;