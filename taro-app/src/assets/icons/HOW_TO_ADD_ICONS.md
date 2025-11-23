# 如何添加 TabBar 图标

## 方法 1：使用 Iconfont（推荐）

1. 访问 https://www.iconfont.cn/
2. 搜索并下载以下图标（PNG 格式，81x81px）：
   - 日历图标（calendar）
   - 书本图标（book）
   - 图表图标（chart/pie-chart）
   - 用户图标（user）

3. 每个图标需要两个版本：
   - 默认版本（灰色 #C1C1C1）
   - 选中版本（橙色 #FFAB73）

4. 将图标重命名并放到当前目录：
   ```
   calendar.png
   calendar-active.png
   book.png
   book-active.png
   chart.png
   chart-active.png
   user.png
   user-active.png
   ```

5. 在 `src/app.config.ts` 中恢复图标配置：
   ```typescript
   tabBar: {
     list: [
       {
         pagePath: 'pages/home/index',
         text: '明日菜单',
         iconPath: 'assets/icons/calendar.png',
         selectedIconPath: 'assets/icons/calendar-active.png'
       },
       // ... 其他配置
     ]
   }
   ```

6. 重新构建：`npm run build:weapp`

## 方法 2：使用在线工具生成

访问 https://icon-icons.com/ 或 https://icons8.com/
- 搜索图标
- 下载 PNG 格式
- 调整尺寸为 81x81px
- 修改颜色

## 方法 3：使用 Figma/Sketch 设计

如果你有设计工具，可以自己设计简单的图标：
- 画布尺寸：81x81px
- 图标尺寸：建议 48x48px 居中
- 导出为 PNG

## 方法 4：暂时不使用图标

当前配置已经移除了图标，只显示文字。这在开发阶段是可以接受的。

## 快速测试用图标

如果只是想快速测试，可以使用任意 81x81px 的图片：
```bash
# 在 assets/icons 目录下
curl -o calendar.png "https://via.placeholder.com/81/C1C1C1/FFFFFF?text=📅"
curl -o calendar-active.png "https://via.placeholder.com/81/FFAB73/FFFFFF?text=📅"
curl -o book.png "https://via.placeholder.com/81/C1C1C1/FFFFFF?text=📖"
curl -o book-active.png "https://via.placeholder.com/81/FFAB73/FFFFFF?text=📖"
curl -o chart.png "https://via.placeholder.com/81/C1C1C1/FFFFFF?text=📊"
curl -o chart-active.png "https://via.placeholder.com/81/FFAB73/FFFFFF?text=📊"
curl -o user.png "https://via.placeholder.com/81/C1C1C1/FFFFFF?text=👤"
curl -o user-active.png "https://via.placeholder.com/81/FFAB73/FFFFFF?text=👤"
```

## 注意事项

1. 图标必须是本地文件，不能使用网络图片
2. 推荐尺寸：81x81px（@3x）或 54x54px（@2x）
3. 格式：PNG（支持透明背景）
4. 文件大小：建议每个图标 < 40KB
5. 路径：相对于项目根目录的路径

## 当前状态

✅ TabBar 功能正常（只显示文字）
⏳ 等待添加图标文件
