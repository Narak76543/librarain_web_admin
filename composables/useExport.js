export const useExport = () => {
  const exportData = (rows, columns, filename, format) => {
    if (!rows || !rows.length) return;

    if (format === 'csv') {
      const headers = columns.map(c => c.label).join(',');
      const csvRows = [headers];

      for (const row of rows) {
        const values = columns.map(c => {
          let val = row[c.key];
          if (val === null || val === undefined) val = '';
          val = String(val).replace(/"/g, '""');
          if (val.includes(',') || val.includes('\n')) {
            val = `"${val}"`;
          }
          return val;
        });
        csvRows.push(values.join(','));
      }

      const csvString = csvRows.join('\n');
      const blob = new Blob(['\ufeff' + csvString], { type: 'text/csv;charset=utf-8;' });
      triggerDownload(blob, `${filename}.csv`);

    } else if (format === 'excel') {
      // Create a simple HTML table to be opened by Excel
      let html = '<html xmlns:x="urn:schemas-microsoft-com:office:excel">';
      html += '<head><meta charset="UTF-8"></head><body><table>';
      
      // Headers
      html += '<tr>';
      columns.forEach(c => {
        html += `<th>${c.label}</th>`;
      });
      html += '</tr>';

      // Rows
      rows.forEach(row => {
        html += '<tr>';
        columns.forEach(c => {
          let val = row[c.key];
          if (val === null || val === undefined) val = '';
          html += `<td>${val}</td>`;
        });
        html += '</tr>';
      });

      html += '</table></body></html>';
      const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
      triggerDownload(blob, `${filename}.xls`);
    }
  };

  const triggerDownload = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return { exportData };
};
