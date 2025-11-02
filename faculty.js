document.getElementById('facultyName').textContent = localStorage.getItem('userEmail') || 'Faculty';
function logout(){ localStorage.clear(); location.href='index.html'; }
document.getElementById('gradeForm')?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  const data = { enrollment_id: document.getElementById('enrollment_id').value, grade: document.getElementById('grade').value, attendance_date: document.getElementById('attendance_date').value, status: document.getElementById('status').value };
  try{
    const res = await fetch('http://127.0.0.1:5000/api/grades',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
    const j = await res.json();
    document.getElementById('gradeResult').textContent = j.message || j.error || 'Submitted';
  }catch(e){ document.getElementById('gradeResult').textContent = 'Submit failed'; }
});