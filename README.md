# Self-Editing Dashboard 🤖

A revolutionary Angular dashboard that can modify itself through natural language commands!

## 🌟 Features

- **AI-Powered Editing**: Type commands to modify the dashboard
- **Auto-Deploy**: Changes are automatically deployed to GitHub Pages
- **Version Control**: Every edit is tracked in Git
- **Protected Core**: Command input and menu are protected from AI modifications

## 🚀 Live Demo

Visit the live dashboard: [https://noahhabanero.github.io/CursorTest/](https://noahhabanero.github.io/CursorTest/)

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Self-Editing Dashboard              │
├─────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────┐   │
│  │     🔒 Protected: Burger Menu               │   │
│  │     - Deployment tracking                   │   │
│  │     - Edit history                          │   │
│  │     - Settings                              │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │     ✅ Editable: Dashboard Content          │   │
│  │     - AI can modify this area               │   │
│  │     - Widgets, cards, layouts               │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │     🔒 Protected: Command Input             │   │
│  │     - User enters commands here             │   │
│  │     - Triggers AI processing                │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

## 🛠️ Development

### Prerequisites

- Node.js 20+
- npm 10+

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build:prod
```

### Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── burger-menu/        # 🔒 Protected - Navigation menu
│   │   ├── command-input/      # 🔒 Protected - AI command input
│   │   └── dashboard-content/  # ✅ Editable - Main content area
│   ├── services/
│   │   └── github.service.ts   # 🔒 Protected - GitHub API
│   └── app.component.ts        # 🔒 Protected - Root component
├── styles.scss                 # Global styles
└── index.html                  # Entry point
```

## 🔐 Protected vs Editable Components

### Protected Components (🔒)
These components can **only** be edited manually in the codebase:
- `AppComponent`
- `BurgerMenuComponent`
- `CommandInputComponent`
- `GitHubService`

### Editable Components (✅)
These components can be modified via AI commands:
- `DashboardContentComponent`

## 📝 Example Commands

- "Add a clock widget that shows the current time"
- "Change the background to a dark blue gradient"
- "Add a weather card for New York City"
- "Create a todo list component"

## 🔄 How It Works

1. User enters a command in the input box
2. Command creates a GitHub issue with `[AI Command]` tag
3. GitHub Action picks up the issue
4. AI processes the command and generates code changes
5. Changes are committed and pushed
6. Site automatically redeploys

## 📄 License

MIT

