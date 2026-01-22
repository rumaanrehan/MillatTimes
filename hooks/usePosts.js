import { useCallback, useEffect, useState } from 'react';
import { fetchPosts } from '../services/wordpress';
import { transformPost } from '../utils/wpTransform';

/**
 * Custom hook to fetch and manage WordPress posts with pagination.
 */
export function usePosts(perPage = 10, categoryId = null) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const loadPosts = useCallback(async (pageNum, isRefreshing = false) => {
        if (loading || (pageNum > 1 && !hasMore && !isRefreshing)) return;

        setLoading(true);
        setError(null);

        try {
            const rawPosts = await fetchPosts(pageNum, perPage, categoryId);

            if (rawPosts.length < perPage) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }

            const transformedPosts = rawPosts.map(transformPost);

            if (isRefreshing || pageNum === 1) {
                setPosts(transformedPosts);
            } else {
                setPosts(prev => [...prev, ...transformedPosts]);
            }

            setPage(pageNum);
        } catch (err) {
            setError(err.message || 'Error loading posts');
            console.error('usePosts Hook Error:', err);
        } finally {
            setLoading(false);
            if (isRefreshing) setRefreshing(false);
        }
    }, [loading, hasMore, perPage, categoryId]);

    // Initial load and reload on category change
    useEffect(() => {
        setPosts([]); // Clear posts to show loading state
        setPage(1);
        setHasMore(true);
        loadPosts(1, true);
    }, [categoryId]);

    const refresh = useCallback(() => {
        setRefreshing(true);
        loadPosts(1, true);
    }, [loadPosts]);

    const loadMore = useCallback(() => {
        if (!loading && hasMore) {
            loadPosts(page + 1);
        }
    }, [loading, hasMore, page, loadPosts]);

    return {
        posts,
        loading,
        refreshing,
        error,
        refresh,
        loadMore,
        hasMore
    };
}
