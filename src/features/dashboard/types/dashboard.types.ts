export interface DashboardStat {
  id: string;
  label: string;
  value: number | string;
  change: number; // percentage change vs last period
  trend: 'up' | 'down' | 'neutral';
  unit?: string;
}

export interface ActivityItem {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string | null;
  action: string;
  target: string;
  timestamp: string; // ISO 8601
}

export interface DashboardData {
  stats: DashboardStat[];
  recentActivity: ActivityItem[];
}
