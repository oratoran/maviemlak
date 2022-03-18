export const makeBlurDataUri = (mimeType: string, data: string) =>
  `data:${mimeType}; base64, ${data}`;
