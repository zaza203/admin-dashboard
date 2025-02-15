import React from 'react'

const Navbar = ({ logout }) => {
  return (
    <nav className="navbar z-2 navbar-expand-lg bg-white border-bottom">
      <div className="container-fluid">
        <div className="navbar-brand">
          <form className="d-flex" role="search">
            <div className="search-group position-relative">
              <input
                className="form-control me-2 search-input ps-5"
                type="search"
                placeholder="Search..."
              />
              <span className="position-absolute start-0 top-50 translate-middle-y ms-3">
                <i className="bi bi-search" style={{ color: '#BABABA'}}></i>
              </span>
            </div>
          </form>
        </div>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto d-flex align-items-center">
            <li className="nav-item me-3">
              <button className="btn btn-light">
                <i className="bi bi-moon"></i>
              </button>
            </li>

            <li className="nav-item me-3">
              <button className="btn btn-light">
                <i className="bi bi-bell"></i>
              </button>
            </li>

            <li className="nav-item">
              <button className="btn btn-light" onClick={logout}>
                <i className="bi bi-box-arrow-right"></i>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
