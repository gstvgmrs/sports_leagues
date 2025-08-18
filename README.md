# Home Assignment - FE - Sports Leagues

**Live preview:** [https://sportsleagues.vercel.app/](https://sportsleagues.vercel.app/)

## Features

- 🏆 List of sports leagues
- 🔄 Card flip animation to display league badges
- 🔍 Search system by league name
- 🏷️ Filter by sports category
- 📱 Responsive interface with Tailwind CSS
- ⚡ Optimized loading with skeleton states
- 🎯 Proper error and empty states handling

## Technologies

- **Vue.js 3** with Composition API
- **TypeScript** for static typing
- **Tailwind CSS** for styling
- **Pinia** for state management
- **Vite** as bundler and dev server
- **Vitest** for unit testing
- **Vue Test Utils** for component testing

## AI usage

This project was developed with significant assistance from AI (GitHub Copilot with Claude Sonnet 4 Agent), which was instrumental in various aspects of development:

### **Project Architecture & Setup**

- Initial Vue.js 3 + TypeScript + Vite project configuration
- Tailwind CSS configuration

### **Auto completetions**

- Code snippets and suggestions for Vue.js components
- TypeScript type definitions and interfaces generation
- Tailwind CSS class name suggestions
- Component composition patterns and props validation
- Error handling

### **Code generation**

- SVG for Icons and Skeletons

### **Testing Strategy**

#### **Test Scenario Generation & Edge Cases**

- AI suggested comprehensive testing scenarios including empty states, loading states, error conditions, and user interaction patterns
- Identified edge cases like API failures, missing data, component lifecycle issues, and reactive state changes
- Generated test cases for complex user flows: card flips with badge fetching, search with filters, dropdown selections

#### **Test Code Generation & Setup**

- Auto-generated test file boilerplate with proper imports, describe blocks, and component mounting utilities
- Created mock implementations for Pinia stores, API services with spy functions for tracking method calls
- Provided code snippets for async testing patterns, event simulation, and Vue reactivity handling with `nextTick()`

The AI assistance enabled rapid development while maintaining high code quality, comprehensive testing, and modern development practices throughout the project.

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/gstvgmrs/sports_leagues.git
cd sports_leagues
npm install
```

## Running the Project

To run the project in development mode with hot-reload:

```bash
npm run dev
```

### Run All Tests

```bash
npm run test:unit
```
