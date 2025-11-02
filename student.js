document.getElementById('studentName').textContent = localStorage.getItem('userEmail') || 'Student';
function logout(){
     localStorage.clear(); location.href='index.html'; }
async function loadStudent(){
     const uid = localStorage.getItem('userId') || 1;
     try{ const res = await fetch(`http://127.0.0.1:5000/api/students/${uid}/courses`);
     const data = res.ok? await res.json(): []; 
     document.getElementById('sCourses').textContent = data.length || 0; 
     const container = document.getElementById('coursesList'); 
     container.innerHTML = data.length ?
     data.map(c=>`<div class="card small"><strong>
        ${c.course_name}</strong><div class="muted">
        ${c.course_code}</div><div class="muted small">
        ${c.description||'-'}</div></div>`).join('') : '<p class="muted">No courses</p>'; }
         catch(e){ document.getElementById('coursesList').innerHTML = '<p class="muted">Unable to load</p>'; }}
 loadStudent();