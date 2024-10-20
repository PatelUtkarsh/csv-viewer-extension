# CSV Viewer Firefox Extension

## Description

CSV Viewer is a Firefox extension that enhances the browsing experience for CSV (Comma-Separated Values) files. It provides a user-friendly interface to view, sort, search, and interact with CSV data directly in the browser.

## Features

- **Table View**: Displays CSV data in a neatly formatted table.
- **Plain Text View**: Allows viewing the raw CSV text.
- **Sorting**: Click on column headers to sort the data.
- **Searching**: Real-time search functionality to filter data.
- **Copy to Clipboard**: Easily copy the entire CSV content to the clipboard.
- **Responsive Design**: Handles large CSV files with horizontal scrolling.

## Installation

1. Download the latest release from the [Releases](https://github.com/patelutkarsh/simple-csv-viewer/releases) page.
2. Open Firefox and navigate to `about:addons`.
3. Click the gear icon and select "Install Add-on From File".
4. Choose the downloaded `.xpi` file.

## Usage

1. Navigate to any URL ending with `.csv` in Firefox.
2. The extension will automatically activate and display the CSV content in a table format.
3. Use the "Switch to Plain Text View" button to toggle between table and plain text views.
4. In table view, click on column headers to sort the data.
5. Use the search box to filter the data in real-time.
6. Click the "Copy to Clipboard" button to copy the raw CSV data.

### Building the Extension

To build the extension and create an XPI file:

1. Open Terminal (macOS/Linux).
2. Navigate to the extension's directory:
   ```
   cd path/to/csv-viewer-extension
   ```
3. Run the following command:
   - For macOS/Linux:
     ```
     zip -r -FS ../csv-viewer.xpi * -x "*.git*" -x "*.DS_Store"
     ```
4. The XPI file will be created in the parent directory of your project folder.