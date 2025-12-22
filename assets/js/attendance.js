// Note: We removed the DOMContentLoaded listener so it doesn't load automatically.

function loadAttendance() {
    // Show the table container
    document.getElementById('attendanceTable').style.display = "table";
    
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '<tr><td colspan="6">Loading data...</td></tr>';

    fetch('../../data/attendance_data.json')
        .then(response => response.json())
        .then(data => renderTable(data))
        .catch(error => {
            console.error('Error loading attendance:', error);
            tbody.innerHTML = '<tr><td colspan="6" style="color:red;">Error loading data.</td></tr>';
        });
}

function renderTable(data) {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = ''; // Clear loading text

    data.forEach(row => {
        const tr = document.createElement('tr');
        
        // 1. Calculate Individual Percentages (Pass row.code now!)
        const lecHtml = calculateCell(row.lecture, row.subject, 'Lecture', row.code);
        const tutHtml = calculateCell(row.tutorial, row.subject, 'Tutorial', row.code);
        const pracHtml = calculateCell(row.practical, row.subject, 'Practical', row.code);

        // 2. Calculate Combined Lecture + Tutorial
        let ltHtml = "&nbsp;";
        if (row.lecture || row.tutorial) {
            // Initialize counts
            let totalAtt = 0;
            let totalDel = 0;

            if(row.lecture) { totalAtt += row.lecture.attended; totalDel += row.lecture.delivered; }
            if(row.tutorial) { totalAtt += row.tutorial.attended; totalDel += row.tutorial.delivered; }

            if (totalDel > 0) {
                const pct = Math.round((totalAtt / totalDel) * 100);
                
                // Create link for combined (Passing Code here too)
                // Note: You might need to create a specific 'LT' json file or just link to Lecture
                const url = `attendance-detail.html?code=${row.code}&type=Lecture&subject=${encodeURIComponent(row.subject)}`;
                ltHtml = `<a href="${url}" target="_blank"><font color="blue">${pct}</font></a>`;
            }
        }

        tr.innerHTML = `
            <td>${row.sno}</td>
            <td>${row.subject}</td>
            <td>${ltHtml}</td>
            <td>${lecHtml}</td>
            <td>${tutHtml}</td>
            <td>${pracHtml}</td>
        `;

        tbody.appendChild(tr);
    });
}

// Updated Helper: Now accepts subjectCode
function calculateCell(dataObj, subjectName, typeName, subjectCode) {
    if (!dataObj || dataObj.delivered === 0) return "&nbsp;";
    
    const percentage = Math.round((dataObj.attended / dataObj.delivered) * 100);
    
    // Create URL with Code, Type, and Name
    // This allows the detail page to find the file: data/details/{CODE}_{TYPE}.json
    const url = `attendance-detail.html?code=${subjectCode}&type=${typeName}&subject=${encodeURIComponent(subjectName)}`;
    
    return `<a href="${url}" target="_blank"><font color="blue">${percentage}</font></a>`;
}