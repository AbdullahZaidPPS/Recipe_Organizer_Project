import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function RecipeDetails() {
    const [recipe, setRecipe] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:3001/recipes/${id}`, {
                    headers: { 'x-access-token': token }
                });
                setRecipe(response.data);
            } catch (error) {
                console.error('Error fetching recipe', error);
            }
        };

        fetchRecipe();
    }, [id]);

    if (!recipe) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>{recipe.name}</h2>
            <img src={`http://localhost:3001${recipe.image}`} alt={recipe.name} style={{ width: '15mm', height: '15mm', objectFit: 'cover' }} />
            <p><strong>Title:</strong> {recipe.title}</p>
            <p><strong>Instructions:</strong> {recipe.instructions}</p>
        </div>
    );
}

export default RecipeDetails;
