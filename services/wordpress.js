import { WP_BASE } from '../constants/config';

/**
 * Fetches posts from the WordPress API with embedding for featured media and categories.
 * @param {number} page - The page number to fetch.
 * @param {number} perPage - Number of posts per page.
 * @returns {Promise<Array>} - The array of WordPress posts.
 */
export async function fetchPosts(page = 1, perPage = 10) {
    try {
        const response = await fetch(
            `${WP_BASE}/posts?page=${page}&per_page=${perPage}&_embed`
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch posts');
        }

        return await response.json();
    } catch (error) {
        console.error('WordPress API Error:', error);
        throw error;
    }
}
