// [일정 관리 모듈] - 산악회, 기타교실, 범방위, 기타사항 통합 관리 (전체 소스)
export function initSchedule() {
    const display = document.getElementById('main-display');
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    // 화면 UI 그리기 (달력 + 입력창 통합)
    display.innerHTML = `
        <div style="padding:15px; width:100%; height:100%; overflow-y:auto; box-sizing:border-box; background:#181818;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <h3 style="color:#f39c12; margin:0;">📅 ${year}년 ${month + 1}월 일정</h3>
                <button onclick="location.reload()" style="background:#444; color:white; border:none; padding:5px 10px; cursor:pointer; border-radius:3px;">닫기</button>
            </div>
            
            <div id="calendar-grid" style="display:grid; grid-template-columns:repeat(7, 1fr); gap:1px; background:#444; border:1px solid #444; margin-bottom:20px;">
                ${['일','월','화','수','목','금','토'].map(d => `<div style="background:#222; padding:5px; text-align:center; font-size:0.7rem; color:#888;">${d}</div>`).join('')}
                ${generateCalendarDays(year, month)}
            </div>

            <hr style="border:0.5px solid #444; margin:20px 0;">

            <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:15px;">
                <input type="text" id="event-name" placeholder="행사명을 입력하세요" 
                    style="padding:12px; background:#333; border:1px solid #555; color:white; border-radius:5px;">
                
                <select id="event-type" style="padding:12px; background:#333; border:1px solid #555; color:white; border-radius:5px;">
                    <option value="var(--point-red)">⛰️ 산악회 (빨강)</option>
                    <option value="var(--point-green)">🎸 기타교실 (초록)</option>
                    <option value="var(--point-blue)">🛡️ 범방위 (파랑)</option>
                    <option value="#f39c12">🔸 기타사항 (오렌지)</option>
                </select>

                <input type="number" id="event-date" placeholder="날짜(일) 입력 (예: 15)" 
                    style="padding:12px; background:#333; border:1px solid #555; color:white; border-radius:5px;">
                
                <button onclick="saveEvent()" 
                    style="padding:12px; background:#f39c12; color:black; border:none; font-weight:bold; cursor:pointer; border-radius:5px;">
                    일정 추가하기
                </button>
            </div>

            <h4 style="color:var(--text-silver);">저장된 일정 목록</h4>
            <ul id="event-list" style="list-style:none; padding:0; margin:0;"></ul>
        </div>
    `;

    renderEvents();
}

// [보조 기능: 달력 날짜 생성 로직]
function generateCalendarDays(year, month) {
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    let days = '';
    const events = JSON.parse(localStorage.getItem('dure_evs') || '[]');

    for (let i = 0; i < firstDay; i++) days += `<div style="background:#181818; padding:15px;"></div>`;
    for (let d = 1; d <= lastDate; d++) {
        const dayEvs = events.filter(e => parseInt(e.date) === d);
        const dots = dayEvs.map(e => `<span style="display:inline-block; width:5px; height:5px; background:${e.type}; border-radius:50%; margin:1px;"></span>`).join('');
        days += `<div style="background:#222; min-height:40px; padding:2px; font-size:0.75rem; border:1px solid #181818;">
                    ${d}<br><div style="display:flex; flex-wrap:wrap; justify-content:center;">${dots}</div>
                 </div>`;
    }
    return days;
}

// [보조 기능: 일정 저장 및 화면 갱신]
window.saveEvent = function() {
    const name = document.getElementById('event-name').value;
    const type = document.getElementById('event-type').value;
    const date = document.getElementById('event-date').value;
    const typeText = document.getElementById('event-type').options[document.getElementById('event-type').selectedIndex].text;

    if (!name || !date) return alert("행사명과 날짜를 모두 입력해주세요!");

    const events = JSON.parse(localStorage.getItem('dure_evs') || '[]');
    events.push({ id: Date.now(), name, type, typeText, date });
    localStorage.setItem('dure_evs', JSON.stringify(events));
    
    initSchedule(); // 달력과 목록 즉시 업데이트
};

// [보조 기능: 하단 목록 렌더링]
function renderEvents() {
    const list = document.getElementById('event-list');
    const events = JSON.parse(localStorage.getItem('dure_evs') || '[]');
    
    if (events.length === 0) {
        list.innerHTML = `<p style="color:#666; font-size:0.8rem; text-align:center;">등록된 일정이 없습니다.</p>`;
        return;
    }

    list.innerHTML = events.slice().reverse().map(ev => `
        <li style="background:#222; margin-bottom:8px; padding:12px; border-left:5px solid ${ev.type}; display:flex; justify-content:space-between; align-items:center; border-radius:0 5px 5px 0;">
            <div style="text-align:left;">
                <span style="font-size:0.95rem; color:white; font-weight:bold;">${ev.date}일: ${ev.name}</span><br>
                <small style="color:${ev.type === '#f39c12' ? '#f39c12' : ev.type}; font-size:0.75rem;">${ev.typeText}</small>
            </div>
            <button onclick="deleteEvent(${ev.id})" style="background:#e74c3c; color:white; border:none; padding:8px 12px; border-radius:5px; font-size:0.75rem;">삭제</button>
        </li>
    `).join('');
}

// [보조 기능: 일정 삭제]
window.deleteEvent = function(id) {
    if(!confirm("이 일정을 삭제하시겠습니까?")) return;
    let events = JSON.parse(localStorage.getItem('dure_evs') || '[]');
    events = events.filter(ev => ev.id !== id);
    localStorage.setItem('dure_evs', JSON.stringify(events));
    initSchedule();
};