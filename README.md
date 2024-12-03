# LeetCode Automation Chrome Extension

A powerful Chrome extension that automates your LeetCode problem-solving workflow. Currently optimized for C++ solutions with built-in extensibility for other programming languages. The extension automatically detects the current problem, loads the appropriate solution, and helps streamline your LeetCode practice sessions.

## Features

- Smart Problem Detection: Automatically identifies the current LeetCode problem
- Solution Auto-Loading: Instantly loads solutions from your local repository
- Dark Theme UI: Modern, eye-friendly interface
- Quick Copy: One-click solution copying
- Extensive Coverage: Currently mapped for problems 0-899 (expandable to 3399)
- Language Support: Currently optimized for C++, with easy extensibility for other languages
- Clean Interface: Intuitive popup window with problem information and controls

## Installation

1. Enable Developer Mode in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Toggle "Developer mode" in the top right corner

2. Load the Extension:
   - Click "Load unpacked"
   - Select the extension directory
   - The extension icon should appear in your Chrome toolbar

## How to Use

1. Navigate: Go to any LeetCode problem page
2. Click: Open the extension by clicking its icon
3. Load: The extension will automatically:
   - Detect the current problem
   - Find the corresponding solution
   - Display the solution details
4. Copy: Use the copy button to copy the solution code
5. Submit: Paste and submit your solution

## Current Solution Coverage

- Problems range: 0-899 (currently implemented)
- Planned expansion: Up to problem 3399
- Primary language: C++
- Solution format: Optimized and tested solutions

## Technical Details

- Built with vanilla JavaScript for optimal performance
- Uses Chrome Extension Manifest V3
- Implements secure local file access
- Smart problem mapping system
- Efficient solution retrieval algorithm

## Language Support

Currently optimized for C++, but designed for multi-language support:
- C++ (.cpp files) - Fully Supported
- Python (.py files) - Ready for Implementation
- Java (.java files) - Ready for Implementation
- JavaScript (.js files) - Ready for Implementation

## Performance

- Instant problem detection
- Fast solution loading
- Minimal memory footprint
- Efficient file system operations

## Security

- Local file system access only
- No external API calls
- No data collection
- Secure manifest implementation

## TODO List

- [done] Display solutions according to problem name
- [done] Implement full automation for problem submission process
- [done] Add automatic navigation to next problem
- [ ] Expand problem mapping to 3399
- [ ] Add support for multiple programming languages
- [ ] Implement solution versioning
- [ ] Add solution performance metrics
- [ ] Create solution testing framework
- [ ] Add problem difficulty filtering
- [ ] Implement solution commenting system

## Contributing

Feel free to contribute by:
1. Expanding the problem mapping range
2. Adding support for additional programming languages
3. Improving the UI/UX
4. Adding new features from the TODO list
5. Reporting bugs or suggesting improvements

## License

MIT License - Feel free to use and modify as needed.

## Future Plans

- Integration with LeetCode's API
- Support for problem categories and tags
- Solution performance comparison
- Progress tracking dashboard
- Multiple solution variants per problem
