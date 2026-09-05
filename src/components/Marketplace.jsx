import { useState, useEffect, useRef } from 'react';
import Card from './Card';
import { useFetchProducts } from '../../zustand/store';

// Standard Fisher-Yates shuffle algorithm
const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

function Marketplace() {
    const products = useFetchProducts((state) => state.products);
    const loading = useFetchProducts((state) => state.loading);
    const error = useFetchProducts((state) => state.errorM);
    
    // Local state for the scrambled list
    const [randomizedProducts, setRandomizedProducts] = useState([]);
    const [visibleCount, setVisibleCount] = useState(10);
    const loaderRef = useRef(null);

    // Shuffle the products exactly once when they are fetched from Zustand
    useEffect(() => {
        if (products && products.length > 0) {
            setRandomizedProducts(shuffleArray(products));
        }
    }, [products]);

    // Intersection Observer to detect when the user scrolls to the bottom
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const target = entries[0];
                if (target.isIntersecting && !loading) {
                    setVisibleCount((prevCount) => prevCount + 10);
                }
            },
            {
                root: null,
                rootMargin: "20px",
                threshold: 1.0 
            }
        );

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => {
            if (loaderRef.current) observer.unobserve(loaderRef.current);
        };
    }, [loading, randomizedProducts.length]);

    // Slice from the randomized array instead of the original one
    const visibleProducts = randomizedProducts.slice(0, visibleCount);
    const hasMore = visibleCount < randomizedProducts.length;

    return (
        <section className="w-full min-h-fit py-6 px-4 sm:px-6 lg:px-8">
            <div className='flex flex-wrap justify-center gap-6 max-w-[1400px] mx-auto'>
                
                {visibleProducts.map((item) => (
                    <Card 
                        key={item._id}
                        id={item._id} 
                        name={item.name} 
                        description={item.description} 
                        price={item.price}
                        image={item?.images?.[0]}
                        stock={item.stockQuantity}
                    />
                ))}

                {/* Loading / Error States */}
                {loading && visibleCount === 10 && <p className="w-full text-center text-gray-500 font-bold">Loading items...</p>}
                {error && <p className="w-full text-center text-red-500 font-bold">{`Error: ${error}`}</p>}
                
                {/* Invisible trigger element for the Intersection Observer */}
                {!loading && !error && hasMore && (
                    <div ref={loaderRef} className="w-full py-8 flex justify-center">
                        <div className="animate-pulse text-gray-400 font-bold text-sm">
                            Loading more...
                        </div>
                    </div>
                )}

                {/* End of list indicator */}
                {!loading && !error && !hasMore && randomizedProducts.length > 0 && (
                    <div className="w-full py-8 text-center text-gray-400 font-bold text-sm">
                        You&lsquo;ve reached the end of the catalog.
                    </div>
                )}
                
            </div>
        </section>
    );
}

export default Marketplace;