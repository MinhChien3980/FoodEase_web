# 🛒 Hướng dẫn Giỏ hàng - Cart System

## 📋 Tổng quan

Hệ thống giỏ hàng cho phép khách hàng:
- ➕ **Thêm** món ăn vào giỏ
- ✏️ **Sửa** số lượng món ăn
- 🗑️ **Xóa** món ăn khỏi giỏ
- 💾 **Lưu trữ** giỏ hàng trên server

## 🔧 Các chức năng chính

### 1. ➕ Thêm món vào giỏ hàng

**Cách hoạt động:**
1. User click nút "Thêm vào giỏ" trên menu item
2. Kiểm tra user đã đăng nhập chưa
3. Thêm vào giỏ local ngay lập tức (UX nhanh)
4. Đồng bộ với server trong background

**API Used:**
- `POST /api/cart-items` - Thêm item mới
- `PUT /api/cart-items/{id}` - Cập nhật số lượng nếu đã có

**Code Example:**
```typescript
// Thêm vào giỏ
addToCart(menuItem, () => {
  // Callback nếu chưa đăng nhập
  navigateToLogin();
});
```

---

### 2. ✏️ Sửa số lượng

**Cách thức:**
- **Nút +/-**: Tăng/giảm từng đơn vị
- **Input field**: Nhập trực tiếp số lượng
- **Auto-delete**: Xóa tự động khi số lượng = 0

**API Used:**
- `PUT /api/cart-items/{cartItemId}`

**Request Body:**
```json
{
  "cartId": 123,
  "menuItemId": 456,
  "quantity": 2
}
```

**Code Example:**
```typescript
// Cập nhật số lượng
updateQuantity(itemId, restaurantId, newQuantity);

// Nút tăng
onClick={() => updateQuantity(item.id, item.restaurantId, item.quantity + 1)}

// Nút giảm  
onClick={() => updateQuantity(item.id, item.restaurantId, item.quantity - 1)}
```

---

### 3. 🗑️ Xóa món khỏi giỏ

**Cách hoạt động:**
1. User click nút xóa (🗑️)
2. Xóa khỏi UI ngay lập tức
3. Gọi API xóa trên server

**API Used:**
- `DELETE /api/cart-items/{cartItemId}`

**Code Example:**
```typescript
// Xóa item
removeItem(itemId, restaurantId);

// Nút xóa
onClick={() => removeItem(item.id, item.restaurantId)}
```

---

## 🔄 Flow hoạt động

### Khi User đăng nhập:
```
1. Load cart từ server
2. Hiển thị items trong UI  
3. User thao tác (thêm/sửa/xóa)
4. Update UI ngay lập tức
5. Sync với server background
```

### Khi User chưa đăng nhập:
```
1. Hiển thị yêu cầu đăng nhập
2. Redirect đến login page
3. Sau khi login → load cart
```

---

## 🏗️ Cấu trúc Code

### 1. **CartContext** (`src/contexts/CartContext.tsx`)
```typescript
// Các method chính
const { 
  cart,           // Dữ liệu giỏ hàng
  addToCart,      // Thêm món
  updateQuantity, // Sửa số lượng  
  removeItem,     // Xóa món
} = useCart();
```

### 2. **CartService** (`src/services/cartService.ts`)
```typescript
// API calls
cartService.addCartItem(request)      // POST
cartService.updateCartItem(id, data)  // PUT  
cartService.deleteCartItem(id)        // DELETE
```

### 3. **CartPage** (`src/pages/customer/views/CartPage.tsx`)
```typescript
// UI Components
- Quantity controls (+/- buttons)
- Delete button
- Input field for quantity
```

---

## 📊 Cấu trúc dữ liệu

### Cart Item:
```typescript
interface ICartItem {
  id: number;              // Menu item ID
  name: string;            // Tên món
  price: number;           // Giá  
  quantity: number;        // Số lượng
  restaurantId: number;    // ID nhà hàng
  restaurantName: string;  // Tên nhà hàng
  imageUrl?: string;       // Hình ảnh
}
```

### Cart State:
```typescript
interface ICart {
  items: ICartItem[];      // Danh sách món
  totalItems: number;      // Tổng số lượng
  totalAmount: number;     // Tổng tiền
}
```

---

## 🔍 Debugging & Troubleshooting

### 1. **Xem console logs:**
```javascript
// Các log quan trọng
🛒 Adding item to cart: {...}
🔄 Updating cart item 5 quantity to: 2  
🗑️ Deleting cart item 5
✅ Successfully updated cart item
❌ Error: API error! code: undefined
```

### 2. **Kiểm tra Authentication:**
```javascript
// User phải đăng nhập
isCustomerAuthenticated() // → true/false
getCustomerUser()         // → user object
getCustomerCartId()       // → cart ID
```

### 3. **Common Issues:**

| Lỗi | Nguyên nhân | Giải pháp |
|-----|-------------|-----------|
| `code: undefined` | Server response format khác | Kiểm tra API response |
| Cart không sync | Authentication lỗi | Check login status |
| Item không update | CartItemId không tìm thấy | Refresh cart từ server |

---

## 🎯 Test Cases

### Test thêm món:
1. ✅ Đăng nhập → Thêm món → Kiểm tra UI + server
2. ✅ Chưa đăng nhập → Show login required
3. ✅ Thêm món đã có → Cập nhật quantity

### Test sửa số lượng:
1. ✅ Click +/- → Quantity thay đổi
2. ✅ Nhập số → Update quantity
3. ✅ Set quantity = 0 → Xóa item

### Test xóa món:
1. ✅ Click delete → Item biến mất
2. ✅ Kiểm tra server → Item đã bị xóa
3. ✅ Total amount/items update

---

## 📝 Notes

- **UX Priority**: UI update ngay lập tức, server sync background
- **Error Handling**: Không revert UI nếu server lỗi (UX tốt hơn)
- **Authentication**: Cart chỉ hoạt động khi đã đăng nhập
- **Data Consistency**: Periodic sync với server để đảm bảo đúng data

---

## 🚀 Cách sử dụng

1. **Import CartContext** trong component:
```typescript
import { useCart } from '../../../contexts/CartContext';
```

2. **Sử dụng các method**:
```typescript
const { addToCart, updateQuantity, removeItem } = useCart();
```

3. **Handle user actions**:
```typescript
// Thêm vào giỏ
<Button onClick={() => addToCart(menuItem)}>
  Thêm vào giỏ
</Button>

// Cập nhật số lượng
<IconButton onClick={() => updateQuantity(id, restaurantId, quantity + 1)}>
  <AddIcon />
</IconButton>

// Xóa item
<IconButton onClick={() => removeItem(id, restaurantId)}>
  <DeleteIcon />
</IconButton>
```

---

**🎉 Happy Coding!** 

*Document này sẽ được cập nhật khi có thay đổi trong hệ thống cart.* 