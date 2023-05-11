import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import LineWithTextArrow from '../Utils/LineWithTextArrow';
import MapBox from './MapBox';
import ToursSection from './ToursSection';
import HotelsSection from './HotelsSection';
import RestaurantsSection from './RestaurantsSection';


const SingleDestination = () => {
  const [destination, setDestination] = useState()
  const { slug } = useParams()
  const [isAccOpen, setIsAccOpen] = useState(false)

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`/api/destinations/${slug}`)
        setDestination(data.data.data)
      } catch (err) {
        toast.error('An error occured!', {
          position: "bottom-left",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    }
    )();
  }, [slug])

  if (!destination || !destination.photo) return (
    <div className="loader-container">
      <div className="spinner"></div>
    </div>
  )

  return (
    <div>
      <ToastContainer />
      <div className='w-full h-50 p-0 md:p-4 lg:p-8 flex flex-col md:flex-row gap-4 items-center'>
        <img src={`${destination.photo[0]}`} className='w-[100%] md:w-[50%] rounded-0 md:rounded-xl' alt="" />
        <img src={`${destination.photo[1]}`} className='w-[100%] md:w-[50%] rounded-0 md:rounded-xl' alt="" />
      </div>
      <MapBox coords={destination.location} />
      <div className='flex flex-col md:flex-row items-center justify-between px-14 text-4xl'>
        <div className='flex flex-col text-center text-primary font-bold'>
          <div className='underline'>Tours Available</div>
          <div className='text-center text-2xl'>{destination.tours.length}</div>
        </div>
        <div className='flex flex-col ml-0 mt-5 md:mt-0 md:ml-24 text-center text-primary font-bold'>
          <div className='underline'>Hotels Available</div>
          <div className='text-center text-2xl'>{destination.hotels.length}</div>
        </div>
        <div className='flex flex-col text-center text-primary font-bold'>
          <div className='underline'>Restaurants Available</div>
          <div className='text-center text-2xl'>{destination.restaurants.length}</div>
        </div>
      </div>
      <div className='m-3'>
        <button className='bg-none hover:bg-slate-200 transition duration-500 w-full my-4 text-center' onClick={() => setIsAccOpen(prevState => !prevState)}>
          <LineWithTextArrow content={"Description"} isOpen={isAccOpen} />
        </button>
        {isAccOpen && (
          <div className={'border-4 p-8'}>
            <p>{destination.description}</p>
          </div>)}
      </div>
      
      <div className="container mx-auto mt-10">
        <ToursSection tours={destination.tours}/>
        <HotelsSection/>
        <RestaurantsSection/>
      </div>
    </div >
  )
}

export default SingleDestination