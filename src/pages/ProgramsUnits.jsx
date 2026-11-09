import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/programs.css";
import { getSiteContent } from "../services/siteContentService";


const ProgramsUnits = () => {


const navigate = useNavigate();


const [showContact, setShowContact] = useState(false);
const [page, setPage] = useState(null);
const [loadError, setLoadError] = useState("");
const [loading, setLoading] = useState(true);

useEffect(() => {
  getSiteContent("programmes")
    .then(setPage)
    .catch((error) => {
      console.error("Failed to load programme content:", error);
      setLoadError(error.message || "Unable to load programmes and units.");
    })
    .finally(() => setLoading(false));
}, []);

const units = page?.content?.units || [];
const contact = page?.content?.contact || {};
return (

<section className="programmes-section">



<div className="header-controls">



<div className="header-content">


<h1 className="page-title">

{page?.title || "Programmes & Units"}

</h1>




<p className="page-description">

{page?.description || "Programme information will appear here when published."}

</p>


</div>



</div>







{loading && <p role="status">Loading programmes and units...</p>}
{loadError && <p role="alert">{loadError}</p>}
{!loading && !loadError && units.length === 0 ? (
  <p>No programmes or units have been published.</p>
) : !loading && units.length > 0 ? <div className="units-grid">


{

units.map((unit)=>(


<UnitCard

key={unit.title}

{...unit}

navigate={navigate}

setShowContact={setShowContact}

/>


))

}


</div> : null}







<div className="bottom-section">



<div className="knowledge-portal">



<h2 className="portal-title">

{page?.content?.portal_heading || "Departmental Knowledge Portal"}

</h2>





<div className="stats-grid">





<div className="stat-card">

<p>

Total Assets

</p>


<h2>

{page?.content?.total_assets ?? "—"}

</h2>


</div>







<div className="stat-card">


<p>

Active Units

</p>


<h2>


{

units.filter(

(unit)=>unit.status==="Active Unit"

).length

}


</h2>


</div>








<div className="stat-card">


<p>

Knowledge Shares

</p>


<h2>

{page?.content?.knowledge_shares ?? "—"}

</h2>


</div>






</div>



</div>









<div className="support-card">



<h2>

Need Workspace Support?

</h2>




<p>

{page?.content?.support_description || "Support information will appear here when published."}

</p>







<button

type="button"

onClick={()=>navigate("/support")}

>

Get Help Now

</button>





</div>





</div>








{

showContact && (


<div className="contact-overlay">



<div className="contact-popup">





<button

className="close-popup"

onClick={()=>setShowContact(false)}

>

×

</button>







<h2>

Contact Support

</h2>







<p>

Need assistance with this programme workspace?
Contact the relevant departmental unit.

</p>








<div className="contact-details">


<p>

{contact.email && <>📧 Email: {contact.email}</>}

</p>



<p>

{contact.phone && <>☎ Phone: {contact.phone}</>}

</p>




<p>

🏢 Office: Northern Cape Department of Economic Development and Tourism

</p>



</div>







<button

className="workspace-btn"

onClick={()=>setShowContact(false)}

>

Close

</button>





</div>



</div>


)


}








</section>


);


};
function UnitCard({

icon,
iconBg,
status,
statusType,
title,
description,
tags,
navigate,
setShowContact

}){


return (


<div className="unit-card">





<div className="unit-header">





<div className={`unit-icon ${iconBg}`}>





<svg

className="icon-large"

fill="none"

stroke="currentColor"

viewBox="0 0 24 24"

>





<path

d={icon}

strokeLinecap="round"

strokeLinejoin="round"

strokeWidth="2"

/>





</svg>





</div>








<span className={`status-badge ${statusType}`}>

{status}

</span>






</div>









<h3 className="unit-title">

{title}

</h3>









<p className="unit-description">

{description}

</p>









<div className="unit-tags">



{


tags.map((tag)=>(



<span

key={tag}

className="unit-tag"

>


{tag}


</span>



))


}




</div>









<div className="unit-card-actions">







<button

type="button"

className="workspace-btn"

onClick={()=>


navigate(

`/programmes/${title

.toLowerCase()

.replace(/\s+/g,"-")}`

)


}

>

Enter Workspace

</button>









<button

type="button"

className="secondary-btn"

onClick={()=>navigate("/policies")}

>

Policies

</button>









<button

type="button"

className="secondary-btn"

onClick={()=>setShowContact(true)}

>

Contacts

</button>







</div>







</div>



);


}








export default ProgramsUnits;