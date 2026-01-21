import { decode } from 'html-entities';

/**
 * Transforms a raw WordPress post object into a normalized News object for the app.
 * @param {Object} wpPost - The raw post data from WP API.
 * @returns {Object} - The normalized news object.
 */
export function transformPost(wpPost) {
    // Determine the best image URL
    const avifImage = wpPost.uagb_featured_image_src?.full?.[0];
    const embeddedMedia = wpPost._embedded?.['wp:featuredmedia']?.[0];
    const standardImage = embeddedMedia?.source_url;

    // Look through all sizes for a non-avif fallback
    let fallbackImage = null;
    if (embeddedMedia?.media_details?.sizes) {
        const sizes = Object.values(embeddedMedia.media_details.sizes);
        const nonAvif = sizes.find(size => !size.source_url.toLowerCase().endsWith('.avif'));
        if (nonAvif) fallbackImage = nonAvif.source_url;
    }

    // featuredImage logic: try standard first, then fallback, then avif.
    const featuredImage = standardImage || fallbackImage || avifImage || 'https://millattimes.com/wp-content/uploads/2021/06/Millat-Times-Logo.jpg';

    // Get categories
    const categories = wpPost._embedded?.['wp:term']?.[0]?.map(term => term.name) || ['News'];

    return {
        id: wpPost.id.toString(),
        category: categories[0],
        headline: decode(wpPost.title.rendered),
        image: featuredImage,
        time: formatWPDate(wpPost.date),
        content: wpPost.content.rendered,
        link: wpPost.link
    };
}

/**
 * Helper to format WP date string to a more readable relative time or simple date.
 */
function formatWPDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString();
}
