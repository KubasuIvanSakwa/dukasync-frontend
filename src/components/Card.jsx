import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAddToCart } from '../../zustand/store';

// Helper function to generate stable "random" numbers based on the product ID string
const getDeterministicMetrics = (id) => {
  let hash = 0;
  // Create a numeric hash from the string characters
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Use sine and cosine to generate predictable decimals between 0 and 1
  const random1 = Math.abs(Math.sin(hash));
  const random2 = Math.abs(Math.cos(hash));

  // Scale random1 to a rating between 3.8 and 4.8
  const rating = (3.8 + random1 * 1.0).toFixed(1);
  
  // Scale random2 to a sane review count between 15 and 380
  const reviews = Math.floor(15 + random2 * 365);

  return { rating, reviews };
};

function Card({ id, name, description, price, image, stock = 10 }) {
    const addToCart = useAddToCart((s) => s.addToCart);

    // useMemo ensures we only run the math once per item render
    const { rating, reviews } = useMemo(() => getDeterministicMetrics(id), [id]);

    const formattedPrice = Number(price).toLocaleString();

    return (
      <Link
        to={`item/${id}`}
        className="relative shadow-md hover:shadow-xl transition-all duration-300 bg-white w-[18rem] h-[25rem] rounded-2xl flex flex-col overflow-hidden border border-gray-100 group"
      >
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold shadow-sm z-20">
          {stock <= 10 ? (
            <span className="text-red-600 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
              Low Stock
            </span>
          ) : (
            <span className="text-green-600">In Stock</span>
          )}
        </div>

        <div
          className="w-full h-[14rem] bg-no-repeat bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
          style={{ backgroundImage: `url('${image}')` }}
        ></div>

        <div className="flex flex-col justify-between flex-1 p-4 bg-white z-10">
          <div>
            <div className="flex justify-between items-start gap-2">
              <h2 className="font-extrabold text-gray-900 line-clamp-1">
                {name}
              </h2>
              <p className="font-black text-lg">
                <sup className="font-medium text-xs text-gray-500 mr-0.5">
                  kes
                </sup>
                {formattedPrice}
              </p>
            </div>

            <p className="text-gray-500 text-sm line-clamp-2 mt-1 leading-snug">
              {description}
            </p>

            <div className="flex items-center gap-1 mt-2">
              <svg
                className="w-4 h-4 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-bold text-gray-700">{rating}</span>
              <span className="text-xs text-gray-400 ml-1">
                ({reviews} reviews)
              </span>
            </div>
          </div>

          <button
            className="w-full mt-3 py-2.5 bg-black hover:bg-gray-800 text-white font-semibold rounded-xl active:scale-95 transition-transform"
            onClick={(e) => {
              e.preventDefault();
              addToCart({ id, name, price, description, image });
            }}
          >
            Add to cart
          </button>
        </div>
      </Link>
    );
}

export default Card;