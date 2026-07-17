import { useState } from "react";
import "../styles/calendar.css";


const Calendar = () => {


const [currentDate, setCurrentDate] = useState(new Date());

const [events, setEvents] = useState([]);

const [selectedDate, setSelectedDate] = useState(null);

const [showModal, setShowModal] = useState(false);

const [searchTerm, setSearchTerm] = useState("");


const [filters,setFilters] = useState({

Meeting:true,
Training:true,
Leave:true,
Deadline:true,
Boardroom:true

});



const [eventData, setEventData] = useState({

    title:"",
    time:"",
    endTime:"",
    category:"Meeting"

});







const monthNames = [

"January",
"February",
"March",
"April",
"May",
"June",
"July",
"August",
"September",
"October",
"November",
"December"

];



const days = [

"Sunday",
"Monday",
"Tuesday",
"Wednesday",
"Thursday",
"Friday",
"Saturday"

];





const year = currentDate.getFullYear();

const month = currentDate.getMonth();


const firstDay = new Date(year, month, 1).getDay();

const totalDays = new Date(year, month + 1, 0).getDate();





const previousMonth = () => {

setCurrentDate(

new Date(year, month - 1, 1)

);

};



const nextMonth = () => {

setCurrentDate(

new Date(year, month + 1, 1)

);

};



const today = () => {

setCurrentDate(new Date());

};







const openEventModal = (day) => {


const date =

`${year}-${String(month + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;


setSelectedDate(date);


setEventData({

    title:"",
    time:"",
    category:"Meeting"

});


setShowModal(true);


};




const saveEvent = () => {


if(
!eventData.title || 
!eventData.time ||
(eventData.category === "Boardroom" && !eventData.endTime)
){

alert("Please complete event details");

return;

}



const newEvent = {


date:selectedDate,

title:eventData.title,

time:eventData.time,

endTime:eventData.endTime,

category:eventData.category


};


setEvents(prevEvents => [

...prevEvents,

newEvent

]);




setEventData({

title:"",
time:"",
category:"Meeting"

});



setShowModal(false);


};







const getEvents = (day)=>{


const date =

`${year}-${String(month + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;



return events.filter(

(event)=>event.date === date

);


};






const filteredEvents = (day) => {

    return getEvents(day).filter((event) => {


        const searchMatch = searchTerm === "" || 
        event.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());


        const categoryMatch = filters[event.category];


        return searchMatch && categoryMatch;


    });

};

const boardroomBookings = events
.filter(
(event)=>event.category === "Boardroom"
)
.sort(
(a,b)=>new Date(a.date)-new Date(b.date)
);





const calendarDays=[];





for(let i=0;i<firstDay;i++){


calendarDays.push(

<div

className="calendar-box empty"

key={`empty-${i}`}

></div>


);


}





for(let day=1; day<=totalDays; day++){



const dayEvents = filteredEvents(day);



calendarDays.push(


<div

className="calendar-box"

key={day}

onClick={()=>openEventModal(day)}

>



<span className="date-number">

{day}

</span>





<div className="events-container">


{

dayEvents.map((event,index)=>(


<div

className={`event-card ${event.category.toLowerCase()}`}

key={index}

>


<strong>

{event.title}

</strong>



<small>

{event.time}

</small>



</div>


))


}



</div>




</div>


);


}

return (

<div className="calendar-page">





{/* SEARCH */}


<div className="calendar-search">


<input

type="text"

placeholder="Search calendar events..."

value={searchTerm}

onChange={(e)=>setSearchTerm(e.target.value)}


/>


</div>









<div className="calendar-layout">







{/* SIDEBAR */}



<div className="calendar-sidebar">



<h3>
Event Filter
</h3>




{

Object.keys(filters).map((category)=>(


<label key={category}>


<input

type="checkbox"

checked={filters[category]}


onChange={(e)=>

setFilters(prev => ({

...prev,

[category]:e.target.checked

}))

}


/>


{category}



</label>


))

}







{/* BOARDROOM */}



<div className="boardroom-status">


<h3>
Boardroom Schedule
</h3>


{

boardroomBookings.length === 0 ? (

<p>
No upcoming boardroom bookings
</p>

)

:

(

boardroomBookings.map((booking,index)=>(


<div

key={index}

className="boardroom-slot booked"

>


<strong>

{booking.date}

</strong>


<p>

{booking.time} - {booking.endTime}

<br/>

{booking.title}

</p>


</div>


))

)

}



</div>






</div>









{/* CALENDAR */}



<div className="calendar-content">





<div className="calendar-header">



<button onClick={previousMonth}>

‹

</button>





<h1>

{monthNames[month]} {year}

</h1>





<button onClick={nextMonth}>

›

</button>





</div>







<button

className="today-btn"

onClick={today}

>

Today

</button>








<div className="weekdays">


{

days.map((day)=>(


<div key={day}>

{day}

</div>


))


}


</div>







<div className="calendar-grid">


{calendarDays}


</div>






</div>






</div>













{/* MODAL */}



{

showModal && (



<div className="modal-overlay">



<div className="event-modal">





<h2>

Add Event

</h2>








<select

value={eventData.category}

onChange={(e)=>

setEventData({

...eventData,

category:e.target.value

})


}

>





<option>

Meeting

</option>




<option>

Training

</option>




<option>

Leave

</option>




<option>

Deadline

</option>

<option>
Boardroom
</option>


</select>









<input

type="text"

placeholder="Event title"


value={eventData.title}


onChange={(e)=>

setEventData({

...eventData,

title:e.target.value

})


}


/>


{
eventData.category === "Boardroom" && (

<input

type="time"

value={eventData.endTime}

onChange={(e)=>

setEventData({

...eventData,

endTime:e.target.value

})

}

placeholder="End Time"

/>

)
}






<input

type="time"

value={eventData.time}


onChange={(e)=>

setEventData({

...eventData,

time:e.target.value

})


}


/>








<button onClick={saveEvent}>

Save Event

</button>







<button

className="close-btn"

onClick={()=>setShowModal(false)}

>

Cancel

</button>







</div>


</div>


)


}






</div>

);


};



export default Calendar;