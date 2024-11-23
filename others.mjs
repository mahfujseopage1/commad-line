import linkifyHtml from 'linkify-html';

function cleanUpMalformedAnchors(text) {
  return text.replace(/<a\s+href="([^"]+)"[^>]*>([^<]*<a\s+href="[^"]+"[^>]*>[^<]*<\/a>[^<]*)<\/a>/gi, (match, p1, p2) => {
    return `<a href="${p1}" target="_blank">${p1}</a>`;
  });
}

export function formatHttp(text) {
  if (!text) return text;
  let cleanedText = cleanUpMalformedAnchors(text);

  const options = {
    defaultProtocol: 'http',  // Ensure the default protocol is 'http'
    target: '_blank',
    validate: {
      url: (value) => {
        // Ensure we linkify all URLs that don't have href attribute already in the text
        const urlPattern = new RegExp(`href="[^"]*"`, 'i');
        return !urlPattern.test(cleanedText);
      },
    },
    formatHref: (href) => {
      // Add http:// if no protocol is present
      if (!href.startsWith('http://') && !href.startsWith('https://')) {
        return `http://${href}`;
      }
      return href;
    },
  };

  let formattedText = linkifyHtml(cleanedText, options);
  return formattedText;
}

