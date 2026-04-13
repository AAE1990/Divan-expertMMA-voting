import { FetchClient } from "../utils"

// 1. Берем URL из .env (теперь с NEXT_PUBLIC_)
const rawUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:4000';

// 2. Гарантируем, что Base URL ЗАКОНЧИТСЯ на слэш
const baseUrl = rawUrl.endsWith('/') ? rawUrl : `${rawUrl}/`;

export const api = new FetchClient({
    baseUrl: baseUrl,
    options: {
        credentials: 'include',
    }
})
