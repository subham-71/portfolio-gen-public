import React from "react";
import { useAuth } from '../contexts/AuthContext';

import { Routes, Route, useNavigate } from "react-router-dom";
import Portfolio from "../templates/template1/Portfolio.jsx";
import {Login, Signup, Landing, Home, Experiences,Projects } from "../components/index.js";
import { Navigate } from "react-router-dom";

// Component that receives the id parameter


const Router = () => {

    const { currentUser } = useAuth();
    const PrivateRoute = ({children} ) => {
        return currentUser ? children : <Navigate to="/login" />;
    };

    return (
        <>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/:clientId" element={<Portfolio />} />
                <Route path="/dashboard" element={<PrivateRoute><Home/></PrivateRoute>} />
                <Route path="/experiences" element={<PrivateRoute><Experiences/></PrivateRoute>} />
                <Route path="/projects" element={<PrivateRoute><Projects/></PrivateRoute>} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
            </Routes>
        </>
    );
};

export default Router;
