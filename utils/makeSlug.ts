export const makeSlug = (slug: string) => {
  if(slug.startsWith('en-')) return slug.substring('en-'.length);

  return slug;
}