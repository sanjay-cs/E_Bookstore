import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

function ProductCard({ product, onAddToCart }) {
  return (
    <div className="product-card">
      <img
        className="product-image"
        src={product.image || 'https://via.placeholder.com/100x140?text=No+Image'}
        alt={product.title}
        width={100}
        height={140}
      />
      <h3 className="product-title">{product.title}</h3>
      <p className="product-author">{product.author}</p>
      <p className="product-price">₹{product.price}</p>
      <Link className="product-link" to={`/product/${product._id}`}>
        View Details
      </Link>
      <button
        className="product-add-btn"
        onClick={() => onAddToCart(product)}
      >
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;
