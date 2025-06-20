# API `/users/profile` - Hướng dẫn sử dụng

## Tổng quan (Overview)

API `/users/profile` được sử dụng để lấy thông tin hồ sơ của user đã đăng nhập thành công. API này yêu cầu JWT token trong header Authorization.

---

## Thông tin API

- **Endpoint**: `/users/profile`
- **Method**: `GET`
- **Base URL**: `http://localhost:8080/api`
- **Full URL**: `http://localhost:8080/api/users/profile`

---

## Authentication Required

### Cách token được gửi (How token is sent)

Token được gửi trong header `Authorization` với format:
```
Authorization: Bearer <jwt_token>
```

### Cách token được lưu trữ trong ứng dụng

1. **Sau khi login thành công**:
   - Token được lưu vào `sessionStorage` với key `customer_token`
   - User data được lưu vào `sessionStorage` với key `customer_user`

2. **Automatic token inclusion**:
   - `apiClient` tự động thêm token vào mỗi request thông qua interceptor
   - Code trong `src/services/apiClient.ts`:
   ```typescript
   const token = sessionStorage.getItem('customer_token');
   if (token) {
     config.headers.Authorization = `Bearer ${token}`;
   }
   ```

---

## Cách sử dụng (Usage)

### 1. Trong CustomerLogin.tsx

```typescript
// Sau khi login thành công
const response = await authService.login({ email, password });

if (response.code === 200 && response.data && response.data.authenticated) {
  // Lưu token
  setCustomerToken(response.data.token);
  
  // Gọi API profile để lấy thông tin user
  const profileData = await userService.getProfile();
  
  if (profileData.code === 200) {
    setCustomerSession(response.data.token, profileData.data);
    navigate('/foodease/profile');
  }
}
```

### 2. Trong userService.ts

```typescript
export const userService = {
  getProfile: async (): Promise<ProfileResponse> => {
    // Token sẽ được tự động thêm vào header bởi apiClient interceptor
    const response: AxiosResponse<ProfileResponse> = await apiClient.get(API_ENDPOINTS.USERS.PROFILE);
    return response.data;
  },
};
```

---

## Response Format

### Successful Response (200)
```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "id": 123,
    "email": "user@example.com",
    "fullName": "John Doe",
    "phone": "+84123456789",
    "cityId": 1,
    "langKey": "vi"
  }
}
```

### Error Response (401 - Unauthorized)
```json
{
  "code": 401,
  "message": "Unauthorized",
  "data": null
}
```

### Error Response (403 - Forbidden)
```json
{
  "code": 403,
  "message": "Forbidden",
  "data": null
}
```

---

## Flow hoạt động (Workflow)

1. **User login**:
   ```
   POST /auth/token → Trả về JWT token
   ```

2. **Lưu token**:
   ```typescript
   sessionStorage.setItem('customer_token', token);
   ```

3. **Gọi profile API**:
   ```
   GET /users/profile
   Headers: Authorization: Bearer <token>
   ```

4. **API response**:
   ```json
   {
     "code": 200,
     "data": { user_profile_data }
   }
   ```

5. **Lưu session hoàn chỉnh**:
   ```typescript
   setCustomerSession(token, profileData);
   ```

---

## Error Handling

### 1. Token không hợp lệ (Invalid Token)
- API trả về status 401
- `apiClient` interceptor tự động xóa session:
  ```typescript
  sessionStorage.removeItem('customer_token');
  sessionStorage.removeItem('customer_user');
  ```

### 2. Token hết hạn (Expired Token)
- Tương tự như token không hợp lệ
- User sẽ được redirect về trang login

### 3. Network Error
- Hiển thị thông báo lỗi cho user
- Không xóa session (token có thể vẫn hợp lệ)

---

## Code Examples

### Validate Token
```typescript
// Trong sessionManager.ts
export const validateStoredToken = async (): Promise<boolean> => {
  const token = getCustomerToken();
  
  if (!token) return false;

  try {
    const response = await fetch('http://localhost:8080/api/users/profile', {
      method: 'GET',
      headers: {
        'accept': '*/*',
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      if (data.code === 200) {
        setCustomerUser(data.data);
        return true;
      }
    }
    
    clearCustomerSession();
    return false;
  } catch (error) {
    console.error('Token validation failed:', error);
    return false;
  }
};
```

### Auto Login Check
```typescript
// Trong CustomerLogin.tsx useEffect
useEffect(() => {
  const checkExistingSession = async () => {
    try {
      const result = await autoLoginIfTokenExists();
      if (result.success) {
        navigate('/foodease/profile');
        return;
      }
    } catch (error) {
      console.error('Session check failed:', error);
    }
  };

  checkExistingSession();
}, []);
```

---

## Security Notes

1. **Token Storage**: Token được lưu trong `sessionStorage` (bảo mật hơn `localStorage`)
2. **Token Expiry**: Token tự động bị xóa khi đóng browser tab
3. **HTTPS**: Trong production nên sử dụng HTTPS để bảo vệ token
4. **Token Validation**: Luôn validate token trước khi sử dụng

---

## Troubleshooting

### Problem: API returns 401 even with token

**Possible causes:**
1. Token bị expired
2. Token format không đúng
3. Server không recognize token

**Solutions:**
1. Check token trong sessionStorage
2. Verify token format: `Bearer <token>`
3. Check server logs
4. Re-login để lấy token mới

### Problem: Token không được gửi trong request

**Possible causes:**
1. Token không được lưu đúng cách
2. apiClient interceptor có vấn đề

**Solutions:**
1. Check `sessionStorage.getItem('customer_token')`
2. Verify apiClient interceptor code
3. Check network tab trong DevTools 