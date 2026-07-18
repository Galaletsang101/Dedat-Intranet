
// pages/StaffDirectoryPage.jsx
import React from 'react';
import StaffDirectoryComp from '../components/staff/staffDirectoryComponent';
import { Container } from 'react-bootstrap';
import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/staffDirectory.css';

const StaffDirectoryPage = () => {
  return (
    <div className="staff-directory-container bg-offwhite" style={{ minHeight: '100vh' }}>
      <Container fluid className="px-4 py-3">
        <StaffDirectoryComp />
      </Container>
    </div>
  );
};

export default StaffDirectoryPage;

