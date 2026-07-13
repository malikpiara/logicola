export function formatTextTypography(text: string) {
  return text
    .replace(/\.{3}/g, '…')
    .replace(/(\p{L})'(\p{L})/gu, '$1’$2')
    .replace(/(^|[\s([{])"([^"]+)"/g, '$1“$2”')
    .replace(/(^|[\s([{])'([^']+)'/g, '$1‘$2’');
}
