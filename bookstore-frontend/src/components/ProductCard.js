import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

function ProductCard({ product, onAddToCart }) {
  const productId = product._id || product.id;

  return (
    <div className="product-card">
      <Link to={`/product/${productId}`} className="overlay-link" aria-label={`View details for ${product.title}`} />

      <div className="product-image-container">
        <img
          className="product-image"
          src={product.image || 'https://via.placeholder.com/200x280?text=No+Image'}
          alt={product.title}
          loading="lazy"
        />
      </div>

      <div className="product-content">
        <h3 className="product-title">{product.title}</h3>
        <p className="product-author">by {product.author}</p>

        <div className="product-footer">
          <span className="product-price">${product.price}</span>
        </div>

        <button
          className="product-add-btn"
          onClick={(e) => {
            e.preventDefault(); // Prevent navigating to detail page if clicked on button
            onAddToCart(product);
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
