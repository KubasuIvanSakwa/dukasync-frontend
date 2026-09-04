import { Area, AreaChart, XAxis, ResponsiveContainer, Tooltip } from 'recharts';

// Fixed mock data so it remains stable on reload
const data = [
  { day: "Mon", RE: 40, OR: 60 },
  { day: "Tue", RE: 30, OR: 13 },
  { day: "Wed", RE: 20, OR: 19 },
  { day: "Thur", RE: 80, OR: 18 },
  { day: "Fri", RE: 18, OR: 40 },
  { day: "Sat", RE: 19, OR: 38 },
  { day: "Sun", RE: 20, OR: 30 }
];

export const SystemActivityCard = () => {
  return (
    <div className="bg-white rounded-[0.6rem] p-6 lg:col-span-2 shadow-sm flex flex-col justify-between h-[320px] min-w-[300px]">
      {/* Header Info */}
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-400 font-semibold text-sm">Chart</p>
          <p className="text-xl tracking-tighter text-gray-400"><span className='text-[#82ca9d]'>Orders</span>/<span className='text-[#8884d8]'>Restocks</span></p>
        </div>
        {/* Replace with your original <Badge text="System Activity" /> component */}
        <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">system</span>
      </div>

      {/* Chart Wrapper: flex-grow ensures it dynamically fills the middle card space */}
      <div className="w-full flex-grow h-[120px] mt-2 mb-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
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
      </div>

      {/* Footer Info */}
      {/* <div className="flex items-end justify-end pt-2 border-t border-gray-100">
        <div className="text-right">
          <p className="text-gray-400 font-semibold text-xs mb-0.5">Pending Syncs</p>
          <p 
            className="text-4xl font-bold tracking-tighter text-gray-900"
            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.05)" }}
          >
            {pendingCount}
          </p>
        </div>
      </div> */}
    </div>
  );
};

export default SystemActivityCard;
