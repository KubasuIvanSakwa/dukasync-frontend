import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAddToCart, useFetchProducts, useToggleCart } from '../../zustand/store'; 
import truck from '../assets/truck.svg';
import delivery from '../assets/delivery.svg';

function DescriptionPage() {
    const { idno } = useParams(); 
    const [Prod, setProd] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [counter, setCounter] = useState(1); 

    const { addToCart } = useAddToCart();
    const toggleCart = useToggleCart(s => s.toggleCart);
    const product = useFetchProducts(({ products }) => products);

    const fetchProdById = async (id) => {
        try {
            const data = await product;
            const foundProduct = data.find((item) => item._id === id);
            
            if (foundProduct) {
                setProd(foundProduct);
            } else {
                throw new Error('Prod not found');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProdById(idno);
    }, [idno]);

    const handleAddToCart = () => {
        if (counter > 0) {
            for (let i = 0; i < counter; i++) {
                addToCart(Prod);
            }
            toggleCart(); 
        }
    };

    if (loading) return <div className="min-h-[50vh] flex items-center justify-center text-gray-500">Loading Prod details...</div>;
    if (error) return <div className="min-h-[50vh] flex items-center justify-center text-red-500">Error: {error}</div>;

    // Format prices with commas while maintaining 2 decimal places
    const formattedPrice = Prod ? Number(Prod.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00";
    const formattedTotalPrice = Prod ? Number(Prod.price * counter).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00";

    return (
        <section className="max-w-6xl mx-auto px-4 py-8 md:py-12 bg-white min-h-screen font-sans">
            {Prod ? (
                <div className="flex flex-col">
                    
                    <nav className="text-sm font-medium text-gray-400 mb-8">
                        <Link to="/" className="hover:text-black transition-colors">products</Link>
                        <span className="mx-2">/</span>
                        <span className="text-black">{Prod.name}</span>
                    </nav>

                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
                        
                        <div className="w-full lg:w-1/2 flex justify-center items-start">
                            {Prod.images ? (
                                <img 
                                    src={Prod.images} 
                                    alt={Prod.name} 
                                    className="w-full max-w-lg aspect-square object-cover rounded-2xl shadow-sm border border-gray-100"
                                />
                            ) : (
                                <div className="w-full max-w-lg aspect-square bg-gray-50 rounded-2xl flex flex-col items-center justify-center text-gray-400 border border-gray-100">
                                    <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    <span className="font-semibold">No preview available</span>
                                </div>
                            )}
                        </div>

                        <div className="w-full lg:w-1/2 flex flex-col">
                            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-tight">{Prod.name}</h2>
                            
                            <div className="flex items-center gap-1 mt-3 mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                ))}
                                <span className="text-sm font-bold text-gray-700 ml-2">4.8</span>
                                <span className="text-sm text-gray-400 ml-1">(124 reviews)</span>
                            </div>

                            <p className="text-lg text-gray-500 leading-relaxed mb-8">{Prod.description}</p>
                            
                            <div className="text-4xl font-bold text-black mb-10">
                                Ksh. {formattedPrice}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 mb-10">
                                <div className="flex items-center justify-between bg-gray-100 rounded-full px-2 py-1 w-full sm:w-[140px] h-[60px]">
                                    <button 
                                        className="w-12 h-full flex items-center justify-center text-2xl font-light text-gray-500 hover:text-black transition-colors"
                                        onClick={() => counter > 1 && setCounter(c => c - 1)}
                                    >
                                        -
                                    </button>
                                    <span className="text-lg font-bold w-8 text-center">{counter}</span>
                                    <button 
                                        className="w-12 h-full flex items-center justify-center text-2xl font-light text-gray-500 hover:text-black transition-colors"
                                        onClick={() => setCounter(c => c + 1)}
                                    >
                                        +
                                    </button>
                                </div>

                                <button 
                                    onClick={handleAddToCart}
                                    className="flex-1 bg-black hover:bg-gray-800 text-white p-4 text-lg font-bold h-[60px] rounded-full transition-all active:scale-95 shadow-md flex items-center justify-center gap-2"
                                >
                                    Add to Cart 
                                    <span className="text-gray-400 font-normal">|</span> 
                                    Ksh. {formattedTotalPrice}
                                </button>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="bg-white p-2 rounded-full shadow-sm border border-gray-100">
                                        <img src={truck} alt="Delivery" className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-md font-bold text-gray-900">Free Delivery</h4>
                                        <p className="text-sm text-gray-500 underline mt-1 cursor-pointer hover:text-black">Enter your postal code for Delivery Availability</p>
                                    </div>
                                </div>
                                
                                <div className="h-[1px] w-full bg-gray-200 mb-6"></div>
                                
                                <div className="flex items-start gap-4">
                                    <div className="bg-white p-2 rounded-full shadow-sm border border-gray-100">
                                        <img src={delivery} alt="Return" className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-md font-bold text-gray-900">Return Delivery</h4>
                                        <p className="text-sm text-gray-500 mt-1">Free 30 days Delivery Returns. <span className="underline cursor-pointer hover:text-black">Details</span></p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            ) : (
                <div className="min-h-[50vh] flex flex-col items-center justify-center text-gray-500">
                    <p className="text-2xl font-bold text-gray-300 mb-4">404</p>
                    <p>No Prod found with the given name.</p>
                    <Link to="/" className="text-blue-500 hover:underline mt-4">Return to products</Link>
                </div>
            )}
        </section>
    );
}

export default DescriptionPage;