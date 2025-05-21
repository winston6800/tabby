# Tabby - Your Creative Anchor

## Overview

Tabby is a visual productivity tool designed for creatives who thrive in chaos but need a gentle anchor to bring their ideas to fruition. It provides a flexible node-map interface, allowing users to externalize their creative storm, connect ideas, and set gentle reminders for their own goals without feeling boxed in.

## Documentation

- [User Guide](USER_GUIDE.md) - Complete guide for using Tabby
- [Developer Guide](DEVELOPER_GUIDE.md) - Guide for developers contributing to Tabby

## The Problem: Creative Chaos vs. Momentum (Scenario: Jordan, the Disorganized Creative)

Meet Jordan, a design major brimming with ideas. Her workspace is a testament to her creativity: multiple Figma boards, half-finished Notion pages, a screenplay draft, and an Etsy shop with sporadic sales. While inspiration is never lacking, the sheer volume of thoughts and projects leads to a cycle of distraction and a feeling of unaccomplishment.

Every time Jordan sits down to work, she struggles to recall her priorities, gets sidetracked by new inspirations, and ends the day feeling like she's spiraled without making tangible progress. She fears traditional productivity tools, seeing them as rigid structures that stifle her creative process.

**Tabby is built for Jordan.** It aims to be the self-check, not a cage, helping her navigate her creative explorations while gently guiding her back to her self-defined objectives.

## Current Operational Use Case (Beta Release)

This beta release of Tabby demonstrates the core visual mapping functionality addressing Jordan's need to externalize and organize her thoughts:

1.  **Launch Tabby**: The user can start the application.
2.  **Visual Node Map**: The user is presented with a canvas.
3.  **Create & Label Nodes**: Jordan can create nodes on the canvas to represent her tasks, ideas, or projects (e.g., "Finish rough cut of short film," "Prep two new art pieces for Etsy," "Reflect on themes for screenplay").
4.  **Arrange & Connect Nodes**: She can drag and drop nodes, arranging them spatially in a way that makes sense to her. She can draw connections (edges) between nodes to visualize relationships, dependencies, or a flow of thought.
5.  **Externalize Priorities**: Jordan can create a specific node for her main goal, like "Don't start anything new until rough cut is done."

This setup allows Jordan to lay out her creative storm visually, see her commitments, and begin to bring structure to her workflow in a way that feels natural and empowering, rather than restrictive.

*(Future iterations will focus on features like gentle reminders based on her own stated priorities, e.g., "You wanted to finish the rough cut first.")*

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

*This README is a living document and will be updated as the project evolves. Last updated: [Current Date]*

  
  
