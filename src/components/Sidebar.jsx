import { useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import logo from "../assets/logo.jpg";
import branding from "../assets/branding.png";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Dashboard");

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleMobileSidebar = () => {
    setIsCollapsed(false)
    setIsMobileOpen(!isMobileOpen);
  }

  return (
    <>
      <button className="hamburger d-lg-none" onClick={toggleMobileSidebar}>
        <i className={`bi ${isMobileOpen ? "bi-x" : "bi-list"}`}></i>
      </button>

      <div className={`sidebar ${isCollapsed ? "collapsed" : ""} ${isMobileOpen ? "mobile-open" : ""}`}>
        <div className="d-flex align-items-center justify-content-between">
          {!isCollapsed && (
            <div className="d-flex justify-content-center align-items-center ms-3 mb-2">
              <img className="rounded" src={logo} style={{ width: "24px", height: "24px" }} alt="Rentam" />
              <img className="" src={branding} style={{ width: "150px", height: "40px" }} alt="Rentam" />
            </div>
          )}

          <button className="toggle-btn d-none d-lg-block" onClick={toggleSidebar}>
            <i className="bi bi-list"></i>
          </button>
        </div>

        <ul className="nav flex-column">
          {[
            { name: "Dashboard", icon: "bi bi-grid", path: '/homepage' },
            { name: "Properties", icon: "bi bi-card-checklist", path: '/properties' },
            { name: "Users", icon: "bi-people", path: '/dashboard/users' },
            { name: "Categories", icon: "bi-tag", path: '/dashboard/categories' },
            { name: "Admins", icon: "bi-person-badge", path: '/dashboard/admins' },
            { name: "Facilities", icon: "bi-tools", path: '/dashboard/facilities' },
            { name: "Conditions", icon: "bi-file-earmark-text", path: '/dashboard/conditions' },
            { name: "Type", icon: "bi-box", path: '/dashboard/types' },
            { name: "Chats", icon: "bi-chat-dots", path: '/dashboard/chats' },
            { name: "Notifications", icon: "bi-bell", path: '/dashboard/notifications' },
            { name: "Ratings", icon: "bi-star", path: '/dashboard/ratings' },
            { name: "Images", icon: "bi-image", path: '/dashboard/images' },
            { name: "Favorites", icon: "bi-heart", path: '/dashboard/favorites' },
            { name: "Logout", icon: "bi-box-arrow-right", path: '/' },
          ].map((item, index) => (
            <li className="nav-item" key={index}>
              <Link
                to={item.path} 
                className={`nav-link ${activeLink === item.name ? "active" : ""}`} 
                onClick={() => {
                    setActiveLink(item.name)
                    setIsMobileOpen(false)
                    }} >
                <i className={`bi ${item.icon}`}></i>
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {isMobileOpen && <div className="overlay" onClick={toggleMobileSidebar}></div>}
    </>
  );
};

export default Sidebar;
