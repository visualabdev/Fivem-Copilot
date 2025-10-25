# FiveM Copilot Platform - AI Rules & Guidelines

## Tech Stack Overview

- **Frontend**: Next.js 14 with App Router for React-based UI
- **Styling**: Tailwind CSS with shadcn/ui components for consistent design
- **AI Providers**: Multiple integrations (Google AI, OpenRouter, OpenAI) with fallback system
- **Vector Database**: SQLite with better-sqlite3 for local document storage
- **Editor**: Monaco Editor with Lua syntax highlighting and FiveM-specific features
- **UI Components**: Radix UI primitives with custom styling
- **State Management**: React Context and Hooks for client-side state
- **File Processing**: RAG pipeline with document chunking and embedding
- **Authentication**: Supabase integration (when enabled)
- **Deployment**: Vercel optimized with serverless functions

## AI Provider Rules

### Primary Provider Selection
1. **Google AI Studio** is the default provider (free tier with generous limits)
2. **OpenRouter** is the secondary option (free models with request limits)
3. **OpenAI** is the fallback provider (paid, highest quality)
4. Always check environment variables in order: `GOOGLE_AI_API_KEY` → `OPENROUTER_API_KEY` → `OPENAI_API_KEY`

### Implementation Guidelines
1. Use `lib/google-ai.ts` for Google AI integration
2. Use `lib/openrouter-ai.ts` for OpenRouter integration
3. Use `@ai-sdk/openai` and `openai` packages for OpenAI integration
4. Always implement fallback handling when primary provider fails
5. Respect rate limits for each provider (1,500/day for Google, 200/day for OpenRouter)

## RAG Pipeline Rules

### Document Processing
1. All documents must be chunked to 800-1000 tokens with 100-200 token overlap
2. Each chunk must include metadata: source, framework, type, title
3. Use `lib/embeddings.ts` for generating embeddings (OpenAI Embeddings model)
4. Store processed documents in SQLite vector database via `lib/vector-db.ts`
5. Implement proper error handling for failed document processing

### Search & Retrieval
1. Always generate embeddings for search queries using the same provider as documents
2. Return top 6 most relevant results unless otherwise specified
3. Filter results by framework when possible (qbcore, esx, fivem)
4. Include similarity scores with results (minimum 0.0, maximum 1.0)
5. Combine RAG context with user query for final AI prompt

## Code Generation Rules

### FiveM Best Practices
1. Always include `Wait()` in loops to prevent server freezing
2. Validate `source` parameter in server events for security
3. Use proper error handling and null checks for player data
4. Follow framework-specific patterns (QBCore.Functions vs ESX.GetPlayerFromId)
5. Include performance considerations in comments (resmon usage, memory efficiency)

### Framework Support
1. Detect framework automatically from code content (QBCore, ESX, Standalone)
2. Generate framework-specific code when framework is known
3. Include framework imports when generating code snippets
4. Follow framework conventions for events, commands, and exports
5. Provide framework migration suggestions when relevant

## UI Component Rules

### shadcn/ui Usage
1. Use shadcn/ui components for all standard UI elements
2. Customize components using Tailwind classes rather than modifying source
3. Maintain consistent styling with the existing design system
4. Implement proper accessibility attributes for all interactive elements
5. Use component variants for different states (hover, focus, disabled)

### Monaco Editor Integration
1. Configure Lua syntax highlighting with FiveM-specific keywords
2. Implement autocomplete for FiveM natives, QBCore, and ESX functions
3. Add hover documentation for common functions
4. Configure editor options for optimal Lua development experience
5. Implement proper theme support (light/dark mode)

## Error Handling Rules

### Graceful Degradation
1. Always provide fallback responses when AI providers fail
2. Implement mock data for local development without API keys
3. Show user-friendly error messages with actionable steps
4. Log detailed errors for debugging while showing simple messages to users
5. Implement retry mechanisms for transient failures

### Validation
1. Validate all user inputs before processing
2. Sanitize file uploads and content before ingestion
3. Check file size limits (50MB maximum)
4. Validate file extensions (lua, js, json, txt, md, zip)
5. Implement proper error boundaries for UI components

## Performance Rules

### Response Optimization
1. Limit AI responses to 2048 tokens unless otherwise specified
2. Use appropriate temperature settings (0.1 for focused, 0.7 for balanced, 1.0 for creative)
3. Implement streaming responses when possible for better UX
4. Cache frequently accessed data (framework detection, common snippets)
5. Optimize database queries with proper indexing

### Resource Management
1. Clean up temporary files and database connections
2. Implement proper rate limiting for API endpoints
3. Use batch processing for multiple document ingestion
4. Optimize vector database queries with proper indexing
5. Monitor and log performance metrics for optimization

## Security Rules

### Data Protection
1. Never store API keys in client-side code
2. Validate and sanitize all user inputs
3. Implement proper authentication for protected endpoints
4. Use environment variables for all sensitive configuration
5. Encrypt data at rest when storing user information

### Content Safety
1. Implement content filtering for inappropriate material
2. Validate file uploads for malicious content
3. Sanitize generated code for security vulnerabilities
4. Implement proper access controls for user data
5. Regularly audit dependencies for security vulnerabilities