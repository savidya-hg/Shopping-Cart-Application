import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = ({ categories, refreshProducts }) => {
    const [products, setProducts] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editFormData, setEditFormData] = useState({});
    const [newProductData, setNewProductData] = useState({ name: '', price: '', category: 'Vegetables', image: '', description: '' });
    
    const [adminSearch, setAdminSearch] = useState('');
    const [adminCategory, setAdminCategory] = useState('All');

    const [localCategories, setLocalCategories] = useState([]);

    useEffect(() => {
        fetchLocalProducts();
    }, []);

    // Sync local categories with the ones coming from App.js
    useEffect(() => {
        setLocalCategories(categories);
    }, [categories]);

    const fetchLocalProducts = async () => {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/products`, { withCredentials: true });
        setProducts(res.data);
        refreshProducts(); 
    };

    const handleCategorySelect = (val, isEditing = false) => {
        if (val === "ADD_NEW") {
            const newCat = prompt("Enter new category name:");
            if (newCat && newCat.trim() !== "") {
                const formattedCat = newCat.trim();
                // Add to local list so the dropdown shows it immediately
                if (!localCategories.includes(formattedCat)) {
                    setLocalCategories([...localCategories, formattedCat]);
                }
                
                if (isEditing) {
                    setEditFormData({...editFormData, category: formattedCat});
                } else {
                    setNewProductData({...newProductData, category: formattedCat});
                }
            }
        } else {
            if (isEditing) {
                setEditFormData({...editFormData, category: val});
            } else {
                setNewProductData({...newProductData, category: val});
            }
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/products`, newProductData, { withCredentials: true });
            setNewProductData({ name: '', price: '', category: 'Vegetables', image: '', description: '' });
            fetchLocalProducts(); // refreshes everything
        } catch (err) { console.error("Error adding product", err); }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure?")) {
            await axios.delete(`${process.env.REACT_APP_API_URL}/products/${id}`, { withCredentials: true });
            fetchLocalProducts();
        }
    };

    const startEditing = (p) => { setEditingId(p._id); setEditFormData(p); };
    const cancelEditing = () => { setEditingId(null); setEditFormData({}); };
    const handleEditChange = (e) => setEditFormData({ ...editFormData, [e.target.name]: e.target.value });

    const handleSaveUpdate = async () => {
        await axios.put(`${process.env.REACT_APP_API_URL}/products/${editingId}`, editFormData, { withCredentials: true });
        setEditingId(null);
        fetchLocalProducts();
    };

    const filteredProducts = products.filter(p => {
        const matchesCat = adminCategory === 'All' || p.category === adminCategory;
        const matchesSearch = p.name.toLowerCase().includes(adminSearch.toLowerCase());
        return matchesCat && matchesSearch;
    });

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Admin Panel - Management Console</h2>

            <div style={styles.sectionHeader}>Create New Product</div>
            <form onSubmit={handleAddProduct} style={styles.addBar}>
                <input name="name" placeholder="Name" style={styles.input} value={newProductData.name} onChange={(e) => setNewProductData({...newProductData, name: e.target.value})} required />
                <input name="description" placeholder="Description" style={styles.input} value={newProductData.description} onChange={(e) => setNewProductData({...newProductData, description: e.target.value})} required />
                <input name="price" type="number" placeholder="Price (LKR)" style={styles.input} value={newProductData.price} onChange={(e) => setNewProductData({...newProductData, price: e.target.value})} required />
                
                <select 
                    style={styles.select} 
                    value={newProductData.category} 
                    onChange={(e) => handleCategorySelect(e.target.value)}
                >
                    {localCategories.filter(c => c !== 'All').map(c => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                    <option value="ADD_NEW" style={{color: 'green'}}>+ Add New Category</option>
                </select>

                <input name="image" placeholder="Image URL" style={styles.input} value={newProductData.image} onChange={(e) => setNewProductData({...newProductData, image: e.target.value})} required />
                <button type="submit" style={styles.mainAddBtn}>Add Item</button>
            </form>

            <div style={styles.adminFilterBar}>
                <div style={styles.sectionHeader}>Manage Inventory</div>
                <div style={styles.filterControls}>
                    <input 
                        type="text" 
                        placeholder="Search your inventory..." 
                        style={styles.adminSearch} 
                        onChange={(e) => setAdminSearch(e.target.value)}
                    />
                    <select 
                        style={styles.adminDropdown} 
                        value={adminCategory}
                        onChange={(e) => setAdminCategory(e.target.value)}
                    >
                        {localCategories.map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div style={styles.cardGrid}>
                {filteredProducts.map(p => (
                    <div key={p._id} style={styles.cardGroup}>
                        <div style={styles.productCard}>
                            <div style={styles.imageSection}><img src={p.image} alt={p.name} style={styles.cardImage} /></div>
                            <div style={styles.detailsSection}>
                                {editingId === p._id ? (
                                    <div style={styles.editForm}>
                                        <input name="name" value={editFormData.name} onChange={handleEditChange} style={styles.editInput} />
                                        <input name="price" type="number" value={editFormData.price} onChange={handleEditChange} style={styles.editInput} />
                                        <select 
                                            name="category" 
                                            value={editFormData.category} 
                                            onChange={(e) => handleCategorySelect(e.target.value, true)} 
                                            style={styles.editInput}
                                        >
                                            {localCategories.filter(c => c !== 'All').map(c => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                            <option value="ADD_NEW">+ New Category</option>
                                        </select>
                                    </div>
                                ) : (
                                    <>
                                        <h3 style={styles.itemName}>{p.name}</h3>
                                        <p style={styles.categoryInfo}>Category: {p.category}</p>
                                        <p style={styles.priceInfo}>Price: {p.price.toFixed(2)} LKR</p>
                                    </>
                                )}
                            </div>
                        </div>
                        <div style={styles.cardActions}>
                            {editingId === p._id ? (
                                <><button onClick={handleSaveUpdate} style={styles.saveBtn}><i className="fas fa-check"></i> Save</button>
                                <button onClick={cancelEditing} style={styles.cancelBtn}><i className="fas fa-times"></i> Cancel</button></>
                            ) : (
                                <><button onClick={() => startEditing(p)} style={styles.editBtn}><i className="fas fa-edit"></i> Edit Item</button>
                                <button onClick={() => handleDelete(p._id)} style={styles.deleteBtn}><i className="fas fa-trash"></i> Delete</button></>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: { maxWidth: '1100px', margin: '0 auto', padding: '20px' },
    title: { textAlign: 'center', color: '#333', marginBottom: '30px' },
    sectionHeader: { fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '10px', color: '#555' },
    addBar: { display: 'flex', gap: '10px', marginBottom: '40px', padding: '15px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', flexWrap: 'wrap' },
    input: { padding: '8px', borderRadius: '4px', border: '1px solid #ddd', flex: '1 1 150px' },
    select: { padding: '8px', borderRadius: '4px', border: '1px solid #ddd', flex: '1 1 150px' },
    mainAddBtn: { background: '#2ecc71', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
    adminFilterBar: { marginBottom: '20px', borderTop: '1px solid #ddd', paddingTop: '20px' },
    filterControls: { display: 'flex', gap: '10px' },
    adminSearch: { flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ddd' },
    adminDropdown: { padding: '10px', borderRadius: '4px', border: '1px solid #ddd', minWidth: '150px' },
    cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '30px' },
    cardGroup: { display: 'flex', flexDirection: 'column', gap: '10px' },
    productCard: { display: 'flex', background: 'white', borderRadius: '12px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)', padding: '20px', gap: '20px', alignItems: 'center' },
    imageSection: { width: '100px', height: '100px', flexShrink: 0 },
    cardImage: { width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' },
    detailsSection: { flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' },
    itemName: { margin: 0, fontSize: '1.1rem', color: '#2c3e50' },
    categoryInfo: { margin: 0, color: '#7f8c8d', fontSize: '0.85rem' },
    priceInfo: { margin: 0, fontWeight: 'bold', color: '#2ecc71' },
    editForm: { display: 'flex', flexDirection: 'column', gap: '5px' },
    editInput: { padding: '5px', borderRadius: '4px', border: '1px solid #ddd' },
    saveBtn: { background: '#2ecc71', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', flex: 1 },
    cancelBtn: { background: '#f39c12', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', flex: 1 },
    cardActions: { display: 'flex', justifyContent: 'space-between', gap: '10px' },
    editBtn: { background: '#27ae60', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer', flex: 1 },
    deleteBtn: { background: '#e74c3c', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer', flex: 1 }
};

export default AdminDashboard;