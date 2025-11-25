import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '../api/products';
import { addToCart } from '../api/cart';

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    getProductById(id).then(res => setProduct(res.data));
  }, [id]);

  const handleAddToCart = async () => {
    await addToCart({ productId: product._id, quantity: 1 });
    alert('Added to cart!');
  };

  if (!product) return <div>Loading...</div>;
  return (
    <div>
      <h3>{product.title}</h3>
      <p>{product.author}</p>
      <p>₹{product.price}</p>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
}
export default ProductDetail;
