
import React, { useState, useMemo, useEffect } from 'react';
import { Plus, ShoppingBag, ArrowLeft, ArrowRight, Check, Trash2, ChevronRight, ChefHat, Star, PieChart, PenTool, X, User as UserIcon, Calendar, Trophy, BookOpen, Sun, CloudSun, Moon, Sparkles, Clock, Flame, TrendingUp, Medal, ThumbsUp, UtensilsCrossed, Soup, PlusCircle, Save, Tag, Camera, AlertCircle, Search, Minus, Settings, Bell, Heart, LogOut, History, CalendarDays, Share2, MoreHorizontal, Timer } from 'lucide-react';
import { USERS, DISHES as INITIAL_DISHES, CATEGORIES as INITIAL_CATEGORIES } from './constants';
import { MenuItem, MealType, Dish, Ingredient, Category, User, Achievement } from './types';

// Fallback Mock Achievements if not in types/constants
const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: 'a1', title: '中华小当家', desc: '累计烹饪超过 50 次', icon: '👨‍🍳', unlocked: true },
  { id: 'a2', title: '营养均衡', desc: '一周内蔬菜占比超过 60%', icon: '🥦', unlocked: false },
  { id: 'a3', title: '光盘行动', desc: '连续 3 天没有剩菜', icon: '🍽️', unlocked: true },
  { id: 'a4', title: '省钱能手', desc: '按清单买菜节省 100 元', icon: '💰', unlocked: true },
];

// --- HOOKS ---

const useMenuAggregator = (menuItems: MenuItem[]) => {
  return useMemo(() => {
    const rawIngredients: Ingredient[] = [];
    
    // Flatten ingredients
    menuItems.forEach(item => {
      rawIngredients.push(...item.dish.ingredients);
    });

    // Aggregate
    const map = new Map<string, Ingredient>();
    
    rawIngredients.forEach(ing => {
      const key = `${ing.name}-${ing.unit}`;
      if (map.has(key)) {
        const existing = map.get(key)!;
        existing.quantity += ing.quantity;
      } else {
        map.set(key, { ...ing });
      }
    });

    // Group
    const groupedList = {
      vegetable: [] as Ingredient[],
      meat: [] as Ingredient[],
      seasoning: [] as Ingredient[],
      other: [] as Ingredient[]
    };

    map.forEach(ing => {
      const cat = ing.category || 'other';
      if (groupedList[cat]) {
        groupedList[cat].push(ing);
      } else {
        groupedList['other'].push(ing);
      }
    });

    return {
      groupedList,
      totalCount: rawIngredients.length,
      totalItems: map.size
    };
  }, [menuItems]);
};

// --- COMPONENTS ---

const Navbar = ({ onBack, title, rightAction, subtitle, className = '', transparent = false }: { onBack?: () => void, title?: string, rightAction?: React.ReactNode, subtitle?: string, className?: string, transparent?: boolean }) => (
  <div className={`pt-12 pb-3 px-6 flex justify-between items-center sticky top-0 z-40 shrink-0 transition-colors ${transparent ? 'bg-transparent' : 'bg-white'} ${className}`}>
    <div className="flex items-center">
      {onBack && (
        <button 
          onClick={onBack}
          className={`w-10 h-10 mr-3 rounded-full flex items-center justify-center active:scale-95 transition-transform pointer-events-auto ${transparent ? 'bg-black/20 backdrop-blur-md text-white' : 'bg-white shadow-card text-sg-text-main'}`}
        >
          <ArrowLeft size={20} />
        </button>
      )}
      {!transparent && (
        <div>
          <h1 className="text-xl font-extrabold text-sg-text-main leading-none">{title || '食光集'}</h1>
          {subtitle && <p className="text-xs font-bold text-sg-text-light mt-1">{subtitle}</p>}
        </div>
      )}
    </div>
    
    {rightAction}
  </div>
);

const TabBar = ({ activeTab, onTabChange }: { activeTab: string, onTabChange: (tab: 'home' | 'recipes' | 'summary' | 'profile') => void }) => {
  const tabs = [
    { id: 'home', label: '明日菜单', icon: Calendar },
    { id: 'recipes', label: '菜谱', icon: BookOpen },
    { id: 'summary', label: '回忆录', icon: PieChart },
    { id: 'profile', label: '我的', icon: UserIcon },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.03)] pb-safe pt-2 px-6 flex justify-between items-end h-[85px] z-40 rounded-t-[2rem]">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id as any)}
            className={`flex flex-col items-center justify-center flex-1 h-14 transition-all duration-300 mb-4`}
          >
            <div className={`p-1.5 rounded-full mb-0.5 transition-all ${isActive ? 'text-sg-primary scale-110' : 'text-gray-300'}`}>
              <tab.icon size={26} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className={`text-[10px] font-bold transition-colors ${isActive ? 'text-sg-primary' : 'text-gray-300'}`}>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

// --- CATEGORY MANAGER COMPONENT ---

