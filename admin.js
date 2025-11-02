document.querySelectorAll('.sidebar nav li').forEach(li=>{
  li.addEventListener('click', ()=>{
    document.querySelectorAll('.sidebar nav li').forEach(x=>x.classList.remove('active'));
    li.classList.add('active');
    const view = li.getAttribute('data-view');
    document.getElementById('pageTitle').textContent = li.textContent;
    document.querySelectorAll('.view').forEach(v=> v.classList.remove('active'));
    const target = document.getElementById('view-'+view);
    if(target) target.classList.add('active');
  });
});
document.getElementById('toggleBtn').addEventListener('click', ()=>{
  document.getElementById('sidebar').classList.toggle('collapsed');
});
function logout(){ localStorage.clear(); location.href='index.html'; }
document.getElementById('username').textContent = localStorage.getItem('userEmail') || 'Admin';
async function loadOverview(){
  try{
    const sRes = await fetch('http://127.0.0.1:5000/api/students');
    const students = sRes.ok ? await sRes.json() : [];
    document.getElementById('totalStudents').textContent = students.length || 0;
    const tbody = document.querySelector('#studentsTable tbody');
    tbody.innerHTML='';
    for(const s of students.slice(0,10)){
      let courses = [];
      try{ const r = await fetch(`http://127.0.0.1:5000/api/students/${s.user_id}/courses`); if(r.ok) courses = await r.json(); }catch(e){}
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>R-2025-${String(s.user_id).padStart(3,'0')}</td><td>${s.user_id}</td><td>${s.first_name} ${s.last_name}</td><td>${s.date_of_birth||'-'}</td><td>${s.email}</td><td>${courses.map(c=>c.course_code||c.course_name).join(', ')||'-'}</td><td>—%</td>`;
      tbody.appendChild(tr);
    }
  }catch(e){ console.error(e); }
}
async function loadStudentsView(){
  try{
    const res = await fetch('http://127.0.0.1:5000/api/students');
    const students = res.ok ? await res.json() : [];
    const tbody = document.querySelector('#studentsTable2 tbody');
    tbody.innerHTML='';
    for(const s of students){
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>R-2025-${String(s.user_id).padStart(3,'0')}</td><td>${s.user_id}</td><td>${s.first_name||'-'}</td><td>${s.last_name||'-'}</td><td>${s.date_of_birth||'-'}</td><td>${s.email}</td>`;
      tbody.appendChild(tr);
    }
  }catch(e){ console.error(e); }
}
async function loadCoursesView(){
  try{
    const res = await fetch('http://127.0.0.1:5000/api/courses');
    const courses = res.ok ? await res.json() : [];
    document.getElementById('totalCourses').textContent = courses.length || 0;
    const tbody = document.querySelector('#coursesTable tbody');
    tbody.innerHTML='';
    for(const c of courses){
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${c.course_id}</td><td>${c.course_code}</td><td>${c.course_name}</td><td>${c.description||'-'}</td>`;
      tbody.appendChild(tr);
    }
  }catch(e){ console.error(e); }
}
const modalStudent = document.getElementById('modalStudent');
const modalCourse = document.getElementById('modalCourse');
document.getElementById('openAddStudent').addEventListener('click', ()=> modalStudent.classList.add('show'));
document.getElementById('closeStudentModal').addEventListener('click', ()=> modalStudent.classList.remove('show'));
document.getElementById('openAddCourse').addEventListener('click', ()=> modalCourse.classList.add('show'));
document.getElementById('closeCourseModal').addEventListener('click', ()=> modalCourse.classList.remove('show'));
document.getElementById('addStudentForm').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const form = e.target;
  const data = { first_name: form.first_name.value.trim(), last_name: form.last_name.value.trim(), email: form.email.value.trim(), password: form.password.value.trim(), date_of_birth: form.date_of_birth.value || null };
  try{
    const res = await fetch('http://127.0.0.1:5000/api/students', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)});
    const j = await res.json();
    document.getElementById('addStudentMsg').textContent = j.message || j.error || 'Done';
    if(res.ok){ modalStudent.classList.remove('show'); loadStudentsView(); loadOverview(); }
  }catch(e){ document.getElementById('addStudentMsg').textContent = 'Failed'; }
});
document.getElementById('addCourseForm').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const form = e.target;
  const data = { course_name: form.course_name.value.trim(), course_code: form.course_code.value.trim(), description: form.description.value.trim() };
  try{
    const res = await fetch('http://127.0.0.1:5000/api/courses', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(data)});
    const j = await res.json();
    document.getElementById('addCourseMsg').textContent = j.message || j.error || 'Done';
    if(res.ok){ modalCourse.classList.remove('show'); loadCoursesView(); loadOverview(); }
  }catch(e){ document.getElementById('addCourseMsg').textContent = 'Failed'; }
});
loadOverview(); loadStudentsView(); loadCoursesView();