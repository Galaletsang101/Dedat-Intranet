
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

import {
    HiCalendar,
    HiDocumentText,
    HiTemplate,
    HiUserGroup,
    HiOfficeBuilding,
    HiChartBar,
    HiCreditCard,
    HiUsers,
    HiShieldCheck,
    HiPlus,
    HiHeart,
    HiUser,
    HiDocument,
    HiBell,
    HiStar,
    HiBookOpen,
    HiVideoCamera,
    HiDesktopComputer,
    HiNewspaper,
    HiClock,
    HiMail,
    HiSpeakerphone
} from "react-icons/hi";



/* =====================================
   HEADER
===================================== */

const GreetingHeader = () => {

return (

<header className="dashboard-header">

<h1>
Welcome back, Thabo
</h1>

<p>
Your central hub for NCDEDAT departmental services and professional resources.
</p>

</header>

);

};




/* =====================================
   QUICK ACTIONS
===================================== */


const QuickActions = () => {
  const navigate = useNavigate();

  const handleAction = (item) => {
    if (item.path) {
      navigate(item.path);
      return;
    }

    if (item.mailto) {
      window.location.href = `mailto:${item.mailto}`;
    }
  };

  const actions = [
    {
      title: "Apply for Leave",
      desc: "Track and request time off",
      icon: <HiCalendar />,
      mailto: "hr@dedat.gov.za?subject=Leave%20Request",
    },
    {
      title: "Submit Forms",
      desc: "Claims, travel & procurement",
      icon: <HiDocumentText />,
      path: "/knowledge-center",
    },
    {
      title: "HR Templates",
      desc: "Letters, logs & checklists",
      icon: <HiTemplate />,
      path: "/knowledge-center",
    },
    {
      title: "Contact HR",
      desc: "Support & inquiries",
      icon: <HiUserGroup />,
      mailto: "hr@dedat.gov.za?subject=HR%20Support",
    },
  ];



return (

<section className="dashboard-actions">


{

actions.map((item,index)=>(


<button
  type="button"
  className="dashboard-action-card"
  key={index}
  onClick={() => handleAction(item)}
>

  <div>
    <h3>{item.title}</h3>
    <p>{item.desc}</p>
  </div>

  <div className="dashboard-action-icon">{item.icon}</div>
</button>


))

}



</section>

);


};






/* =====================================
   HR SERVICES
===================================== */


const HRServices = () => {
  const navigate = useNavigate();

  const services = [

{
title:"Leave Management",
desc:"View balances and applications",
icon:<HiCalendar/>
},

{
title:"PMDS",
desc:"Performance management",
icon:<HiChartBar/>
},

{
title:"Payroll Links",
desc:"Payslips and certificates",
icon:<HiCreditCard/>
},

{
title:"Labour Relations",
desc:"Policies and support",
icon:<HiUsers/>
},

{
title:"Ethics Management",
desc:"Code of conduct",
icon:<HiShieldCheck/>
}

];



return (

<section className="dashboard-section">


<div className="dashboard-section-title">

<HiOfficeBuilding/>

<h2>
HR Services & Payroll
</h2>


</div>



<div className="dashboard-service-grid">


{

services.map((item,index)=>(


<div 
className="dashboard-service-card"
key={index}
>


<div className="dashboard-icon">

{item.icon}

</div>


<h4>
{item.title}
</h4>


<p>
{item.desc}
</p>


</div>


))


}



<button
  type="button"
  className="dashboard-service-card more"
  onClick={() => navigate("/policies")}
>

<HiPlus/>

<h4>
More Services
</h4>


</button>


</div>



</section>

);


};







/* =====================================
   WELLNESS CENTRE
===================================== */


const WellnessCenter = () => {


const resources=[

{
title:"FAMSA Partnership",
desc:"Confidential counselling and support",
icon:<HiUser/>
},


{
title:"Health Circulars",
desc:"Health updates and protocols",
icon:<HiDocument/>
},


{
title:"First Aid Services",
desc:"Emergency assistance, first aid procedures and safety support",
icon:<HiHeart/>
}


];



return (

<section className="dashboard-wellness">


<div className="dashboard-section-title">


<HiHeart/>


<h2>
Wellness Center
</h2>


</div>




<p>

Prioritizing the health and mental well-being of our dedicated staff.

</p>




<div className="dashboard-wellness-list">



{

resources.map((item,index)=>(


<div 
className="dashboard-wellness-item"
key={index}
>


<div className="dashboard-icon">

{item.icon}

</div>



<div>

<h4>
{item.title}
</h4>


<p>
{item.desc}
</p>


</div>


</div>


))


}



</div>



</section>

);


};
/* =====================================
   EMPLOYEE NOTICES
===================================== */

