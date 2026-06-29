import { http, HttpResponse } from 'msw';
import type { DashboardData } from '@/features/dashboard/types/dashboard.types';

const mockDashboardData: DashboardData = {
  stats: [
    { id: 'headcount', label: 'Total Headcount', value: 142, change: 8, trend: 'up' },
    { id: 'new-hires', label: 'New Hires (30d)', value: 12, change: 20, trend: 'up' },
    { id: 'open-roles', label: 'Open Roles', value: 7, change: -3, trend: 'down' },
    { id: 'retention', label: 'Retention Rate', value: '94.2', unit: '%', change: 1.1, trend: 'up' },
  ],
  recentActivity: [
    { id: 'a1', userId: 'user-1', userName: 'Alex Rivera', userAvatar: 'https://i.pravatar.cc/150?u=admin', action: 'onboarded', target: 'Jordan Liu • Engineering', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
    { id: 'a2', userId: 'user-2', userName: 'Morgan Chen', userAvatar: 'https://i.pravatar.cc/150?u=manager', action: 'promoted', target: 'Casey Kim to Senior Designer', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
    { id: 'a3', userId: 'user-3', userName: 'Sam Taylor', userAvatar: 'https://i.pravatar.cc/150?u=employee', action: 'updated', target: 'Q3 performance review', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
    { id: 'a4', userId: 'user-1', userName: 'Alex Rivera', userAvatar: 'https://i.pravatar.cc/150?u=admin', action: 'closed', target: 'Backend Engineer role', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'a5', userId: 'user-2', userName: 'Morgan Chen', userAvatar: 'https://i.pravatar.cc/150?u=manager', action: 'scheduled', target: 'All-hands meeting', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
  ],
};

export const dashboardHandlers = [
  http.get('/api/dashboard', () => {
    return HttpResponse.json(mockDashboardData);
  }),
];
