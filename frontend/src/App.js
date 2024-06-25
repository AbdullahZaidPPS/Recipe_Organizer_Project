import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import AddRecipe from './components/AddRecipe';
import ViewRecipes from './components/ViewRecipes';
import './App.css';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
        <Router>
            <div>
                <header className="header">
                    <h1>Recipe Organizer</h1>
                    <nav className="nav">
                        {isAuthenticated ? (
                            <>
                                <Link to="/add-recipe">Add Recipe</Link>
                                <Link to="/view-recipes">View Recipes</Link>
                            </>
                        ) : (
                            <>
                                <Link to="/register">Register</Link>
                                <Link to="/login">Login</Link>
                            </>
                        )}
                    </nav>
                </header>
                <Routes>
                    <Route
                        path="/register"
                        element={<Register onRegisterSuccess={() => setIsAuthenticated(true)} />}
                    />
                    <Route
                        path="/login"
                        element={<Login onLoginSuccess={() => setIsAuthenticated(true)} />}
                    />
                    {isAuthenticated && (
                        <>
                            <Route path="/add-recipe" element={<AddRecipe />} />
                            <Route path="/view-recipes" element={<ViewRecipes />} />
                        </>
                    )}
                    <Route path="*" element={<Navigate to={isAuthenticated ? "/add-recipe" : "/register"} />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
