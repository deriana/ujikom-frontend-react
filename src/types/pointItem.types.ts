import { UUID } from "./common";
import { PowerUpType } from "@/constants/PointPowerUpItem";

export type PointItemCategory = "VOUCHER" | "GOODS" | "SERVICE";

export interface PointItem {
  uuid: UUID;
  name: string;
  slug: string;
  description: string | null;
  required_points: number;
  stock: number;
  power_up_type: PowerUpType | null;
  category: PointItemCategory;
  system_reserve: boolean;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PointItemInput {
  uuid?: UUID;
  name: string;
  description?: string | null;
  required_points: number;
  stock: number;
  power_up_type?: PowerUpType | null;
  category?: PointItemCategory | null;
  is_active?: boolean;
  image?: File | null;
}

export interface PointInventory {
  uuid: UUID;
  item_uuid: UUID;
  item_name: string;
  category: PointItemCategory;
  power_up_type: PowerUpType | null;
  description: string | null;
  image_url: string | null;
  is_used: boolean;
  obtained_at: string;
  expired_at: string | null;
}