import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EcuEduca API',
      version: '1.0.0',
      description: 'API for the EcuEduca project including endpoints for users, authentication, quizzes, etc.',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        // Aquí puedes definir, por ejemplo, el esquema de la respuesta unificada:
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            code: { type: 'number' },
            message: { type: 'string' },
            data: { type: 'object' },
            error: {
              type: 'object',
              properties: {
                details: { type: 'string' },
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Indica en qué archivos buscar anotaciones (cambia la ruta si lo necesitas)
  apis: ['./src/controllers/*.ts', './src/routers/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
