(function () {
  console.log("CSV Viewer extension activated");

  if (!window.location.href.toLowerCase().endsWith(".csv")) {
    console.log("URL does not end with .csv, exiting");
    return;
  }

  console.log("URL ends with .csv, proceeding");

  let csvData = null;
  let rawCsvText = "";
  let tableView = true;
  let sortColumn = -1;
  let sortAscending = true;

  function createTable(data) {
    const headers = data.meta.fields;
    const rows = data.data;

    let table = '<div class="table-container"><table id="csvTable">';
    table +=
      "<thead><tr>" +
      headers
        .map(
          (header, index) =>
            `<th data-index="${index}">${header} <span class="sort-arrow"></span></th>`
        )
        .join("") +
      "</tr></thead>";
    table +=
      "<tbody>" +
      rows
        .map(
          (row) =>
            "<tr>" +
            headers.map((header) => `<td>${row[header]}</td>`).join("") +
            "</tr>"
        )
        .join("") +
      "</tbody>";
    table += "</table></div>";

    return table;
  }

  function createPlainText(data) {
    return '<pre id="csvPlainText">' + Papa.unparse(data) + "</pre>";
  }

  function toggleView() {
    tableView = !tableView;
    renderView();
  }

  function sortTable(columnIndex) {
    if (sortColumn === columnIndex) {
      sortAscending = !sortAscending;
    } else {
      sortColumn = columnIndex;
      sortAscending = true;
    }

    const header = csvData.meta.fields[columnIndex];
    csvData.data.sort((a, b) => {
      const aValue = a[header];
      const bValue = b[header];
      return sortAscending
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

    renderView();
  }

  function copyToClipboard() {
    navigator.clipboard
      .writeText(rawCsvText)
      .then(() => {
        alert("CSV data copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        alert("Failed to copy CSV data. Please check console for details.");
      });
  }

  function renderView() {
    const viewToggle =
      '<div class="csv-action-wrapper"><button id="viewToggle">Switch to ' +
      (tableView ? "Plain Text" : "Table") +
      ' View</button><button id="copyButton">Copy to Clipboard</button></div>';
    const searchInput =
      '<input type="text" id="searchInput" placeholder="Search...">';

    let content = tableView ? createTable(csvData) : createPlainText(csvData);

    document.body.innerHTML = viewToggle + searchInput + content;

    document.getElementById("viewToggle").addEventListener("click", toggleView);
    document
      .getElementById("copyButton")
      .addEventListener("click", copyToClipboard);

    if (tableView) {
      document.querySelectorAll("#csvTable th").forEach((th, index) => {
        th.addEventListener("click", () => sortTable(index));
      });

      // Update sort arrows
      const headers = csvData.meta.fields;
      headers.forEach((header, index) => {
        const th = document.querySelector(
          `#csvTable th[data-index="${index}"]`
        );
        const arrow = th.querySelector(".sort-arrow");
        if (index === sortColumn) {
          arrow.textContent = sortAscending ? "▲" : "▼";
        } else {
          arrow.textContent = "";
        }
      });
    }

    document
      .getElementById("searchInput")
      .addEventListener("input", function () {
        const searchText = this.value.toLowerCase();
        if (tableView) {
          document.querySelectorAll("#csvTable tbody tr").forEach((row) => {
            const rowText = row.textContent.toLowerCase();
            row.style.display = rowText.includes(searchText) ? "" : "none";
          });
        } else {
          const plainText = document.getElementById("csvPlainText");
          const lines = plainText.textContent.split("\n");
          plainText.innerHTML = lines
            .map((line) =>
              line.toLowerCase().includes(searchText)
                ? `<span class="highlight">${line}</span>`
                : line
            )
            .join("\n");
        }
      });
  }

  fetch(window.location.href)
    .then((response) => response.text())
    .then((text) => {
      console.log("Fetched content:", text.slice(0, 200)); // Log first 200 characters
      rawCsvText = text; // Store the raw CSV text
      Papa.parse(text, {
        header: true,
        complete: function (results) {
          csvData = results;
          renderView();
        },
        error: function (error) {
          console.error("Error parsing CSV:", error);
          document.body.innerHTML =
            "<p>Error parsing CSV file. Please make sure the file is a valid CSV.</p>";
        },
      });
    })
    .catch((error) => {
      console.error("Error fetching CSV:", error);
      document.body.innerHTML =
        "<p>Error loading CSV file. Please make sure the URL ends with .csv and the file is accessible.</p>";
    });
})();
