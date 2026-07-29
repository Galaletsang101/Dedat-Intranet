import {
  FaFileSignature,
  FaFileUpload,
  FaLaptop,
  FaBuilding,
  FaEnvelope,
  FaFileAlt,
  FaHeart,
  FaHeadset,
  FaTachometerAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import "../styles/bottomnav.css";

function BottomNav() {
  const navigate = useNavigate();

  const buttons = [
    {
      name: "Dashboard",
      icon: <FaTachometerAlt />,
      path: "/dashboard",
    },
    {
      name: "E-Leave",
      icon: <FaFileSignature />,
    },
    {
      name: "E-Submission",
      icon: <FaFileUpload />,
    },
    {
      name: "IT Support",
      icon: <FaLaptop />,
    },
    {
      name: "Book Boardroom",
      icon: <FaBuilding />,
    },
    {
      name: "GroupWise",
      icon: <FaEnvelope />,
    },
    {
      name: "Policies",
      icon: <FaFileAlt />,
      path: "/policies",
    },
    {
      name: "Wellness",
      icon: <FaHeart />,
      path: "/wellness",
    },
    {
      name: "Help Desk",
      icon: <FaHeadset />,
    },
  ];

  return (
    <div className="bottomnav-container">
      <div className="bottomnav">
        {buttons.map((button, index) => (
          <button
            key={index}
            type="button"
            onClick={() => button.path && navigate(button.path)}
          >
            <span className="nav-icon">{button.icon}</span>
            <span>{button.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default BottomNav;
