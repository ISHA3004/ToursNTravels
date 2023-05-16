/* eslint-disable react/prop-types */
import { useState } from 'react'
import { BsChevronDown } from 'react-icons/bs'
import { AiOutlineCalendar, AiOutlineUsergroupAdd } from 'react-icons/ai'
import { RxCounterClockwiseClock } from 'react-icons/rx'

const BookingSection = ({ tour }) => {
   tour.startDates = tour.startDates.map(date => {
      const options = {
         day: 'numeric',
         month: 'long',
         year: 'numeric',
      };
      const parsedDate = new Date(date);
      return parsedDate.toLocaleString('en-GB', options);
   });

   const [isCalendarOpen, setIsCalendarOpen] = useState(false)
   const [calendar, setCalendar] = useState(tour?.startDates[0])
   const [countOfPeople, setCountOfPeople] = useState(2)

   const decrementHandler = () => {
      countOfPeople > 1 && setCountOfPeople((prevState) => prevState - 1)
   }

   const incrementHandler = () => {
      countOfPeople < tour.maxGroupSize - 2 && setCountOfPeople((prevState) => prevState + 1)
   }

   return (
      <div className={`w-full flex flex-col border border-gray-400 rounded-xl p-8 ${isCalendarOpen ? 'h-[53rem]' : 'h-[44rem]'}`}>
         <h1 className='font-bold text-3xl'>Reserve your spot</h1>
         <div className='w-full mt-3 font-medium'>
            <div onClick={() => setIsCalendarOpen((prevState) => !prevState)} className={`bg-white hover:bg-gray-300 border-2 transition-all w-full p-3 flex items-center justify-between rounded-full cursor-pointer text-center ${!calendar && 'text-gray-500'}`}>
               <AiOutlineCalendar size={35} className='text-pink-600' />{calendar ? calendar : "Select date"}
               <BsChevronDown className={`ml-2 ${isCalendarOpen && 'rotate-180'}`} />
            </div>
            <ul className={`bg-white my-2 overflow-y-auto ${isCalendarOpen ? 'max-h-36' : 'max-h-0'} rounded-lg`}>
               {tour.startDates.map((date, index) => (
                  <li key={index} className={`p-2 text-sm hover:bg-pink-600 hover:text-white cursor-pointer ${date?.toLowerCase() === calendar?.toLowerCase() && 'bg-pink-600 text-white'}`} onClick={() => { setCalendar(date); setIsCalendarOpen(prevState => !prevState) }}>{date}</li>
               ))}
            </ul>
         </div>
         <div className={`bg-white border-2 w-full p-3 flex flew-row text-gray-500 items-center rounded-full text-center`}>
            <AiOutlineUsergroupAdd size={35} className='text-pink-600' />
            <div className="flex-1 ml-4 mr-8">
               <div className='flex flex-row items-center justify-center gap-2'>
                  <button className={`w-16 h-12 text-2xl border-2 rounded-full hover:bg-gray-200 transition-all ${countOfPeople > 1 ? 'text-black cursor-pointer' : 'text-gray-200 cursor-not-allowed'}`} onClick={decrementHandler}>-</button>
                  <div className='p-2 text-center border-2 border-gray-300 rounded-2xl w-full text-black'>{countOfPeople}</div>
                  <button className={`w-16 h-12 text-2xl border-2 rounded-full hover:bg-gray-200 transition-all ${countOfPeople < tour.maxGroupSize - 2 ? 'text-black cursor-pointer' : 'text-gray-200 cursor-not-allowed'}`} onClick={incrementHandler}>+</button>
               </div>
            </div>
         </div>
         {calendar && <h3 className='text-green-600 mt-4'>Option is available</h3>}

         <div className='border-2 w-full h-48 my-5 p-4 border-black rounded-xl flex flex-col'>
            <h1 className='font-semibold'>{tour.name}</h1>
            <h3 className='text-gray-600 mt-2'>{calendar}, {countOfPeople} Adults x ${tour.price}</h3>
            <h4 className='text-sm'>(No additional taxes or booking fees)</h4>
            <h1 className='mt-auto font-bold text-2xl'>Total: ${countOfPeople * tour.price}</h1>
         </div>

         <button className='p-4 my-5 text-center bg-pink-600 text-white rounded-full hover:bg-pink-800 transition-all'>Reserve Now</button>
         <div className='flex flex-row gap-2 text-base'>
            <RxCounterClockwiseClock size={30} className='text-pink-600'/>
            Not sure? You can cancel this reservation up to 24 hours in advance for a full refund
         </div>
      </div>
   )
}

export default BookingSection