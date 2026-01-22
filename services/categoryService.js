import { WP_BASE } from '../constants/config';

/**
 * Fetches all categories from WordPress API.
 * @returns {Promise<Array>} - Array of category objects.
 */
export async function fetchCategories() {
    try {
        const response = await fetch(`${WP_BASE}/categories?per_page=100`);
        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

/**
 * Resolves category IDs from a list of slugs.
 * @param {Array} categories - The full list of categories from API.
 * @param {Array} slugs - The list of slugs to find.
 * @returns {Object} - A mapping of slug to ID.
 */
export function resolveCategoryIds(categories, slugs) {
    const mapping = {};
    slugs.forEach(slug => {
        const category = categories.find(c => c.slug === slug);
        if (category) {
            mapping[slug] = category.id;
        }
    });
    console.log(mapping)
    return mapping;
}
