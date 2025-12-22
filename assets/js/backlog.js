document.addEventListener("DOMContentLoaded", () => {
    fetch('../data/backlog_data.json')
        .then(response => response.json())
        .then(data => populateTable(data))
        .catch(error => console.error('Error loading backlog data:', error));
});

function populateTable(data) {
    const tableBody = document.getElementById('tableBody');
    const totalCreditsElement = document.getElementById('totalCredits');
    
    tableBody.innerHTML = '';

    let totalCredits = 0;

    data.forEach(row => {
        const tr = document.createElement('tr');
        
        // Status Logic: Green if "not" is NOT present, Red otherwise.
        const statusColor = row.status.toLowerCase().includes('not') ? 'Red' : 'Green';
        
        // Removed align="center" to allow CSS 'text-align: left' to work
        tr.innerHTML = `
            <td>${row.semester}</td>
            <td><font face="arial">${row.subject}</font></td>
            <td><font face="arial">${row.type}</font></td>
            <td><font face="arial">${row.credit.toFixed(1)}</font></td>
            <td>${row.remarks}</td>
            <td><font color="${statusColor}"><b>${row.status}</b></font></td>
        `;

        tableBody.appendChild(tr);
        totalCredits += row.credit;
    });

    totalCreditsElement.innerHTML = `<b>${totalCredits.toFixed(1)}</b>`;
}