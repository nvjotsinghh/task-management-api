import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Task Management API',
            version: '1.0.0',
            description: 'A RESTful API for managing projects, tasks, and comments',
        },
        servers: [
            {
                url: 'http://localhost:3000/api',
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
                Project: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        description: { type: 'string' },
                        ownerId: { type: 'string' },
                        createdAt: { type: 'string' },
                        updatedAt: { type: 'string' },
                    },
                },
                CreateProject: {
                    type: 'object',
                    required: ['name', 'description'],
                    properties: {
                        name: { type: 'string', minLength: 3, maxLength: 100 },
                        description: { type: 'string', minLength: 3, maxLength: 500 },
                    },
                },
                Task: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        projectId: { type: 'string' },
                        title: { type: 'string' },
                        description: { type: 'string' },
                        status: { type: 'string', enum: ['todo', 'in-progress', 'done'] },
                        assigneeId: { type: 'string' },
                        dueDate: { type: 'string' },
                        createdAt: { type: 'string' },
                        updatedAt: { type: 'string' },
                    },
                },
                CreateTask: {
                    type: 'object',
                    required: ['title', 'description'],
                    properties: {
                        title: { type: 'string', minLength: 3, maxLength: 200 },
                        description: { type: 'string', minLength: 3, maxLength: 1000 },
                        status: { type: 'string', enum: ['todo', 'in-progress', 'done'] },
                        assigneeId: { type: 'string' },
                        dueDate: { type: 'string', format: 'date' },
                    },
                },
                Comment: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        taskId: { type: 'string' },
                        authorId: { type: 'string' },
                        body: { type: 'string' },
                        createdAt: { type: 'string' },
                    },
                },
                CreateComment: {
                    type: 'object',
                    required: ['body'],
                    properties: {
                        body: { type: 'string', minLength: 1, maxLength: 1000 },
                    },
                },
                AuthResponse: {
                    type: 'object',
                    properties: {
                        uid: { type: 'string' },
                        email: { type: 'string' },
                        token: { type: 'string' },
                        role: { type: 'string' },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        error: { type: 'string' },
                    },
                },
            },
        },
        security: [{ bearerAuth: [] }],
        paths: {

            // ── AUTH ──
            '/auth/register': {
                post: {
                    summary: 'Register a new user',
                    tags: ['Auth'],
                    security: [],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['email', 'password'],
                                    properties: {
                                        email: { type: 'string', format: 'email', example: 'user@example.com' },
                                        password: { type: 'string', minLength: 6, example: '123456' },
                                        role: { type: 'string', enum: ['admin', 'member'], example: 'member' },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        201: {
                            description: 'User registered successfully',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } },
                        },
                        400: { description: 'Validation error or email already exists' },
                        429: { description: 'Too many requests' },
                    },
                },
            },
            '/auth/login': {
                post: {
                    summary: 'Login and get a Bearer token',
                    tags: ['Auth'],
                    security: [],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    required: ['email', 'password'],
                                    properties: {
                                        email: { type: 'string', format: 'email', example: 'user@example.com' },
                                        password: { type: 'string', example: '123456' },
                                    },
                                },
                            },
                        },
                    },
                    responses: {
                        200: {
                            description: 'Login successful',
                            content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } },
                        },
                        401: { description: 'Invalid credentials' },
                        429: { description: 'Too many requests' },
                    },
                },
            },

            // ── PROJECTS ──
            '/projects': {
                get: {
                    summary: 'Get all projects for logged in user',
                    tags: ['Projects'],
                    responses: {
                        200: { description: 'List of projects', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Project' } } } } },
                        401: { description: 'Unauthorized' },
                    },
                },
                post: {
                    summary: 'Create a new project',
                    tags: ['Projects'],
                    requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateProject' } } } },
                    responses: {
                        201: { description: 'Project created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Project' } } } },
                        400: { description: 'Validation error' },
                        401: { description: 'Unauthorized' },
                    },
                },
            },
            '/projects/{id}': {
                get: {
                    summary: 'Get a project by ID',
                    tags: ['Projects'],
                    parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
                    responses: {
                        200: { description: 'Project found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Project' } } } },
                        404: { description: 'Project not found' },
                    },
                },
                put: {
                    summary: 'Update a project',
                    tags: ['Projects'],
                    parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
                    requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateProject' } } } },
                    responses: {
                        200: { description: 'Project updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Project' } } } },
                        403: { description: 'Forbidden' },
                        404: { description: 'Not found' },
                    },
                },
                delete: {
                    summary: 'Delete a project',
                    tags: ['Projects'],
                    parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
                    responses: {
                        204: { description: 'Deleted successfully' },
                        403: { description: 'Forbidden' },
                        404: { description: 'Not found' },
                    },
                },
            },

            // ── TASKS ──
            '/projects/{id}/tasks': {
                get: {
                    summary: 'Get all tasks in a project with optional filtering and sorting',
                    tags: ['Tasks'],
                    parameters: [
                        { in: 'path', name: 'id', required: true, schema: { type: 'string' } },
                        { in: 'query', name: 'status', required: false, schema: { type: 'string', enum: ['todo', 'in-progress', 'done'] }, description: 'Filter by task status' },
                        { in: 'query', name: 'assigneeId', required: false, schema: { type: 'string' }, description: 'Filter by assignee user ID' },
                        { in: 'query', name: 'sortBy', required: false, schema: { type: 'string', enum: ['dueDate', 'createdAt'] }, description: 'Sort field' },
                        { in: 'query', name: 'order', required: false, schema: { type: 'string', enum: ['asc', 'desc'] }, description: 'Sort order' },
                    ],
                    responses: {
                        200: { description: 'List of tasks', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Task' } } } } },
                        404: { description: 'Project not found' },
                    },
                },
                post: {
                    summary: 'Create a task in a project',
                    tags: ['Tasks'],
                    parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
                    requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateTask' } } } },
                    responses: {
                        201: { description: 'Task created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Task' } } } },
                        400: { description: 'Validation error' },
                        404: { description: 'Project not found' },
                    },
                },
            },
            '/tasks/{id}': {
                get: {
                    summary: 'Get a task by ID',
                    tags: ['Tasks'],
                    parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
                    responses: {
                        200: { description: 'Task found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Task' } } } },
                        404: { description: 'Task not found' },
                    },
                },
                put: {
                    summary: 'Update a task',
                    tags: ['Tasks'],
                    parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
                    requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateTask' } } } },
                    responses: {
                        200: { description: 'Task updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Task' } } } },
                        404: { description: 'Not found' },
                    },
                },
                delete: {
                    summary: 'Delete a task',
                    tags: ['Tasks'],
                    parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
                    responses: {
                        204: { description: 'Deleted successfully' },
                        404: { description: 'Not found' },
                    },
                },
            },

            // ── COMMENTS ──
            '/tasks/{id}/comments': {
                get: {
                    summary: 'Get all comments on a task',
                    tags: ['Comments'],
                    parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
                    responses: {
                        200: { description: 'List of comments', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Comment' } } } } },
                        404: { description: 'Task not found' },
                    },
                },
                post: {
                    summary: 'Add a comment to a task',
                    tags: ['Comments'],
                    parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
                    requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateComment' } } } },
                    responses: {
                        201: { description: 'Comment created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Comment' } } } },
                        400: { description: 'Validation error' },
                        404: { description: 'Task not found' },
                    },
                },
            },
            '/comments/{id}': {
                delete: {
                    summary: 'Delete a comment',
                    tags: ['Comments'],
                    parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
                    responses: {
                        204: { description: 'Deleted successfully' },
                        403: { description: 'Forbidden' },
                        404: { description: 'Not found' },
                    },
                },
            },
        },
    },
    apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);