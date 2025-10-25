# AI Rules for FiveM Copilot Platform

## Tech Stack Overview

- **Frontend**: Next.js 15 with App Router for modern React development
- **UI Framework**: Tailwind CSS with shadcn/ui components for consistent styling
- **AI Providers**: Multiple integrations including Google AI, OpenRouter, and OpenAI
- **Vector Database**: SQLite with better-sqlite3 for local document storage
- **Code Editor**: Monaco Editor with Lua syntax highlighting
- **State Management**: React Context and Hooks for client-side state
- **Authentication**: Supabase integration for user management (when enabled)
- **File Handling**: react-dropzone for file uploads and processing
- **Real-time Features**: WebSockets for live collaboration features
- **Deployment**: Vercel optimized with automatic builds and preview deployments

## AI Provider Selection Rules

### Primary Provider: Google AI (Free Tier)
- **Use Case**: Default choice for all general AI interactions
- **Models**: Gemini 1.5 Flash for balanced performance and cost
- **Fallback**: Automatically switch to OpenRouter if Google AI is unavailable
- **Limitations**: 1,500 requests/day free limit - implement rate limiting awareness

### Secondary Provider: OpenRouter (Free Tier)
- **Use Case**: Alternative free option when Google AI limits are reached
- **Models**: DeepSeek R1 or similar high-quality free models
- **Integration**: Use for code generation when Google AI is not available
- **Limitations**: 200 requests/day - monitor usage and rotate models

### Tertiary Provider: OpenAI (Paid)
- **Use Case**: High-quality responses when free tiers are exhausted
- **Models**: GPT-4 for complex code analysis and optimization
- **Cost Control**: Only use for premium features or when explicitly requested
- **Fallback**: Use only when both free providers are unavailable

### Local Provider: Ollama (Development)
- **Use Case**: Privacy-focused local development and testing
- **Models**: Qwen2.5-Coder or similar coding-optimized local models
- **Limitations**: Requires local setup - not for production use

## Code Generation Guidelines

### Framework-Specific Rules
1. **QBCore Resources**:
   - Always use `QBCore.Functions.GetPlayer` for player data
   - Prefer `QBCore.Commands.Add` for command registration
   - Use `TriggerClientEvent` with proper event naming conventions

2. **ESX Resources**:
   - Always use `ESX.GetPlayerFromId` for player data
   - Prefer `RegisterServerEvent` for server-side events
   - Use `ESX.ShowNotification` for client notifications

3. **Standalone Resources**:
   - Use native FiveM functions directly
   - Implement custom player management if needed
   - Follow FiveM best practices for resource structure

### Performance Optimization Rules
1. **Loop Management**:
   - Always include `Wait()` in while loops
   - Use appropriate wait times (100ms minimum for active loops)
   - Implement dynamic wait times based on activity

2. **Resource Usage**:
   - Cache frequently used values (PlayerPedId, etc.)
   - Minimize server-client communication
   - Use efficient data structures for large datasets

3. **Memory Management**:
   - Clean up event handlers when resources stop
   - Avoid global variable pollution
   - Implement proper garbage collection patterns

### Security Best Practices
1. **Input Validation**:
   - Always validate source parameter in server events
   - Sanitize all user inputs before processing
   - Implement rate limiting for API endpoints

2. **Data Protection**:
   - Never expose sensitive server information to clients
   - Use proper permission checks for administrative functions
   - Implement secure communication between client-server

3. **Code Integrity**:
   - Avoid executing arbitrary code from user inputs
   - Validate file uploads and process in secure environments
   - Implement proper error handling without exposing internals

## Response Formatting Rules

### Code Snippet Standards
1. **Structure**:
   - Include proper error handling in all code examples
   - Add comments for complex logic or non-obvious implementations
   - Follow consistent indentation and naming conventions

2. **Documentation**:
   - Always include function parameter descriptions
   - Add return value explanations
   - Provide usage examples for exported functions

3. **Framework Integration**:
   - Show proper integration with QBCore/ESX systems
   - Include required dependencies in fxmanifest examples
   - Add notes about version compatibility

### Contextual Awareness
1. **File Context**:
   - Consider active file framework when generating code
   - Reference existing code structure when providing modifications
   - Adapt suggestions based on file type (client/server/config)

2. **User Intent**:
   - Match response complexity to user's apparent experience level
   - Provide explanations when code might be unclear
   - Offer multiple approaches when appropriate

3. **Performance Impact**:
   - Always mention potential performance implications
   - Suggest optimizations for resource-intensive operations
   - Recommend best practices for scalable solutions

## Knowledge Base Utilization

### Documentation Priority
1. **Native Functions**:
   - Reference official FiveM documentation first
   - Include common usage patterns and examples
   - Note any known issues or limitations

2. **Framework Specifics**:
   - Prioritize QBCore then ESX documentation
   - Include version-specific information
   - Note deprecated functions and alternatives

3. **Community Best Practices**:
   - Incorporate widely accepted patterns
   - Reference performance optimization techniques
   - Include security recommendations from community

### Contextual Search
1. **Query Enhancement**:
   - Expand queries with related terms and concepts
   - Consider framework when searching documentation
   - Weight recent and frequently accessed documents higher

2. **Result Filtering**:
   - Filter results by framework compatibility
   - Prioritize high-score matches with relevant content
   - Combine multiple sources for comprehensive answers

3. **Response Synthesis**:
   - Synthesize information from multiple documentation sources
   - Highlight contradictions or conflicting advice
   - Provide clear recommendations when multiple approaches exist

## Error Handling and Fallbacks

### Graceful Degradation
1. **API Failures**:
   - Implement fallback to next available AI provider
   - Provide helpful error messages to users
   - Log failures for monitoring and improvement

2. **Knowledge Base Issues**:
   - Fall back to general AI knowledge when RAG fails
   - Provide disclaimer about response limitations
   - Suggest alternative approaches or resources

3. **Rate Limiting**:
   - Implement client-side rate limiting awareness
   - Queue requests during high-usage periods
   - Inform users about temporary limitations

## Continuous Learning and Improvement

### Feedback Integration
1. **User Feedback**:
   - Analyze positive/negative feedback for response quality
   - Adjust response patterns based on user preferences
   - Track common questions for knowledge base expansion

2. **Performance Monitoring**:
   - Monitor response accuracy and relevance
   - Track usage patterns across different AI providers
   - Optimize prompt engineering based on results

3. **Knowledge Base Updates**:
   - Regularly ingest new documentation and community resources
   - Update outdated information and deprecated practices
   - Expand coverage based on user questions and needs