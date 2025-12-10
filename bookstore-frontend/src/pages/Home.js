// src/pages/Home.js
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, createProduct } from '../api/products';
import { addToCart } from '../api/cart';
import ProductCard from '../components/ProductCard';
import SearchBox from '../components/SearchBox';
import { AuthContext } from '../context/AuthContext';
import './Home.css';

function Home() {
  const [products, setProducts] = useState([]);
  const [msg, setMsg] = useState("");
  const [query, setQuery] = useState("");
  const [searchBooks, setSearchBooks] = useState([]);

  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch default products
  useEffect(() => {
    getProducts().then(res => setProducts(res.data));
  }, []);

  // Fetch from Google Books
  useEffect(() => {
    if (query.length < 2) {
      setSearchBooks([]);
      return;
    }
    const timer = setTimeout(() => {
      fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`)
        .then(res => res.json())
        .then(data => {
          if (data.items) {
            const books = data.items.map(item => ({
              id: item.id,
              title: item.volumeInfo.title,
              author: item.volumeInfo.authors ? item.volumeInfo.authors[0] : "Unknown",
              price: Math.floor(Math.random() * 81) + 20,
              image: item.volumeInfo.imageLinks?.thumbnail || '',
              description: item.volumeInfo.description || ''
            }));
            setSearchBooks(books);
          } else {
            setSearchBooks([]);
          }
        });
    }, 500); // Debounce
    return () => clearTimeout(timer);
  }, [query]);

  const handleAddToCart = async (product) => {
    // 1. Check if user is logged in
    if (!token) {
      navigate('/login');
      return;
    }

    let productId = product._id;

    // 2. If it's a Google Book (no _id), create it in DB first
    if (!productId) {
      try {
        const dbProduct = await createProduct({
          title: product.title,
          author: product.author,
          description: product.description,
          price: product.price,
          image: product.image
        });
        productId = dbProduct._id;
      } catch (e) {
        console.error("Error creating product", e);
        setMsg('Error adding to cart');
        return;
      }
    }

    setMsg(`Adding "${product.title}"...`);
    try {
      await addToCart({ productId, quantity: 1 });
      setMsg(`Added to Bag`);
    } catch (e) {
      console.error(e); // log error to console
      setMsg('Failed to add to cart');
    }
    setTimeout(() => setMsg(''), 3000);
  };

  const displayedProducts = query.length >= 2 ? searchBooks : products;

  return (
    <div className="home-container fade-in">
      {msg && <div className="feedback-msg">{msg}</div>}

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Book Store.</h1>
          <p className="hero-subtitle">
            The best way to buy the books you love.
          </p>
          <div className="search-container">
            <SearchBox query={query} setQuery={setQuery} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container main-content">
        {/* Featured Banner (only show when not searching) */}
        {!query && (
          <div className="featured-banner">
            <div className="featured-text">
              <h3>Bestsellers.</h3>
              <p>Get 25% off international favorites.</p>
              <a href="#shop" className="btn-cta">Shop Now</a>
            </div>
            <div className="featured-image"></div>
          </div>
        )}

        {/* Product Grid */}
        <div id="shop">
          <h2 className="section-title">
            {query ? `Results for "${query}"` : "New & Trending"}
          </h2>

          <div className="product-grid">
            {displayedProducts.map((product, index) => (
              <div key={product._id || product.id} style={{ animationDelay: `${index * 0.05}s` }} className="fade-in">
                <ProductCard
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              </div>
            ))}
          </div>

          {displayedProducts.length === 0 && query && (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
              No books found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
