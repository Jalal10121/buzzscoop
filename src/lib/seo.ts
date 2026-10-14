import type { Post } from "./mdx";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function extractTags(post: Post): string[] {
  const tags: string[] = [post.category.toLowerCase()];
  if (post.tags && post.tags.length > 0) {
    post.tags.forEach((t) => {
      const normalized = t.toLowerCase();
      if (!tags.includes(normalized)) tags.push(normalized);
    });
  }
  const text = (post.title + " " + post.description).toLowerCase();
  const commonTags = [
    "netflix", "hollywood", "marvel", "dc", "disney", "hbo",
    "amazon", "apple", "music", "movie", "tv", "streaming",
    "review", "trailer", "release", "cast", "series", "film",
    "awards", "celebrity", "actor", "actress", "director",
  ];
  commonTags.forEach((tag) => {
    if (text.includes(tag) && !tags.includes(tag)) tags.push(tag);
  });
  return tags;
}

export function getAllTags(posts: Post[]) {
  const map = new Map<string, number>();
  posts.forEach((p) => extractTags(p).forEach((t) => map.set(t, (map.get(t) || 0) + 1)));
  return Array.from(map.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export function getPostsByTag(posts: Post[], tag: string) {
  return posts.filter((p) => extractTags(p).includes(tag.toLowerCase()));
}

export function getArchives(posts: Post[]) {
  const map = new Map<string, number>();
  posts.forEach((p) => {
    const d = new Date(p.date);
    const k = `${d.getFullYear()}-${d.getMonth() + 1}`;
    map.set(k, (map.get(k) || 0) + 1);
  });
  return Array.from(map.entries())
    .map(([k, c]) => {
      const [year, month] = k.split("-").map(Number);
      return { year, month, count: c };
    })
    .sort((a, b) => b.year - a.year || b.month - a.month);
}

export function getPostsByYearMonth(posts: Post[], y: number, m: number) {
  return posts.filter((p) => {
    const d = new Date(p.date);
    return d.getFullYear() === y && d.getMonth() + 1 === m;
  });
}

export function getRelatedPosts(currentPost: Post, allPosts: Post[], limit = 3): Post[] {
  return allPosts
    .filter((p) => p.slug !== currentPost.slug)
    .map((post) => {
      let score = 0;
      if (post.category === currentPost.category) score += 10;
      const currentTags = extractTags(currentPost);
      const postTags = extractTags(post);
      currentTags.forEach((tag) => {
        if (postTags.includes(tag)) score += 1;
      });
      return { post, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.post);
}