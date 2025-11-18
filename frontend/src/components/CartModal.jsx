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
	// Ya no usamos expansión en el modal: redirigimos a una página de detalle

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
			const updatePosition = () => {
				if (!isOpen) return;
				const cartButton = document.querySelector('.cart-icon');
				if (!cartButton) return;
				const rect = cartButton.getBoundingClientRect();
				const top = rect.bottom + 2; // debajo del icono, relativo al viewport
				const centerX = rect.left + rect.width / 2;
				const minX = 16;
				const maxX = window.innerWidth - 16;
				const adjustedLeft = Math.min(maxX, Math.max(minX, centerX));
				setPosition({ top, left: adjustedLeft });
			};

			updatePosition();
			window.addEventListener('scroll', updatePosition, { passive: true });
			window.addEventListener('resize', updatePosition);
			return () => {
				window.removeEventListener('scroll', updatePosition);
				window.removeEventListener('resize', updatePosition);
			};
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
							position: 'fixed',
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
														{cartItems.map((item) => {
															const hasDetailsArray = Array.isArray(item.items) && item.items.length > 0;
															const hasDetallesObject = item.detalles && typeof item.detalles === 'object' && Object.keys(item.detalles).length > 0;
															const isCustomCombo = Boolean(item.isCustomCombo) || hasDetailsArray;

															const handleClick = () => {
																						if (isCustomCombo) {
																							onClose();
																							navigate(`/editar-combo/${item.id}`);
																	return;
																}
																// Inferir categoría para restaurar contexto de navegación
																const prefixMap = {
																	hamburguesa: 'hamburguesas',
																	pizza: 'pizzas',
																	pollo: 'pollo',
																	perro: 'perros',
																	postres: 'postres',
																	papas: 'papas',
																	bebida: 'bebidas'
																};
																const foundKey = Object.keys(prefixMap).find(k => String(item.id).startsWith(k));
																if (foundKey) {
																	sessionStorage.setItem('ultimaCategoria', prefixMap[foundKey]);
																}
																onClose();
																navigate(`/producto/${item.id}`);
															};

															return (
																<div key={item.id} className="cart-modal-item-wrap">
																	<div
																		className={`cart-modal-item ${isCustomCombo ? 'clickable' : ''}`}
																		onClick={handleClick}
																		role={'button'}
																	>
																		<img src={item.imagen} alt={item.nombre} className="cart-modal-item-img" />
																		<div className="cart-modal-item-info">
																			<div className="cart-modal-item-name" title={item.nombre}>{item.nombre}</div>
																			<div className="cart-modal-item-price">${item.precio.toLocaleString('es-CO')}</div>
																		</div>
																	</div>
																</div>
															);
														})}
								</div>
								<p className="cart-modal-message resumen">
									{getTotalItems()} producto(s) · Total ${getTotalPrice().toLocaleString('es-CO')}
								</p>
								<button className="cart-modal-button" onClick={handleExpand}>Ver carrito completo</button>
								<button className="cart-modal-button" onClick={() => { onClose(); navigate('/checkout'); }}>Finalizar compra</button>
								<button className="cart-modal-button secondary" onClick={handleExplorarMenu}>Seguir comprando</button>
							</>
						)}
			</div>
		</div>
	);
};

export default CartModal;
