import { WP_BASE } from '../constants/config';

/**
 * Fetches posts from the WordPress API with embedding for featured media and categories.
 * @param {number} page - The page number to fetch.
 * @param {number} perPage - Number of posts per page.
 * @returns {Promise<Array>} - The array of WordPress posts.
 */
export async function fetchPosts(page = 1, perPage = 10, categoryId = null) {
    try {
        let url = `${WP_BASE}/posts?page=${page}&per_page=${perPage}&_embed`;

        if (categoryId) {
            url += `&categories=${categoryId}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch posts');
        }

        const posts = await response.json();

        // Extra Step: Fetch full media data to get guid.rendered (JPG) as requested
        const mediaIds = posts
            .map(post => post.featured_media)
            .filter(id => id && id > 0);

        if (mediaIds.length > 0) {
            try {
                const mediaResponse = await fetch(
                    `${WP_BASE.replace('/v2', '')}/v2/media?include=${mediaIds.join(',')}`
                );
                if (mediaResponse.ok) {
                    const mediaData = await mediaResponse.json();
                    // Attach full media object to each post for transformation
                    posts.forEach(post => {
                        const fullMedia = mediaData.find(m => m.id === post.featured_media);
                        if (fullMedia) {
                            post._full_media = fullMedia;
                        }
                    });
                }
            } catch (mediaError) {
                console.warn('Failed to fetch extra media data:', mediaError);
                // Fallback will happen in transformPost
            }
        }

        return posts;
    } catch (error) {
        console.error('WordPress API Error:', error);
        throw error;
    }
}

/**
 * Fetches a single post by ID and includes its full media data.
 * @param {string|number} id - The post ID.
 * @returns {Promise<Object>} - The post object.
 */
export async function fetchPostById(id) {
    try {
        const response = await fetch(`${WP_BASE}/posts/${id}?_embed`);
        if (!response.ok) throw new Error('Post not found');

        const post = await response.json();

        if (post.featured_media > 0) {
            try {
                const mediaResponse = await fetch(`${WP_BASE.replace('/v2', '')}/v2/media/${post.featured_media}`);
                if (mediaResponse.ok) {
                    post._full_media = await mediaResponse.json();
                }
            } catch (mediaError) {
                console.warn('Failed to fetch full media for post detail:', mediaError);
            }
        }

        return post;
    } catch (error) {
        console.error('WordPress API Error (Single Post):', error);
        throw error;
    }
}
