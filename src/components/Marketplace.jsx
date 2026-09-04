import { useState, useEffect } from 'react'
import Card from './Card';

function Marketplace() {
    const [cosmetics, setCosmetics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCosmeticsData = async () => {
        try {
            const response = await fetch('/Items.json');
            if (!response.ok) {
                throw new Error('Failed to fetch cosmetics data');
            }
            const data = await response.json();
            setCosmetics(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchCosmeticsData();
    }, []);

    if (loading) return <p>Loading cosmetics...</p>;
    if (error) return <p>Error: {error}</p>;
    
    return (
        <section className="w-full min-h-fit py-6 px-4 sm:px-6 lg:px-8">
            {/* Swapped forced left-margins for justify-center and max-width */}
            <div className='flex flex-wrap justify-center gap-6 max-w-[1400px] mx-auto'>
                {cosmetics.map((cosmetic) => (
                    <Card 
                        key={cosmetic.id}
                        id={cosmetic.id} 
                        name={cosmetic.name} 
                        description={cosmetic.description} 
                        price={cosmetic.price}
                        image={cosmetic.image}
                    />
                ))}
            </div>
        </section>
    )
}

export default Marketplace