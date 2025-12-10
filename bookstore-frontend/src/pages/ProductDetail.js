// src/pages/ProductDetail.js
import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, getProducts } from '../api/products';
import { addToCart } from '../api/cart';
import { AuthContext } from '../context/AuthContext';
import SearchBox from '../components/SearchBox';
import ProductCard from '../components/ProductCard';
import './ProductDetail.css';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [product, setProduct] = useState(undefined);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  // search state
  const [query, setQuery] = useState('');
  const [allProducts, setAllProducts] = useState([]);

  // load current product
  useEffect(() => {
    getProductById(id)
      .then(res => {
        setProduct(res.data);
        setError('');
      })
      .catch(err => {
        console.error(err);
        setError('Product not found');
      });
  }, [id]);

  // load products once for search results
  useEffect(() => {
    getProducts()
      .then(res => setAllProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleAddToCart = async (prod) => {
    // prod argument is optional, defaults to 'product' state if not passed (for main button)
    const itemToAdd = prod || product;
    if (!itemToAdd) return;

    if (!token) {
      navigate('/login');
      return;
    }

    setMsg(`Adding "${itemToAdd.title}"...`);
    try {
      await addToCart({ productId: itemToAdd._id, quantity: 1 });
      setMsg(`Added to Bag`);
    } catch (e) {
      setMsg('Failed to add to cart');
    }
    setTimeout(() => setMsg(''), 1800);
  };

  // filter DB products by query (simple title match)
  const filteredProducts =
    query.length < 2
      ? []
      : allProducts.filter(p =>
        p.title.toLowerCase().includes(query.toLowerCase())
      );

  if (error) {
    return <div className="product-detail-page">{error}</div>;
  }

  if (!product) {
    return <div className="product-detail-page">Loading...</div>;
  }

  return (
    <div className="product-detail-page fade-in">
      {msg && <div className="detail-cart-msg">{msg}</div>}

      <div className="detail-search-wrapper">
        <SearchBox query={query} setQuery={setQuery} />
      </div>

      <div className="product-detail-banner">
        <span>
          Super Sale! 25% off on bestsellers. Use coupon <strong>BEST25</strong> at checkout.
        </span>
      </div>

      {/* main detail card */}
      <div className="product-detail-card">
        <div className="product-detail-cover">
          <img
            src={
              product.image ||
              'https://via.placeholder.com/210x320?text=No+Image'
            }
            alt={product.title}
          />
        </div>

        <div className="product-detail-info">
          <h1 className="product-detail-title">{product.title}</h1>
          <p className="product-detail-author">by {product.author}</p>
          <div className="product-detail-price">₹{product.price}</div>

          {product.description && (
            <p className="product-detail-description">
              {product.description}
            </p>
          )}

          <div className="product-detail-actions">
            <button
              className="product-detail-add-btn"
              onClick={() => handleAddToCart()}
            >
              Add to Cart
            </button>
            <button
              className="product-detail-back-link"
              onClick={() => navigate(-1)}
            >
              Back to Store
            </button>
          </div>
        </div>
      </div>

      {/* search results under the detail card */}
      {query.length >= 2 && (
        <div style={{ marginTop: '28px', width: '100%', maxWidth: '1000px' }}>
          <h3 style={{ marginBottom: '14px', color: 'var(--text-main)' }}>
            Search results
          </h3>
          <div className="product-grid">
            {filteredProducts.map(p => (
              <ProductCard
                key={p._id}
                product={p}
                onAddToCart={handleAddToCart}
              />
            ))}
            {filteredProducts.length === 0 && (
              <p style={{ padding: '8px 0' }}>No books found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;
