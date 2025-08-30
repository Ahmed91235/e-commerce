'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { CartItem, CartState } from '../types/cart';

// Cart Actions
type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'LOAD_CART'; payload: CartState };

// Initial state
const initialState: CartState = {
  items: [],
  itemCount: 0,
  subtotal: 0,
  shipping: 0,
  tax: 0,
  total: 0,
  isOpen: false,
};

// Cart reducer
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      let newItems: CartItem[];
      if (existingItem) {
        // Update quantity if item already exists
        newItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.min(item.quantity + 1, item.stockCount) }
            : item
        );
      } else {
        // Add new item
        newItems = [...state.items, { ...action.payload, quantity: 1 }];
      }

      const itemCount = newItems.reduce((count, item) => count + item.quantity, 0);
      const subtotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
      const tax = subtotal * 0.08; // 8% tax
      const total = subtotal + shipping + tax;

      return {
        ...state,
        items: newItems,
        itemCount,
        subtotal,
        shipping,
        tax,
        total,
      };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      const itemCount = newItems.reduce((count, item) => count + item.quantity, 0);
      const subtotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const shipping = subtotal > 50 ? 0 : 9.99;
      const tax = subtotal * 0.08;
      const total = subtotal + shipping + tax;

      return {
        ...state,
        items: newItems,
        itemCount,
        subtotal,
        shipping,
        tax,
        total,
      };
    }

    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: action.payload.id });
      }

      const newItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.min(action.payload.quantity, item.stockCount) }
          : item
      );

      const itemCount = newItems.reduce((count, item) => count + item.quantity, 0);
      const subtotal = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const shipping = subtotal > 50 ? 0 : 9.99;
      const tax = subtotal * 0.08;
      const total = subtotal + shipping + tax;

      return {
        ...state,
        items: newItems,
        itemCount,
        subtotal,
        shipping,
        tax,
        total,
      };
    }

    case 'CLEAR_CART':
      return { ...initialState, isOpen: state.isOpen };

    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };

    case 'OPEN_CART':
      return { ...state, isOpen: true };

    case 'CLOSE_CART':
      return { ...state, isOpen: false };

    case 'LOAD_CART':
      return action.payload;

    default:
      return state;
  }
}

// Context
interface CartContextType {
  state: CartState;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart Provider
interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: cartData });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage on state change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);

  const contextValue: CartContextType = {
    state,
    addItem: (item) => dispatch({ type: 'ADD_ITEM', payload: item }),
    removeItem: (id) => dispatch({ type: 'REMOVE_ITEM', payload: id }),
    updateQuantity: (id, quantity) => dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } }),
    clearCart: () => dispatch({ type: 'CLEAR_CART' }),
    toggleCart: () => dispatch({ type: 'TOGGLE_CART' }),
    openCart: () => dispatch({ type: 'OPEN_CART' }),
    closeCart: () => dispatch({ type: 'CLOSE_CART' }),
  };

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
}

// Custom hook
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}