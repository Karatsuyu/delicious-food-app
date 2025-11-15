// src/components/CartModal.jsx (restaurado y mejorado)
import React, { useRef, useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './CartModal.css';
import carrito1 from '../assets/carrito1.png';

const CartModal = ({ isOpen, onClose }) => {
	const { isAuthenticated } = useContext(AuthContext);
	const { cartItems, toggleCart, getTotalItems, getTotalPrice } = useCart();
	const navigate = useNavigate();
	const modalRef = useRef(null);
	const [position, setPosition] = useState({ top: 0, left: 0 });

	const handleExplorarMenu = () => {
		onClose();
		navigate('/menu?categoria=hamburguesas');
	};

	const handleExpand = () => {
		onClose();
		toggleCart();
	};

	// Posicionar el modal debajo y centrado respecto al ícono del carrito
	useEffect(() => {
		if (isOpen) {
			const cartButton = document.querySelector('.cart-icon');
			if (cartButton) {
				const rect = cartButton.getBoundingClientRect();
				const top = rect.bottom + window.scrollY + 12;
				const centerX = rect.left + rect.width / 2 + window.scrollX;
				const minX = window.scrollX + 16;
				const maxX = window.scrollX + window.innerWidth - 16;
				const adjustedLeft = Math.min(maxX, Math.max(minX, centerX));
				setPosition({ top, left: adjustedLeft });
			}
		}
	}, [isOpen]);

	// Redirigir al login si intenta abrir modal sin autenticación
	useEffect(() => {
		if (isOpen && !isAuthenticated) {
			onClose();
			navigate('/login');
		}
	}, [isOpen, isAuthenticated, navigate, onClose]);

	if (!isOpen || !isAuthenticated) return null;

	return (
		<div className="cart-modal-overlay" onClick={onClose}>
			<div
				ref={modalRef}
				className="cart-modal-content"
				style={{
					position: 'absolute',
					top: `${position.top}px`,
					left: `${position.left}px`,
					transform: 'translateX(-50%)',
					margin: 0,
					zIndex: 6001,
				}}
				onClick={(e) => e.stopPropagation()}
			>
				<button className="cart-modal-close" onClick={onClose}>×</button>
				<div className="cart-modal-icon">
					<img src={carrito1} alt="Carrito" className="cart-modal-icon-img" />
				</div>
						{cartItems.length === 0 ? (
							<>
								<h2 className="cart-modal-title">Tu carrito está vacío</h2>
								<p className="cart-modal-message">¿Quieres empezar a ordenar?</p>
								<button className="cart-modal-button" onClick={handleExplorarMenu}>Explorar Menú</button>
								<button className="cart-modal-button secondary" onClick={handleExpand}>Ampliar (ver lateral)</button>
							</>
						) : (
							<>
								<h2 className="cart-modal-title">Carrito</h2>
								<div className="cart-modal-items">
									{cartItems.map((item) => (
										<div key={item.id} className="cart-modal-item">
											<img src={item.imagen} alt={item.nombre} className="cart-modal-item-img" />
											<div className="cart-modal-item-info">
												<div className="cart-modal-item-name" title={item.nombre}>{item.nombre}</div>
												<div className="cart-modal-item-price">${item.precio.toLocaleString('es-CO')}</div>
											</div>
										</div>
									))}
								</div>
								<p className="cart-modal-message resumen">
									{getTotalItems()} producto(s) · Total ${getTotalPrice().toLocaleString('es-CO')}
								</p>
								<button className="cart-modal-button" onClick={handleExpand}>Ver carrito completo</button>
								<button className="cart-modal-button secondary" onClick={handleExplorarMenu}>Seguir comprando</button>
							</>
						)}
			</div>
		</div>
	);
};

export default CartModal;
