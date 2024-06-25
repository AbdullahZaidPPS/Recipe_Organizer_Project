import React, { useState } from 'react';
import axios from 'axios';

function AddRecipe() {
    const [name, setName] = useState('');
    const [title, setTitle] = useState('');
    const [instructions, setInstructions] = useState('');
    const [image, setImage] = useState(null);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('title', title);
        formData.append('instructions', instructions);
        formData.append('image', image);

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:3001/recipes', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'x-access-token': token
                }
            });
            alert('Recipe added successfully');
        } catch (error) {
            console.error('Error adding recipe', error);
            alert('Error adding recipe');
        }
    };

    return (
        <div className="auth-form">
            <h2>Add Recipe</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="instructions">Instructions</label>
                    <input
                        type="textarea"
                        id="instructions"
                        name="instructions"
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="image">Image</label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        onChange={handleImageChange}
                        required
                    />
                </div>
                <button type="submit">Add Recipe</button>
            </form>
        </div>
    );
}

export default AddRecipe;
