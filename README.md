# Web Annotator Extension



## Overview



The Web Annotator Extension is a versatile browser tool designed to enhance your web browsing experience by allowing you to annotate web pages directly. Whether you're a student, researcher, or professional, this extension makes it easy to mark up web content with drawings, highlights, notes, and more. Save your annotations for future reference, making it an invaluable tool for productivity and information management.



## Features



### Pen Tool



Draw freehand on any web page using a customizable pen tool. Choose from various colors to personalize your annotations.



### Highlighter Tool



Highlight important text passages with the highlighter tool. Multiple colors are available to categorize and differentiate your highlights.



### Add Note Tool



Attach textual notes to specific sections of a web page. This feature is perfect for adding detailed comments or reminders.



### Undo



Easily undo the last action to correct mistakes without starting over.



### Save Annotations



Save your annotations so you can revisit and review them later. Annotations are stored locally and are automatically restored when you return to the page.



### Color Selector



Choose from a palette of colors for both the pen and highlighter tools, allowing for a personalized annotation experience.



## File Structure



### popup.html



Contains the HTML structure for the extension's popup UI, providing a clean and user-friendly interface for selecting tools and colors.



### styles.css



Defines the CSS styles for the extension's UI components, ensuring a visually appealing and consistent design.



### popup.js



Handles user interactions within the popup UI, sending messages to the content script to perform actions like drawing, highlighting, and saving annotations.



### background.js



Manages background tasks, including saving and loading annotations, ensuring that your work is preserved and accessible whenever you need it.



## Installation



1. **Clone or Download**: Obtain the project files by cloning the repository or downloading the ZIP file.

2. **Open Browser Extensions Page**: Navigate to the extensions management page in your browser (e.g., `chrome://extensions` in Chrome).

3. **Enable Developer Mode**: Turn on "Developer mode" to allow loading of unpacked extensions.

4. **Load Unpacked Extension**: Click "Load unpacked" and select the directory where the project files are located.

5. **Verify Installation**: The Web Annotator Extension should now be visible in your browser's extension list.



## Usage



1. **Open the Popup**: Click the extension icon in the browser toolbar to open the popup interface.



   ![Popup UI](screenshots/select-extension.png)



2. **Select a Tool**: Choose the tool you want to use (pen, highlighter, note, undo, save) from the popup.



   ![Select Tool](screenshots/select-tool.png)



3. **Choose a Color**: For the pen and highlighter tools, pick a color from the color selector.



4. **Annotate**: Start annotating the webpage as needed.



   ![Annotate Webpage](screenshots/annotate.png)



5. **Save Annotations**: Click "Save" to store your annotations. They will be automatically restored when you revisit the page.



## Contribution



We welcome contributions from the community! If you encounter any issues, have suggestions for new features, or want to improve existing functionalities, please open an issue or submit a pull request on our GitHub repository. Your feedback and contributions are highly appreciated and help make this tool better for everyone.



## License



This project is licensed under the MIT License. You are free to use, modify, and distribute this software. See the LICENSE file for more details.



## Detailed Breakdown of Components



### popup.html



The `popup.html` file is the backbone of the extension’s user interface. It defines the structure of the popup that appears when you click the extension icon. This file includes buttons for each tool (pen, highlighter, note, undo, save) and the color selector.



### styles.css



The `styles.css` file ensures that the UI is visually appealing and consistent. It includes styles for the buttons, layout, and hover effects. By customizing this file, you can change the appearance of the extension to better suit your preferences.



### popup.js



The `popup.js` file handles the interaction logic of the popup. When a user clicks a button, this script sends a message to the content script (`content.js`). For instance, if you click the pen tool, `popup.js` tells `content.js` to activate the pen tool on the current webpage.



### background.js



The `background.js` file manages persistent tasks. It listens for messages to save or load annotations and interacts with Chrome’s storage API to persist data across sessions. This ensures that your annotations are available even after you close and reopen the browser.



## Advanced Usage and Tips



### Customizing Tools



You can customize the pen and highlighter tools by modifying the `popup.js` and `content.js` files. Adjust the line width, opacity, and colors to fit your needs.



### Keyboard Shortcuts



For power users, consider adding keyboard shortcuts to quickly switch between tools. This can be done by modifying the `commands` section in the `manifest.json` file and handling the shortcuts in `popup.js`.



### Cloud Sync



While the extension currently saves annotations locally, advanced users might integrate cloud storage solutions (like Google Drive or Dropbox) for cross-device sync. This would involve modifying `background.js` to handle OAuth and API interactions with the cloud storage service.



## Future Enhancements



We are constantly looking to improve the Web Annotator Extension. Here are some planned features:



- **Annotation Sharing**: Share your annotations with others via a unique link.

- **Collaboration Tools**: Enable multiple users to annotate the same webpage simultaneously.

- **Advanced Text Recognition**: Use OCR (Optical Character Recognition) to convert handwritten notes into editable text.



---
