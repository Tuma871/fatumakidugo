let students = [];
let currentStudent = null;

// Register Student
document.getElementById("studentForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let name = document.getElementById("name").value.trim();
    let id = document.getElementById("studentId").value.trim();
    let age = document.getElementById("age").value;
    let gender = document.getElementById("gender").value;
    let form = parseInt(document.getElementById("formLevel").value);

    if (!name || !id || !age || !gender || !form) {
        alert("All fields are required!");
        return;
    }

    if (students.some(student => student.id === id)) {
        alert("Student ID must be unique!");
        return;
    }

    let student = {
        id: id,
        name: name,
        age: age,
        gender: gender,
        form: form,
        performance: []
    };

    students.push(student);
    displayStudents();
    this.reset();
});

// Display Students
function displayStudents() {
    let table = document.getElementById("studentTable");
    table.innerHTML = "";

    students.forEach(student => {
        let avg = calculateOverallAverage(student);

        table.innerHTML += `
            <tr>
                <td>${student.id}</td>
                <td>${student.name}</td>
                 <td>${student.age}</td>
                  <td>${student.gender}</td>
                <td>Form ${student.form}</td>
                <td>${avg ? avg.toFixed(2) : "N/A"}</td>
                <td>
                    <button onclick="viewStudent('${student.id}')">View</button>
                    <button onclick="deleteStudent('${student.id}')">Delete</button>
                </td>
            </tr>
        `;
    });
}

// View Student
function viewStudent(id) {
    currentStudent = students.find(student => student.id === id);
    document.getElementById("performanceSection").classList.remove("hidden");
    document.getElementById("selectedStudent").innerText =
        currentStudent.name + " (Form " + currentStudent.form + ")";

    displayPerformance();
}

// Delete Student
function deleteStudent(id) {
    students = students.filter(student => student.id !== id);
    displayStudents();
    document.getElementById("performanceSection").classList.add("hidden");
}

// Save Performance
function savePerformance() {
    if (!currentStudent) return;

    let math = parseInt(document.getElementById("math").value);
    let english = parseInt(document.getElementById("english").value);
    let science = parseInt(document.getElementById("science").value);
    let social = parseInt(document.getElementById("social").value);

    if (isNaN(math) || isNaN(english) || isNaN(science) || isNaN(social)) {
        alert("Enter valid marks!");
        return;
    }

    let performanceRecord = {
        form: currentStudent.form,
        subjects: { math, english, science, social }
    };

    let existing = currentStudent.performance.find(p => p.form === currentStudent.form);

    if (existing) {
        existing.subjects = performanceRecord.subjects;
    } else {
        currentStudent.performance.push(performanceRecord);
    }

    displayPerformance();
    displayStudents();
}

// Display Performance
function displayPerformance() {
    let display = document.getElementById("performanceDisplay");
    display.innerHTML = "";

    currentStudent.performance.forEach(p => {
        let avg = calculateAverage(p.subjects);

        display.innerHTML += `
            <p>
                <strong>Form ${p.form}</strong> |
                Math: ${p.subjects.math},
                English: ${p.subjects.english},
                Science: ${p.subjects.science},
                Social: ${p.subjects.social}
                | Average: ${avg.toFixed(2)}
            </p>
        `;
    });
}

// Calculate Average Per Form
function calculateAverage(subjects) {
    return (subjects.math + subjects.english + subjects.science + subjects.social) / 4;
}

// Calculate Overall Average
function calculateOverallAverage(student) {
    if (student.performance.length === 0) return null;

    let total = 0;
    student.performance.forEach(p => {
        total += calculateAverage(p.subjects);
    });

    return total / student.performance.length;
}

// Promote Student
function promoteStudent() {
    if (!currentStudent) return;

    if (currentStudent.form < 4) {
        currentStudent.form++;
        alert("Student promoted to Form " + currentStudent.form);
    } else {
        alert("Student has completed Form 4!");
    }

    displayStudents();
    viewStudent(currentStudent.id);

}

