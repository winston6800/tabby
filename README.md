# Tabby - Your Creative Anchor

## Overview

Tabby is a visual productivity tool designed for creatives who thrive in chaos but need a gentle anchor to bring their ideas to fruition. It provides a flexible node-map interface, allowing users to externalize their creative storm, connect ideas, and set gentle reminders for their own goals without feeling boxed in.

---

## What's New: The Burn Engine

Tabby now features the **Burn Engine**—a unique productivity tool that lets you set your own hourly rate and see your real-time "burn rate" as you work. This creates a sense of urgency and loss aversion, motivating you to make faster progress on the things that matter most. The Burn Engine helps you self-impose deadlines and accountability, turning your time into a tangible resource for creative momentum.

---

## Documentation

- [User Guide](USER_GUIDE.md) - Complete guide for using Tabby
- [Developer Guide](DEVELOPER_GUIDE.md) - Guide for developers contributing to Tabby

## The Problem: Creative Chaos vs. Momentum (Scenario: Jordan, the Disorganized Creative)

Meet Jordan, a design major brimming with ideas. Her workspace is a testament to her creativity: multiple Figma boards, half-finished Notion pages, a screenplay draft, and an Etsy shop with sporadic sales. While inspiration is never lacking, the sheer volume of thoughts and projects leads to a cycle of distraction and a feeling of unaccomplishment.

Every time Jordan sits down to work, she struggles to recall her priorities, gets sidetracked by new inspirations, and ends the day feeling like she's spiraled without making tangible progress. She fears traditional productivity tools, seeing them as rigid structures that stifle her creative process.

**Tabby is built for Jordan.** It aims to be the self-check, not a cage, helping her navigate her creative explorations while gently guiding her back to her self-defined objectives.

## Current Use Case 

This release of Tabby demonstrates the core visual mapping functionality and introduces the Burn Engine to address Jordan's need to externalize, organize, and act with urgency:

1.  **Launch Tabby**: The user can start the application.
2.  **Visual Node Map**: The user is presented with a canvas.
3.  **Create & Label Nodes**: Jordan can create nodes on the canvas to represent her tasks, ideas, or projects (e.g., "Finish rough cut of short film," "Prep two new art pieces for Etsy," "Reflect on themes for screenplay").
4.  **Arrange & Connect Nodes**: She can drag and drop nodes, arranging them spatially in a way that makes sense to her. She can draw connections (edges) between nodes to visualize relationships, dependencies, or a flow of thought.
5.  **Externalize Priorities & Create Urgency**: Jordan can create a specific node for her main goal, like "Don't start anything new until rough cut is done," and use the Burn Engine to set a burn rate, creating urgency and accountability for her most important work.

This setup allows Jordan to lay out her creative storm visually, see her commitments, and bring structure and urgency to her workflow in a way that feels natural and empowering, rather than restrictive.

*(Future iterations will focus on features like gentle reminders based on her own stated priorities, e.g., "You wanted to finish the rough cut first.")*

## App & Extension

- **Web App**: The main Tabby app is a web application. Run it with `npm run dev` and access it in your browser.
- **Extension (Companion App)**: There is a Chrome extension, but it is not integrated with the main app. It serves as a companion tool for additional features. All core features, including the Burn Engine, are in the web app.

## Quick Start

### For Users
1. Visit the [Chrome Web Store](link to be added) to install the extension
2. Follow the [User Guide](USER_GUIDE.md) to get started

### For Developers
1. Clone the repository
2. Follow the setup instructions in the [Developer Guide](DEVELOPER_GUIDE.md)
3. Start contributing!

## Toolchain and Processes

Our development process and toolchain are set up to ensure quality and collaboration:

*   **Version Control**: We use Git for version control, with all code hosted on a public GitHub repository. Commits are made frequently with descriptive messages, often following conventional commit standards (e.g., `feat:`, `fix:`, `docs:`).
*   **Branching Strategy**: We primarily use feature branches for new development, which are then merged into the `main` branch via Pull Requests.
*   **Bug Tracking**: GitHub Issues are used to track bugs, feature requests, and tasks.
*   **Build System**: The frontend application (`vite-react`) is built using Vite, a fast and modern build tool for web projects.
*   **Testing**: We use Vitest for running unit and integration tests within the Vite environment. Test files are co-located with the source files (e.g., `*.test.jsx`).
*   **Continuous Integration (CI)**: GitHub Actions are configured to automate linting, testing, and potentially builds on every push and pull request to the `main` branch.

## Contributing

Please see our [Developer Guide](DEVELOPER_GUIDE.md) for detailed instructions on how to contribute to the project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

- GitHub Issues: [Create an issue](https://github.com/winston6800/tabby/issues)

---

*This README is a living document and will be updated as the project evolves. *

  
  
