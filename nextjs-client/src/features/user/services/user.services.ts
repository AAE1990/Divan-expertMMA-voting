import { IUser, ILeaderboardResponse } from "@/features/auth/types"
import { api } from "@/shared/api"
import { TypeSettingsSchema } from "../schemes"

class UserService {
    public async findProfile(page?: number, limit?: number) {
        const params = new URLSearchParams();
        if (page !== undefined) params.append('page', page.toString());
        if (limit !== undefined) params.append('limit', limit.toString());
        const query = params.toString() ? `?${params.toString()}` : '';
        const response = await api.get<IUser>(`users/profile${query}`)

        return response
    }

    public async updateProfile(body: TypeSettingsSchema) {
        const response = await api.patch<IUser>('users/profile', body)

        return response
    }

    public async getPublicProfile(id: string, page?: number, limit?: number) {
        const params = new URLSearchParams();
        if (page !== undefined) params.append('page', page.toString());
        if (limit !== undefined) params.append('limit', limit.toString());
        const query = params.toString() ? `?${params.toString()}` : '';
        const response = await api.get<IUser>(`users/public/${id}${query}`)
    
        return response
    }

    public async getLeaderboard(page?: number, limit?: number, period?: 'all' | 'month' | 'week') {
        const params = new URLSearchParams();
        if (page !== undefined) params.append('page', page.toString());
        if (limit !== undefined) params.append('limit', limit.toString());
        if (period !== undefined) params.append('period', period);
        const query = params.toString() ? `?${params.toString()}` : '';
        const response = await api.get<ILeaderboardResponse>(`users/leaderboard${query}`)
    
        return response
    }
}

export const userService = new UserService()
