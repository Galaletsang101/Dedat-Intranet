import { 
  FaFileSignature,
  FaFileUpload,
  FaLaptop,
  FaBuilding,
  FaEnvelope,
  FaFileAlt,
  FaHeart,
  FaHeadset
} from "react-icons/fa";

import "../styles/bottomnav.css";


function BottomNav() {

  const buttons = [
    {
      name: "E-Leave",
      icon: <FaFileSignature />
    },
    {
      name: "E-Submission",
      icon: <FaFileUpload />
    },
    {
      name: "IT Support",
      icon: <FaLaptop />
    },
    {
      name: "Book Boardroom",
      icon: <FaBuilding />
    },
    {
      name: "GroupWise",
      icon: <FaEnvelope />
    },
    {
      name: "Policies",
      icon: <FaFileAlt />
    },
    {
      name: "Wellness",
      icon: <FaHeart />
    },
    {
      name: "Help Desk",
      icon: <FaHeadset />
    }
  ];


  return (
    <div className="bottomnav-container">

      <div className="bottomnav">

        {buttons.map((button, index) => (

          <button key={index}>

            <span className="nav-icon">
              {button.icon}
            </span>

            <span>
              {button.name}
            </span>

          </button>

        ))}

      </div>

    </div>
  );
}

export default BottomNav;