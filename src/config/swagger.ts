export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Yggdrasil API',
    version: '1.0.0',
    description: 'Auth kayıt ve giriş endpointleri için Swagger dokümantasyonu'
  },
  servers: [
    { url: `http://localhost:${process.env.PORT || 3000}` }
  ],
  paths: {
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Kullanıcı kaydı',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 8 },
                  name: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Kayıt başarılı',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    email: { type: 'string' },
                    name: { type: 'string' },
                    role: { type: 'string', enum: ['user', 'admin'] }
                  }
                }
              }
            }
          },
          '400': { description: 'Validasyon hatası' },
          '409': { description: 'E-posta zaten kayıtlı' },
          '500': { description: 'Sunucu hatası' }
        }
      }
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Kullanıcı girişi',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Giriş başarılı, JWT üretildi',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    token: { type: 'string' },
                    user: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        email: { type: 'string' },
                        name: { type: 'string' },
                        role: { type: 'string', enum: ['user', 'admin'] }
                      }
                    }
                  }
                }
              }
            }
          },
          '400': { description: 'Eksik/geçersiz giriş verisi' },
          '401': { description: 'Kimlik doğrulama başarısız' },
          '500': { description: 'Sunucu hatası' }
        }
      }
    }
  },
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
    }
  }
};