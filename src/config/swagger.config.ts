import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "EcuEduca API",
      version: "1.0.0",
      description:
        "API for the EcuEduca project including endpoints for users, authentication, quizzes, etc.",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        ApiResponse: {
          type: "object",
          properties: {
            success: { type: "boolean" },
            code: { type: "number" },
            message: { type: "string" },
            data: { type: "object" },
            error: {
              type: "object",
              properties: {
                details: { type: "string" },
              },
            },
          },
        },
        CreateClassDTO: {
          type: "object",
          properties: {
            className: { type: "string" },
            teacherIds: { type: "array", items: { type: "string" } },
          },
          required: ["className"],
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/controllers/*.ts", "./src/routers/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
