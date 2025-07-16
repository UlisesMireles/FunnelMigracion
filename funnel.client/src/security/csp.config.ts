export const CSP_CONFIG = {
  // Content Security Policy directives
  defaultSrc: ["'self'"],
  scriptSrc: [
    "'self'",
    "'unsafe-inline'", // Solo para desarrollo, remover en producción
    "https://trusted-cdn.com",
    "https://api.google.com" // Para reCAPTCHA si lo usas
  ],
  styleSrc: [
    "'self'",
    "'unsafe-inline'",
    "https://fonts.googleapis.com"
  ],
  fontSrc: [
    "'self'",
    "https://fonts.gstatic.com",
    "data:"
  ],
  imgSrc: [
    "'self'",
    "data:",
    "https:"
  ],
  connectSrc: [
    "'self'",
    "https://api.tudominio.com", // Tu API
    "https://api.google.com"
  ],
  frameSrc: [
    "'none'"
  ],
  objectSrc: [
    "'none'"
  ],
  baseUri: [
    "'self'"
  ],
  formAction: [
    "'self'"
  ]
};

export function generateCSPHeader(): string {
  const directives = Object.entries(CSP_CONFIG)
    .map(([key, values]) => {
      const directiveName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      const directiveValues = Array.isArray(values) ? values.join(' ') : values;
      return `${directiveName} ${directiveValues}`;
    })
    .join('; ');
  
  return directives;
}
