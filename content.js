import Papa from "papaparse";

(function () {
  if (!window.location.href.toLowerCase().endsWith(".csv")) {
    return;
  }

  let csvData = null;
  let rawCsvText = "";
  let tableView = true;
  let sortColumn = -1;
  let sortAscending = true;

  function createTable(data) {
    const headers = data.meta.fields;
    const rows = data.data;

    const table = document.createElement("table");
    table.id = "csvTable";

    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    headers.forEach((header, index) => {
      const th = document.createElement("th");
      th.dataset.index = index;
      th.textContent = header + " ";
      const sortArrow = document.createElement("span");
      sortArrow.className = "sort-arrow";
      th.appendChild(sortArrow);
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    rows.forEach((row) => {
      const tr = document.createElement("tr");
      headers.forEach((header) => {
        const td = document.createElement("td");
        td.textContent = row[header];
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    const tableContainer = document.createElement("div");
    tableContainer.className = "table-container";
    tableContainer.appendChild(table);

    return tableContainer;
  }

  function createPlainText(data) {
    const pre = document.createElement("pre");
    pre.id = "csvPlainText";
    pre.textContent = Papa.unparse(data);
    return pre;
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
    document.body.textContent = "";

    const actionWrapper = document.createElement("div");
    actionWrapper.className = "csv-action-wrapper";

    const viewToggleBtn = document.createElement("button");
    viewToggleBtn.id = "viewToggle";
    viewToggleBtn.textContent = `Switch to ${
      tableView ? "Plain Text" : "Table"
    } View`;
    actionWrapper.appendChild(viewToggleBtn);

    const copyButton = document.createElement("button");
    copyButton.id = "copyButton";
    copyButton.textContent = "Copy to Clipboard";
    actionWrapper.appendChild(copyButton);

    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.id = "searchInput";
    searchInput.placeholder = "Search...";

    document.body.appendChild(actionWrapper);
    document.body.appendChild(searchInput);

    if (tableView) {
      document.body.appendChild(createTable(csvData));
    } else {
      document.body.appendChild(createPlainText(csvData));
    }

    viewToggleBtn.addEventListener("click", toggleView);
    copyButton.addEventListener("click", copyToClipboard);

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
        arrow.textContent =
          index === sortColumn ? (sortAscending ? "▲" : "▼") : "";
      });
    }

    searchInput.addEventListener("input", function () {
      const searchText = this.value.toLowerCase();
      if (tableView) {
        document.querySelectorAll("#csvTable tbody tr").forEach((row) => {
          const rowText = row.textContent.toLowerCase();
          row.style.display = rowText.includes(searchText) ? "" : "none";
        });
      } else {
        const plainText = document.getElementById("csvPlainText");
        const lines = plainText.textContent.split("\n");
        plainText.textContent = "";
        lines.forEach((line) => {
          const lineElement = document.createElement("span");
          lineElement.textContent = line + "\n";
          if (line.toLowerCase().includes(searchText)) {
            lineElement.className = "highlight";
          }
          plainText.appendChild(lineElement);
        });
      }
    });
  }

  fetch(window.location.href)
    .then((response) => response.text())
    .then((text) => {
      rawCsvText = text; // Store the raw CSV text
      Papa.parse(text, {
        header: true,
        complete: function (results) {
          csvData = results;
          renderView();
        },
        error: function (error) {
          console.error("Error parsing CSV:", error);
        },
      });
    })
    .catch((error) => {
      console.error("Error fetching CSV:", error);
    });
})();
