export function createSlug(str: string) {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove non-word characters (excluding spaces and hyphens)
    .replace(/[\s]+/g, "-") // Replace spaces with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading and trailing hyphens
}
