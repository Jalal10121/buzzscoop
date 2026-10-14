export type Role = "admin" | "editor" | "writer" | "reader";

export const PERMISSIONS = {
  admin: [
    "articles.create", "articles.edit", "articles.delete", "articles.publish",
    "comments.moderate", "users.manage", "settings.manage", "analytics.view",
    "media.upload", "media.delete", "newsletter.manage",
  ],
  editor: [
    "articles.create", "articles.edit", "articles.publish",
    "comments.moderate", "analytics.view", "media.upload",
  ],
  writer: [
    "articles.create", "articles.edit",
    "media.upload",
  ],
  reader: [],
} as const;

export function can(role: Role, permission: string): boolean {
  return (PERMISSIONS[role] as readonly string[]).includes(permission);
}

export function getRoleBadge(role: Role): { label: string; color: string } {
  const badges = {
    admin: { label: "Admin", color: "bg-red-100 text-red-800" },
    editor: { label: "Editor", color: "bg-purple-100 text-purple-800" },
    writer: { label: "Writer", color: "bg-blue-100 text-blue-800" },
    reader: { label: "Reader", color: "bg-gray-100 text-gray-800" },
  };
  return badges[role] || badges.reader;
}