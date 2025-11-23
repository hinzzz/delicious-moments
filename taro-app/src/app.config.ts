export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/recipes/index',
    'pages/summary/index',
    'pages/profile/index',
    'pages/menu-select/index',
    'pages/dish-detail/index',
    'pages/shopping-list/index',
    'pages/create-recipe/index',
    'pages/category-manager/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '食光集',
    navigationBarTextStyle: 'black',
    backgroundColor: '#F9F9F9'
  },
  tabBar: {
    color: '#C1C1C1',
    selectedColor: '#FFAB73',
    backgroundColor: '#FFFFFF',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '明日菜单',
        iconPath: 'assets/icons/calendar.png',
        selectedIconPath: 'assets/icons/calendar-active.png'
      },
      {
        pagePath: 'pages/recipes/index',
        text: '菜谱',
        iconPath: 'assets/icons/book.png',
        selectedIconPath: 'assets/icons/book-active.png'
      },
      {
        pagePath: 'pages/summary/index',
        text: '回忆录',
        iconPath: 'assets/icons/chart.png',
        selectedIconPath: 'assets/icons/chart-active.png'
      },
      {
        pagePath: 'pages/profile/index',
        text: '家庭',
        iconPath: 'assets/icons/family.png',
        selectedIconPath: 'assets/icons/family-active.png'
      }
    ]
  }
})
