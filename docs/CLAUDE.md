# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Build and Development
- `npm run build` - Builds the minified widget using Rollup, outputs to `dist/feedback-widget.min.js`
- `npm test` - Runs Jest tests (no test files exist yet)

### Storyboard Development
The storyboard is a Docker-based interactive tool for visualizing widget variations:
- `make story` - Build and run storyboard on port 8080
- `make story PORT=3000` - Run on custom port
- `make story USE_VOLUME=1` - Development mode with live file updates
- `make story-clean` - Stop the storyboard container
- `make story-logs` - View container logs
- `make story-debug` - Debugging information

Note: ESLint and Prettier are installed but no lint/format scripts are configured in package.json.

## Architecture

### FeedbackWidget Class Structure
The widget is implemented as a single class that supports three feedback types:
1. **Star Rating** - 5-star rating system
2. **Thumbs** - Up/down binary feedback
3. **Text** - Limited to 140 characters

### Configuration Flow
```javascript
new FeedbackWidget({
  type: 'star|thumbs|text',
  targetElement: DOM_ELEMENT,  // defaults to document.body
  theme: {
    primaryColor: '#007BFF',
    secondaryColor: '#6C757D',
    fontFamily: 'Arial, sans-serif'
  },
  onSubmit: (data) => { /* handle feedback */ }
})
```

### Key Implementation Details
- **No Dependencies**: Pure vanilla JavaScript implementation
- **UMD Format**: Universal module definition for compatibility with CommonJS, AMD, and global scripts
- **Inline Styling**: Styles are applied inline or via style tags to avoid CSS conflicts
- **Event Handling**: The `onSubmit` callback receives typed feedback data:
  - Star: `{type: 'star', value: '1-5'}`
  - Thumbs: `{type: 'thumbs', value: 'up|down'}`
  - Text: `{type: 'text', value: 'user input'}`

### Build Configuration
- **Rollup**: Bundles src/feedback-widget.js with terser minification
- **Plugins**: node-resolve and commonjs for module compatibility
- **Source Maps**: Generated for debugging

### Development Workflow
1. Edit source in `src/feedback-widget.js`
2. Run `npm run build` to generate minified version
3. Test using examples/index.html or the Docker storyboard
4. The storyboard (examples/storyboard.html) provides interactive customization controls