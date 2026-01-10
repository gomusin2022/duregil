// [일정 관리 모듈] - 산악회, 기타교실, 범방위 일정 통합 관리
export function initSchedule() {
    const display = document.getElementById('main-display');
    
    // 화면 UI 그리기
    display.innerHTML = `
        <div style="padding:15px; width:100%; height:100%; overflow-y:auto; box-sizing:border-box;">
            <h3 style="color:var(--point-red); margin-top:0;">📅 일정 등록</h3>
            
            <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:15px;">
                <input type="text" id="event-name" placeholder="행사명을 입력하세요" 
                    style="padding:12px; background:#333; border:1px solid #555; color:white; border-radius:5px;">
                
                <select id="event-type" style="padding:12px; background:#333; border:1px solid #555; color:white; border-radius:5px;">
                    <option value="var(--point-red)">⛰️ 산악회 (빨강)</option>
                    <option value="var(--point-green)">🎸 기타교실 (초록)</option>
                    <option value="var(--point-blue)">🛡️ 범방위 (파랑)</option>
                </select>
                
                <button onclick="saveEvent()" 
                    style="padding:12px; background:var(--metal-bright); color:white; border:1px solid #777; font-weight:bold; cursor:pointer;">
                    일정 추가하기
                </button>
            </div>

            <hr style="border:0.5px solid #444;">

            <h4 style="color:var(--text-silver);">저장된 일정 목록</h4>
            <ul id="event-list" style="list-style:none; padding:0; margin:0;"></ul>
            
            <button onclick="location.reload()" 
                style="margin-top:20px; width:100%; padding:10px; background:#444; color:white; border:none; border-radius:5px; cursor:pointer;">
                메인화면으로 돌아가기
            </button>
        </div>
    `;

    // 저장된 일정 불러오기
    renderEvents();
}

// [기능 1: 일정 저장]
window.saveEvent = function() {
    const name = document.getElementById('event-name').value;
    const type = document.getElementById('event-type').value;
    const typeText = document.getElementById('event-type').options[document.getElementById('event-type').selectedIndex].text;

    if (!name) return alert("행사명을 입력해주세요!");

    const events = JSON.parse(localStorage.getItem('duregil_events') || '[]');
    events.push({ id: Date.now(), name, type, typeText });
    localStorage.setItem('duregil_events', JSON.stringify(events));
    
    document.getElementById('event-name').value = '';
    renderEvents();
};

// [기능 2: 목록 그리기]
function renderEvents() {
    const list = document.getElementById('event-list');
    const events = JSON.parse(localStorage.getItem('duregil_events') || '[]');
    
    if (events.length === 0) {
        list.innerHTML = `<p style="color:#666; font-size:0.8rem;">등록된 일정이 없습니다.</p>`;
        return;
    }

    list.innerHTML = events.map(ev => `
        <li style="background:#222; margin-bottom:8px; padding:10px; border-left:5px solid ${ev.type}; display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:0.9rem;">${ev.name} <br><small style="color:#888;">${ev.typeText.split(' ')[0]}</small></span>
            <button onclick="deleteEvent(${ev.id})" style="background:#e74c3c; color:white; border:none; padding:5px 8px; border-radius:3px; font-size:0.7rem;">삭제</button>
        </li>
    `).join('');
}

// [기능 3: 일정 삭제]
window.deleteEvent = function(id) {
    let events = JSON.parse(localStorage.getItem('duregil_events') || '[]');
    events = events.filter(ev => ev.id !== id);
    localStorage.setItem('duregil_events', JSON.stringify(events));
    renderEvents();
};