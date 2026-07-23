import React, { useState } from "react";
import "../styles/knowledgecenter.css";

import {
  FaFileAlt,
  FaChartBar,
  FaLightbulb,
  FaClipboardList,
  FaFileContract,
  FaWpforms,
  FaSearch,
  FaUpload,
  FaDownload,
} from "react-icons/fa";


const initialDocuments = [
  {
    name: "NC_Economic_Strategy_2024.pdf",
    category: "POLICY",
    status: "Approved",
    version: "v2.1",
    date: "2h ago",
  },
  {
    name: "Tourism_Quarterly_Q3.docx",
    category: "REPORT",
    status: "Under Review",
    version: "v1.4",
    date: "5h ago",
  },
  {
    name: "Export_Permit_Guidelines_SOP.pdf",
    category: "SOP",
    status: "Active",
    version: "v3.0",
    date: "Yesterday",
  },
];


const KnowledgeCenter = () => {


const [documents,setDocuments] = useState(initialDocuments);

const [search,setSearch] = useState("");

const [category,setCategory] = useState("ALL");


const [showUpload,setShowUpload] = useState(false);

const [showSupport,setShowSupport] = useState(false);



const filteredDocuments = documents.filter((doc)=>{

return (

doc.name.toLowerCase().includes(search.toLowerCase())

&&

(category==="ALL" || doc.category===category)

)

});





const uploadResource = ()=>{


const newDoc={

name:"New_Department_File.pdf",

category:"POLICY",

status:"Pending",

version:"v1.0",

date:"Just now"

};


setDocuments([newDoc,...documents]);

setShowUpload(false);


};




return (

<div className="knowledgecenter-app-container">



<header className="knowledgecenter-main-header">


<div>

<h1 className="knowledgecenter-header-title">

Institutional Repository

</h1>


<p className="knowledgecenter-header-subtitle">

Access NCDEDAT's centralized collective intelligence.

</p>


</div>



<div className="knowledgecenter-header-actions">


<button className="knowledgecenter-btn-outline">

<FaDownload/> My Downloads

</button>




<button

className="knowledgecenter-btn-primary"

onClick={()=>setShowUpload(true)}

>

<FaUpload/> Upload Resource

</button>


</div>


</header>






<section className="knowledgecenter-primary-grid">


<Card

icon={<FaFileAlt/>}

title="Policies Repository"

text="Departmental mandates and regulatory frameworks."

color="navy"

/>



<Card

icon={<FaChartBar/>}

title="Reports Library"

text="Annual reviews and economic studies."

color="green"

/>



<Card

icon={<FaLightbulb/>}

title="Research & Insights"

text="Academic partnerships and analysis."

color="orange"

/>


</section>







<section className="knowledgecenter-main-grid">



<div className="knowledgecenter-table-section">


<h2>

Recent Documents

</h2>




<div className="knowledgecenter-search">


<FaSearch/>


<input

placeholder="Search documents..."

value={search}

onChange={(e)=>setSearch(e.target.value)}

/>




<select

onChange={(e)=>setCategory(e.target.value)}

>

<option value="ALL">
All Categories
</option>


<option>
POLICY
</option>


<option>
REPORT
</option>


<option>
SOP
</option>


</select>


</div>






<table className="knowledgecenter-table">


<thead>

<tr>

<th>Name</th>
<th>Category</th>
<th>Status</th>
<th>Version</th>
<th>Action</th>

</tr>


</thead>




<tbody>


{

filteredDocuments.map((doc)=>(


<tr key={doc.name}>


<td className="knowledgecenter-document-name">

<FaFileAlt/>

{doc.name}

</td>



<td>

<span className="knowledgecenter-badge">

{doc.category}

</span>

</td>




<td>

<span className="knowledgecenter-status">

● {doc.status}

</span>

</td>




<td>

{doc.version}

</td>




<td>


<button

className="download-btn"

onClick={()=>alert(`Downloading ${doc.name}`)}

>

Download

</button>


</td>



</tr>



))

}


</tbody>



</table>


</div>






<aside className="knowledgecenter-right-column">


<div className="knowledgecenter-stats-card">


<h3>

Knowledge Stats

</h3>


<div className="knowledgecenter-stats">


<div>

<strong>

{documents.length}

</strong>

<p>
Total Assets
</p>

</div>



<div>

<strong>

+42

</strong>

<p>
New Month
</p>


</div>



</div>


</div>







<div className="knowledgecenter-support-card">


<h3>

Need KM Support?

</h3>



<p>

Contact Information Governance team.

</p>



<button

className="knowledgecenter-support-btn"

onClick={()=>setShowSupport(true)}

>

Open Support Ticket

</button>


</div>



</aside>




</section>








{
showUpload &&

<div className="modal">


<div className="modal-box">


<h2>

Upload Resource

</h2>


<input type="file"/>


<button onClick={uploadResource}>

Upload

</button>


<button onClick={()=>setShowUpload(false)}>

Cancel

</button>


</div>


</div>

}





{
showSupport &&

<div className="modal">


<div className="modal-box">


<h2>

Support Ticket

</h2>


<textarea placeholder="Describe your issue"/>


<button

onClick={()=>{

alert("Ticket submitted");

setShowSupport(false);

}}

>

Submit

</button>


</div>


</div>

}



</div>


);

};





function Card({icon,title,text,color}){

return(

<div className="knowledgecenter-card">


<div className={`knowledgecenter-card-icon knowledgecenter-${color}`}>

{icon}

</div>


<h3>{title}</h3>

<p>{text}</p>


<a href="#">

View Documents →

</a>


</div>

)

}



export default KnowledgeCenter;

