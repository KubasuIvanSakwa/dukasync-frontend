import { Link } from 'react-router-dom';
import { useToggleCart, useAddToCart } from '../../zustand/store';

function CartPage() {
    const toggleCart = useToggleCart((s) => s.toggleCart);
    const cartState = useToggleCart(({ toggle }) => toggle);
    
    const { cart, addToCart, removeFromCart, deleteFromCart } = useAddToCart();

    // The math is now incredibly simple because quantity is built-in
    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

    const handleDemoCheckout = async () => {
        console.log("Triggering DukaSync API...");
        // Add your fetch logic here
    };

    return (
        <>
            {cartState && (
                <section className="fixed inset-0 z-[999] flex justify-end">
                    <div 
                        className="absolute inset-0 bg-black/20 backdrop-blur-sm" 
                        onClick={() => toggleCart()}
                    ></div>
                    
                    <div className='relative bg-white w-full md:w-[400px] h-full shadow-2xl flex flex-col z-10'>
                        
                        <div className="flex justify-between items-center p-4 border-b border-gray-100">
                            <h2 className="text-2xl font-bold">Your Cart</h2>
                            <button 
                                onClick={() => toggleCart()}
                                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-600 hover:text-black"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>

                        {cart.length === 0 ? (
                            <div className='flex justify-center flex-col items-center flex-1'>
                                <p className="font-semibold text-lg">Your cart is empty.</p>
                                <button onClick={() => toggleCart()} className="text-blue-500 hover:underline mt-2">
                                    Continue shopping
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className='flex-1 overflow-y-auto p-4 flex flex-col gap-3 scrollbar-none'>
                                    {/* We now map directly over the Zustand cart array! */}
                                    {cart.map(item => {
                                        const identifier = item.id || item.name;

                                        return (
                                            <Link 
                                                key={identifier} 
                                                className='flex border border-gray-200 hover:bg-gray-50 gap-3 rounded-xl p-3 transition-colors group'
                                                to={`/item/${item.name}`}
                                                onClick={() => toggleCart()}
                                            >
                                                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md border border-gray-100" />
                                                
                                                <div className="flex flex-col flex-1 justify-between py-1">
                                                    <div>
                                                        <h3 className='text-md font-bold leading-tight line-clamp-1'>{item.name}</h3>
                                                        <p className='text-xs text-gray-500 line-clamp-1 mt-1'>{item.description}</p>
                                                    </div>
                                                    
                                                    <div className='flex items-center justify-between mt-2'>
                                                        <p className='font-bold text-sm'>
                                                            ${(item.price * item.quantity).toFixed(2)}
                                                        </p>
                                                        
                                                        {/* Quantity Controls */}
                                                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1" >
                                                            <button 
                                                                onClick={(e) => { 
                                                                    e.preventDefault(); e.stopPropagation(); 
                                                                    removeFromCart(identifier); 
                                                                }} 
                                                                className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm hover:bg-gray-50 font-bold active:scale-95"
                                                            >
                                                                -
                                                            </button>
                                                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                                            <button 
                                                                onClick={(e) => { 
                                                                    e.preventDefault(); e.stopPropagation(); 
                                                                    // We pass the whole item back in to increment it
                                                                    addToCart(item); 
                                                                }} 
                                                                className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm hover:bg-gray-50 font-bold active:scale-95"
                                                            >
                                                                +
                                                            </button>
                                                        </div>

                                                        {/* Trash Button */}
                                                        <button 
                                                            onClick={(e) => { 
                                                                e.preventDefault(); e.stopPropagation(); 
                                                                deleteFromCart(identifier); 
                                                            }} 
                                                            className="text-red-400 hover:text-red-600 p-1 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>

                                <div className='p-4 border-t border-gray-200 bg-gray-50'>
                                    <div className="flex justify-between items-center mb-4 px-1">
                                        <span className="text-gray-500 font-semibold text-sm">Total</span>
                                        <span className="text-2xl font-black">${cartTotal.toFixed(2)}</span>
                                    </div>
                                    <button 
                                        onClick={handleDemoCheckout}
                                        className='w-full bg-black hover:bg-gray-800 text-white p-4 rounded-xl font-bold transition-all shadow-md active:scale-95 text-lg'
                                    >
                                        Check Out
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </section>
            )}
        </>
    );
}

export default CartPage;