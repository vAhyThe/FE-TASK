# FE-TASK: AI-Powered Chat Application

## Overview
This is a modern, responsive Vue 3 chat application with AI-like interaction capabilities. The application provides a seamless chat experience with dynamic sidebar management, message handling, and a clean, intuitive user interface.

## Key Features
- AI-simulated chat responses
- Dynamic chat creation and management
- Sidebar with chat history
- Responsive design
- Performance-optimized Vue 3 implementation

## Technology Stack
- **Frontend**: Vue 3
- **State Management**: Pinia
- **Routing**: Vue Router
- **Styling**: SCSS, Tailwind CSS
- **Testing**: Vitest
- **Build Tool**: Vite
- **Language**: TypeScript

## Architectural Highlights
### Component Structure
- `ChatView.vue`: Main view managing chat interactions
- `ChatInput.vue`: Dedicated component for message input
- `ChatBlock.vue`: Renders chat messages
- `ChatSideBar.vue`: Manages chat list and interactions

### State Management
Utilizes Pinia for centralized state management, with a `chatStore` handling:
- Chat creation
- Message storage
- Chat switching
- Persistent storage

### Performance Considerations
- Lazy-loaded components
- Minimal re-renders using Vue 3's reactivity system
- Efficient state management with Pinia

## Prerequisites
- Node.js (v20+)
- npm (v10+)

## Setup Instructions

1. Clone the repository
```bash
git clone https://github.com/your-username/fe-task.git
cd fe-task
```

2. Install dependencies
```bash
npm install
```

3. Run development server
```bash
npm run dev
```

4. Build for production
```bash
npm run build
```

5. Run tests
```bash
npm test
```

6. Run tests with Vitest UI
```bash
npm run test:ui
```

## Demo
🌐 Live Demo: [https://herohero.tomasvahala.com/](https://herohero.tomasvahala.com/)

Experience the chat application in action! The demo provides a full preview of the application's features, including:
- Real-time chat interactions
- Dynamic chat creation
- Responsive design across devices


## Testing
- Unit tests powered by Vitest
- Component testing with Vue Test Utils

## Future Improvements
- Implement actual AI response generation
- Add more comprehensive error handling
- Enhance accessibility features
- Implement user authentication

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
Distributed under the MIT License. See `LICENSE` for more information.

## Contact
Your Name - me@tomasvahala.com

Project Link: [https://github.com/vAhyThe/FE-TASK](https://github.com/vAhyThe/FE-TASK)
