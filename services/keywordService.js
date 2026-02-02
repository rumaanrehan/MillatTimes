import { WP_BASE } from '../constants/config';

const STOP_WORDS = new Set([
    // English
    "the", "in", "and", "for", "with", "this", "that", "from", "into", "onto", "upon", "about", "after", "again", "against", "all", "any", "are", "because", "been", "before", "being", "below", "between", "both", "but", "could", "did", "does", "doing", "down", "during", "each", "few", "more", "most", "other", "some", "such", "than", "too", "very", "will", "just", "should", "your", "them", "then", "there", "these", "they", "which", "who", "whom", "will", "with", "you", "your",
    // Hindi
    "है", "हैं", "को", "से", "पर", "और", "भी", "ने", "हो", "था", "थी", "थे", "सब", "अब", "जो", "कर", "किया", "करने", "होने", "रहा", "रहे", "रही", "हुआ", "हुए", "हुई", "गया", "गए", "गई",
    // Urdu
    "کے", "کا", "کی", "میں", "ہے", "ہیں", "کو", "سے", "پر", "اور", "بھی", "نے", "ہو", "تھا", "تھی", "تھے", "سب", "اب", "جو", "کر", "کیا", "کرنے", "ہونے", "رہا", "رہے", "رہی", "ہوا", "ہوئے", "ہوئی", "گیا", "گئے", "گئی"
]);

const IGNORE_TERMS = new Set([
    "dr.", "mr.", "mrs.", "ms.", "prof.", "shri", "smt", "latest", "update", "breaking", "news"
]);

/**
 * Extracts the most "important" word from a headline.
 */
function extractKeyword(headline) {
    // Decode HTML entities and strip smart quotes/advanced punctuation
    const decoded = headline
        .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/[‘’“”〝〞"']/g, ""); // Remove all types of quotes first

    // 1. Heuristic: Word before a colon is usually the location or main topic
    const colonParts = decoded.split(':');
    if (colonParts.length > 1) {
        const term = colonParts[0].trim().split(/\s+/)[0].replace(/[!"#$%&'()*+,./:;<=>?@[\\\]^_`{|}~]/g, "");
        if (term.length > 2 && !IGNORE_TERMS.has(term.toLowerCase())) return term;
    }

    // 2. Normalize and split (keeping hyphens for now to capture compound words)
    const words = decoded
        .replace(/[!"#$%&'()*+,./:;<=>?@[\\\]^_`{|}~]/g, " ")
        .split(/\s+/)
        .filter(w => w.length > 2);

    // 3. Filter stop words & ignore terms
    const filtered = words.filter(w => {
        // Extra clean for leading/trailing hyphens
        const cleanWord = w.replace(/^-+|-+$/g, "");
        if (cleanWord.length <= 2) return false;
        const lower = cleanWord.toLowerCase();
        return !STOP_WORDS.has(lower) && !IGNORE_TERMS.has(lower);
    });

    if (filtered.length === 0) return words[0]?.replace(/^-+|-+$/g, "") || "";

    // 4. Heuristic: Proper nouns (Capitalized in Roman script)
    const capitalized = filtered.filter(w => /^[A-Z]/.test(w));
    if (capitalized.length > 0) return capitalized[0].replace(/^-+|-+$/g, "");

    // 5. Fallback: Longest word
    return filtered.sort((a, b) => b.length - a.length)[0].replace(/^-+|-+$/g, "");
}

/**
 * Fetches latest news and generates popular search keywords.
 */
export async function getPopularKeywords() {
    try {
        const response = await fetch(`${WP_BASE}/posts?per_page=20`);
        if (!response.ok) return [];

        const posts = await response.json();

        const rawKeywords = posts.map(post => {
            return extractKeyword(post.title.rendered);
        }).filter(k => k && k.length > 2);

        // Keep unique results and return top 8
        const uniqueKeywords = [...new Set(rawKeywords)];
        return uniqueKeywords.slice(0, 8);
    } catch (error) {
        console.error("Failed to generate popular keywords:", error);
        return [];
    }
}
