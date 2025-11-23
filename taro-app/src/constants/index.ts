import { Dish, User, Category, Achievement } from './types';

const ACHIEVEMENTS: Achievement[] = [
  { id: 'a1', title: '中华小当家', desc: '累计烹饪超过 50 次', icon: '👨‍🍳', unlocked: true },
  { id: 'a2', title: '营养均衡', desc: '一周内蔬菜占比超过 60%', icon: '🥦', unlocked: false },
  { id: 'a3', title: '光盘行动', desc: '连续 3 天没有剩菜', icon: '🍽️', unlocked: true },
  { id: 'a4', title: '省钱能手', desc: '按清单买菜节省 100 元', icon: '💰', unlocked: true },
];

export const USERS: User[] = [
  { id: 'u1', name: '爸爸', avatar: 'https://picsum.photos/id/1005/100/100', achievements: ACHIEVEMENTS },
  { id: 'u2', name: '妈妈', avatar: 'https://picsum.photos/id/1011/100/100' },
  { id: 'u3', name: '宝贝', avatar: 'https://picsum.photos/id/1027/100/100' },
];

export const CATEGORIES: Category[] = [
  { id: 'c1', name: '热菜', icon: '🥘' },
  { id: 'c2', name: '凉菜', icon: '🥗' },
  { id: 'c3', name: '汤羹', icon: '🥣' },
  { id: 'c4', name: '甜点/主食', icon: '🍮' },
];

export const DISHES: Dish[] = [
  {
    id: 'd1',
    name: '番茄炒蛋',
    cover: 'https://picsum.photos/id/102/400/400',
    calories: 150,
    time: 10,
    tags: ['家常', '快手'],
    categoryId: 'c1',
    cookedCount: 12,
    lastRating: 5,
    ingredients: [
      { name: '番茄', quantity: 2, unit: '个', category: 'vegetable' },
      { name: '鸡蛋', quantity: 3, unit: '个', category: 'meat' }, 
      { name: '葱花', quantity: 1, unit: '根', category: 'vegetable' },
    ]
  },
  {
    id: 'd2',
    name: '红烧肉',
    cover: 'https://picsum.photos/id/106/400/400',
    calories: 450,
    time: 60,
    tags: ['硬菜', '解馋'],
    categoryId: 'c1',
    cookedCount: 5,
    lastRating: 4,
    ingredients: [
      { name: '五花肉', quantity: 500, unit: '克', category: 'meat' },
      { name: '生姜', quantity: 20, unit: '克', category: 'vegetable' },
      { name: '生抽', quantity: 2, unit: '勺', category: 'seasoning' },
      { name: '冰糖', quantity: 10, unit: '克', category: 'seasoning' },
    ]
  },
  {
    id: 'd3',
    name: '拍黄瓜',
    cover: 'https://picsum.photos/id/139/400/400',
    calories: 50,
    time: 5,
    tags: ['清爽', '下酒'],
    categoryId: 'c2',
    cookedCount: 8,
    lastRating: 5,
    ingredients: [
      { name: '黄瓜', quantity: 2, unit: '根', category: 'vegetable' },
      { name: '蒜末', quantity: 3, unit: '瓣', category: 'vegetable' },
      { name: '陈醋', quantity: 1, unit: '勺', category: 'seasoning' },
    ]
  },
  {
    id: 'd4',
    name: '奶油蘑菇汤',
    cover: 'https://picsum.photos/id/292/400/400',
    calories: 100,
    time: 20,
    tags: ['暖胃'],
    categoryId: 'c3',
    cookedCount: 2,
    lastRating: 3,
    ingredients: [
      { name: '口蘑', quantity: 200, unit: '克', category: 'vegetable' },
      { name: '淡奶油', quantity: 50, unit: '毫升', category: 'other' },
    ]
  },
  {
    id: 'd5',
    name: '草莓布丁',
    cover: 'https://picsum.photos/id/429/400/400',
    calories: 200,
    time: 15,
    tags: ['甜美'],
    categoryId: 'c4',
    cookedCount: 6,
    lastRating: 5,
    ingredients: [
      { name: '牛奶', quantity: 200, unit: '毫升', category: 'other' },
      { name: '白糖', quantity: 20, unit: '克', category: 'seasoning' },
      { name: '草莓', quantity: 5, unit: '个', category: 'vegetable' },
    ]
  },
  {
    id: 'd6',
    name: '全麦三明治',
    cover: 'https://picsum.photos/id/488/400/400',
    calories: 320,
    time: 10,
    tags: ['减脂', '快手'],
    categoryId: 'c4',
    cookedCount: 15,
    lastRating: 5,
    ingredients: [
      { name: '全麦吐司', quantity: 2, unit: '片', category: 'other' },
      { name: '生菜', quantity: 2, unit: '片', category: 'vegetable' },
      { name: '火腿', quantity: 1, unit: '片', category: 'meat' },
      { name: '芝士', quantity: 1, unit: '片', category: 'other' },
    ]
  },
  {
    id: 'd7',
    name: '清炒时蔬',
    cover: 'https://picsum.photos/id/493/400/400',
    calories: 120,
    time: 8,
    tags: ['健康', '素食'],
    categoryId: 'c1',
    cookedCount: 9,
    lastRating: 4,
    ingredients: [
      { name: '油菜', quantity: 300, unit: '克', category: 'vegetable' },
      { name: '蒜瓣', quantity: 2, unit: '个', category: 'vegetable' },
      { name: '蚝油', quantity: 1, unit: '勺', category: 'seasoning' },
    ]
  },
  {
    id: 'd8',
    name: '鲜虾云吞',
    cover: 'https://picsum.photos/id/450/400/400',
    calories: 350,
    time: 15,
    tags: ['鲜美', '早餐'],
    categoryId: 'c4',
    cookedCount: 4,
    lastRating: 5,
    ingredients: [
      { name: '云吞皮', quantity: 10, unit: '张', category: 'other' },
      { name: '虾仁', quantity: 100, unit: '克', category: 'meat' },
      { name: '猪肉碎', quantity: 50, unit: '克', category: 'meat' },
    ]
  }
];