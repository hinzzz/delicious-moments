import { create } from 'zustand'
import Taro from '@tarojs/taro'
import { MenuItem, Dish, Category, User } from '../types'
import { USERS, DISHES as INITIAL_DISHES, CATEGORIES as INITIAL_CATEGORIES } from '../constants'

interface AppState {
  // Data
  menuItems: MenuItem[]
  dishes: Dish[]
  categories: Category[]
  users: User[]
  
  // Menu Items Actions
  addMenuItem: (item: MenuItem) => void
  removeMenuItem: (id: string) => void
  clearMenuItems: () => void
  
  // Dishes Actions
  addDish: (dish: Dish) => void
  updateDish: (id: string, dish: Partial<Dish>) => void
  deleteDish: (id: string) => void
  
  // Categories Actions
  addCategory: (category: Category) => void
  updateCategory: (id: string, name: string) => void
  deleteCategory: (id: string) => void
  
  // Persistence
  loadFromStorage: () => void
  saveToStorage: () => void
}

export const useStore = create<AppState>((set, get) => ({
  // Initial State
  menuItems: [],
  dishes: INITIAL_DISHES,
  categories: INITIAL_CATEGORIES,
  users: USERS,
  
  // Menu Items Actions
  addMenuItem: (item) => {
    set((state) => {
      const newState = { menuItems: [...state.menuItems, item] }
      setTimeout(() => get().saveToStorage(), 0)
      return newState
    })
  },
  
  removeMenuItem: (id) => {
    set((state) => {
      const newState = { menuItems: state.menuItems.filter(item => item.id !== id) }
      setTimeout(() => get().saveToStorage(), 0)
      return newState
    })
  },
  
  clearMenuItems: () => {
    set({ menuItems: [] })
    setTimeout(() => get().saveToStorage(), 0)
  },
  
  // Dishes Actions
  addDish: (dish) => {
    set((state) => {
      const newState = { dishes: [...state.dishes, dish] }
      setTimeout(() => get().saveToStorage(), 0)
      return newState
    })
  },
  
  updateDish: (id, updates) => {
    set((state) => {
      const newState = {
        dishes: state.dishes.map(dish => 
          dish.id === id ? { ...dish, ...updates } : dish
        )
      }
      setTimeout(() => get().saveToStorage(), 0)
      return newState
    })
  },
  
  deleteDish: (id) => {
    set((state) => {
      const newState = { dishes: state.dishes.filter(dish => dish.id !== id) }
      setTimeout(() => get().saveToStorage(), 0)
      return newState
    })
  },
  
  // Categories Actions
  addCategory: (category) => {
    set((state) => {
      const newState = { categories: [...state.categories, category] }
      setTimeout(() => get().saveToStorage(), 0)
      return newState
    })
  },
  
  updateCategory: (id, name) => {
    set((state) => {
      const newState = {
        categories: state.categories.map(cat => 
          cat.id === id ? { ...cat, name } : cat
        )
      }
      setTimeout(() => get().saveToStorage(), 0)
      return newState
    })
  },
  
  deleteCategory: (id) => {
    set((state) => {
      const newState = { categories: state.categories.filter(cat => cat.id !== id) }
      setTimeout(() => get().saveToStorage(), 0)
      return newState
    })
  },
  
  // Persistence
  loadFromStorage: () => {
    try {
      const menuItems = Taro.getStorageSync('menuItems')
      const dishes = Taro.getStorageSync('dishes')
      const categories = Taro.getStorageSync('categories')
      
      set({
        menuItems: menuItems ? JSON.parse(menuItems) : [],
        dishes: dishes ? JSON.parse(dishes) : INITIAL_DISHES,
        categories: categories ? JSON.parse(categories) : INITIAL_CATEGORIES,
      })
    } catch (e) {
      console.error('Load from storage error:', e)
    }
  },
  
  saveToStorage: () => {
    try {
      const state = get()
      Taro.setStorageSync('menuItems', JSON.stringify(state.menuItems))
      Taro.setStorageSync('dishes', JSON.stringify(state.dishes))
      Taro.setStorageSync('categories', JSON.stringify(state.categories))
    } catch (e) {
      console.error('Save to storage error:', e)
    }
  }
}))
