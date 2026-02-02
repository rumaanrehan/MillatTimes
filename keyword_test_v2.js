const WP_BASE = "https://millattimes.com/wp-json/wp/v2";
const STOP_WORDS = new Set([
    "the", "in", "and", "for", "with", "this", "that", "from", "into", "onto", "upon", "about", "after", "again", "against", "all", "any", "are", "because", "been", "before", "being", "below", "between", "both", "but", "could", "did", "does", "doing", "down", "during", "each", "few", "more", "most", "other", "some", "such", "than", "too", "very", "will", "just", "should", "your", "them", "then", "there", "these", "they", "which", "who", "whom", "will", "with", "you", "your",
    "है", "हैं", "को", "से", "पर", "और", "भी", "ने", "हो", "था", "थी", "थे", "सब", "अब", "जो", "कर", "किया", "करने", "होने", "रहा", "रहे", "रही", "हुआ", "हुए", "हुई", "गया", "गए", "गई",
    "کے", "کا", "کی", "میں", "ہے", "ہیں", "کو", "سے", "پر", "اور", "بھی", "نے", "ہو", "تھا", "تھی", "تھے", "سب", "اب", "جو", "کر", "کیا", "کرنے", "ہونے", "رہا", "رہے", "رہی", "ہوا", "ہوئے", "ہوئی", "گیا", "گئے", "گئی"
]);
const IGNORE_TERMS = new Set(["dr.", "mr.", "mrs.", "ms.", "prof.", "shri", "smt", "latest", "update", "breaking", "news"]);

function extractKeyword(headline) {
    // Decode HTML entities and strip smart quotes/advanced punctuation
    const decoded = headline
        .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/[‘’“”〝〞"']/g, ""); // Remove all types of quotes first

    const colonParts = decoded.split(':');
    if (colonParts.length > 1) {
        const term = colonParts[0].trim().split(/\s+/)[0].replace(/[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/g, "");
        if (term.length > 2 && !IGNORE_TERMS.has(term.toLowerCase())) return term;
    }
    const words = decoded.replace(/[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/g, " ").split(/\s+/).filter(w => w.length > 2);
    const filtered = words.filter(w => !STOP_WORDS.has(w.toLowerCase()) && !IGNORE_TERMS.has(w.toLowerCase()));
    if (filtered.length === 0) return words[0] || "";
    const capitalized = filtered.filter(w => /^[A-Z][a-z]/.test(w));
    if (capitalized.length > 0) return capitalized[0];
    return filtered.sort((a, b) => b.length - a.length)[0];
}

async function test() {
    const res = await fetch(`${WP_BASE}/posts?per_page=20`);
    const posts = await res.json();
    const keywords = [...new Set(posts.map(p => extractKeyword(p.title.rendered)))].filter(k => k.length > 2).slice(0, 8);
    console.log(JSON.stringify(keywords, null, 2));
}
test();
