import React from "react";
import { Chip, ChipProps } from "@mui/material";
import {
  PendingOutlined,
  RestaurantOutlined,
  LocalShippingOutlined,
  CheckCircleOutlined,
  CancelOutlined,
  PaymentOutlined,
  TimerOutlined,
} from "@mui/icons-material";

export type OrderStatus = 
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "picked_up"
  | "delivered"
  | "cancelled"
  | "refunded";

interface OrderStatusChipProps extends Omit<ChipProps, 'color'> {
  status: OrderStatus;
  showIcon?: boolean;
}

const OrderStatusChip: React.FC<OrderStatusChipProps> = ({
  status,
  showIcon = true,
  ...chipProps
}) => {
  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return {
          label: "Pending",
          color: "warning" as const,
          icon: showIcon ? <PendingOutlined /> : undefined,
        };
      case "confirmed":
        return {
          label: "Confirmed",
          color: "info" as const,
          icon: showIcon ? <CheckCircleOutlined /> : undefined,
        };
      case "preparing":
        return {
          label: "Preparing",
          color: "primary" as const,
          icon: showIcon ? <RestaurantOutlined /> : undefined,
        };
      case "ready":
        return {
          label: "Ready",
          color: "secondary" as const,
          icon: showIcon ? <TimerOutlined /> : undefined,
        };
      case "picked_up":
        return {
          label: "Picked Up",
          color: "info" as const,
          icon: showIcon ? <LocalShippingOutlined /> : undefined,
        };
      case "delivered":
        return {
          label: "Delivered",
          color: "success" as const,
          icon: showIcon ? <CheckCircleOutlined /> : undefined,
        };
      case "cancelled":
        return {
          label: "Cancelled",
          color: "error" as const,
          icon: showIcon ? <CancelOutlined /> : undefined,
        };
      case "refunded":
        return {
          label: "Refunded",
          color: "default" as const,
          icon: showIcon ? <PaymentOutlined /> : undefined,
        };
      default:
        return {
          label: "Unknown",
          color: "default" as const,
          icon: undefined,
        };
    }
  };

  const { label, color, icon } = getStatusConfig(status);

  return (
    <Chip
      label={label}
      color={color}
      variant="filled"
      size="small"
      icon={icon}
      {...chipProps}
    />
  );
};

export default OrderStatusChip;

// Helper function to get all possible order statuses
export const getAllOrderStatuses = (): OrderStatus[] => [
  "pending",
  "confirmed", 
  "preparing",
  "ready",
  "picked_up",
  "delivered",
  "cancelled",
  "refunded",
];

// Helper function to get status progression
export const getOrderStatusProgression = (currentStatus: OrderStatus): OrderStatus[] => {
  const allStatuses = getAllOrderStatuses();
  const currentIndex = allStatuses.indexOf(currentStatus);
  
  // Return statuses up to current (excluding cancelled and refunded)
  const normalFlow = ["pending", "confirmed", "preparing", "ready", "picked_up", "delivered"];
  const currentNormalIndex = normalFlow.indexOf(currentStatus);
  
  if (currentNormalIndex !== -1) {
    return normalFlow.slice(0, currentNormalIndex + 1) as OrderStatus[];
  }
  
  return [currentStatus];
};

// Helper function to check if status is final
export const isFinalStatus = (status: OrderStatus): boolean => {
  return ["delivered", "cancelled", "refunded"].includes(status);
};

// Helper function to get next possible statuses
export const getNextPossibleStatuses = (currentStatus: OrderStatus): OrderStatus[] => {
  switch (currentStatus) {
    case "pending":
      return ["confirmed", "cancelled"];
    case "confirmed":
      return ["preparing", "cancelled"];
    case "preparing":
      return ["ready", "cancelled"];
    case "ready":
      return ["picked_up", "cancelled"];
    case "picked_up":
      return ["delivered"];
    case "delivered":
      return ["refunded"];
    case "cancelled":
      return ["refunded"];
    case "refunded":
      return [];
    default:
      return [];
  }
}; 