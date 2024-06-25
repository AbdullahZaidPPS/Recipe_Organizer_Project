import React, { useState } from 'react';
import axios from 'axios';

function ViewRecipes() {
    const [recipeName, setRecipeName] = useState('');
    const [recipe, setRecipe] = useState(null);

    const handleInputChange = (e) => {
        setRecipeName(e.target.value);
    };

    const handleSearch = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:3001/recipes?name=${recipeName}`, {
                headers: { 'x-access-token': token }
            });
            setRecipe(response.data);
        } catch (error) {
            console.error('Error fetching recipe', error);
            setRecipe(null); // Reset recipe if error occurs
        }
    };

    return (
        <div className="recipe-search">
            <h2>Search Recipe</h2>
            <input
                type="text"
                value={recipeName}
                onChange={handleInputChange}
                placeholder="Enter recipe name"
            />
            <button onClick={handleSearch}>Search</button>
            {recipe && (
                <div className="recipe-details">
                    <h2>{recipe.name}</h2>
                    <img
                        src={`http://localhost:3001${recipe.image}`}
                        alt={recipe.name}
                        className="recipe-image"
                    />
                    <p><strong>Title:</strong> {recipe.title}</p>
                    <p><strong>Instructions:</strong> {recipe.instructions}</p>
                </div>
            )}
            {recipe === null && <p className="no-recipe">No recipe found.</p>}
        </div>
    );
}

export default ViewRecipes;
