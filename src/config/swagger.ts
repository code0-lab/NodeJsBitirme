import { baseSpec } from './swagger/base';
import { authPaths } from './swagger/auth';
import { blogPaths, blogSchemas } from './swagger/blogs';
import { newsPaths, newsSchemas } from './swagger/news';

export const swaggerSpec = {
  ...baseSpec,
  // paths ekleme sırası UI’daki görünümü etkiler
  paths: {
    ...authPaths,
    ...blogPaths,
    ...newsPaths
  },
  components: {
    ...baseSpec.components,
    securitySchemes: {
      ...baseSpec.components.securitySchemes
    },
    schemas: {
      ...(baseSpec.components.schemas || {}),
      ...blogSchemas,
      ...newsSchemas
    }
  }
};