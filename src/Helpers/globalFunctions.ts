import slugify from "slugify";

export const createSlug = (str: string) => {
  return slugify(str, {
    replacement: "-",
    remove: undefined,
    lower: true,
    strict: true,
    locale: "en",
    trim: true,
  });
}
