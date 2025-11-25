import React, { useEffect, useState } from 'react';
import { getProducts } from '../api/products';
import { addToCart } from '../api/cart';
import ProductCard from '../components/ProductCard';
import SearchBox from '../components/SearchBox';  // Import your SearchBox component
import { createProduct } from '../api/products'; // Import the new function
import './Home.css';  

function Home() {
  const [products, setProducts] = useState([]);
  const [msg, setMsg] = useState(""); // Feedback message
  const [query, setQuery] = useState(""); // Search input
  const [searchBooks, setSearchBooks] = useState([]); // Books from Google Books API

  // Fetch default products on mount
  useEffect(() => {
    getProducts().then(res => setProducts(res.data));
  }, []);

  // Fetch from Google Books API when query changes
  useEffect(() => {
    if (query.length < 2) {
      setSearchBooks([]);
      return;
    }
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`)
      .then(res => res.json())
      .then(data => {
        if (data.items) {
          const books = data.items.map(item => ({
          id: item.id,
          title: item.volumeInfo.title,
          author: item.volumeInfo.authors ? item.volumeInfo.authors[0] : "Unknown",
          price: Math.floor(Math.random() * 151) + 50, // random price between 50-200
          image: item.volumeInfo.imageLinks?.thumbnail || '',
          description: item.volumeInfo.description || ''
        }));

          setSearchBooks(books);
        } else {
          setSearchBooks([]);
        }
      });
  }, [query]);

  const handleAddToCart = async (product) => {
  let productId = product._id; // Will be undefined for Google Books search results

  // If product is from Google Books (not in your DB), import it:
  if (!productId) {
    const dbProduct = await createProduct({
      title: product.title,
      author: product.author,
      description: product.description,
      price: product.price, // already set as random
      image: product.image
    });
    productId = dbProduct._id; // Use MongoDB ID from DB
  }

  await addToCart({ productId, quantity: 1 });
  setMsg(`Added "${product.title}" to cart!`);
  setTimeout(() => setMsg(""), 1800);
};


  // Determine which list to show: searchBooks when searching, else default products
  const displayedProducts = query.length >= 2 ? searchBooks : products;

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {/* Blurred background image */}
      <div className="books-blur-bg"></div>
      <div className="home-container" style={{ position: "relative", zIndex: 1 }}>
        <h2 className="home-title">Bookstore</h2>

        {/* Use the imported SearchBox component */}
        <SearchBox query={query} setQuery={setQuery} />

        {msg && <div className="add-cart-msg">{msg}</div>}

        <div className="ad-banner">
          <img
            src="https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=980&q=80"
            alt="Festival Sale: Get 25% Off on Bestsellers!"
          />
        </div>
        <div className="ad-banner">
          <span className="ad-text">
            Super Sale! 25% off on bestsellers. <a href="#">Shop Now →</a>
          </span>
        </div>
        <div className="product-list">
          {displayedProducts.map(product =>
            <ProductCard
              key={product._id || product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
