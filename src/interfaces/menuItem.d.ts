export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  restaurantId: number;
  categoryId: number;
}

export interface MenuItemWithRestaurant extends MenuItem {
  restaurantName: string;
} 