const CategoryManager = ({
  categories,
  onClose,
  onAdd,
  onEdit,
  onDelete
}: {
  categories: Category[],
  onClose: () => void,
  onAdd: (name: string) => void,
  onEdit: (id: string, name: string) => void,
  onDelete: (id: string) => void
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setDeleteConfirmId(null);
  };

  const saveEdit = () => {
    if (editingId && editName.trim()) {
      onEdit(editingId, editName.trim());
    }
    setEditingId(null);
  };

  const handleAdd = () => {
    if (newCatName.trim()) {
      onAdd(newCatName.trim());
      setNewCatName('');
      setIsAdding(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#F9F9F9] z-[70] flex flex-col animate-in slide-in-from-bottom-10">
      <Navbar title="分类管理" onBack={onClose} className="bg-white" />
      <div className="flex-1 overflow-y-auto p-5 space-y-3 pb-safe">
        {categories.map(cat => (
          <div key={cat.id} className="bg-white p-4 rounded-2xl shadow-sm overflow-hidden transition-all">
            {editingId === cat.id ? (
              <div className="flex items-center">
                 <input
                   className="flex-1 bg-gray-50 px-3 py-2 rounded-lg text-sm font-bold outline-none text-sg-text-main border border-gray-100 focus:border-sg-primary/50"
                   value={editName}
                   onChange={e => setEditName(e.target.value)}
                   autoFocus
                   onKeyDown={e => e.key === 'Enter' && saveEdit()}
                 />
                 <button onClick={saveEdit} className="ml-2 p-2 bg-sg-primary text-white rounded-lg shadow-sm active:scale-95 transition-transform">
                   <Check size={16} />
                 </button>
              </div>
            ) : deleteConfirmId === cat.id ? (
               <div className="flex items-center justify-between bg-red-50 -m-4 p-4 animate-in fade-in duration-200">
                  <span className="text-xs font-bold text-red-500">确定删除 "{cat.name}" 吗?</span>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setDeleteConfirmId(null)}
                      className="px-3 py-1.5 bg-white text-gray-500 text-xs font-bold rounded-lg shadow-sm active:scale-95"
                    >
                      取消
                    </button>
                    <button 
                      onClick={() => { onDelete(cat.id); setDeleteConfirmId(null); }}
                      className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-lg shadow-sm flex items-center active:scale-95"
                    >
                      <Trash2 size={12} className="mr-1"/> 删除
                    </button>
                  </div>
               </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-xl mr-3">{cat.icon}</span>
                  <span className="font-bold text-sg-text-main">{cat.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                   <button onClick={() => startEdit(cat)} className="p-2 text-gray-400 hover:text-sg-primary bg-gray-50 rounded-lg transition-colors active:scale-95">
                     <PenTool size={16} />
                   </button>
                   <button onClick={() => setDeleteConfirmId(cat.id)} className="p-2 text-gray-400 hover:text-red-500 bg-gray-50 rounded-lg transition-colors active:scale-95">
                     <Trash2 size={16} />
                   </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {isAdding ? (
          <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center animate-in fade-in">
             <div className="flex-1 flex items-center">
                 <span className="text-xl mr-3">🍽️</span>
                 <input
                   className="flex-1 bg-gray-50 px-3 py-2 rounded-lg text-sm font-bold outline-none text-sg-text-main border border-gray-100 focus:border-sg-primary/50"
                   value={newCatName}
                   onChange={e => setNewCatName(e.target.value)}
                   placeholder="新分类名称"
                   autoFocus
                   onKeyDown={e => e.key === 'Enter' && handleAdd()}
                 />
                 <button onClick={handleAdd} className="ml-2 p-2 bg-sg-primary text-white rounded-lg shadow-sm active:scale-95 transition-transform">
                   <Check size={16} />
                 </button>
                 <button onClick={() => setIsAdding(false)} className="ml-2 p-2 text-gray-400 hover:bg-gray-100 rounded-lg active:scale-95 transition-transform">
                   <X size={16} />
                 </button>
             </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full py-4 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 font-bold flex items-center justify-center active:bg-gray-50 transition-colors"
          >
            <Plus size={20} className="mr-2" /> 添加新分类
          </button>
        )}
      </div>
    </div>
  );
};


// --- TAB 1: HOME (Tomorrow's Menu) ---

const HomePage = ({ 
  menuItems, 
  onOpenMenu, 
  onGenerateList
}: { 
  menuItems: MenuItem[];
  onOpenMenu: (type: MealType) => void;
  onGenerateList: () => void;
}) => {
  
  const [activeMeal, setActiveMeal] = useState<MealType>('breakfast');

  const meals: { 
    type: MealType; 
    label: string; 
    time: string; 
    icon: any;
    themeClass: string;
    cardBg: string;
    textClass: string;
    activeText: string;
    borderClass: string;
  }[] = [
    { 
      type: 'breakfast', 
      label: '早餐', 
      time: '07:00',
      icon: Sun,
      themeClass: 'bg-[#FFF9E6]',
      cardBg: 'bg-[#FFF9E6]',
      textClass: 'text-gray-400',
      activeText: 'text-[#B48E33]',
      borderClass: 'border-[#FFE082]',
    },
    { 
      type: 'lunch', 
      label: '午餐', 
      time: '12:00',
      icon: CloudSun,
      themeClass: 'bg-[#E8F5E9]',
      cardBg: 'bg-[#E8F5E9]',
      textClass: 'text-gray-400',
      activeText: 'text-[#4A7A57]',
      borderClass: 'border-[#A5D6A7]',
    },
    { 
      type: 'dinner', 
      label: '晚餐', 
      time: '19:00',
      icon: Moon,
      themeClass: 'bg-[#FFF0F0]',
      cardBg: 'bg-[#FFF0F0]',
      textClass: 'text-gray-400',
      activeText: 'text-[#A85D5D]',
      borderClass: 'border-[#EF9A9A]',
    },
  ];

  const activeMealData = meals.find(m => m.type === activeMeal)!;
  const currentItems = menuItems.filter(m => m.mealTime === activeMeal);

  // Helper to find user avatar
  const getUserAvatar = (id: string) => USERS.find(u => u.id === id)?.avatar;

  return (
    <div className="h-full flex flex-col bg-sg-bg relative">
      {/* Top Header */}
      <div className="pt-12 px-6 pb-2 bg-sg-bg shrink-0 flex justify-center relative z-20">
        <h1 className="text-xl font-black text-sg-text-main tracking-tight">食光集</h1>
      </div>

      {/* Banner & Tabs Area */}
      <div className="px-4 pb-2 bg-sg-bg shrink-0">
        
        {/* Refined Banner */}
        <div className="relative bg-gradient-to-br from-[#FFAB73] to-[#FF9A62] rounded-3xl p-4 shadow-float mb-4 overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="relative z-10 flex justify-between items-center">
            <div>
               <div className="flex items-center space-x-1.5 text-white/90 mb-1">
                 <Calendar size={12} strokeWidth={2.5} />
                 <span className="text-[10px] font-bold tracking-wide">10月26日 · 周四</span>
               </div>
               <h1 className="text-xl font-black text-white leading-none tracking-tight">明日菜单</h1>
            </div>

            <div className="flex -space-x-2">
              {USERS.map((u) => (
                <img 
                  key={u.id} 
                  src={u.avatar} 
                  alt={u.name} 
                  className="w-8 h-8 rounded-full border-2 border-white/50 object-cover"
                />
              ))}
              <button className="w-8 h-8 rounded-full border-2 border-white/50 bg-white/20 flex items-center justify-center text-white backdrop-blur-sm active:scale-90 transition-transform">
                <Plus size={14} strokeWidth={3}/>
              </button>
            </div>
          </div>
        </div>

        {/* Meal Tabs */}
        <div className="flex space-x-2 mb-2">
          {meals.map((meal) => {
            const isActive = activeMeal === meal.type;
            const Icon = meal.icon;
            return (
              <button
                key={meal.type}
                onClick={() => setActiveMeal(meal.type)}
                className={`flex-1 flex flex-col items-center justify-center py-2.5 rounded-xl transition-all duration-300 relative overflow-hidden ${isActive ? 'shadow-sm scale-100' : 'scale-95 opacity-70 bg-white'}`}
                style={{ backgroundColor: isActive ? undefined : '#FFFFFF' }}
              >
                {isActive && (
                  <div className={`absolute inset-0 ${meal.themeClass} opacity-60 z-0`} />
                )}
                
                <div className="relative z-10 flex flex-col items-center">
                  <Icon size={18} className={`mb-0.5 ${isActive ? meal.activeText : 'text-gray-400'}`} strokeWidth={2.5} />
                  <span className={`text-xs font-bold ${isActive ? 'text-sg-text-main' : 'text-gray-400'}`}>{meal.label}</span>
                </div>
                
                {isActive && (
                   <div className={`absolute bottom-0 w-6 h-1 rounded-t-full ${meal.borderClass.replace('border', 'bg')}`} />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Scrollable List Area */}
      <div className="flex-1 overflow-y-auto px-4 pb-48">
        <div className="space-y-2.5">
          {/* Empty State */}
          {currentItems.length === 0 ? (
            <button 
              onClick={() => onOpenMenu(activeMeal)}
              className="w-full mt-4 flex flex-col items-center justify-center py-10 border-2 border-dashed border-[#FFAB73]/30 rounded-3xl bg-[#FFF9F5] active:scale-95 transition-transform"
            >
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 text-sg-primary">
                 <Soup size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-sg-text-main font-bold text-sm mb-1">还没有想好吃啥？</h3>
              <p className="text-sg-primary text-xs font-bold bg-white px-3 py-1 rounded-full shadow-sm">
                去点菜 +
              </p>
            </button>
          ) : (
            <>
              {/* Dish List Items */}
              {currentItems.map((item) => (
                <div key={item.id} className={`${activeMealData.cardBg} border border-white rounded-xl p-2.5 shadow-sm flex items-center active:scale-[0.98] transition-transform duration-200 h-24 overflow-hidden`}>
                  
                  {/* Left: Image (Smaller) */}
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-white/50">
                    <img src={item.dish.cover} className="w-full h-full object-cover" alt={item.dish.name} />
                  </div>
                  
                  {/* Middle: Content (Fixed Height with Internal Scroll) */}
                  <div className="flex-1 ml-3 mr-2 h-full overflow-y-auto no-scrollbar py-1">
                    <h3 className="font-bold text-sg-text-main text-sm mb-1">{item.dish.name}</h3>
                    <div className="flex flex-wrap gap-1">
                      <span className="flex items-center text-[9px] text-gray-500 bg-white/60 px-1.5 py-0.5 rounded-md font-medium shrink-0">
                        <Clock size={9} className="mr-0.5"/> {item.dish.time}分
                      </span>
                      {item.dish.tags.map(tag => (
                        <span key={tag} className="text-[9px] px-1.5 py-0.5 bg-white/60 text-gray-500 rounded-md font-medium shrink-0">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right: Avatar Badge */}
                  <div className="flex flex-col items-center justify-center pl-2 shrink-0">
                    <img src={getUserAvatar(item.selectorId)} className="w-6 h-6 rounded-full border border-white shadow-sm" />
                  </div>
                </div>
              ))}
              
              {/* Add Another Dish Button (In Flow) */}
              <button 
                onClick={() => onOpenMenu(activeMeal)}
                className={`w-full py-3 rounded-xl border border-dashed ${activeMealData.borderClass} ${activeMealData.cardBg} bg-opacity-50 flex items-center justify-center text-xs font-bold ${activeMealData.activeText} active:scale-95 transition-transform`}
              >
                <Plus size={14} className="mr-1" strokeWidth={3} /> 加一道菜
              </button>
            </>
          )}
        </div>
      </div>

      {/* FIXED Bottom Action Bar */}
      <div className="fixed bottom-[95px] left-0 right-0 z-50 px-5 pointer-events-none">
        <div className="flex items-center space-x-3 pointer-events-auto">
          {/* Big Generate Button (Centered/Full Width) */}
          <button 
            onClick={onGenerateList}
            className="flex-1 bg-sg-text-main text-white h-12 rounded-full shadow-float font-bold flex items-center justify-center text-sm active:scale-95 transition-transform"
          >
            <ShoppingBag size={18} className="mr-2 text-sg-primary" strokeWidth={2.5} />
            生成买菜清单 
            {menuItems.length > 0 && <span className="ml-1 opacity-60 font-normal">({menuItems.length})</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- TAB 2: RECIPES (New Tab) ---

const RecipesPage = ({ 
  dishes, 
  categories,
  onOpenCreateRecipe,
  onDishClick,
  onManageCategories
}: { 
  dishes: Dish[], 
  categories: Category[],
  onOpenCreateRecipe: () => void,
  onDishClick: (dish: Dish) => void,
  onManageCategories: () => void
}) => {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || 'c1');
  const [searchQuery, setSearchQuery] = useState('');

  // Validate activeCategory: if deleted, switch to first available
  useEffect(() => {
    if (categories.length > 0 && !categories.find(c => c.id === activeCategory)) {
      setActiveCategory(categories[0].id);
    }
  }, [categories, activeCategory]);

  const filteredDishes = dishes.filter(d => 
    d.categoryId === activeCategory && 
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-sg-bg overflow-y-auto pb-32">
       <Navbar 
         title="私房菜谱" 
         subtitle={`共收录 ${dishes.length} 道美味`}
         rightAction={
            <button 
               onClick={onOpenCreateRecipe}
               className="w-10 h-10 rounded-full bg-white text-sg-primary shadow-card flex items-center justify-center active:scale-90 transition-transform"
            >
               <Plus size={20} strokeWidth={3} />
            </button>
         }
       />
       
       <div className="bg-sg-bg sticky top-0 z-10">
         {/* Search Bar */}
         <div className="px-6 mb-2">
           <div className="relative bg-white rounded-xl flex items-center px-3 py-3 transition-all focus-within:ring-2 focus-within:ring-sg-primary/20 shadow-sm border border-gray-50">
             <Search size={18} className="text-gray-400 mr-2 shrink-0" />
             <input 
                placeholder="搜搜想吃什么..." 
                className="bg-transparent text-sm font-bold flex-1 outline-none text-sg-text-main placeholder-gray-300 min-w-0"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
             />
             {searchQuery && (
               <button onClick={() => setSearchQuery('')} className="p-1 rounded-full bg-gray-200 text-gray-500">
                 <X size={12} strokeWidth={3} />
               </button>
             )}
           </div>
         </div>

         {/* Horizontal Categories with Manage Button */}
         <div className="pb-3 pt-1 px-6 flex items-center">
           <div className="flex-1 overflow-x-auto no-scrollbar flex space-x-2 -ml-2 pl-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`shrink-0 flex items-center px-3 py-2 rounded-xl font-bold text-xs transition-all active:scale-95 border ${
                    activeCategory === cat.id 
                    ? 'bg-sg-primary text-white shadow-lg shadow-orange-200 border-sg-primary' 
                    : 'bg-white text-sg-text-sub border-gray-50 shadow-sm'
                  }`}
                >
                  <span className="mr-1.5 text-base">{cat.icon}</span> {cat.name}
                </button>
              ))}
              <div className="w-2 shrink-0"></div>
           </div>
           
           {/* Manage Categories Button */}
           <div className="pl-3 border-l border-gray-100 ml-2 shrink-0">
               <button 
                 onClick={onManageCategories}
                 className="w-9 h-9 flex items-center justify-center bg-gray-50 rounded-xl text-gray-400 active:bg-gray-100 transition-colors"
               >
                 <Settings size={18} />
               </button>
           </div>
         </div>
       </div>

       {/* List */}
       <div className="px-6 space-y-3 pb-safe">
          {filteredDishes.length > 0 ? (
            filteredDishes.map(dish => (
              <div 
                key={dish.id} 
                onClick={() => onDishClick(dish)}
                className="flex bg-white p-3 rounded-2xl shadow-sm border border-gray-50 items-center active:scale-[0.99] transition-transform cursor-pointer"
              >
                  <img src={dish.cover} className="w-16 h-16 rounded-xl object-cover bg-gray-100 shrink-0" alt={dish.name} />
                  <div className="flex-1 ml-3 min-w-0 pr-2">
                    <h4 className="font-bold text-sg-text-main text-sm truncate mb-1">{dish.name}</h4>
                    <div className="flex items-center text-[10px] text-sg-text-light space-x-3 mb-1.5">
                      <span className="flex items-center"><Clock size={10} className="mr-1"/> {dish.time}m</span>
                    </div>
                    <div className="flex space-x-1 overflow-hidden">
                      {dish.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[9px] px-1.5 py-0.5 bg-[#F9F9F9] text-gray-400 rounded-md whitespace-nowrap">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 text-gray-300">
                     <ChevronRight size={16} />
                  </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center pt-20 opacity-50">
               <Soup size={48} className="text-gray-300 mb-2" />
               <p className="text-sm font-bold text-gray-400">还没有这个分类的菜谱哦</p>
               <button onClick={onOpenCreateRecipe} className="mt-4 text-xs font-bold text-sg-primary bg-orange-50 px-3 py-1.5 rounded-full">
                 + 录入一个
               </button>
            </div>
          )}
       </div>
    </div>
  )
}

// --- TAB 3: SUMMARY (Memories) ---

type TimeRange = 'week' | 'month' | 'year';

const SummaryPage = () => {
  const [range, setRange] = useState<TimeRange>('week');
  
  // Mock Data Generators based on range
  const stats = useMemo(() => {
    const base = range === 'week' ? 12 : range === 'month' ? 45 : 520;
    return {
      count: base,
      topDish: range === 'week' ? '番茄炒蛋' : '红烧肉',
      topChef: USERS[0]
    };
  }, [range]);

  // Mock History Data
  const historyDishes = useMemo(() => {
    // Generate some random history entries
    const items = [];
    const count = range === 'week' ? 5 : range === 'month' ? 12 : 20;
    const meals = ['早餐', '午餐', '晚餐'];
    
    for(let i=0; i<count; i++) {
       const dish = INITIAL_DISHES[i % INITIAL_DISHES.length];
       items.push({
         id: i,
         dish,
         date: `${range === 'week' ? '周' : ''}${['一','二','三','四','五','六','日'][i%7]}`,
         meal: meals[i%3],
         chef: USERS[i % USERS.length]
       });
    }
    return items;
  }, [range]);

  const ranges: { id: TimeRange; label: string }[] = [
    { id: 'week', label: '本周' },
    { id: 'month', label: '本月' },
    { id: 'year', label: '本年' },
  ];

  return (
    <div className="h-full flex flex-col bg-sg-bg overflow-y-auto pb-32">
      <Navbar title="饮食回忆" subtitle="记录每一顿温馨" className="bg-sg-bg" />
      
      {/* Time Range Switcher */}
      <div className="px-6 mb-5">
        <div className="bg-white p-1 rounded-xl flex shadow-sm border border-gray-100">
           {ranges.map(r => (
             <button
               key={r.id}
               onClick={() => setRange(r.id)}
               className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${range === r.id ? 'bg-sg-primary text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}
             >
               {r.label}
             </button>
           ))}
        </div>
      </div>

      <div className="px-5 space-y-5">
        
        {/* Row for Stats and Taste Profile */}
        <div className="grid grid-cols-2 gap-3">
          
          {/* Stats Card: Count + Favorite */}
          <div className="bg-white rounded-3xl p-4 shadow-card relative overflow-hidden flex flex-col justify-between min-h-[160px]">
             <div className="absolute -top-3 -right-3 p-4 opacity-5 pointer-events-none">
               <TrendingUp size={80} className="text-sg-primary" />
             </div>
             
             {/* Total Count */}
             <div className="relative z-10">
                <p className="text-[10px] font-bold text-gray-400 mb-1">{ranges.find(r => r.id === range)?.label}共烹饪</p>
                <div className="flex items-baseline text-sg-text-main">
                  <span className="text-3xl font-black tracking-tighter mr-1">{stats.count}</span>
                  <span className="text-xs font-bold text-gray-500">顿</span>
                </div>
             </div>
 
             {/* Favorite Dish */}
             <div className="relative z-10 mt-2">
                <p className="text-[10px] font-bold text-gray-400 mb-1">最爱吃</p>
                <div className="bg-[#FFF9F5] px-2 py-2 rounded-xl flex items-center border border-orange-50">
                   <ChefHat size={14} className="text-sg-primary mr-1.5 shrink-0" />
                   <span className="text-xs font-bold text-sg-text-main truncate">{stats.topDish}</span>
                </div>
             </div>
          </div>
 
          {/* Taste Profile Card */}
          <div className="bg-white rounded-3xl p-4 shadow-card flex flex-col justify-center min-h-[160px]">
            <h3 className="font-bold text-xs text-sg-text-main flex items-center mb-3">
              <PieChart size={14} className="mr-1.5 text-sg-primary"/>
              口味偏好
            </h3>
            
            <div className="space-y-3">
               {/* Bar 1 */}
               <div>
                 <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-1">
                   <span>🥬 蔬菜</span>
                   <span>45%</span>
                 </div>
                 <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                   <div className="h-full bg-sg-secondary w-[45%] rounded-full" />
                 </div>
               </div>
               {/* Bar 2 */}
               <div>
                 <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-1">
                   <span>🥩 肉类</span>
                   <span>30%</span>
                 </div>
                 <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                   <div className="h-full bg-sg-primary w-[30%] rounded-full" />
                 </div>
               </div>
            </div>
          </div>

        </div>

        {/* Dish History List */}
        <div className="bg-white rounded-3xl p-5 shadow-card">
            <h3 className="font-bold text-sg-text-main flex items-center mb-4">
              <History size={16} className="mr-2 text-blue-400" />
              点了什么菜
            </h3>
            
            <div className="space-y-4">
               {historyDishes.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between group">
                     <div className="flex items-center overflow-hidden">
                        <img src={item.dish.cover} className="w-12 h-12 rounded-xl object-cover bg-gray-100 shrink-0" alt={item.dish.name}/>
                        <div className="ml-3">
                           <p className="font-bold text-sm text-sg-text-main truncate">{item.dish.name}</p>
                           <div className="flex items-center mt-0.5">
                              <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 mr-2">{item.meal}</span>
                              <span className="text-[10px] text-gray-300">{item.date}</span>
                           </div>
                        </div>
                     </div>
                     <div className="shrink-0 flex items-center">
                        <img src={item.chef.avatar} className="w-6 h-6 rounded-full border border-white shadow-sm" />
                     </div>
                  </div>
               ))}
               
               <div className="pt-2 text-center">
                  <button className="text-xs font-bold text-gray-400 flex items-center justify-center w-full py-2 active:bg-gray-50 rounded-xl">
                    查看更多 <ChevronRight size={12} className="ml-1"/>
                  </button>
               </div>
            </div>
        </div>

        {/* Top Chef */}
        <div className="bg-gradient-to-r from-[#FFF0E6] to-white p-5 rounded-3xl shadow-sm border border-[#FFE0B2] flex items-center">
           <div className="relative">
             <div className="absolute -top-3 -right-2 bg-[#FFC107] text-white text-[10px] px-2 py-0.5 rounded-full border border-white font-bold shadow-sm z-10">
               本周厨神
             </div>
             <img src={stats.topChef.avatar} className="w-14 h-14 rounded-full border-2 border-white shadow-md" />
           </div>
           <div className="ml-4 flex-1">
             <h4 className="font-bold text-sg-text-main text-lg">{stats.topChef.name}</h4>
             <p className="text-xs text-sg-text-sub mt-0.5">为大家准备了 {Math.floor(stats.count * 0.6)} 道菜</p>
           </div>
           <Medal size={28} className="text-[#FFB74D]" />
        </div>

      </div>
    </div>
  );
};

// --- TAB 4: PROFILE (Me) ---

const ProfilePage = () => {
  const currentUser = USERS[0];
  
  return (
    <div className="h-full flex flex-col bg-sg-bg overflow-y-auto pb-32">
      {/* Header Card */}
      <div className="bg-white pb-6 pt-12 px-6 rounded-b-[3rem] shadow-card z-10 relative">
        <div className="flex justify-between items-start mb-6">
           <h1 className="text-xl font-extrabold text-sg-text-main">个人中心</h1>
           <button className="p-2 bg-gray-50 rounded-full text-gray-400">
             <Settings size={20} />
           </button>
        </div>
        
        <div className="flex items-center">
          <div className="relative">
            <img src={currentUser.avatar} className="w-20 h-20 rounded-full border-4 border-white shadow-float object-cover" />
            <div className="absolute bottom-0 right-0 bg-sg-primary text-white p-1 rounded-full border-2 border-white">
              <PenTool size={12} />
            </div>
          </div>
          <div className="ml-5">
            <h2 className="text-2xl font-black text-sg-text-main">{currentUser.name}</h2>
            <p className="text-xs font-bold text-gray-400 mt-1 bg-gray-100 inline-block px-2 py-1 rounded-md">
              家庭 ID: 882910
            </p>
          </div>
        </div>
      </div>

      <div className="px-5 mt-6 space-y-6">
        
        {/* Family Members */}
        <div className="bg-white rounded-3xl p-5 shadow-card">
           <h3 className="font-bold text-sg-text-main mb-4 flex items-center">
             <Heart size={16} className="mr-2 text-pink-400" />
             家庭成员
           </h3>
           <div className="space-y-4">
             {USERS.map(user => (
               <div key={user.id} className="flex items-center justify-between">
                 <div className="flex items-center">
                   <img src={user.avatar} className="w-10 h-10 rounded-full bg-gray-200 object-cover" />
                   <span className="ml-3 font-bold text-sm text-sg-text-main">{user.name}</span>
                   {user.id === currentUser.id && <span className="ml-2 text-[10px] bg-orange-100 text-sg-primary px-1.5 py-0.5 rounded font-bold">我</span>}
                 </div>
                 <button className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
                   <ArrowRight size={14} />
                 </button>
               </div>
             ))}
             {/* Invite Button */}
             <button className="w-full py-3 border border-dashed border-gray-200 rounded-xl flex items-center justify-center text-xs font-bold text-gray-400 mt-2 active:bg-gray-50">
               <Plus size={14} className="mr-1" /> 邀请家人加入
             </button>
           </div>
        </div>

        {/* Settings Menu */}
        <div className="bg-white rounded-3xl p-2 shadow-card">
           {[
             { label: '消息通知', icon: Bell, color: 'text-blue-400' },
             { label: '饮食偏好设置', icon: ChefHat, color: 'text-sg-primary' },
             { label: '关于食光集', icon: BookOpen, color: 'text-purple-400' },
             { label: '退出登录', icon: LogOut, color: 'text-gray-400' },
           ].map((item, idx) => (
             <button key={idx} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors group">
               <div className="flex items-center">
                 <item.icon size={18} className={`mr-3 ${item.color}`} />
                 <span className="text-sm font-bold text-sg-text-main">{item.label}</span>
               </div>
               <ArrowRight size={14} className="text-gray-300 group-hover:text-gray-400" />
             </button>
           ))}
        </div>

      </div>
    </div>
  );
};

// --- TAB 2: MENU (Selection) ---

const MenuPage = ({ 
  currentMeal, 
  dishes,
  categories,
  onClose, 
  onSubmit 
}: { 
  currentMeal: MealType; 
  dishes: Dish[];
  categories: Category[];
  onClose: () => void;
  onSubmit: (dishes: Dish[]) => void;
}) => {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || 'c1');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCart, setShowCart] = useState(false);
  
  // Selection State: dishId -> count
  const [selectedCounts, setSelectedCounts] = useState<Record<string, number>>({});

  const filteredDishes = dishes.filter(d => 
    d.categoryId === activeCategory && 
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedDishes = useMemo(() => {
    return dishes.filter(d => (selectedCounts[d.id] || 0) > 0);
  }, [dishes, selectedCounts]);

  const updateCount = (e: React.MouseEvent, dishId: string, delta: number) => {
    e.stopPropagation();
    const current = selectedCounts[dishId] || 0;
    const next = Math.max(0, current + delta);
    const newCounts = { ...selectedCounts, [dishId]: next };
    if (next === 0) {
      delete newCounts[dishId];
    }
    setSelectedCounts(newCounts);
  };

  const totalCount = (Object.values(selectedCounts) as number[]).reduce((a, b) => a + b, 0);

  const handleSubmit = () => {
    const result: Dish[] = [];
    Object.entries(selectedCounts).forEach(([id, count]) => {
      const dish = dishes.find(d => d.id === id);
      if(dish) {
        for(let i=0; i<(count as number); i++) result.push(dish);
      }
    });
    onSubmit(result);
  };

  return (
    <div className="fixed inset-0 bg-[#F9F9F9] z-50 flex flex-col">
      <Navbar 
        onBack={onClose} 
        title="点菜" 
        subtitle={currentMeal === 'breakfast' ? '早餐吃得像皇帝' : currentMeal === 'lunch' ? '午餐吃得像绅士' : '晚餐吃得像乞丐'}
        className="bg-white pb-2"
      />

      {/* Sticky Header with Search and Categories */}
      <div className="bg-white sticky top-[100px] z-10 shadow-sm">
         {/* Search Bar */}
         <div className="px-4 pb-2">
           <div className="relative bg-[#F5F5F5] rounded-xl flex items-center px-3 py-2.5 transition-all focus-within:ring-2 focus-within:ring-sg-primary/20">
             <Search size={18} className="text-gray-400 mr-2 shrink-0" />
             <input 
                placeholder="搜索想吃的菜..." 
                className="bg-transparent text-sm font-bold flex-1 outline-none text-sg-text-main placeholder-gray-300 min-w-0"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
             />
             {searchQuery && (
               <button onClick={() => setSearchQuery('')} className="p-1 rounded-full bg-gray-200 text-gray-500">
                 <X size={12} strokeWidth={3} />
               </button>
             )}
           </div>
         </div>

         {/* Horizontal Categories */}
         <div className="pb-3 pt-1">
           <div className="flex space-x-2 px-4 overflow-x-auto no-scrollbar">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`shrink-0 flex items-center px-3 py-2 rounded-xl font-bold text-xs transition-all active:scale-95 ${
                    activeCategory === cat.id 
                    ? 'bg-sg-primary text-white shadow-lg shadow-orange-200' 
                    : 'bg-[#F9F9F9] text-sg-text-sub'
                  }`}
                >
                  <span className="mr-1.5 text-base">{cat.icon}</span> {cat.name}
                </button>
              ))}
              {/* Spacer for right padding in scroll */}
              <div className="w-2 shrink-0"></div>
           </div>
         </div>
      </div>

      {/* Dish List */}
      <div className="flex-1 overflow-y-auto p-4 pb-24 bg-[#F9F9F9]">
        {filteredDishes.length > 0 ? (
          <>
            <h3 className="text-xs font-bold text-sg-text-light mb-3 flex items-center ml-1">
              <Sparkles size={12} className="mr-1 text-sg-primary" />
              美味推荐 ({filteredDishes.length})
            </h3>
            <div className="space-y-3">
              {filteredDishes.map(dish => {
                const count = selectedCounts[dish.id] || 0;
                return (
                <div key={dish.id} className="flex bg-white p-2 rounded-xl shadow-sm border border-gray-50 items-center active:scale-[0.99] transition-transform">
                  <img src={dish.cover} className="w-16 h-16 rounded-lg object-cover bg-gray-100 shrink-0" alt={dish.name} />
                  <div className="flex-1 ml-3 min-w-0 pr-2">
                    <h4 className="font-bold text-sg-text-main text-sm truncate mb-0.5">{dish.name}</h4>
                    <div className="flex items-center text-[10px] text-sg-text-light space-x-2 mb-1">
                      <span className="flex items-center"><Clock size={10} className="mr-0.5"/> {dish.time}m</span>
                    </div>
                    <div className="flex space-x-1 overflow-hidden">
                      {dish.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[9px] px-1.5 py-0.5 bg-[#F9F9F9] text-gray-400 rounded-md whitespace-nowrap">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Stepper Control */}
                  <div className="shrink-0 flex items-center mr-1">
                     {count > 0 ? (
                        <div className="flex items-center bg-gray-50 rounded-full p-0.5 border border-gray-100">
                           <button
                             onClick={(e) => updateCount(e, dish.id, -1)}
                             className="w-7 h-7 flex items-center justify-center text-gray-500 bg-white rounded-full shadow-sm active:scale-90 transition-transform"
                           >
                             <Minus size={14} strokeWidth={3} />
                           </button>
                           <span className="w-7 text-center text-xs font-bold text-sg-text-main tabular-nums">{count}</span>
                           <button
                             onClick={(e) => updateCount(e, dish.id, 1)}
                             className="w-7 h-7 flex items-center justify-center text-sg-primary bg-white rounded-full shadow-sm active:scale-90 transition-transform"
                           >
                             <Plus size={14} strokeWidth={3} />
                           </button>
                        </div>
                     ) : (
                        <button 
                          onClick={(e) => updateCount(e, dish.id, 1)}
                          className="w-8 h-8 bg-sg-primary rounded-full flex items-center justify-center text-white shadow-lg active:scale-90 transition-transform"
                        >
                          <Plus size={16} strokeWidth={3} />
                        </button>
                     )}
                  </div>
                </div>
              )})}
            </div>
          </>
        ) : (
           <div className="flex flex-col items-center justify-center pt-20 opacity-50">
              <Soup size={48} className="text-gray-300 mb-2" />
              <p className="text-sm font-bold text-gray-400">这个分类下没有找到菜品哦</p>
           </div>
        )}
      </div>
      
      {/* Cart Details Popup Overlay */}
      {showCart && totalCount > 0 && (
         <div className="absolute inset-0 z-20 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setShowCart(false)}>
            <div 
              className="absolute bottom-24 left-4 right-4 bg-white rounded-3xl p-5 shadow-xl animate-in slide-in-from-bottom-10 duration-200"
              onClick={e => e.stopPropagation()}
            >
               <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-50">
                  <h3 className="font-bold text-sg-text-main">已选菜品 <span className="text-sg-primary text-xs ml-1">({totalCount}项)</span></h3>
                  <button 
                    onClick={() => setSelectedCounts({})}
                    className="text-xs text-gray-400 flex items-center px-2 py-1 bg-gray-50 rounded-full active:scale-95"
                  >
                    <Trash2 size={12} className="mr-1"/> 清空
                  </button>
               </div>
               <div className="max-h-[40vh] overflow-y-auto no-scrollbar space-y-4">
                  {selectedDishes.map(dish => {
                     const count = selectedCounts[dish.id] || 0;
                     return (
                     <div key={dish.id} className="flex justify-between items-center">
                        <div className="flex items-center overflow-hidden">
                           <img src={dish.cover} className="w-10 h-10 rounded-lg object-cover bg-gray-100 shrink-0" alt={dish.name}/>
                           <span className="font-bold text-sm text-sg-text-main ml-3 truncate pr-2 max-w-[150px]">{dish.name}</span>
                        </div>
                        
                        <div className="flex items-center bg-gray-50 rounded-full p-0.5 border border-gray-100 shrink-0">
                           <button
                             onClick={(e) => updateCount(e, dish.id, -1)}
                             className="w-6 h-6 flex items-center justify-center text-gray-500 bg-white rounded-full shadow-sm active:scale-90 transition-transform"
                           >
                             <Minus size={12} strokeWidth={3} />
                           </button>
                           <span className="w-8 text-center text-xs font-bold text-sg-text-main tabular-nums">{count}</span>
                           <button
                             onClick={(e) => updateCount(e, dish.id, 1)}
                             className="w-6 h-6 flex items-center justify-center text-sg-primary bg-white rounded-full shadow-sm active:scale-90 transition-transform"
                           >
                             <Plus size={12} strokeWidth={3} />
                           </button>
                        </div>
                     </div>
                  )})}
               </div>
            </div>
         </div>
      )}

      {/* Floating Bottom Bar (Split Action) */}
      {totalCount > 0 && (
         <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-float z-30 pb-safe animate-in slide-in-from-bottom-5">
            <div className="w-full bg-sg-text-main text-white h-12 rounded-full flex items-center shadow-lg overflow-hidden relative">
                 {/* Left: Toggle Cart */}
                 <button 
                     onClick={() => setShowCart(!showCart)}
                     className="flex-1 flex items-center px-4 h-full active:bg-white/10 transition-colors"
                 >
                     <div className="bg-sg-primary text-white text-xs w-6 h-6 rounded-full flex items-center justify-center mr-2 shadow-sm font-black border-2 border-sg-text-main">
                         {totalCount}
                     </div>
                     <span className="text-sm font-bold">已选好</span>
                     <ChevronRight 
                         size={16} 
                         className={`ml-1 transition-transform duration-200 ${showCart ? '-rotate-90' : ''}`} 
                     />
                 </button>
                 
                 {/* Divider */}
                 <div className="w-[1px] h-6 bg-white/10"></div>
 
                 {/* Right: Submit */}
                 <button 
                     onClick={handleSubmit}
                     className="px-8 h-full flex items-center justify-center font-bold text-sm bg-sg-primary text-white active:brightness-95 transition-all"
                 >
                     确认提交
                 </button>
             </div>
         </div>
      )}
    </div>
  );
};

// --- CREATE RECIPE MODAL ---
const CreateRecipePage = ({ 
  categories,
  onClose, 
  onSave,
  onAddCategory
}: { 
  categories: Category[],
  onClose: () => void, 
  onSave: (dish: Dish) => void,
  onAddCategory: (name: string) => string
}) => {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [time, setTime] = useState('15');
  const [ingredients, setIngredients] = useState<Partial<Ingredient>[]>([{ name: '', quantity: 1, unit: '个' }]);
  const [tags, setTags] = useState<string[]>([]);
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'c1');
  
  // Custom Tag State
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTag, setNewTag] = useState('');

  // Custom Category State
  const [isAddingCat, setIsAddingCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  
  // Mock image upload
  const [cover, setCover] = useState('https://picsum.photos/400/400'); // Default random

  const toggleTag = (tag: string) => {
    if (tags.includes(tag)) setTags(tags.filter(t => t !== tag));
    else setTags([...tags, tag]);
  }

  const handleAddCustomTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
    }
    setNewTag('');
    setIsAddingTag(false);
  };

  const handleAddCustomCat = () => {
    if (newCatName) {
      const newId = onAddCategory(newCatName);
      setCategoryId(newId);
    }
    setNewCatName('');
    setIsAddingCat(false);
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: 1, unit: '个', category: 'vegetable' }]);
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: any) => {
    const newList = [...ingredients];
    newList[index] = { ...newList[index], [field]: value };
    setIngredients(newList);
  };
  
  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  }

  const handleSave = () => {
    // Validation
    if (!name) return;

    const newDish: Dish = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      description: desc,
      cover,
      calories: 0, // Removed from UI, default to 0
      time: Number(time) || 10,
      tags,
      ingredients: ingredients.filter(i => i.name) as Ingredient[], // Filter empty
      categoryId,
      cookedCount: 0,
      lastRating: 0
    };
    onSave(newDish);
    onClose();
  };

  // Predefined tags
  const SUGGESTED_TAGS = ['家常', '快手', '减脂', '下饭', '汤羹', '甜点', '宝宝餐'];
  // Combine suggested tags with currently selected tags to show all
  const displayTags = Array.from(new Set([...SUGGESTED_TAGS, ...tags]));

  return (
    <div className="fixed inset-0 bg-[#F9F9F9] z-50 flex flex-col animate-in slide-in-from-bottom-10 overflow-y-auto">
      <Navbar 
        title="录入菜谱" 
        onBack={onClose} 
        className="bg-white"
        rightAction={
          <button 
            onClick={handleSave} 
            className="bg-sg-primary text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg shadow-orange-200 active:scale-95 transition-transform"
          >
            保存
          </button>
        }
      />
      
      <div className="p-5 pb-20 space-y-6">
         {/* Combined Header: Cover Image + Name + Time */}
         <div className="bg-white p-4 rounded-3xl shadow-sm flex items-start">
            {/* Left: Compact Cover Upload */}
            <div className="w-24 h-24 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 relative shrink-0 overflow-hidden group active:bg-gray-100 transition-colors">
               <Camera size={20} className="mb-1 text-gray-300" />
               <span className="text-[10px] font-bold">上传封面</span>
               <img src={cover} className="absolute inset-0 w-full h-full object-cover opacity-60" />
            </div>

            {/* Right: Inputs */}
            <div className="ml-4 flex-1 flex flex-col h-24 justify-between py-1">
               {/* Name Input */}
               <div className="w-full">
                  <label className="text-[10px] font-bold text-gray-400 block mb-0.5">菜品名称</label>
                  <input 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full text-lg font-black text-sg-text-main placeholder-gray-200 outline-none bg-transparent"
                    placeholder="例如: 番茄炒蛋"
                  />
               </div>

               {/* Time Input */}
               <div className="flex items-center">
                  <div className="flex items-center bg-gray-50 rounded-lg px-2 py-1.5">
                     <Clock size={14} className="text-gray-400 mr-1.5" />
                     <input 
                       type="number" 
                       value={time} 
                       onChange={e => setTime(e.target.value)}
                       className="bg-transparent font-bold text-sg-text-main w-10 outline-none text-sm text-center"
                     />
                     <span className="text-xs text-gray-400 font-bold ml-1">分钟</span>
                  </div>
               </div>
            </div>
         </div>

         {/* Description */}
         <div className="bg-white p-5 rounded-3xl shadow-sm">
             <label className="text-xs font-bold text-gray-400 ml-1 mb-2 block">心得描述</label>
             <textarea 
               value={desc}
               onChange={e => setDesc(e.target.value)}
               className="w-full bg-gray-50 rounded-xl p-3 text-sm font-bold text-sg-text-main placeholder-gray-300 outline-none h-24 resize-none"
               placeholder="记录下烹饪的小窍门，或者这道菜独特的味道..."
             />
         </div>

         {/* Category Selection */}
         <div className="bg-white p-5 rounded-3xl shadow-sm">
            <h3 className="font-bold text-sg-text-main mb-3 flex items-center">
              <Soup size={16} className="mr-2 text-sg-secondary" /> 所属分类
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryId(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center ${
                    categoryId === cat.id 
                    ? 'bg-sg-secondary text-white shadow-md' 
                    : 'bg-gray-50 text-gray-400'
                  }`}
                >
                  <span className="mr-1">{cat.icon}</span>
                  {cat.name}
                </button>
              ))}
              {isAddingCat ? (
                <div className="flex items-center bg-gray-50 rounded-lg px-2 border border-sg-secondary">
                  <input 
                    autoFocus
                    value={newCatName}
                    onChange={e => setNewCatName(e.target.value)}
                    onBlur={handleAddCustomCat}
                    onKeyDown={e => e.key === 'Enter' && handleAddCustomCat()}
                    className="w-20 bg-transparent text-xs py-1.5 outline-none text-sg-text-main"
                    placeholder="新分类"
                  />
                </div>
              ) : (
                <button 
                  onClick={() => setIsAddingCat(true)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-50 text-gray-400 border border-dashed border-gray-300 active:bg-gray-100"
                >
                  + 自定义
                </button>
              )}
            </div>
         </div>

         {/* Ingredients */}
         <div className="bg-white p-5 rounded-3xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-sg-text-main flex items-center">
                <ShoppingBag size={16} className="mr-2 text-sg-primary" /> 食材清单
              </h3>
            </div>
            
            <div className="space-y-3">
               {ingredients.map((ing, idx) => (
                 <div key={idx} className="flex items-center space-x-2">
                    <input 
                      placeholder="食材名" 
                      value={ing.name}
                      onChange={e => updateIngredient(idx, 'name', e.target.value)}
                      className="flex-1 bg-gray-50 rounded-xl px-3 py-2 text-sm font-bold text-sg-text-main outline-none focus:ring-1 ring-sg-primary/20"
                    />
                    <input 
                      type="number"
                      placeholder="数量" 
                      value={ing.quantity}
                      onChange={e => updateIngredient(idx, 'quantity', Number(e.target.value))}
                      className="w-16 bg-gray-50 rounded-xl px-2 py-2 text-sm font-bold text-sg-text-main outline-none text-center"
                    />
                    <input 
                      placeholder="单位" 
                      value={ing.unit}
                      onChange={e => updateIngredient(idx, 'unit', e.target.value)}
                      className="w-14 bg-gray-50 rounded-xl px-2 py-2 text-sm font-bold text-sg-text-main outline-none text-center"
                    />
                    <button onClick={() => removeIngredient(idx)} className="p-2 text-gray-300 hover:text-red-400">
                      <X size={16} />
                    </button>
                 </div>
               ))}
               
               <button 
                 onClick={handleAddIngredient}
                 className="w-full py-3 border border-dashed border-gray-200 rounded-xl text-xs font-bold text-gray-400 flex items-center justify-center active:bg-gray-50"
               >
                 <Plus size={14} className="mr-1" /> 添加一行
               </button>
            </div>
         </div>

         {/* Tags */}
         <div className="bg-white p-5 rounded-3xl shadow-sm">
            <h3 className="font-bold text-sg-text-main mb-3 flex items-center">
              <Tag size={16} className="mr-2 text-blue-400" /> 标签
            </h3>
            <div className="flex flex-wrap gap-2">
               {displayTags.map(tag => (
                 <button
                   key={tag}
                   onClick={() => toggleTag(tag)}
                   className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                     tags.includes(tag) 
                     ? 'bg-sg-primary text-white shadow-md' 
                     : 'bg-gray-50 text-gray-400'
                   }`}
                 >
                   {tag}
                 </button>
               ))}
               
               {isAddingTag ? (
                 <div className="flex items-center bg-gray-50 rounded-lg px-2 border border-sg-primary">
                    <input 
                      autoFocus
                      value={newTag}
                      onChange={e => setNewTag(e.target.value)}
                      onBlur={handleAddCustomTag}
                      onKeyDown={e => e.key === 'Enter' && handleAddCustomTag()}
                      className="w-20 bg-transparent text-xs py-1.5 outline-none text-sg-text-main"
                      placeholder="输入标签"
                    />
                 </div>
               ) : (
                 <button 
                   onClick={() => setIsAddingTag(true)}
                   className="px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-50 text-gray-400 border border-dashed border-gray-300 active:bg-gray-100"
                 >
                   + 自定义
                 </button>
               )}
            </div>
         </div>
      </div>
    </div>
  );
};

// --- DISH DETAIL PAGE ---

const DishDetailPage = ({ dish, onClose }: { dish: Dish, onClose: () => void }) => {
  return (
    <div className="fixed inset-0 bg-white z-[60] overflow-y-auto animate-in slide-in-from-bottom-20 duration-300 no-scrollbar">
       
       {/* Fixed Navbar for navigation persistence */}
       <Navbar 
         onBack={onClose} 
         transparent={true} 
         className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
         rightAction={
           <button className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md text-white flex items-center justify-center active:scale-90 transition-transform pointer-events-auto">
             <Share2 size={20} />
           </button>
         }
       />

       {/* Immersive Header Image */}
       <div className="relative h-80 w-full shrink-0">
         <img src={dish.cover} className="w-full h-full object-cover" alt={dish.name} />
         <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
       </div>

       {/* Content Sheet */}
       <div className="relative -mt-10 bg-white rounded-t-[2.5rem] px-6 pt-8 pb-32 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] min-h-[500px]">
          {/* Header Info */}
          <div className="mb-6">
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-2xl font-black text-sg-text-main">{dish.name}</h1>
              <div className="flex items-center bg-[#FFF9F5] px-2 py-1 rounded-lg text-orange-400 text-xs font-black">
                <Star size={12} className="fill-orange-400 mr-1" />
                {dish.lastRating || 4.5}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {dish.tags.map(tag => (
                <span key={tag} className="text-[10px] font-bold px-2 py-1 bg-gray-100 text-gray-500 rounded-md">
                  {tag}
                </span>
              ))}
            </div>

            {/* Stats Grid - Modified: Removed Calories */}
            <div className="grid grid-cols-2 gap-3">
               {/* Time */}
               <div className="bg-[#F9F9F9] rounded-2xl p-3 flex flex-col items-center justify-center">
                  <Timer size={18} className="text-sg-primary mb-1" />
                  <span className="text-[10px] text-gray-400 font-bold">耗时</span>
                  <span className="text-sm font-black text-sg-text-main">{dish.time}分</span>
               </div>
               {/* Cooked Count */}
               <div className="bg-[#F9F9F9] rounded-2xl p-3 flex flex-col items-center justify-center">
                  <ChefHat size={18} className="text-sg-secondary mb-1" />
                  <span className="text-[10px] text-gray-400 font-bold">烹饪</span>
                  <span className="text-sm font-black text-sg-text-main">{dish.cookedCount || 0}次</span>
               </div>
            </div>
          </div>

          {/* Ingredients */}
          <div className="mb-8">
             <h3 className="font-bold text-lg text-sg-text-main mb-4 flex items-center">
               <span className="w-1.5 h-6 bg-sg-primary rounded-full mr-2"></span>
               食材准备
             </h3>
             <div className="bg-[#FAFAFA] rounded-3xl p-4 space-y-3 border border-gray-100">
               {dish.ingredients.map((ing, i) => (
                  <div key={i} className="flex justify-between items-center border-b border-gray-100 last:border-0 pb-2 last:pb-0">
                     <span className="text-sm font-bold text-gray-600 flex items-center">
                       <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mr-2.5"></div>
                       {ing.name}
                     </span>
                     <span className="text-sm font-black text-sg-text-main">{ing.quantity}{ing.unit}</span>
                  </div>
               ))}
             </div>
          </div>

          {/* Description / Instructions */}
          <div className="mb-6">
             <h3 className="font-bold text-lg text-sg-text-main mb-4 flex items-center">
               <span className="w-1.5 h-6 bg-sg-secondary rounded-full mr-2"></span>
               心得与做法
             </h3>
             <div className="text-sm leading-7 text-gray-600 font-medium">
               {dish.description ? dish.description : (
                 <p className="italic text-gray-400">暂时没有详细步骤，凭借厨神的直觉发挥吧！</p>
               )}
             </div>
          </div>
       </div>

       {/* Floating Action Bar */}
       <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-50 pb-safe z-[61]">
         <button className="w-full bg-sg-text-main text-white h-12 rounded-full font-bold flex items-center justify-center shadow-lg active:scale-95 transition-transform">
           <Plus size={18} className="mr-2 text-sg-primary" />
           加入明日菜单
         </button>
       </div>
    </div>
  );
};

// --- SHOPPING LIST MODAL ---
const ShoppingListPage = ({ menuItems, onClose }: { menuItems: MenuItem[], onClose: () => void }) => {
  const { groupedList, totalItems } = useMenuAggregator(menuItems);

  const renderSection = (title: string, items: Ingredient[]) => {
    if (items.length === 0) return null;
    return (
      <div className="mb-6">
        <h4 className="text-xs font-bold text-gray-400 mb-2 ml-1">{title}</h4>
        <div className="bg-white rounded-2xl p-1 shadow-sm border border-gray-50">
          {items.map((ing, i) => (
             <div key={i} className="flex justify-between items-center p-3 border-b border-gray-50 last:border-0">
                <div className="flex items-center">
                   <div className="w-4 h-4 rounded-full border-2 border-gray-200 mr-3" />
                   <span className="font-bold text-sm text-sg-text-main">{ing.name}</span>
                </div>
                <span className="font-bold text-sm text-sg-primary">{ing.quantity}{ing.unit}</span>
             </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-[#F9F9F9] z-50 flex flex-col animate-in slide-in-from-bottom-10">
       <Navbar title="买菜清单" subtitle={`共 ${totalItems} 项食材`} onBack={onClose} />
       <div className="flex-1 overflow-y-auto p-5 pb-safe">
          {renderSection('🥬 蔬菜果蔬', groupedList.vegetable)}
          {renderSection('🥩 肉禽蛋奶', groupedList.meat)}
          {renderSection('🧂 调味辅料', groupedList.seasoning)}
          {renderSection('📦 其他', groupedList.other)}
          
          {totalItems === 0 && (
             <div className="flex flex-col items-center justify-center pt-20 opacity-50">
                <ShoppingBag size={48} className="text-gray-300 mb-2" />
                <p className="text-sm font-bold text-gray-400">还没点菜呢</p>
             </div>
          )}
       </div>
    </div>
  );
};

// --- MAIN APP ---

const App = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'recipes' | 'summary' | 'profile'>('home');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [openMealType, setOpenMealType] = useState<MealType | null>(null);
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [showCreateRecipe, setShowCreateRecipe] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [dishes, setDishes] = useState<Dish[]>(INITIAL_DISHES);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  
  // New State for Detail Page
  const [viewingDish, setViewingDish] = useState<Dish | null>(null);

  const handleAddMenu = (selected: Dish[]) => {
    if (!openMealType) return;
    const newItems = selected.map(dish => ({
      id: Math.random().toString(36).slice(2),
      dish,
      selectorId: USERS[0].id, // Current user
      mealTime: openMealType,
      date: new Date().toISOString()
    }));
    setMenuItems(prev => [...prev, ...newItems]);
    setOpenMealType(null);
  };

  const handleSaveRecipe = (newDish: Dish) => {
    setDishes(prev => [...prev, newDish]);
  };

  const handleAddCategory = (name: string) => {
    const newCat: Category = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      icon: '🍽️' 
    };
    setCategories(prev => [...prev, newCat]);
    return newCat.id;
  };

  const handleEditCategory = (id: string, name: string) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, name } : c));
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="w-full h-screen overflow-hidden bg-sg-bg flex flex-col font-sans text-sg-text-main select-none">
      <div className="flex-1 overflow-hidden relative">
         {activeTab === 'home' && (
            <HomePage 
              menuItems={menuItems} 
              onOpenMenu={setOpenMealType}
              onGenerateList={() => setShowShoppingList(true)}
            />
         )}
         {activeTab === 'recipes' && (
            <RecipesPage 
              dishes={dishes} 
              categories={categories}
              onOpenCreateRecipe={() => setShowCreateRecipe(true)} 
              onDishClick={setViewingDish}
              onManageCategories={() => setShowCategoryManager(true)}
            />
         )}
         {activeTab === 'summary' && <SummaryPage />}
         {activeTab === 'profile' && <ProfilePage />}
      </div>
      
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

      {openMealType && (
        <MenuPage 
          currentMeal={openMealType}
          dishes={dishes}
          categories={categories}
          onClose={() => setOpenMealType(null)}
          onSubmit={handleAddMenu}
        />
      )}

      {showShoppingList && (
        <ShoppingListPage 
          menuItems={menuItems}
          onClose={() => setShowShoppingList(false)}
        />
      )}

      {showCreateRecipe && (
        <CreateRecipePage 
          categories={categories}
          onClose={() => setShowCreateRecipe(false)}
          onSave={handleSaveRecipe}
          onAddCategory={handleAddCategory}
        />
      )}

      {showCategoryManager && (
        <CategoryManager
          categories={categories}
          onClose={() => setShowCategoryManager(false)}
          onAdd={handleAddCategory}
          onEdit={handleEditCategory}
          onDelete={handleDeleteCategory}
        />
      )}

      {viewingDish && (
        <DishDetailPage 
           dish={viewingDish}
           onClose={() => setViewingDish(null)}
        />
      )}
    </div>
  );
};

export default App;