const EmployeeNotices = () => {
  const [showArchive, setShowArchive] = useState(false);

  const notices = [

{
tag:"Acting Appointment",
title:"Ms. Nomvula Dube",
desc:"Acting Director: Tourism Development effective 01 Nov."
},

{
tag:"New Appointment",
title:"Mr. Kevin Smith",
desc:"Welcome our new IT Security Specialist."
},

{
tag:"Bereavement",
title:"Memorial Service: L. Mofokeng",
desc:"Thursday, 14:00 at Main Hall."
}

];

  const archiveNotices = [
    {
      tag: "Archived",
      title: "Policy Update: Leave Guidelines",
      desc: "Please review the revised leave procedures published last month.",
    },
    {
      tag: "Archived",
      title: "HR Workshop Reminder",
      desc: "Attendance is required for the quarterly wellness and compliance workshop.",
    },
  ];

  const visibleNotices = showArchive ? [...notices, ...archiveNotices] : notices;

  return (

<section className="dashboard-notices">


<h2>

<HiBell/>

Employee Notices

</h2>



{
visibleNotices.map((item,index)=>(

<div 
className="dashboard-notice"
key={index}
>


<span>
{item.tag}
</span>


<h4>
{item.title}
</h4>


<p>
{item.desc}
</p>


</div>


))

}



<button type="button" onClick={() => setShowArchive((prev) => !prev)}>

{showArchive ? "Hide Archive" : "See Archive"}

</button>


</section>

);

};





/* =====================================
   STAFF SPOTLIGHT
===================================== */


const StaffSpotlight = () => {


return (

<section className="dashboard-spotlight">


<div className="dashboard-spotlight-header">

<HiStar/>

Staff Spotlight

</div>



<div className="dashboard-spotlight-body">


<img

className="dashboard-avatar"

src="https://randomuser.me/api/portraits/women/44.jpg"

alt="Staff Member"

/>



<h3>
Sarah Johnson
</h3>



<p>
Excellence in Service Delivery
</p>



<blockquote>

"Sarah consistently goes above and beyond to support the SMME development project."

</blockquote>




<div className="dashboard-tags">


<span>
Long Service
</span>


<span>
Innovation Award
</span>


</div>



</div>


</section>


);


};







/* =====================================
   LEARNING CENTRE
===================================== */


const LearningCentre = () => {


const resources=[


{
title:"Zoom / Teams Guides",
desc:"Troubleshooting and basics",
icon:<HiVideoCamera/>
},


{
title:"Training Resources",
desc:"Department manuals and SOPs",
icon:<HiBookOpen/>
},


{
title:"E-learning Modules",
desc:"Mandatory compliance courses",
icon:<HiDesktopComputer/>
}


];



return (

<section className="dashboard-learning">


<h2>

<HiBookOpen/>

Learning Centre

</h2>



{

resources.map((item,index)=>(


<div

className="dashboard-learning-card"

key={index}

>


<div className="dashboard-learning-icon">

{item.icon}

</div>



<div>

<h4>
{item.title}
</h4>


<p>
{item.desc}
</p>


</div>



</div>


))

}





<div className="dashboard-progress">


<h4>
My Progress
</h4>



<div className="dashboard-progress-bar">

<div></div>

</div>



<p>
75% of Digital Literacy complete
</p>



</div>



</section>

);


};







/* =====================================
   INTERNAL COMMUNICATIONS
===================================== */


const InternalCommunications = () => {


const news=[


{
tag:"Communique",
title:"Quarterly Performance Review: Q3 Outcomes",
desc:"Departmental targets and achievements across districts.",
time:"2 hours ago"
},


{
tag:"Workshop",
title:"Ethics & Anti-Corruption Training",
desc:"Mandatory compliance session via Zoom.",
time:"5 hours ago"
},


{
tag:"IT Announcement",
title:"Server Maintenance",
desc:"Scheduled system downtime this Friday.",
time:"Yesterday"
},


{
tag:"Statistics",
title:"Provincial Economic Snapshot",
desc:"Tourism growth and SMME support indicators.",
time:"2 days ago"
}


];



return (

<section className="dashboard-news">


<h2>

<HiNewspaper/>

Internal Communications

</h2>




<div className="dashboard-news-grid">



{

news.map((item,index)=>(


<div

className="dashboard-news-card"

key={index}

>



<span>
{item.tag}
</span>



<h3>
{item.title}
</h3>



<p>
{item.desc}
</p>



<small>

<HiClock/>

 {item.time}

</small>



</div>


))

}



</div>



</section>


);


};
/* =====================================
   DEPARTMENT NOTICES
===================================== */

