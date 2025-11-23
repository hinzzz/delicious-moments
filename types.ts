export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  category: 'vegetable' | 'meat' | 'seasoning' | 'other';
}

export interface Dish {
  id: string;
  name: string;
  cover: string;
  description?: string; // New description field
  calories: number; // kcal
  time: number; // minutes
  tags: string[];
  ingredients: Ingredient[];
  categoryId: string;
  // New fields for summary
  cookedCount?: number;
  lastRating?: number; // 1-5 stars
}

export interface Achievement {
  id: string;
  title: string;
  desc: string;
  icon: string;
  unlocked: boolean;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  achievements?: Achievement[];
}

export type MealType = 'breakfast' | 'lunch' | 'dinner';

export interface MenuItem {
  id: string;
  dish: Dish;
  selectorId: string; // User ID
  mealTime: MealType;
  date: string; // simplified to just a marker in this version
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}