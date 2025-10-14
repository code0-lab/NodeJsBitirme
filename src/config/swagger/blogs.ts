export const blogPaths = {
  '/api/blogs': {
    get: {
      tags: ['Blogs'],
      summary: 'Blogları listele',
      responses: {
        '200': {
          description: 'Blog listesi',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  items: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Blog' }
                  }
                }
              }
            }
          }
        },
        '500': { description: 'Bloglar listelenemedi' }
      }
    },
    post: {
      tags: ['Blogs'],
      summary: 'Yeni blog oluştur',
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/BlogCreate' }
          }
        }
      },
      responses: {
        '201': {
          description: 'Blog oluşturuldu',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  ok: { type: 'boolean' },
                  item: { $ref: '#/components/schemas/Blog' }
                }
              }
            }
          }
        },
        '400': { description: 'Validasyon veya istek hatası' },
        '401': { description: 'Yetkisiz' }
      }
    }
  },
  '/api/blogs/{id}': {
    get: {
      tags: ['Blogs'],
      summary: 'Blog detayını getir',
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
      ],
      responses: {
        '200': {
          description: 'Blog bulundu',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { item: { $ref: '#/components/schemas/Blog' } }
              }
            }
          }
        },
        '404': { description: 'Blog bulunamadı' },
        '400': { description: 'Geçersiz blog id' }
      }
    },
    put: {
      tags: ['Blogs'],
      summary: 'Blogu güncelle',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/BlogUpdate' }
          }
        }
      },
      responses: {
        '200': {
          description: 'Blog güncellendi',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  ok: { type: 'boolean' },
                  item: { $ref: '#/components/schemas/Blog' }
                }
              }
            }
          }
        },
        '403': { description: 'Yetkisiz' },
        '404': { description: 'Blog bulunamadı' },
        '400': { description: 'Geçersiz istek' }
      }
    },
    delete: {
      tags: ['Blogs'],
      summary: 'Blogu sil',
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
      ],
      responses: {
        '200': {
          description: 'Blog silindi',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { ok: { type: 'boolean' } }
              }
            }
          }
        },
        '403': { description: 'Yetkisiz' },
        '404': { description: 'Blog bulunamadı' },
        '400': { description: 'Geçersiz istek' }
      }
    }
  }
};

export const blogSchemas = {
  Blog: {
    type: 'object',
    properties: {
      _id: { type: 'string' },
      title: { type: 'string' },
      content: { type: 'string' },
      tags: { type: 'array', items: { type: 'string' } },
      categories: { type: 'array', items: { type: 'string' } },
      coverImageUrl: { type: 'string' },
      isPublished: { type: 'boolean' },
      author: { type: 'string', description: 'Kullanıcı id' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' }
    }
  },
  BlogCreate: {
    type: 'object',
    required: ['title', 'content'],
    properties: {
      title: { type: 'string' },
      content: { type: 'string' },
      tags: { type: 'array', items: { type: 'string' } },
      categories: { type: 'array', items: { type: 'string' } },
      coverImageUrl: { type: 'string' },
      isPublished: { type: 'boolean' }
    }
  },
  BlogUpdate: {
    type: 'object',
    properties: {
      title: { type: 'string' },
      content: { type: 'string' },
      tags: { type: 'array', items: { type: 'string' } },
      categories: { type: 'array', items: { type: 'string' } },
      coverImageUrl: { type: 'string' },
      isPublished: { type: 'boolean' }
    }
  }
};