const DepartmentNotices = () => {


const notices=[

{
month:"Oct",
day:"28",
type:"urgent",
title:"System Migration Downtime",
desc:"Internal database will be offline for 4 hours starting at 18:00."
},


{
month:"Oct",
day:"30",
type:"info",
title:"New Parking Policy",
desc:"Please review updated parking allocations for Head Office."
}


];



return (

<section className="dashboard-section">


<div className="dashboard-section-title">

<HiSpeakerphone/>

<h2>
Department Notices
</h2>


</div>




{

notices.map((item,index)=>(


<div

className="dashboard-department-notice"

key={index}

>


<div className="dashboard-date">

<span>
{item.month}
</span>


<strong>
{item.day}
</strong>


</div>




<div>


<span className={item.type}>

{
item.type==="urgent"
?
"Urgent"
:
"Information"
}

</span>



<h4>
{item.title}
</h4>



<p>
{item.desc}
</p>



</div>



</div>


))


}



</section>


);


};








/* =====================================
   SUGGESTION BOX
===================================== */

const SuggestionBox = () => {


const [visible,setVisible]=useState(false);

const [open,setOpen]=useState(false);

const [suggestion,setSuggestion]=useState("");

const [message,setMessage]=useState("");



const submitSuggestion=(e)=>{

e.preventDefault();


if(!suggestion.trim()){

setMessage("Please enter your suggestion.");

return;

}


setMessage("Suggestion submitted successfully.");

setSuggestion("");

};




if(!visible){

return (

<section className="dashboard-widget">


<button
onClick={()=>setVisible(true)}
>

Show Suggestion Box

</button>


</section>

);

}




return (

<section className="dashboard-widget">


<h3>

<HiMail/>

Suggestion Box

</h3>



<p>
Have an idea to improve our workplace? We would love to hear it.
</p>




<button
onClick={()=>setOpen(!open)}
>

{

open

?

"Hide Suggestion Form"

:

"Submit Suggestion"

}

</button>





{

open &&

<form onSubmit={submitSuggestion}>


<textarea

value={suggestion}

onChange={(e)=>setSuggestion(e.target.value)}

placeholder="Type your idea here..."

></textarea>




<button type="submit">

Submit Idea

</button>



</form>

}




{

message &&

<p className="form-message">

{message}

</p>

}




<button

className="remove-widget"

onClick={()=>setVisible(false)}

>

Hide Suggestion Box

</button>



</section>

);


};

/* =====================================
   GRIEVANCE BOX
===================================== */

const GrievanceBox = () => {


const [visible,setVisible]=useState(false);

const [open,setOpen]=useState(false);


const [form,setForm]=useState({

subject:"",
description:""

});


const [message,setMessage]=useState("");




const handleChange=(e)=>{

setForm({

...form,

[e.target.name]:e.target.value

});

};




const submitGrievance=(e)=>{

e.preventDefault();



if(!form.subject || !form.description){

setMessage("Please complete all fields.");

return;

}



setMessage(
"Your grievance has been submitted confidentially."
);



setForm({

subject:"",
description:""

});


setOpen(false);


};





if(!visible){

return (

<section className="dashboard-widget">


<button
onClick={()=>setVisible(true)}
>

Show Grievance Box

</button>


</section>

);

}





return (

<section className="dashboard-widget">


<h3>

<HiShieldCheck/>

Grievance Box

</h3>




<p>

Submit formal complaints or report issues securely.

</p>




<div className="dashboard-confidential">

All submissions are handled confidentially by HR Ethics Committee.

</div>





<button

onClick={()=>setOpen(!open)}

>

{

open

?

"Cancel Complaint"

:

"File a Complaint"

}

</button>





{

open &&


<div className="grievance-modal">


<form onSubmit={submitGrievance}>


<h3>
Submit Grievance
</h3>




<input

type="text"

name="subject"

placeholder="Complaint subject"

value={form.subject}

onChange={handleChange}

/>





<textarea

name="description"

placeholder="Describe your complaint"

value={form.description}

onChange={handleChange}

/>





<button type="submit">

Submit Complaint

</button>




</form>


</div>


}





{

message &&

<p className="form-message">

{message}

</p>

}




<button

className="remove-widget"

onClick={()=>setVisible(false)}

>

Hide Grievance Box

</button>




</section>

);


};





/* =====================================
   MAIN DASHBOARD
===================================== */


const Dashboard = () => {


return (

<main className="dashboard">


<GreetingHeader/>


<QuickActions/>




<div className="dashboard-layout">


<div>


<HRServices/>


<WellnessCenter/>


</div>




<div>


<EmployeeNotices/>


<StaffSpotlight/>


<LearningCentre/>


</div>



</div>





<InternalCommunications/>





<div className="dashboard-bottom">


<div>


<DepartmentNotices/>


</div>




<div>


<SuggestionBox/>


<GrievanceBox/>


</div>




</div>



</main>


);


};



export default Dashboard;