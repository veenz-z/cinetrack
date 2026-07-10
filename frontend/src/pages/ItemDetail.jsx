import { useState, useEffect } from 'react'; //use state for keeping data/ useEffect for getting info from back while page is loading
import { useParams } from 'react-router-dom'; // splits parameters using : / gives json
import { getTMDBDetails } from '../api/tmdb'; // the api req we made before for getting details

function ItemDetail() { // the whole component
    const { type, id } = useParams();// gets url parameters
    const [item, setItem] = useState(null); // holds  moovie info
    const [loading, setLoading] = useState(true); // loading is happening

    useEffect(() => { // this Hook starts when page loads
        setLoading(true); // loading
        getTMDBDetails(type, id)// getting info
            .then(setItem) // sets the res
            .finally(() => setLoading(false)); // resets the loading state
    }, [type, id]); // but if the type or id changes the page has to reload and gets the info again
    // it calls : Dependency Array

    if (loading) return <p>Loading...</p>;
    if (!item) return <p>Not found.</p>;

    const trailer = item.videos?.results?.find((v) => v.type === 'Trailer');
    //checks if item has video type of trailer to show it or not
    // the "?" makes the program prevent from crashing

    return ( // web look
        <div>
            <h1>{item.title || item.name}</h1>
            <p>{item.overview}</p>
            {trailer && (
                <iframe
                    width="560"
                    height="315"
                    src={`https://www.youtube.com/embed/${trailer.key}`}
                    title="Trailer"
                    allowFullScreen
                />
            )}
        </div>
    );
}

export default ItemDetail; // exporting to use