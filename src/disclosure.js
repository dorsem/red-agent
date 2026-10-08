export const disclosureText = config => (config.disclosure ?? '').trim();

export function disclosureFooter(config) {
  const text = disclosureText(config);
  return text ? `\n\n---\n${text}` : '';
}
