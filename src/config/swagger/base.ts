export const baseSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Yggdrasil API',
    version: '1.0.0',
    description: 'Auth ve Blog endpointleri için Swagger dokümantasyonu'
  },
  servers: [{ url: `http://localhost:${process.env.PORT || 3000}` }],
  // Tag sırası UI’da görünümü etkiler
  tags: [
    { name: 'Auth', description: 'Kayıt ve giriş' },
    { name: 'Blogs', description: 'Blog CRUD' }
  ],
  paths: {},
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
    },
    schemas: {}
  }
};