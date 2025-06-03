# Tabby User Guide

## What is Tabby?

Tabby is a visual productivity tool designed for creatives who thrive in chaos but need a gentle anchor to bring their ideas to fruition. It helps you organize your thoughts, track your progress, and stay focused on what matters most to you.

## Key Features

- **Visual Node Mapping**: Create and connect nodes to represent your tasks, ideas, and projects
- **Focus Sessions**: Select a node to work on and enter a distraction-free session
- **Progress Tracking**: Monitor your streaks and completion rates

## Installation

### Prerequisites
- Google Chrome browser (version 88 or later)
- A modern computer with at least 4GB RAM

### Extension Installation Steps 
1. Clone the repo:
```bash
git clone https://github.com/winston6800/tabby.git
```
2. Install dependencies
```bash
 cd tabby
```
Run the command 
```bash
npm start
```
 in the tabby directory
3. Build the extension
```bash
cd extension
npm run build
``` 
## Running extension
1. Go to the extension setting in the browser of choice
2. Enable dev mode
3. Click load unpack
4. Open the Tabby folder (double click)
5. Click the extension folder
6. Click select folder
7. Now you can see Tabby as one of your usable extensions
## Getting Started

### Creating Your First Node
1. Click the "Add Node" button in the top left corner
3. Enter a name for your node
4. (Optional) Add a description and due date
5. Click "Create"

### Connecting Nodes
1. Hover over a node to see the connection points
2. Click and drag from one node to another to create a connection
3. Release to establish the relationship

### Starting a Focus Session
0. Make sure you've enabled focus mode
1. Click on a node you want to work on
2. Click "Start Focus Session" and Set Scope and Objective
3. Start the Timer
4. Begin working, End Task when Finished.

## Using Focus Sessions

### During a Session (To be Added)
- The extension will monitor your tab usage
- If you switch to an unrelated tab, you'll get a gentle reminder
- You can mark certain websites as productive if they're related to your task

### Taking Breaks
1. Click the "Take Break" button when needed
2. Set your break duration
3. Tabby will remind you when it's time to return to work

## Progress Tracking

### Viewing Your Progress
- Click the "Progress" tab to see:
  - Your current streak
  - Completed nodes
  - Time spent in focus sessions
  - Most productive times

### Streaks
- Maintain your streak by completing at least one focus session per day
- View your streak history in the Progress tab

## Troubleshooting

### Common Issues

1. **Extension Not Working**
   - Try refreshing your browser
   - Check if the extension is enabled in Chrome settings
   - Ensure you're using a supported Chrome version

2. **Nodes Not Saving**
   - Check your internet connection
   - Try refreshing the extension
   - Clear browser cache if issues persist

3. **Focus Session Not Starting**
   - Ensure you've selected a node
   - Check if another session is already active
   - Try restarting the extension

## Reporting Bugs

If you encounter any issues while using Tabby, please help us improve by reporting them. We use GitHub Issues to track bugs and feature requests.

### How to Report a Bug

1. Visit our [GitHub Issues page](https://github.com/winston6800/tabby/issues)
2. Click "New Issue"
3. Select "Bug Report" template
4. Fill out the bug report form with the following information:

### Bug Report Template

```
## Summary
[Brief description of the issue in 10 words or less]

## Steps to Reproduce
1. [First step]
2. [Second step]
3. [And so on...]

## Expected Behavior
[What you expected to happen]

## Actual Behavior
[What actually happened]

## Environment
- Browser Version: [e.g., Chrome 88.0.4324.150]
- Operating System: [e.g., Windows 10, macOS 11.2]
- Tabby Version: [e.g., 1.0.0]

## Additional Information
- Can you reproduce this issue consistently? [Yes/No/Sometimes]
- When did you first notice this issue?
- Does this issue occur in a new browser profile?
- Any relevant screenshots or screen recordings
```

### Tips for Writing a Good Bug Report

1. **Be Specific**: Provide clear, step-by-step instructions to reproduce the issue
2. **Include Context**: Mention what you were trying to do when the bug occurred
3. **Add Details**: Include browser version, OS, and any relevant settings
4. **Attach Evidence**: Screenshots, videos, or error messages help us understand the issue
5. **Check for Duplicates**: Search existing issues before creating a new one

## Known Issues and Limitations

### Current Limitations
- Chrome browser only support
- Focus sessions require active internet connection
- Maximum of 100 nodes per workspace
- Node connections limited to 2D visualization

### Known Bugs
1. **Node Connection Issues**
   - Status: Under Investigation
   - Description: Sometimes connections between nodes may not appear immediately after creation
   - Workaround: Refresh the page to see the connection

2. **Focus Session Timer**
   - Status: In Progress
   - Description: Timer may not update correctly when browser is minimized
   - Workaround: Keep the browser window active during focus sessions

3. **Data Persistence**
   - Status: Fixed in next release
   - Description: Node data may not save immediately in some cases
   - Workaround: Manually save changes using the save button

### Reporting New Issues

If you encounter a bug that's not listed above:
1. Check if it's already reported in our [GitHub Issues](https://github.com/winston6800/tabby/issues)
2. If not, create a new issue using the bug report template
3. We'll review your report and update the known issues list accordingly

## Getting Help

- Visit our [GitHub repository](https://github.com/winston6800/tabby) for updates

## Privacy & Data

- All data is stored locally in your browser
- No personal information is collected without consent
- You can export your data at any time
- Clear all data through the settings menu

---

*This guide is a living document and will be updated as new features are added.* 