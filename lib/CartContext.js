"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { data: session, status } = useSession();
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const isLoggedIn = status === "authenticated" && !!session?.user?.id;

  // ── 從 DB 載入購物車（登入後）──────────────────────
  const loadFromDB = useCallback(async () => {
    try {
      const res = await fetch("/api/cart");
      if (!res.ok) return;
      const { items } = await res.json();
      setCartItems(
        items.map((i) => ({
          id: i.product_id,
          name: i.name,
          price: i.price,
          image: i.image,
          quantity: i.quantity,
        }))
      );
    } catch (e) {
      console.error("Failed to load cart from DB", e);
    }
  }, []);

  // ── 初始化 ──────────────────────────────────────────
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    if (isLoggedIn) {
      // 登入：從 DB 載入，並合併 localStorage 裡的舊資料
      const mergeLocalCart = async () => {
        const stored = localStorage.getItem("heirloom_cart");
        if (stored) {
          const localItems = JSON.parse(stored);
          // 把 localStorage 的商品 upsert 到 DB
          await Promise.all(
            localItems.map((item) =>
              fetch("/api/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  product_id: item.id,
                  name: item.name,
                  price: item.price,
                  image: item.image,
                  quantity: item.quantity,
                }),
              })
            )
          );
          localStorage.removeItem("heirloom_cart");
        }
        await loadFromDB();
      };
      mergeLocalCart();
    } else if (status === "unauthenticated") {
      // 未登入：從 localStorage 載入
      try {
        const stored = localStorage.getItem("heirloom_cart");
        if (stored) setCartItems(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to load cart from localStorage", e);
      }
    }
  }, [isLoggedIn, status, isMounted, loadFromDB]);

  // ── 未登入時同步到 localStorage ─────────────────────
  useEffect(() => {
    if (isMounted && !isLoggedIn) {
      try {
        localStorage.setItem("heirloom_cart", JSON.stringify(cartItems));
      } catch (e) {
        console.error("Failed to save cart to localStorage", e);
      }
    }
  }, [cartItems, isMounted, isLoggedIn]);

  // ── 加入購物車 ──────────────────────────────────────
  const addToCart = async (product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { ...product, quantity }];
    });
    setIsCartOpen(true);

    if (isLoggedIn) {
      // 取目前數量再加
      const current = cartItems.find((i) => i.id === product.id);
      const newQty = (current?.quantity ?? 0) + quantity;
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: newQty,
        }),
      });
    }
  };

  // ── 移除單一商品 ─────────────────────────────────────
  const removeFromCart = async (productId) => {
    setCartItems((prev) => prev.filter((i) => i.id !== productId));
    if (isLoggedIn) {
      await fetch(`/api/cart/${productId}`, { method: "DELETE" });
    }
  };

  // ── 更新數量 ─────────────────────────────────────────
  const updateQuantity = async (productId, amount) => {
    let newQty = 1;
    setCartItems((prev) =>
      prev.map((i) => {
        if (i.id === productId) {
          newQty = Math.max(1, i.quantity + amount);
          return { ...i, quantity: newQty };
        }
        return i;
      })
    );
    if (isLoggedIn) {
      await fetch(`/api/cart/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQty }),
      });
    }
  };

  // ── 清空購物車 ───────────────────────────────────────
  const clearCart = async () => {
    setCartItems([]);
    if (isLoggedIn) {
      await fetch("/api/cart", { method: "DELETE" });
    }
  };

  const cartCount = cartItems.reduce((t, i) => t + i.quantity, 0);
  const cartTotal = cartItems.reduce((t, i) => {
    const price = parseFloat(i.price.replace(/[^0-9.-]+/g, ""));
    return t + price * i.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
