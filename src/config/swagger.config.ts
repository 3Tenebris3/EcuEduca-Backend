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
        LoginDTO: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "user@example.com",
            },
            password: {
              type: "string",
              example: "yourpassword123",
            },
          },
        },
        RegisterDTO: {
          type: "object",
          required: ["email", "password", "displayName"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "student@example.com",
            },
            password: {
              type: "string",
              example: "securePassword123",
            },
            displayName: {
              type: "string",
              example: "Juan Pérez",
            },
            role: {
              type: "string",
              enum: ["student", "teacher", "admin", "parent"],
              example: "student",
            },
          },
        },
        CreateCourseDTO: {
          type: "object",
          required: ["name"],
          properties: {
            name: {
              type: "string",
              example: "Matemáticas Básicas",
            },
            icon: {
              type: "string",
              example: "📘",
            },
            teacherIds: {
              type: "array",
              items: { type: "string" },
              example: ["teacher123", "teacher456"],
            },
          },
        },
        UpdateCourseDTO: {
          type: "object",
          properties: {
            name: {
              type: "string",
              example: "Matemáticas Avanzadas",
            },
            icon: {
              type: "string",
              example: "📕",
            },
            teacherIds: {
              type: "array",
              items: { type: "string" },
              example: ["teacher789"],
            },
            isActive: {
              type: "boolean",
              example: true,
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2025-05-10T15:00:00Z",
            },
          },
        },
        CreateGradeDTO: {
          type: "object",
          required: [
            "groupId",
            "userId",
            "unitId",
            "moduleId",
            "type",
            "score",
            "maxScore",
          ],
          properties: {
            groupId: {
              type: "string",
              example: "group123",
            },
            userId: {
              type: "string",
              example: "user123",
            },
            unitId: {
              type: "string",
              example: "unit456",
            },
            moduleId: {
              type: "string",
              example: "minigame789",
            },
            type: {
              type: "string",
              enum: ["minigame", "quiz", "final_test"],
              example: "quiz",
            },
            score: {
              type: "number",
              example: 85,
            },
            maxScore: {
              type: "number",
              example: 100,
            },
            duration: {
              type: "number",
              example: 1200,
              description: "Duración en segundos",
            },
          },
        },
        GradeQuery: {
          type: "object",
          properties: {
            groupId: {
              type: "string",
              example: "group123",
            },
            unitId: {
              type: "string",
              example: "unit456",
            },
            userId: {
              type: "string",
              example: "user123",
            },
            classId: {
              type: "string",
              example: "classDeprecated",
              deprecated: true,
            },
          },
        },
        CreateGroupDTO: {
          type: "object",
          required: ["courseId", "name", "teacherId"],
          properties: {
            courseId: {
              type: "string",
              example: "course123",
            },
            name: {
              type: "string",
              example: "7°A",
            },
            teacherId: {
              type: "string",
              example: "teacher456",
            },
          },
        },
        UpdateGroupDTO: {
          type: "object",
          properties: {
            name: {
              type: "string",
              example: "7°B",
            },
            teacherId: {
              type: "string",
              example: "teacher456",
            },
            isActive: {
              type: "boolean",
              example: true,
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2025-05-10T10:00:00Z",
            },
          },
        },
        LeaderboardRow: {
          type: "object",
          properties: {
            id: {
              type: "string",
              example: "user123",
            },
            avatar: {
              type: "string",
              example: "avatar5.png",
            },
            name: {
              type: "string",
              example: "Luis Martínez",
            },
            points: {
              type: "number",
              example: 180,
            },
            rank: {
              type: "number",
              example: 2,
            },
          },
        },
        CreateMinigameDTO: {
          type: "object",
          required: ["title", "description", "type"],
          properties: {
            title: {
              type: "string",
              example: "Trivia Precolombina",
            },
            description: {
              type: "string",
              example:
                "Responde preguntas sobre las culturas indígenas de América Latina.",
            },
            type: {
              type: "string",
              enum: ["puzzle", "trivia", "chronology", "search", "simulation"],
              example: "trivia",
            },
            maxScore: {
              type: "number",
              example: 100,
            },
          },
        },
        UpdateMinigameDTO: {
          allOf: [
            { $ref: "#/components/schemas/CreateMinigameDTO" },
            {
              type: "object",
              properties: {
                isActive: {
                  type: "boolean",
                  example: true,
                },
                updatedAt: {
                  type: "string",
                  format: "date-time",
                  example: "2025-05-10T12:00:00Z",
                },
              },
            },
          ],
        },
        CreateModuleDTO: {
          type: "object",
          required: ["type", "refId", "order"],
          properties: {
            type: {
              type: "string",
              enum: [
                "3d_static",
                "3d_animation",
                "minigame",
                "quiz",
                "final_test",
              ],
              example: "minigame",
            },
            refId: {
              type: "string",
              example: "quiz123",
            },
            order: {
              type: "integer",
              example: 1,
            },
            custom: {
              type: "object",
              additionalProperties: true,
              example: {
                color: "blue",
                difficulty: "easy",
              },
            },
          },
        },
        UpdateModuleDTO: {
          type: "object",
          properties: {
            type: {
              type: "string",
              enum: [
                "3d_static",
                "3d_animation",
                "minigame",
                "quiz",
                "final_test",
              ],
              example: "quiz",
            },
            refId: {
              type: "string",
              example: "quiz456",
            },
            order: {
              type: "integer",
              example: 2,
            },
            custom: {
              type: "object",
              additionalProperties: true,
              example: {
                timer: 60,
              },
            },
            isActive: {
              type: "boolean",
              example: true,
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2025-05-10T12:30:00Z",
            },
          },
        },
        NotificationModel: {
          type: "object",
          properties: {
            id: {
              type: "string",
              example: "notif_abc123",
            },
            userId: {
              type: "string",
              example: "user_001",
            },
            title: {
              type: "string",
              example: "¡Felicidades!",
            },
            body: {
              type: "string",
              example: "Has completado todas las actividades de esta semana.",
            },
            date: {
              type: "string",
              format: "date-time",
              example: "2025-05-10T15:30:00Z",
            },
            type: {
              type: "string",
              enum: ["info", "warning", "reward"],
              example: "reward",
            },
            read: {
              type: "boolean",
              example: false,
            },
          },
        },
        CreateQuizDTO: {
          type: "object",
          required: ["title"],
          properties: {
            title: {
              type: "string",
              example: "Evaluación de Historia Precolombina",
            },
            relatedScenario: {
              type: "string",
              example: "scenario_abc123",
            },
            maxAttempts: {
              type: "integer",
              example: 3,
            },
          },
        },
        UpdateQuizDTO: {
          allOf: [
            { $ref: "#/components/schemas/CreateQuizDTO" },
            {
              type: "object",
              properties: {
                isActive: {
                  type: "boolean",
                  example: true,
                },
                updatedAt: {
                  type: "string",
                  format: "date-time",
                  example: "2025-05-10T12:00:00Z",
                },
              },
            },
          ],
        },
        CreateQuestionDTO: {
          type: "object",
          required: ["questionText", "type", "order"],
          properties: {
            questionText: {
              type: "string",
              example: "¿Cuál fue la civilización más avanzada en astronomía?",
            },
            type: {
              type: "string",
              enum: ["multiple_choice", "true_false", "short_answer"],
              example: "multiple_choice",
            },
            order: {
              type: "integer",
              example: 1,
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2025-05-10T10:00:00Z",
            },
          },
        },
        UpdateQuestionDTO: {
          allOf: [
            { $ref: "#/components/schemas/CreateQuestionDTO" },
            {
              type: "object",
              properties: {
                updatedAt: {
                  type: "string",
                  format: "date-time",
                  example: "2025-05-10T15:00:00Z",
                },
              },
            },
          ],
        },
        CreateAnswerDTO: {
          type: "object",
          required: ["answerText", "isCorrect"],
          properties: {
            answerText: {
              type: "string",
              example: "Los Mayas",
            },
            isCorrect: {
              type: "boolean",
              example: true,
            },
          },
        },
        UpdateAnswerDTO: {
          allOf: [
            { $ref: "#/components/schemas/CreateAnswerDTO" },
            {
              type: "object",
              properties: {
                updatedAt: {
                  type: "string",
                  format: "date-time",
                  example: "2025-05-10T16:00:00Z",
                },
              },
            },
          ],
        },
        ReportDTO: {
          type: "object",
          properties: {
            totalUsers: {
              type: "integer",
              example: 128,
            },
            activeClasses: {
              type: "integer",
              example: 14,
            },
            topScenarios: {
              type: "array",
              items: { type: "string" },
              example: ["scenario1", "scenario2", "scenario3"],
            },
            averageQuizScores: {
              type: "number",
              format: "float",
              example: 86.4,
            },
            mostPlayedMinigame: {
              type: "string",
              example: "minigame_puzzle123",
            },
            generatedAt: {
              type: "string",
              format: "date-time",
              example: "2025-05-10T14:00:00Z",
            },
          },
        },
        CreateScenarioDTO: {
          type: "object",
          required: ["title", "historicalPeriod", "modelURL", "description"],
          properties: {
            title: {
              type: "string",
              example: "El Imperio Inca",
            },
            historicalPeriod: {
              type: "string",
              example: "1450 - 1532 d.C.",
            },
            modelURL: {
              type: "string",
              format: "uri",
              example: "https://cdn.example.com/models/inca.glb",
            },
            audioNarrationURL: {
              type: "string",
              format: "uri",
              example: "https://cdn.example.com/audio/inca.mp3",
            },
            description: {
              type: "string",
              example:
                "Explora la arquitectura, costumbres y cultura del Imperio Inca.",
            },
            thumbURL: {
              type: "string",
              format: "uri",
              example: "https://cdn.example.com/thumbs/inca.png",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2025-05-10T12:00:00Z",
            },
          },
        },
        UpdateScenarioDTO: {
          allOf: [
            { $ref: "#/components/schemas/CreateScenarioDTO" },
            {
              type: "object",
              properties: {
                isActive: {
                  type: "boolean",
                  example: true,
                },
                updatedAt: {
                  type: "string",
                  format: "date-time",
                  example: "2025-05-11T14:30:00Z",
                },
              },
            },
          ],
        },
        CreatePointDTO: {
          type: "object",
          required: ["title", "description"],
          properties: {
            title: {
              type: "string",
              example: "Templo del Sol",
            },
            description: {
              type: "string",
              example:
                "Lugar sagrado donde se rendía culto al Inti (dios Sol).",
            },
            iconURL: {
              type: "string",
              format: "uri",
              example: "https://cdn.example.com/icons/temple.png",
            },
            audioURL: {
              type: "string",
              format: "uri",
              example: "https://cdn.example.com/audio/temple.mp3",
            },
            order: {
              type: "integer",
              example: 1,
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2025-05-10T13:00:00Z",
            },
          },
        },
        UpdatePointDTO: {
          allOf: [
            { $ref: "#/components/schemas/CreatePointDTO" },
            {
              type: "object",
              properties: {
                updatedAt: {
                  type: "string",
                  format: "date-time",
                  example: "2025-05-11T09:30:00Z",
                },
              },
            },
          ],
        },
        CreateUnitDTO: {
          type: "object",
          required: ["title", "order"],
          properties: {
            title: {
              type: "string",
              example: "Unidad 1: Introducción a las Culturas Precolombinas",
            },
            order: {
              type: "integer",
              example: 1,
              description:
                "Orden en el que se presenta la unidad dentro de la clase",
            },
          },
        },
        UpdateUnitDTO: {
          allOf: [
            { $ref: "#/components/schemas/CreateUnitDTO" },
            {
              type: "object",
              properties: {
                isActive: {
                  type: "boolean",
                  example: true,
                },
                updatedAt: {
                  type: "string",
                  format: "date-time",
                  example: "2025-05-11T09:30:00Z",
                },
              },
            },
          ],
        },
        CreateUserDTO: {
          type: "object",
          required: ["email", "password", "displayName"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "newuser@example.com",
            },
            password: {
              type: "string",
              format: "password",
              example: "SecurePassword123",
            },
            displayName: {
              type: "string",
              example: "Ana Martínez",
            },
            role: {
              type: "string",
              enum: ["student", "teacher", "admin", "parent"],
              example: "student",
            },
            phone: {
              type: "string",
              example: "+593991234567",
            },
            avatar: {
              type: "string",
              example: "avatar3.png",
            },
            teacherId: {
              type: "string",
              example: "teacher789",
            },
          },
        },
        UpdateUserDTO: {
          type: "object",
          properties: {
            displayName: {
              type: "string",
              example: "Carlos Rodríguez",
            },
            role: {
              type: "string",
              enum: ["student", "teacher", "admin", "parent"],
              example: "teacher",
            },
            phone: {
              type: "string",
              example: "+593987654321",
            },
            avatar: {
              type: "string",
              example: "avatar2.png",
            },
            teacherId: {
              type: "string",
              example: "teacher123",
            },
            classes: {
              type: "array",
              items: { type: "string" },
              example: ["classId1", "classId2"],
            },
            o365Id: {
              type: "string",
              example: "user-azure-guid",
            },
            password: {
              type: "string",
              example: "NewHashedPassword123",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2025-05-11T12:00:00Z",
            },
          },
        },
        UserModel: {
          type: "object",
          properties: {
            id: {
              type: "string",
              example: "user_123",
            },
            email: {
              type: "string",
              format: "email",
              example: "student@example.com",
            },
            displayName: {
              type: "string",
              example: "Juan Pérez",
            },
            roles: {
              type: "array",
              items: {
                type: "string",
                enum: ["student", "teacher", "admin", "parent"],
              },
              example: ["student"],
            },
            classes: {
              type: "array",
              items: { type: "string" },
              example: ["class1", "class2"],
            },
            phone: {
              type: "string",
              example: "+593991122333",
            },
            avatar: {
              type: "string",
              example: "avatar4.png",
            },
            teacherId: {
              type: "string",
              example: "teacher001",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2025-05-01T08:00:00Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2025-05-11T14:00:00Z",
            },
            o365Id: {
              type: "string",
              example: "user-o365-id",
            },
            profilePicture: {
              type: "string",
              format: "uri",
              example: "https://cdn.example.com/profiles/user_123.png",
            },
            progress: {
              type: "object",
              properties: {
                unitsCompleted: {
                  type: "object",
                  additionalProperties: {
                    type: "object",
                    properties: {
                      avg: { type: "number" },
                      passed: { type: "boolean" },
                    },
                  },
                  example: {
                    unit1: { avg: 85, passed: true },
                    unit2: { avg: 70, passed: false },
                  },
                },
                totalScore: {
                  type: "number",
                  example: 1500,
                },
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
  apis: ["./src/controllers/*.ts", "./src/routers/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
