import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        name: '', description: '', price: '', category: 'Vegetables', image: '', stock: ''
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/products');
            setProducts(res.data);
        } catch (err) {
            console.error("Connection to backend failed:", err);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/products', formData);
            fetchProducts(); // refresh list
            setFormData({ name: '', description: '', price: '', category: 'Vegetables', image: '', stock: '' });
        } catch (err) {
            console.error("Error adding product", err);
        }
    };

    const deleteProduct = async (id) => {
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        fetchProducts();
    };

    return (
        <div style={styles.container}>
            <h2>Admin Dashboard - Manage Products</h2>
            
            {/* add product form */}
            <form onSubmit={handleSubmit} style={styles.form}>
                <input name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} required />
                <input name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} required />
                <input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleInputChange} required />
                <select name="category" value={formData.category} onChange={handleInputChange}>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Cakes">Cakes</option>
                    <option value="Biscuits">Biscuits</option>
                </select>
                <input name="image" placeholder="Image URL" value={formData.image} onChange={handleInputChange} required />
                <button type="submit" style={styles.addBtn}>Add Product</button>
            </form>

            {/* Product List */}
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(p => (
                        <tr key={p._id}>
                            <td>{p.name}</td>
                            <td>{p.description}</td>
                            <td>${p.price}</td>
                            <td>{p.category}</td>
                            <td>
                                <button onClick={() => deleteProduct(p._id)} style={styles.delBtn}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const styles = {
    container: { padding: '20px' },
    form: { display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' },
    table: { width: '100%', borderCollapse: 'collapse' },
    addBtn: { background: '#2ecc71', color: 'white', padding: '10px', border: 'none', cursor: 'pointer' },
    delBtn: { color: 'red', cursor: 'pointer', border: 'none', background: 'none' }
};

export default AdminDashboard;