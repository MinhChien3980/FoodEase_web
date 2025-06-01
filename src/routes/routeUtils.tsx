import { ReactNode } from "react";
import MopedOutlined from "@mui/icons-material/MopedOutlined";
import Dashboard from "@mui/icons-material/Dashboard";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import FastfoodOutlinedIcon from "@mui/icons-material/FastfoodOutlined";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import StoreOutlinedIcon from "@mui/icons-material/StoreOutlined";

// Types for route configuration
export interface RouteResource {
  name: string;
  list?: string;
  create?: string;
  edit?: string;
  show?: string;
  meta?: {
    label?: string;
    icon?: ReactNode;
  };
}

export interface RouteConfig {
  path: string;
  component: string;
  public?: boolean;
  requiresAuth?: boolean;
}

export interface RouteGroup {
  public: string[];
  protected: string[];
  auth?: string[];
}

// Helper function to get resource icons
export function getResourceIcon(resourceName: string): ReactNode {
  const iconMap: Record<string, ReactNode> = {
    dashboard: <Dashboard />,
    orders: <ShoppingBagOutlinedIcon />,
    users: <AccountCircleOutlinedIcon />,
    products: <FastfoodOutlinedIcon />,
    categories: <LabelOutlinedIcon />,
    stores: <StoreOutlinedIcon />,
    couriers: <MopedOutlined />,
  };
  
  return iconMap[resourceName] || <Dashboard />;
}

// Enhanced resources with icons
export function enhanceResourcesWithIcons(resources: RouteResource[]): RouteResource[] {
  return resources.map((resource) => ({
    ...resource,
    meta: {
      ...resource.meta,
      icon: getResourceIcon(resource.name),
    },
  }));
}

// Route validation helper
export function isPublicRoute(path: string, routeGroups: RouteGroup): boolean {
  return routeGroups.public.includes(path);
}

export function isProtectedRoute(path: string, routeGroups: RouteGroup): boolean {
  return routeGroups.protected.includes(path);
}

// Route constants for better maintainability
export const ADMIN_PREFIX = '/admin';
export const CUSTOMER_PREFIX = '/foodease';
export const AUTH_PREFIX = '/';

// Route builders
export function buildAdminRoute(path: string): string {
  return `${ADMIN_PREFIX}${path === '' ? '' : `/${path}`}`;
}

export function buildCustomerRoute(path: string): string {
  return `${CUSTOMER_PREFIX}${path === '' ? '' : `/${path}`}`;
}

export function buildAuthRoute(path: string): string {
  return `${AUTH_PREFIX}${path}`;
} 