
       // ================================================================
// ===== MODAL FUNCTIONS =====
// ================================================================
const modalOverlay = document.getElementById('modalOverlay');
const modalBox = document.getElementById('modalBox');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const modalCloseBtn = document.getElementById('modalCloseBtn');

function openModal(title, content) {
    modalTitle.innerHTML = title;
    modalBody.innerHTML = content;
    modalOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function closeModal() {
    modalOverlay.classList.remove('show');
    document.body.style.overflow = '';
}

modalCloseBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', function(e) {
    if (e.target === this) closeModal();
});

// ================================================================
// ===== HELPER FUNCTIONS =====
// ================================================================
function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getStatusLabel(status) {
    const labels = {
        'active': '✅ ንቁ / Active',
        'pending': '⏳ በመጠባበቅ / Pending',
        'completed': '🏆 ተጠናቅቋል / Completed',
        'published': '✅ ታትሟል / Published',
        'draft': '📝 ረቂቅ / Draft',
        'review': '🔍 በግምገማ / Under Review',
        'archived': '📁 ተመዝግቧል / Archived',
        'received': '✅ ተቀብሏል / Received',
        'expected': '📋 ይጠበቃል / Expected',
        'approved': 'ጸድቋል / Approved',
        'rejected': 'ተቀባይነት አላገኘም / Rejected'
    };
    return labels[status] || status;
}

// ================================================================
// ===== CALENDAR FUNCTIONS =====
// ================================================================
const ethiopianMonths = [
    'መስከረም', 'ጥቅምት', 'ህዳር', 'ታህሳስ', 'ጥር', 'የካቲት',
    'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሀሴ', 'ጳጉሜ'
];

function gregorianToEthiopian(date) {
    const greg = new Date(date);
    const year = greg.getFullYear();
    const month = greg.getMonth();
    const day = greg.getDate();
    let ethiopianYear = year - 8;
    let ethiopianMonth = month + 1;
    let ethiopianDay = day;
    if (month < 8) {
        ethiopianYear = year - 9;
        ethiopianMonth = month + 5;
    } else if (month === 8) {
        if (day < 11) {
            ethiopianYear = year - 9;
            ethiopianMonth = 12;
            ethiopianDay = day + 20;
        } else {
            ethiopianYear = year - 8;
            ethiopianMonth = 1;
            ethiopianDay = day - 10;
        }
    } else {
        ethiopianYear = year - 8;
        if (month === 9) ethiopianMonth = 2;
        else if (month === 10) ethiopianMonth = 3;
        else if (month === 11) ethiopianMonth = 4;
        else if (month === 0) ethiopianMonth = 5;
        else if (month === 1) ethiopianMonth = 6;
        else if (month === 2) ethiopianMonth = 7;
        else if (month === 3) ethiopianMonth = 8;
        else if (month === 4) ethiopianMonth = 9;
        else if (month === 5) ethiopianMonth = 10;
        else if (month === 6) ethiopianMonth = 11;
        else if (month === 7) ethiopianMonth = 12;
    }
    return { year: ethiopianYear, month: ethiopianMonth - 1, day: ethiopianDay };
}

function getEthiopianDaysInMonth(month, year) {
    if (month === 12) return (year % 4 === 0) ? 6 : 5;
    return 30;
}

function getEthiopianFirstDay(month, year) {
    const refDate = new Date(2007, 8, 11);
    const refDayOfWeek = refDate.getDay();
    let totalDays = 0;
    for (let y = 2000; y < year; y++) {
        for (let m = 0; m < 13; m++) totalDays += getEthiopianDaysInMonth(m, y);
    }
    for (let m = 0; m < month; m++) totalDays += getEthiopianDaysInMonth(m, year);
    return (refDayOfWeek + totalDays) % 7;
}

let currentEthYear = 2016;
let currentEthMonth = 0;
let selectedEthDate = null;

function renderCalendar(year, month) {
    const daysContainer = document.getElementById('calendarDays');
    const monthDisplay = document.getElementById('monthYearDisplay');
    monthDisplay.textContent = `${ethiopianMonths[month]} ${year}`;
    const firstDay = getEthiopianFirstDay(month, year);
    const daysInMonth = getEthiopianDaysInMonth(month, year);
    let html = '';
    for (let i = 0; i < firstDay; i++) html += `<div class="calendar-day empty"></div>`;
    const today = new Date();
    const ethToday = gregorianToEthiopian(today);
    for (let d = 1; d <= daysInMonth; d++) {
        let classes = 'calendar-day';
        if (ethToday.year === year && ethToday.month === month && ethToday.day === d) classes += ' today';
        if (selectedEthDate && selectedEthDate.year === year && selectedEthDate.month === month && selectedEthDate.day === d) classes += ' selected';
        html += `<div class="${classes}" data-day="${d}" data-month="${month}" data-year="${year}">${d}</div>`;
    }
    daysContainer.innerHTML = html;
    document.querySelectorAll('.calendar-day:not(.empty)').forEach(el => {
        el.addEventListener('click', function() {
            const day = parseInt(this.dataset.day);
            const month = parseInt(this.dataset.month);
            const year = parseInt(this.dataset.year);
            selectedEthDate = { year, month, day };
            document.getElementById('selectedDateDisplay').textContent = 
                `✅ ተመረጠ: ${ethiopianMonths[month]} ${day}, ${year} ዓ.ም. / Selected: ${ethiopianMonths[month]} ${day}, ${year} EC`;
            renderCalendar(currentEthYear, currentEthMonth);
        });
    });
}

document.getElementById('prevMonth').addEventListener('click', function() {
    currentEthMonth--;
    if (currentEthMonth < 0) { currentEthMonth = 12; currentEthYear--; }
    renderCalendar(currentEthYear, currentEthMonth);
});

document.getElementById('nextMonth').addEventListener('click', function() {
    currentEthMonth++;
    if (currentEthMonth > 12) { currentEthMonth = 0; currentEthYear++; }
    renderCalendar(currentEthYear, currentEthMonth);
});

const today = new Date();
const ethToday = gregorianToEthiopian(today);
currentEthYear = ethToday.year;
currentEthMonth = ethToday.month;
selectedEthDate = ethToday;
renderCalendar(currentEthYear, currentEthMonth);
document.getElementById('selectedDateDisplay').textContent = 
    `📅 ዛሬ: ${ethiopianMonths[ethToday.month]} ${ethToday.day}, ${ethToday.year} ዓ.ም. / Today: ${ethiopianMonths[ethToday.month]} ${ethToday.day}, ${ethToday.year} EC`;

// ================================================================
// ===== CHART DATA =====
// ================================================================
const chartData = [
    { month: 'Jan', discussions: 4, completed: 2 },
    { month: 'Feb', discussions: 6, completed: 3 },
    { month: 'Mar', discussions: 8, completed: 5 },
    { month: 'Apr', discussions: 5, completed: 4 },
    { month: 'May', discussions: 7, completed: 6 },
    { month: 'Jun', discussions: 9, completed: 7 },
    { month: 'Jul', discussions: 6, completed: 4 },
    { month: 'Aug', discussions: 10, completed: 8 },
    { month: 'Sep', discussions: 8, completed: 6 },
    { month: 'Oct', discussions: 12, completed: 9 },
    { month: 'Nov', discussions: 7, completed: 5 },
    { month: 'Dec', discussions: 11, completed: 8 }
];

function renderChart() {
    const wrapper = document.getElementById('chartWrapper');
    if (!wrapper) return;
    const width = wrapper.clientWidth || 600;
    const height = wrapper.clientHeight || 180;
    const padding = { top: 20, right: 20, bottom: 25, left: 30 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    const maxValue = Math.max(...chartData.map(d => Math.max(d.discussions, d.completed))) + 2;
    const minValue = 0;
    const range = maxValue - minValue;
    let svg = `<svg class="chart-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet">`;
    for (let i = 0; i <= 4; i++) {
        const y = padding.top + (chartHeight - (i / 4) * chartHeight);
        const val = Math.round(minValue + (i / 4) * range);
        svg += `<line class="chart-grid-line" x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" />`;
        svg += `<text class="chart-axis-label" x="${padding.left - 6}" y="${y + 3}" text-anchor="end">${val}</text>`;
    }
    const pointsGold = chartData.map((d, i) => {
        const x = padding.left + (i / (chartData.length - 1)) * chartWidth;
        const y = padding.top + chartHeight - ((d.discussions - minValue) / range) * chartHeight;
        return `${x},${y}`;
    }).join(' ');
    const pointsGreen = chartData.map((d, i) => {
        const x = padding.left + (i / (chartData.length - 1)) * chartWidth;
        const y = padding.top + chartHeight - ((d.completed - minValue) / range) * chartHeight;
        return `${x},${y}`;
    }).join(' ');
    svg += `<polyline class="chart-line-gold" points="${pointsGold}" />`;
    svg += `<polyline class="chart-line-green" points="${pointsGreen}" />`;
    chartData.forEach((d, i) => {
        const x = padding.left + (i / (chartData.length - 1)) * chartWidth;
        const y = padding.top + chartHeight - ((d.discussions - minValue) / range) * chartHeight;
        svg += `<circle class="chart-dot chart-dot-gold" cx="${x}" cy="${y}" r="4" data-value="${d.discussions}" data-month="${d.month}" data-type="Discussions" />`;
    });
    chartData.forEach((d, i) => {
        const x = padding.left + (i / (chartData.length - 1)) * chartWidth;
        const y = padding.top + chartHeight - ((d.completed - minValue) / range) * chartHeight;
        svg += `<circle class="chart-dot chart-dot-green" cx="${x}" cy="${y}" r="4" data-value="${d.completed}" data-month="${d.month}" data-type="Completed" />`;
    });
    chartData.forEach((d, i) => {
        const x = padding.left + (i / (chartData.length - 1)) * chartWidth;
        svg += `<text class="chart-axis-label" x="${x}" y="${height - 4}" text-anchor="middle">${d.month}</text>`;
    });
    svg += '</svg>';
    wrapper.innerHTML = svg;
    document.querySelectorAll('.chart-dot').forEach(dot => {
        dot.addEventListener('mouseenter', function(e) {
            const value = this.dataset.value;
            const month = this.dataset.month;
            const type = this.dataset.type;
            let tooltip = document.querySelector('.chart-tooltip');
            if (!tooltip) {
                tooltip = document.createElement('div');
                tooltip.className = 'chart-tooltip';
                wrapper.appendChild(tooltip);
            }
            tooltip.innerHTML = `<strong>${month}</strong><br>${type}: ${value}`;
            tooltip.classList.add('show');
            const rect = this.getBoundingClientRect();
            const wrapperRect = wrapper.getBoundingClientRect();
            tooltip.style.left = (rect.left - wrapperRect.left + rect.width/2 - 50) + 'px';
            tooltip.style.top = (rect.top - wrapperRect.top - 40) + 'px';
        });
        dot.addEventListener('mouseleave', function() {
            const tooltip = document.querySelector('.chart-tooltip');
            if (tooltip) tooltip.classList.remove('show');
        });
    });
}

// ================================================================
// ===== NOTES & TODO MODAL =====
// ================================================================
const notesCard = document.getElementById('notesCard');
const notesArea = document.getElementById('notesArea');

notesCard.addEventListener('click', function() {
    const currentNotes = notesArea.value || '';
    openModal('📝 ማስታወሻ / Notes', `
        <textarea id="modalNotesArea" placeholder="ማስታወሻ ይጻፉ / Write your notes..." style="min-height:150px;">${currentNotes}</textarea>
        <div class="modal-actions" style="margin-top:12px;">
            <button class="modal-close-btn" id="modalSaveNotes" style="background:rgba(52,69,45,0.08);border-color:rgba(52,69,45,0.12);color:#34452D;">💾 አስቀምጥ / Save</button>
            <button class="modal-close-btn" id="modalCloseNotes">✕ ዝጋ / Close</button>
        </div>
    `);
    document.getElementById('modalSaveNotes').addEventListener('click', function() {
        notesArea.value = document.getElementById('modalNotesArea').value;
        closeModal();
    });
    document.getElementById('modalCloseNotes').addEventListener('click', closeModal);
});

const todoCard = document.getElementById('todoCard');
const todoList = document.getElementById('todoList');

function getTodoItems() {
    const items = [];
    document.querySelectorAll('#todoList li').forEach(li => {
        const cb = li.querySelector('input[type="checkbox"]');
        const text = li.querySelector('.todo-text');
        if (text) items.push({ text: text.textContent, done: cb ? cb.checked : false });
    });
    return items;
}

todoCard.addEventListener('click', function() {
    const items = getTodoItems();
    let html = `<ul class="modal-todo-list" id="modalTodoList" style="list-style:none;margin:0;padding:0;">`;
    items.forEach((item) => {
        html += `<li style="display:flex;align-items:center;gap:8px;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.15);">
            <input type="checkbox" ${item.done ? 'checked' : ''}>
            <span class="todo-text ${item.done ? 'done' : ''}" style="color:rgba(26,26,46,0.7);">${item.text}</span>
        </li>`;
    });
    html += `</ul>
        <div class="modal-todo-add" style="display:flex;gap:6px;margin-top:8px;">
            <input type="text" id="modalTodoInput" placeholder="ስራ ያክሉ / Add new task..." style="flex:1;background:rgba(255,255,255,0.5);border:1px solid rgba(255,255,255,0.3);border-radius:6px;padding:6px 10px;color:#1a1a2e;font-size:12px;font-family:inherit;">
            <button id="modalAddTodoBtn" style="background:rgba(52,69,45,0.06);border:1px solid rgba(52,69,45,0.1);color:#34452D;border-radius:6px;padding:6px 14px;cursor:pointer;font-size:11px;font-weight:600;font-family:inherit;">+ ያክሉ / Add</button>
        </div>
        <div class="modal-actions" style="margin-top:12px;">
            <button class="modal-close-btn" id="modalCloseTodo">✕ ዝጋ / Close</button>
        </div>
    `;
    openModal('✅ ስራዎች / To-Do List', html);
    document.getElementById('modalAddTodoBtn').addEventListener('click', function() {
        const input = document.getElementById('modalTodoInput');
        const text = input.value.trim();
        if (!text) return;
        const list = document.getElementById('modalTodoList');
        const li = document.createElement('li');
        li.style.cssText = 'display:flex;align-items:center;gap:8px;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.15);';
        li.innerHTML = `<input type="checkbox"><span class="todo-text" style="color:rgba(26,26,46,0.7);">${text}</span>`;
        list.appendChild(li);
        input.value = '';
        li.querySelector('input').addEventListener('change', function() {
            li.querySelector('.todo-text').classList.toggle('done', this.checked);
        });
    });
    document.getElementById('modalTodoInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') document.getElementById('modalAddTodoBtn').click();
    });
    document.getElementById('modalCloseTodo').addEventListener('click', function() {
        const newItems = [];
        document.querySelectorAll('#modalTodoList li').forEach(li => {
            const cb = li.querySelector('input[type="checkbox"]');
            const span = li.querySelector('.todo-text');
            if (span) newItems.push({ text: span.textContent, done: cb ? cb.checked : false });
        });
        todoList.innerHTML = '';
        newItems.forEach(item => {
            const li = document.createElement('li');
            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.checked = item.done;
            cb.disabled = true;
            const span = document.createElement('span');
            span.className = 'todo-text' + (item.done ? ' done' : '');
            span.textContent = item.text;
            li.appendChild(cb);
            li.appendChild(span);
            todoList.appendChild(li);
        });
        closeModal();
    });
    setTimeout(() => {
        document.querySelectorAll('#modalTodoList input[type="checkbox"]').forEach(cb => {
            cb.addEventListener('change', function() {
                this.closest('li').querySelector('.todo-text').classList.toggle('done', this.checked);
            });
        });
    }, 50);
});

// ================================================================
// ===== TIMER =====
// ================================================================
let timerInterval = null;
let seconds = 0;
const timerDisplay = document.getElementById('timerDisplay');

document.getElementById('timerStart').addEventListener('click', function() {
    if (timerInterval) return;
    timerInterval = setInterval(() => { seconds++; updateTimerDisplay(); }, 1000);
});

document.getElementById('timerPause').addEventListener('click', function() {
    clearInterval(timerInterval);
    timerInterval = null;
});

document.getElementById('timerReset').addEventListener('click', function() {
    clearInterval(timerInterval);
    timerInterval = null;
    seconds = 0;
    updateTimerDisplay();
});

function updateTimerDisplay() {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    timerDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// ================================================================
// ===== ALL CATEGORIES DATA =====
// ================================================================
const categoriesData = {
    bento: {
        label: '💬 የዕቅድ አፈጻጸም ውይይት',
        labelEn: 'Plan Performance Discussion',
        icon: 'message-square',
        items: [
            { id: 1, title: 'የQ4 አፈጻጸም ግምገማ', titleEn: 'Q4 Performance Review', status: 'active', date: '2026-12-20', description: 'የሩብ ዓመት አፈጻጸም ግምገማ እና ውይይት' },
            { id: 2, title: 'የ2027 ዕቅድ ውይይት', titleEn: '2027 Planning Discussion', status: 'pending', date: '2026-12-25', description: 'ለቀጣይ ዓመት ዕቅድ ዝግጅት' },
            { id: 3, title: 'የበጀት አስተካከያ', titleEn: 'Budget Adjustment', status: 'completed', date: '2026-12-15', description: 'የበጀት ማስተካከያ እና ማፅደቅ' }
        ]
    },
    report: {
        label: '📊 ሪፖርት',
        labelEn: 'Report',
        icon: 'file-text',
        items: [
            { id: 1, title: 'የ2026 አመታዊ ሪፖርት', titleEn: '2026 Annual Report', status: 'published', date: '2026-12-20', description: 'የ2026 አመታዊ የአፈጻጸም ሪፖርት' },
            { id: 2, title: 'ሩብ ዓመት 4 ሪፖርት', titleEn: 'Q4 Report', status: 'pending', date: '2026-12-25', description: 'የሩብ ዓመት 4 ሪፖርት' }
        ]
    },
    monthlyPartner: {
        label: '🤝 ወርታማ ሴኞ/አብሮነት',
        labelEn: 'Monthly Partnership',
        icon: 'handshake',
        items: [
            { id: 1, title: 'የከተማ ልማት ሽርክና', titleEn: 'Urban Development Partnership', status: 'active', date: '2026-12-01', description: 'ከከተማ ልማት ቢሮ ጋር የተደረገ ሽርክና' },
            { id: 2, title: 'የትምህርት ትብብር', titleEn: 'Education Collaboration', status: 'pending', date: '2026-12-10', description: 'የትምህርት ማሻሻያ ፕሮጀክት' },
            { id: 3, title: 'የጤና አጋርነት', titleEn: 'Health Partnership', status: 'completed', date: '2026-11-28', description: 'የጤና አገልግሎት ማሻሻያ' }
        ]
    },
    externalMonitor: {
        label: '🔍 የውጭ ክትትል',
        labelEn: 'External Monitoring',
        icon: 'eye',
        items: [
            { id: 1, title: 'የፕሮጀክት ክትትል', titleEn: 'Project Monitoring', status: 'active', date: '2026-12-05', description: 'የመሰረተ ልማት ፕሮጀክቶች ክትትል' },
            { id: 2, title: 'የአገልግሎት ግምገማ', titleEn: 'Service Evaluation', status: 'pending', date: '2026-12-15', description: 'የህዝብ አገልግሎት ግምገማ' }
        ]
    },
    woreda: {
        label: '🏛️ የወረዳዎች ዕቅድ',
        labelEn: 'Woreda Plan',
        icon: 'building-2',
        items: [
            { id: 1, title: 'ወረዳ 1 ዕቅድ', titleEn: 'Woreda 1 Plan', status: 'active', date: '2026-12-01', description: 'የወረዳ 1 አመታዊ ዕቅድ' },
            { id: 2, title: 'ወረዳ 2 ሪፖርት', titleEn: 'Woreda 2 Report', status: 'pending', date: '2026-12-10', description: 'የወረዳ 2 ሩብ ዓመት ሪፖርት' },
            { id: 3, title: 'ወረዳ 3 ግምገማ', titleEn: 'Woreda 3 Review', status: 'review', date: '2026-12-20', description: 'የወረዳ 3 አፈጻጸም ግምገማ' }
        ]
    },
    knowledge: {
        label: '📚 ተቋማዊ እውቀት',
        labelEn: 'Knowledge Mgmt',
        icon: 'book-open',
        items: [
            { id: 1, title: 'የፖሊሲ ሰነድ', titleEn: 'Policy Document', status: 'published', date: '2026-11-15', description: 'የክፍለ ከተማ ፖሊሲዎች', category: 'policy' },
            { id: 2, title: 'የስራ ሂደት መመሪያ', titleEn: 'Procedure Manual', status: 'draft', date: '2026-12-05', description: 'የስራ ሂደት መመሪያ ረቂቅ', category: 'procedure' }
        ]
    },
    networking: {
        label: '🔗 የእርስ በርስ መገናኘቢ',
        labelEn: 'Networking',
        icon: 'network',
        items: [
            { id: 1, title: 'የአጋርነት ስምምነት', titleEn: 'Partnership Agreement', status: 'active', date: '2026-12-01', description: 'ከድርጅቶች ጋር የተደረገ ስምምነት' },
            { id: 2, title: 'የስብሰባ ውጤት', titleEn: 'Meeting Outcome', status: 'completed', date: '2026-11-25', description: 'የጋራ ስብሰባ ውጤቶች' }
        ]
    },
    income: {
        label: '💰 የገቢ መረጃ',
        labelEn: 'Income Info',
        icon: 'dollar-sign',
        items: [
            { id: 1, title: 'የመንግስት ድጋፍ', titleEn: 'Government Support', status: 'received', date: '2026-12-01', description: 'የመንግስት የበጀት ድጋፍ' },
            { id: 2, title: 'የለጋሽ ድጋፍ', titleEn: 'Donor Support', status: 'pending', date: '2026-12-15', description: 'ከለጋሽ ድርጅቶች የሚጠበቅ ድጋፍ' }
        ]
    },
    experience: {
        label: '💡 የልምድ ልውውጥ',
        labelEn: 'Experience Sharing',
        icon: 'lightbulb',
        items: [
            { id: 1, title: 'የተሳካ ፕሮጀክት', titleEn: 'Successful Project', status: 'active', date: '2026-12-10', description: 'የተሳካ ፕሮጀክት ትምህርቶች' },
            { id: 2, title: 'የተማርኩት ትምህርት', titleEn: 'Lessons Learned', status: 'completed', date: '2026-11-30', description: 'ከፕሮጀክቶች የተማርኩት ትምህርቶች' }
        ]
    },
    ngo: {
        label: '🌍 የሲማድ/NGO/ መረጃ',
        labelEn: 'NGO Info',
        icon: 'globe',
        items: [
            { id: 1, title: 'ኤንጂኦ ትብብር', titleEn: 'NGO Collaboration', status: 'active', date: '2026-12-01', description: 'ከኤንጂኦዎች ጋር ትብብር' },
            { id: 2, title: 'የፕሮጀክት ድጋፍ', titleEn: 'Project Support', status: 'pending', date: '2026-12-20', description: 'የኤንጂኦ ፕሮጀክት ድጋፍ' }
        ]
    },
    plan: {
        label: '📋 ዕቅድ',
        labelEn: 'Plan',
        icon: 'file-text',
        items: [
            { id: 1, title: 'የ2026 አመታዊ ዕቅድ', titleEn: '2026 Annual Plan', status: 'active', date: '2026-01-01', description: 'የ2026 አመታዊ ዕቅድ ሰነድ' },
            { id: 2, title: 'ሩብ ዓመት 1 ዕቅድ', titleEn: 'Q1 Plan', status: 'completed', date: '2026-03-31', description: 'የሩብ ዓመት 1 ዕቅድ ማጠቃለያ' },
            { id: 3, title: 'ሩብ ዓመት 2 ዕቅድ', titleEn: 'Q2 Plan', status: 'active', date: '2026-06-30', description: 'የሩብ ዓመት 2 ዕቅድ እድገት' }
        ]
    },
    additionalPlans: {
        label: '📑 ተጨማሪ ዕቅዶች',
        labelEn: 'Additional Plans',
        icon: 'clipboard-list',
        items: [
            { id: 1, title: 'የማህበረሰብ ተሳትፎ ዕቅድ', titleEn: 'Community Engagement Plan', status: 'pending', date: '2026-12-01', description: 'የማህበረሰብ ተሳትፎ ለማሳደግ ዕቅድ' },
            { id: 2, title: 'የዘላቂ ልማት ዕቅድ', titleEn: 'Sustainable Development Plan', status: 'active', date: '2026-11-15', description: 'የዘላቂ ልማት ግቦች እና እርምጃዎች' }
        ]
    },
    bpr: {
        label: '📊 BPR & BSC ጥናት',
        labelEn: 'BPR & BSC Study',
        icon: 'bar-chart-2',
        items: [
            { id: 1, title: 'BPR ጥናት ሪፖርት', titleEn: 'BPR Study Report', status: 'published', date: '2026-10-01', description: 'የBPR ጥናት ግኝቶች' },
            { id: 2, title: 'BSC ማመዛዘኛ', titleEn: 'BSC Assessment', status: 'draft', date: '2026-11-20', description: 'የBSC አፈጻጸም ግምገማ' }
        ]
    },
    publicRelations: {
        label: '📢 የህዝብ ክንፍ ዕቅድና ሪፖርት',
        labelEn: 'Public Relations Plan & Report',
        icon: 'megaphone',
        items: [
            { id: 1, title: 'የህዝብ ግንኙነት ዕቅድ', titleEn: 'PR Plan', status: 'active', date: '2026-12-01', description: 'የህዝብ ግንኙነት ስትራቴጂ' },
            { id: 2, title: 'የህዝብ አስተያየት ጥናት', titleEn: 'Public Opinion Survey', status: 'completed', date: '2026-11-15', description: 'የህዝብ አስተያየት ጥናት ውጤቶች' }
        ]
    },
    finance: {
        label: '💰 የመ/ፋይናንስ/አስ/ መረጃ',
        labelEn: 'Finance/Admin Info',
        icon: 'credit-card',
        items: [
            { id: 1, title: 'የአስተዳደር ሪፖርት', titleEn: 'Admin Report', status: 'published', date: '2026-12-01', description: 'የአስተዳደር ክፍል ሪፖርት' },
            { id: 2, title: 'የፋይናንስ ሪፖርት', titleEn: 'Finance Report', status: 'pending', date: '2026-12-15', description: 'የፋይናንስ ሁኔታ ሪፖርት' }
        ]
    },
    budget: {
        label: '📊 የበጀት መረጃ',
        labelEn: 'Budget Info',
        icon: 'pie-chart',
        items: [
            { id: 1, title: 'የ2026 በጀት', titleEn: '2026 Budget', status: 'approved', date: '2026-01-01', description: 'የ2026 አመታዊ በጀት' },
            { id: 2, title: 'የበጀት ማሻሻያ', titleEn: 'Budget Amendment', status: 'pending', date: '2026-12-10', description: 'የበጀት ማሻሻያ ሀሳብ' }
        ]
    },
    findings: {
        label: '🔍 የግኝት መረጃ',
        labelEn: 'Findings Info',
        icon: 'search',
        items: [
            { id: 1, title: 'የግምገማ ግኝቶች', titleEn: 'Assessment Findings', status: 'published', date: '2026-11-30', description: 'የግምገማ ግኝቶች ማጠቃለያ' },
            { id: 2, title: 'የክትትል ግኝቶች', titleEn: 'Monitoring Findings', status: 'active', date: '2026-12-05', description: 'የክትትል ግኝቶች ሪፖርት' }
        ]
    },
    audit: {
        label: '📋 የኦዲት መረጃ',
        labelEn: 'Audit Info',
        icon: 'clipboard-check',
        items: [
            { id: 1, title: 'የውስጥ ኦዲት ሪፖርት', titleEn: 'Internal Audit Report', status: 'approved', date: '2026-11-20', description: 'የውስጥ ኦዲት ግኝቶች' },
            { id: 2, title: 'የውጭ ኦዲት ሪፖርት', titleEn: 'External Audit Report', status: 'pending', date: '2026-12-15', description: 'የውጭ ኦዲት ግኝቶች' }
        ]
    },
    monitoring: {
        label: '📊 የክትትልና ድጋፍ መረጃዎች',
        labelEn: 'Monitoring & Support Info',
        icon: 'activity',
        items: [
            { id: 1, title: 'የክትትል ሪፖርት', titleEn: 'Monitoring Report', status: 'active', date: '2026-12-01', description: 'የክትትል እንቅስቃሴዎች ሪፖርት' },
            { id: 2, title: 'የድጋፍ እንቅስቃሴ', titleEn: 'Support Activities', status: 'completed', date: '2026-11-25', description: 'የድጋፍ እንቅስቃሴዎች ማጠቃለያ' }
        ]
    },
    training: {
        label: '🎓 የስልጠና መረጃዎች',
        labelEn: 'Training Info',
        icon: 'graduation-cap',
        items: [
            { id: 1, title: 'የስልጠና ፕሮግራም', titleEn: 'Training Program', status: 'active', date: '2026-12-01', description: 'የስልጠና ፕሮግራም መርሃ ግብር' },
            { id: 2, title: 'የስልጠና ሪፖርት', titleEn: 'Training Report', status: 'completed', date: '2026-11-30', description: 'የስልጠና ሪፖርት ማጠቃለያ' }
        ]
    },
    peer: {
        label: '🤝 አቻ ለአቻ ፍረም',
        labelEn: 'Peer-to-Peer Forum',
        icon: 'users',
        items: [
            { id: 1, title: 'የፍረም ስብሰባ', titleEn: 'Forum Meeting', status: 'active', date: '2026-12-10', description: 'የአቻ ለአቻ ፍረም ስብሰባ' },
            { id: 2, title: 'የፍረም ውጤቶች', titleEn: 'Forum Outcomes', status: 'completed', date: '2026-11-20', description: 'የአቻ ለአቻ ፍረም ውጤቶች' }
        ]
    },
    sdp: {
        label: '📊 SDP and OP ዕቅድና ሪፖርት',
        labelEn: 'SDP & OP Plan & Report',
        icon: 'trending-up',
        items: [
            { id: 1, title: 'SDP ዕቅድ', titleEn: 'SDP Plan', status: 'active', date: '2026-12-01', description: 'የSDP ዕቅድ ሰነድ' },
            { id: 2, title: 'OP ሪፖርት', titleEn: 'OP Report', status: 'pending', date: '2026-12-15', description: 'የOP ሪፖርት ማጠቃለያ' }
        ]
    },
    standard: {
        label: '📋 ስታንዳርድ ገጽጽር ሪፖርት',
        labelEn: 'Standard Indicator Report',
        icon: 'check-circle',
        items: [
            { id: 1, title: 'የገጽጽር ሪፖርት', titleEn: 'Indicator Report', status: 'published', date: '2026-12-01', description: 'የስታንዳርድ ገጽጽር ሪፖርት' },
            { id: 2, title: 'የአፈጻጸም ገጽጽር', titleEn: 'Performance Indicator', status: 'active', date: '2026-11-20', description: 'የአፈጻጸም ገጽጽር መረጃ' }
        ]
    },
    satisfaction: {
        label: '😊 የተገልጋይ እርካታ',
        labelEn: 'Customer Satisfaction',
        icon: 'smile',
        items: [
            { id: 1, title: 'የእርካታ ጥናት', titleEn: 'Satisfaction Survey', status: 'completed', date: '2026-11-30', description: 'የተገልጋይ እርካታ ጥናት' },
            { id: 2, title: 'የእርካታ ሪፖርት', titleEn: 'Satisfaction Report', status: 'published', date: '2026-12-10', description: 'የተገልጋይ እርካታ ሪፖርት' }
        ]
    },
    complaint: {
        label: '📝 የቅሬታ መረጃ',
        labelEn: 'Complaint Info',
        icon: 'alert-circle',
        items: [
            { id: 1, title: 'የቅሬታ ሪፖርት', titleEn: 'Complaint Report', status: 'active', date: '2026-12-01', description: 'የቅሬታ አስተዳደር ሪፖርት' },
            { id: 2, title: 'የቅሬታ ማጠቃለያ', titleEn: 'Complaint Summary', status: 'completed', date: '2026-11-25', description: 'የቅሬታ ማጠቃለያ ሪፖርት' }
        ]
    },
    capital: {
        label: '🏗️ የመ/ካፒታል ፕሮጀክት መረጃ',
        labelEn: 'Capital Project Info',
        icon: 'building',
        items: [
            { id: 1, title: 'የመንገድ ፕሮጀክት', titleEn: 'Road Project', status: 'active', date: '2026-12-01', description: 'የመንገድ ግንባታ ፕሮጀክት' },
            { id: 2, title: 'የህንፃ ፕሮጀክት', titleEn: 'Building Project', status: 'pending', date: '2026-12-15', description: 'የህንፃ ግንባታ ፕሮጀክት' }
        ]
    },
    integrated: {
        label: '📋 የቅንጅታዊ አሰራር ሰነድ',
        labelEn: 'Integrated Work-Process Document',
        icon: 'git-branch',
        items: [
            { id: 1, title: 'የቅንጅታዊ ሂደት ሰነድ', titleEn: 'Integrated Process Document', status: 'published', date: '2026-12-01', description: 'የቅንጅታዊ አሰራር ሰነድ' },
            { id: 2, title: 'የሂደት ማሻሻያ', titleEn: 'Process Improvement', status: 'active', date: '2026-11-20', description: 'የሂደት ማሻሻያ ሀሳቦች' }
        ]
    },
    trust: {
        label: '💬 እምነታዊ አስተያየት',
        labelEn: 'Trust/Reliability Feedback',
        icon: 'heart',
        items: [
            { id: 1, title: 'የእምነት ጥናት', titleEn: 'Trust Survey', status: 'completed', date: '2026-11-30', description: 'የእምነት አስተያየት ጥናት' },
            { id: 2, title: 'የእምነት ሪፖርት', titleEn: 'Trust Report', status: 'published', date: '2026-12-10', description: 'የእምነት አስተያየት ሪፖርት' }
        ]
    },
    modernization: {
        label: '⚡ ተቋማዊ የማዘመን ዕቅድና ሪፖርት',
        labelEn: 'Institutional Modernization Plan & Report',
        icon: 'zap',
        items: [
            { id: 1, title: 'የማዘመን ዕቅድ', titleEn: 'Modernization Plan', status: 'active', date: '2026-12-01', description: 'የተቋማዊ ማዘመን ዕቅድ' },
            { id: 2, title: 'የማዘመን ሪፖርት', titleEn: 'Modernization Report', status: 'pending', date: '2026-12-15', description: 'የተቋማዊ ማዘመን ሪፖርት' }
        ]
    },
    standardization: {
        label: '📏 የስታንዳርዳይዜሽን ዕቅድ ሪፖርት',
        labelEn: 'Standardization/Reform Work Info',
        icon: 'ruler',
        items: [
            { id: 1, title: 'የስታንዳርዳይዜሽን ዕቅድ', titleEn: 'Standardization Plan', status: 'active', date: '2026-12-01', description: 'የስታንዳርዳይዜሽን ዕቅድ' },
            { id: 2, title: 'የሪፎርም ሪፖርት', titleEn: 'Reform Report', status: 'published', date: '2026-11-20', description: 'የሪፎርም እንቅስቃሴዎች ሪፖርት' }
        ]
    },
    employee: {
        label: '👥 ሰራተኛ የመደገፍና የማንሳሳት መረጃ',
        labelEn: 'Employee Support & Motivation Info',
        icon: 'users',
        items: [
            { id: 1, title: 'የሰራተኛ ድጋፍ ፕሮግራም', titleEn: 'Employee Support Program', status: 'active', date: '2026-12-01', description: 'የሰራተኛ ድጋፍ ፕሮግራም' },
            { id: 2, title: 'የማንሳሳት ፕሮግራም', titleEn: 'Motivation Program', status: 'completed', date: '2026-11-25', description: 'የሰራተኛ ማንሳሳት ፕሮግራም' }
        ]
    },
    balance: {
        label: '⚖️ የፈጻሚ እና የወረዳዎች ሚዛና መረጃ',
        labelEn: 'Implementer/Woreda Balance Info',
        icon: 'scale',
        items: [
            { id: 1, title: 'የአፈጻጸም ሚዛና', titleEn: 'Performance Balance', status: 'active', date: '2026-12-01', description: 'የፈጻሚ እና የወረዳዎች ሚዛና' },
            { id: 2, title: 'የሚዛና ሪፖርት', titleEn: 'Balance Report', status: 'pending', date: '2026-12-15', description: 'የሚዛና ሪፖርት ማጠቃለያ' }
        ]
    },
    green: {
        label: '🌱 ማዕድ ማጋራት/አረንዴ አሻራ',
        labelEn: 'Green Footprint/Multi-Sector Info',
        icon: 'leaf',
        items: [
            { id: 1, title: 'የአረንዴ አሻራ ፕሮጀክት', titleEn: 'Green Footprint Project', status: 'active', date: '2026-12-01', description: 'የአረንዴ አሻራ ፕሮጀክት' },
            { id: 2, title: 'የማዕድ ማጋራት ሪፖርት', titleEn: 'Multi-Sector Report', status: 'completed', date: '2026-11-30', description: 'የማዕድ ማጋራት እንቅስቃሴዎች' }
        ]
    },
    sector: {
        label: '📅 የዘርፍ ስብሰባ መረጃ',
        labelEn: 'Sector Meeting Info',
        icon: 'calendar',
        items: [
            { id: 1, title: 'የዘርፍ ስብሰባ ማስታወሻ', titleEn: 'Sector Meeting Notes', status: 'active', date: '2026-12-10', description: 'የዘርፍ ስብሰባ ውይይቶች' },
            { id: 2, title: 'የስብሰባ ውጤቶች', titleEn: 'Meeting Outcomes', status: 'completed', date: '2026-11-20', description: 'የዘርፍ ስብሰባ ውጤቶች' }
        ]
    }
};

// ================================================================
// ===== SCORECARD DATA =====
// ================================================================
let scorecardData = {
    vision: 'በአካባቢያችን ዘላቂ ልማት እና የህዝብ ተጠቃሚነትን ማረጋገጥ',
    visionEn: 'Ensuring sustainable development and public benefit in our community',
    mission: 'ተጠያቂነትን፣ ፍትሃዊነትን እና አገልግሎትን በማስቀደም የህዝብን ህይወት ማሻሻል',
    missionEn: 'Improving public life by prioritizing accountability, fairness, and service',
    strategicGoals: [
        { id: 1, icon: '🏗️', title: 'መሰረተ ልማት', titleEn: 'Infrastructure', progress: 75, color: 'gold' },
        { id: 2, icon: '📚', title: 'ትምህርት', titleEn: 'Education', progress: 60, color: 'green' },
        { id: 3, icon: '🏥', title: 'ጤና', titleEn: 'Health', progress: 45, color: 'blue' },
        { id: 4, icon: '💰', title: 'ኢኮኖሚ', titleEn: 'Economy', progress: 80, color: 'purple' },
        { id: 5, icon: '🌿', title: 'አካባቢ', titleEn: 'Environment', progress: 30, color: 'green' }
    ],
    cascading: [
        {
            id: 1,
            level: 'org',
            levelAm: 'ድርጅታዊ',
            levelEn: 'Organizational',
            icon: '🏛️',
            progress: 72,
            kpis: [
                { name: 'የህዝብ እርካታ', nameEn: 'Public Satisfaction', target: '85%', actual: '72%', status: 'on-track' },
                { name: 'የስራ ፍጥነት', nameEn: 'Service Speed', target: '90%', actual: '65%', status: 'at-risk' }
            ]
        },
        {
            id: 2,
            level: 'dept',
            levelAm: 'መምሪያ',
            levelEn: 'Department',
            icon: '📊',
            progress: 65,
            kpis: [
                { name: 'የፕሮጀክት ማጠናቀቂያ', nameEn: 'Project Completion', target: '80%', actual: '58%', status: 'behind' },
                { name: 'የበጀት አጠቃቀም', nameEn: 'Budget Utilization', target: '95%', actual: '82%', status: 'on-track' }
            ]
        },
        {
            id: 3,
            level: 'team',
            levelAm: 'ቡድን',
            levelEn: 'Team',
            icon: '👥',
            progress: 58,
            kpis: [
                { name: 'የስራ አፈጻጸም', nameEn: 'Team Performance', target: '90%', actual: '73%', status: 'on-track' },
                { name: 'የስልጠና ተሳትፎ', nameEn: 'Training Participation', target: '100%', actual: '45%', status: 'at-risk' }
            ]
        },
        {
            id: 4,
            level: 'ind',
            levelAm: 'ግለሰባዊ',
            levelEn: 'Individual',
            icon: '👤',
            progress: 45,
            kpis: [
                { name: 'የስራ ሃላፊነት', nameEn: 'Task Completion', target: '95%', actual: '68%', status: 'at-risk' },
                { name: 'የተማርኩት ትምህርት', nameEn: 'Learning Hours', target: '40 hrs', actual: '22 hrs', status: 'behind' }
            ]
        }
    ],
    kpiDashboard: [
        { title: 'ጠቅላላ ግቦች', value: '12', sub: 'የተጠናቀቁ 8', progress: 67, color: 'gold' },
        { title: 'የአፈጻጸም ደረጃ', value: '74%', sub: 'ከታለመው 85%', progress: 74, color: 'blue' },
        { title: 'የበጀት አጠቃቀም', value: '82%', sub: 'የታቀደ 95%', progress: 82, color: 'green' },
        { title: 'የህዝብ እርካታ', value: '72%', sub: 'ዒላማ 85%', progress: 72, color: 'purple' }
    ]
};

function renderScorecard() {
    const container = document.getElementById('scorecardContainer');
    const view = document.getElementById('scorecardView').value;
    
    let html = '';

    if (view === 'dashboard' || view === 'both') {
        html += `
            <div class="strategic-section">
                <div class="section-title"><span class="section-icon">🎯</span> ትዕይንት እና ተልዕኮ / Vision & Mission</div>
                <div class="vision-mission">
                    <div class="vm-item">
                        <div class="vm-label">👁️ ትዕይንት / Vision</div>
                        <div class="vm-text">${scorecardData.vision}</div>
                        <div class="vm-text-en">${scorecardData.visionEn}</div>
                    </div>
                    <div class="vm-item">
                        <div class="vm-label">🚀 ተልዕኮ / Mission</div>
                        <div class="vm-text">${scorecardData.mission}</div>
                        <div class="vm-text-en">${scorecardData.missionEn}</div>
                    </div>
                </div>
                <div class="section-title" style="margin-top:12px;"><span class="section-icon">🎯</span> ስትራቴጂካዊ ግቦች / Strategic Goals</div>
                <div class="strategic-goals">
                    ${scorecardData.strategicGoals.map(g => `
                        <div class="strategic-goal" onclick="alert('Goal: ${g.title} - ${g.progress}%')">
                            <div class="goal-title">
                                <span class="goal-icon">${g.icon}</span>
                                ${g.title}
                                <span class="goal-en">${g.titleEn}</span>
                            </div>
                            <div class="goal-progress"><div class="goal-bar ${g.color}" style="width:${g.progress}%;"></div></div>
                            <div class="goal-percent">${g.progress}%</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    if (view === 'cascading' || view === 'both') {
        html += `
            <div class="strategic-section">
                <div class="section-title"><span class="section-icon">📊</span> የKPIs ካስኬዲንግ / KPI Cascading</div>
                <div class="cascading-container">
                    ${scorecardData.cascading.map((level, idx) => `
                        ${idx > 0 ? `<div class="cascade-arrow">⬇</div>` : ''}
                        <div class="level-card">
                            <div class="level-header">
                                <div class="level-title">
                                    <span class="level-icon">${level.icon}</span>
                                    ${level.levelAm}
                                    <span style="font-size:10px;color:rgba(26,26,46,0.2);font-weight:400;">${level.levelEn}</span>
                                </div>
                                <span class="level-badge ${level.level}">${level.progress}%</span>
                            </div>
                            <div class="kpi-list">
                                ${level.kpis.map(kpi => `
                                    <div class="kpi-item">
                                        <div class="kpi-name">
                                            ${kpi.name}
                                            <span class="kpi-en">${kpi.nameEn}</span>
                                        </div>
                                        <div class="kpi-values">
                                            <span class="target">🎯 ${kpi.target}</span>
                                            <span class="actual">📊 ${kpi.actual}</span>
                                        </div>
                                        <span class="kpi-status ${kpi.status}">${kpi.status.replace('-', ' ').toUpperCase()}</span>
                                    </div>
                                `).join('')}
                            </div>
                            <div class="level-progress"><div class="progress-bar" style="width:${level.progress}%;"></div></div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    if (view === 'dashboard' || view === 'both') {
        html += `
            <div class="strategic-section">
                <div class="section-title"><span class="section-icon">📊</span> የKPI ዳሽቦርድ / KPI Dashboard</div>
                <div class="kpi-dashboard">
                    ${scorecardData.kpiDashboard.map(kpi => `
                        <div class="kpi-dash-item">
                            <div class="kpi-dash-title">${kpi.title}</div>
                            <div class="kpi-dash-value">${kpi.value}</div>
                            <div class="kpi-dash-sub">
                                <span>${kpi.sub}</span>
                                <span>${kpi.progress}%</span>
                            </div>
                            <div class="mini-progress"><div class="mini-bar ${kpi.color}" style="width:${kpi.progress}%;"></div></div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    container.innerHTML = html;
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

document.getElementById('scorecardPeriod').addEventListener('change', renderScorecard);
document.getElementById('scorecardView').addEventListener('change', renderScorecard);

document.getElementById('addKpiBtn').addEventListener('click', function() {
    openModal(`➕ አዲስ KPI / New KPI`, `
        <form id="newKpiForm" onsubmit="addKpi(event)">
            <input type="text" id="newKpiName" placeholder="KPI ስም (አማርኛ) / KPI Name (Amharic)" required>
            <input type="text" id="newKpiNameEn" placeholder="KPI Name (English)" required>
            <div class="form-row">
                <input type="text" id="newKpiTarget" placeholder="ዒላማ / Target" required>
                <input type="text" id="newKpiActual" placeholder="አሁን ያለው / Actual" required>
            </div>
            <select id="newKpiStatus">
                <option value="on-track">በመንገድ ላይ / On Track</option>
                <option value="at-risk">አደጋ ላይ / At Risk</option>
                <option value="behind">ዘግይቷል / Behind</option>
                <option value="achieved">ተሳክቷል / Achieved</option>
            </select>
            <select id="newKpiLevel">
                <option value="org">ድርጅታዊ / Organizational</option>
                <option value="dept">መምሪያ / Department</option>
                <option value="team">ቡድን / Team</option>
                <option value="ind">ግለሰባዊ / Individual</option>
            </select>
            <div class="modal-actions" style="margin-top:12px;">
                <button type="submit" class="modal-close-btn" style="background:rgba(52,69,45,0.08);border-color:rgba(52,69,45,0.12);color:#34452D;">➕ ያክሉ / Add</button>
                <button type="button" class="modal-close-btn" onclick="closeModal()">✕ ዝጋ / Close</button>
            </div>
        </form>
    `);
});

function addKpi(e) {
    e.preventDefault();
    const name = document.getElementById('newKpiName').value;
    const nameEn = document.getElementById('newKpiNameEn').value;
    const target = document.getElementById('newKpiTarget').value;
    const actual = document.getElementById('newKpiActual').value;
    const status = document.getElementById('newKpiStatus').value;
    const level = document.getElementById('newKpiLevel').value;
    
    const levelMap = { org: 'ድርጅታዊ', dept: 'መምሪያ', team: 'ቡድን', ind: 'ግለሰባዊ' };
    const levelEnMap = { org: 'Organizational', dept: 'Department', team: 'Team', ind: 'Individual' };
    
    const levelData = scorecardData.cascading.find(l => l.level === level);
    if (levelData) {
        levelData.kpis.push({ name, nameEn, target, actual, status });
    } else {
        scorecardData.cascading.push({
            id: Date.now(),
            level: level,
            levelAm: levelMap[level],
            levelEn: levelEnMap[level],
            icon: '📊',
            progress: 50,
            kpis: [{ name, nameEn, target, actual, status }]
        });
    }
    closeModal();
    renderScorecard();
}

document.getElementById('addGoalBtn').addEventListener('click', function() {
    openModal(`➕ አዲስ ግብ / New Goal`, `
        <form id="newGoalForm" onsubmit="addGoal(event)">
            <input type="text" id="newGoalIcon" placeholder="አዶ / Icon (e.g. 🏗️)" value="🎯">
            <input type="text" id="newGoalTitle" placeholder="ግብ (አማርኛ) / Goal (Amharic)" required>
            <input type="text" id="newGoalTitleEn" placeholder="Goal (English)" required>
            <input type="number" id="newGoalProgress" placeholder="እድገት % / Progress %" min="0" max="100" value="0">
            <select id="newGoalColor">
                <option value="gold">ወርቃማ / Gold</option>
                <option value="green">አረንጓዴ / Green</option>
                <option value="blue">ሰማያዊ / Blue</option>
                <option value="purple">ሐምራዊ / Purple</option>
            </select>
            <div class="modal-actions" style="margin-top:12px;">
                <button type="submit" class="modal-close-btn" style="background:rgba(52,69,45,0.08);border-color:rgba(52,69,45,0.12);color:#34452D;">➕ ያክሉ / Add</button>
                <button type="button" class="modal-close-btn" onclick="closeModal()">✕ ዝጋ / Close</button>
            </div>
        </form>
    `);
});

function addGoal(e) {
    e.preventDefault();
    const newGoal = {
        id: Date.now(),
        icon: document.getElementById('newGoalIcon').value || '🎯',
        title: document.getElementById('newGoalTitle').value,
        titleEn: document.getElementById('newGoalTitleEn').value,
        progress: parseInt(document.getElementById('newGoalProgress').value) || 0,
        color: document.getElementById('newGoalColor').value
    };
    scorecardData.strategicGoals.push(newGoal);
    closeModal();
    renderScorecard();
}

// ================================================================
// ===== ADDITIONAL REPORTS NOTEBOOK =====
// ================================================================
let notebookEntries = [
    { 
        id: 1, 
        titleAm: '📊 የጎብኝዎች አጠቃላይ እይታ (ጥር - ሰኔ 2024)', 
        titleEn: 'Visitors Overview (Jan - Jun 2024)', 
        category: 'chart',
        categoryAm: 'ገበታ',
        categoryEn: 'Chart',
        date: '2024-06-30', 
        status: 'final',
        statusAm: 'የተጠናቀቀ',
        statusEn: 'Final',
        contentAm: 'በጥር - ሰኔ 2024 የዴስክቶፕ እና ሞባይል ጎብኝዎች አጠቃላይ እይታ',
        contentEn: 'Overview of desktop and mobile visitors from January - June 2024',
        hasChart: true,
        chartId: 'gradientNotebook'
    },
    { 
        id: 2, 
        titleAm: 'የስብሰባ ማስታወሻ - ታህሳስ 2026', 
        titleEn: 'Meeting Notes - December 2026', 
        category: 'internal',
        categoryAm: 'ውስጣዊ',
        categoryEn: 'Internal',
        date: '2026-12-20', 
        status: 'draft',
        statusAm: 'ረቂቅ',
        statusEn: 'Draft',
        contentAm: 'የወርሃዊ ስብሰባ ዋና ዋና ነጥቦች:\n1. የሩብ ዓመት አፈጻጸም ግምገማ\n2. የበጀት ማስተካከያ\n3. ቀጣይ እርምጃዎች', 
        contentEn: 'Key meeting points:\n1. Quarterly performance review\n2. Budget adjustments\n3. Next steps',
        hasChart: false
    },
    { 
        id: 3, 
        titleAm: 'ሀሳብ ለአዲስ ፕሮጀክት', 
        titleEn: 'Idea for New Project', 
        category: 'internal',
        categoryAm: 'ውስጣዊ',
        categoryEn: 'Internal',
        date: '2026-12-18', 
        status: 'draft',
        statusAm: 'ረቂቅ',
        statusEn: 'Draft',
        contentAm: 'የማህበረሰብ ተሳትፎን ለማሳደግ አዲስ ፕሮጀክት ሀሳብ።', 
        contentEn: 'New project idea to increase community engagement.',
        hasChart: false
    }
];

let notebookNextId = 4;
let currentNotebookId = null;

function renderNotebookEntries() {
    const searchTerm = document.getElementById('notebookSearch').value.toLowerCase();
    const filter = document.getElementById('notebookFilter').value;

    let filtered = notebookEntries.filter(entry => {
        const matchesSearch = entry.titleAm.includes(searchTerm) || 
                              entry.titleEn.toLowerCase().includes(searchTerm) ||
                              entry.contentAm.includes(searchTerm) ||
                              entry.contentEn.toLowerCase().includes(searchTerm);
        const matchesFilter = filter === 'all' || entry.category === filter;
        return matchesSearch && matchesFilter;
    });

    const container = document.getElementById('notebookContainer');
    const emptyState = document.getElementById('notebookEmpty');

    if (filtered.length === 0) {
        container.innerHTML = '';
        emptyState.classList.remove('hidden');
        if (typeof lucide !== 'undefined') lucide.createIcons();
    } else {
        emptyState.classList.add('hidden');
        container.innerHTML = filtered.map(entry => `
            <div class="notebook-entry" onclick="viewNotebookEntry(${entry.id})">
                <div class="entry-header">
                    <div>
                        <div class="entry-title">${entry.titleAm}</div>
                        <div style="font-size:9px;color:rgba(26,26,46,0.2);">${entry.titleEn}</div>
                    </div>
                    <div style="display:flex;gap:3px;flex-wrap:wrap;flex-shrink:0;">
                        <span class="entry-tag ${entry.category}">${entry.categoryAm}</span>
                        <span class="entry-tag ${entry.status}">${entry.statusAm}</span>
                        ${entry.hasChart ? `<span class="entry-tag chart">📊 ገበታ</span>` : ''}
                    </div>
                </div>
                <div class="entry-meta">
                    <span>📅 ${formatDate(entry.date)}</span>
                    <span>📌 ${entry.categoryEn}</span>
                    <span>📋 ${entry.statusEn}</span>
                </div>
                <div class="entry-excerpt">${entry.contentAm.split('\n')[0]}</div>
                ${entry.hasChart ? `
                    <div class="chart-card-inline" onclick="event.stopPropagation();">
                        <div class="chart-header">
                            <div class="chart-title">📈 ጎብኝዎች / Visitors</div>
                        </div>
                        <div class="chart-wrapper" id="${entry.chartId}">
                            <!-- Chart rendered by JS -->
                        </div>
                        <div class="chart-legend">
                            <div class="chart-legend-item">
                                <span class="line-sample gold"></span> ዴስክቶፕ
                            </div>
                            <div class="chart-legend-item">
                                <span class="line-sample blue"></span> ሞባይል
                            </div>
                        </div>
                        <div class="chart-footer">
                            <span>📈 <span class="trend">⬆ 5.2%</span> በዚህ ወር</span>
                            <span>•</span>
                            <span>📅 ጥር - ሰኔ 2024</span>
                        </div>
                    </div>
                ` : ''}
                <div style="margin-top:6px;">
                    <div class="notebook-actions" onclick="event.stopPropagation();">
                        <button class="view-btn" onclick="viewNotebookEntry(${entry.id})">👁️ <span class="bilingual"><span class="am">እይ</span><span class="en">View</span></span></button>
                        <button class="edit-btn" onclick="editNotebookEntry(${entry.id})">✏️ <span class="bilingual"><span class="am">አርትዕ</span><span class="en">Edit</span></span></button>
                        <button class="delete-btn" onclick="deleteNotebookEntry(${entry.id})">🗑️ <span class="bilingual"><span class="am">ሰርዝ</span><span class="en">Delete</span></span></button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function viewNotebookEntry(id) {
    const entry = notebookEntries.find(e => e.id === id);
    if (!entry) return;
    
    let chartHtml = '';
    if (entry.hasChart) {
        chartHtml = `
            <div class="chart-card-inline" style="margin-top:12px;">
                <div class="chart-header">
                    <div class="chart-title">📈 ጎብኝዎች / Visitors</div>
                </div>
                <div class="chart-wrapper" id="chartModal" style="height:120px;">
                    <!-- Chart rendered by JS -->
                </div>
                <div class="chart-legend">
                    <div class="chart-legend-item">
                        <span class="line-sample gold"></span> ዴስክቶፕ / Desktop
                    </div>
                    <div class="chart-legend-item">
                        <span class="line-sample blue"></span> ሞባይል / Mobile
                    </div>
                </div>
                <div class="chart-footer">
                    <span>📈 <span class="trend">⬆ 5.2%</span> በዚህ ወር / this month</span>
                    <span>•</span>
                    <span>📅 ጥር - ሰኔ 2024 / Jan - Jun 2024</span>
                </div>
            </div>
        `;
    }

    openModal(`📓 ${entry.titleAm}`, `
        <div class="notebook-detail-content">
            <div class="detail-row"><span class="detail-label">ርዕስ / Title</span><span class="detail-value">${entry.titleAm}<br><span style="font-size:11px;color:rgba(26,26,46,0.3);">${entry.titleEn}</span></span></div>
            <div class="detail-row"><span class="detail-label">ምድብ / Category</span><span class="detail-value">${entry.categoryAm} (${entry.categoryEn})</span></div>
            <div class="detail-row"><span class="detail-label">ሁኔታ / Status</span><span class="detail-value"><span class="entry-tag ${entry.status}">${entry.statusAm} (${entry.statusEn})</span></span></div>
            <div class="detail-row"><span class="detail-label">ቀን / Date</span><span class="detail-value">${formatDate(entry.date)}</span></div>
            <div class="full-description">
                <strong style="color:rgba(52,69,45,0.6);font-size:11px;">📝 ይዘት / Content</strong>
                <br><br>
                <div style="white-space:pre-wrap;font-size:14px;line-height:1.8;">${entry.contentAm}</div>
                <br>
                <div style="white-space:pre-wrap;font-size:13px;color:rgba(26,26,46,0.3);line-height:1.8;border-top:1px solid rgba(255,255,255,0.15);padding-top:8px;">${entry.contentEn}</div>
            </div>
            ${chartHtml}
            <div class="modal-actions" style="margin-top:16px;">
                <button class="modal-close-btn" onclick="closeModal()">✕ ዝጋ / Close</button>
                <button class="modal-close-btn" style="background:rgba(52,69,45,0.08);border-color:rgba(52,69,45,0.12);color:#34452D;" onclick="closeModal();editNotebookEntry(${entry.id})">✏️ አርትዕ / Edit</button>
            </div>
        </div>
    `);
}

function editNotebookEntry(id) {
    const entry = notebookEntries.find(e => e.id === id);
    if (!entry) return;
    currentNotebookId = id;
    openModal(`✏️ ማስታወሻ አርትዕ / Edit Note`, `
        <form id="editNotebookForm" onsubmit="saveNotebookEntry(event)">
            <input type="text" id="editNotebookTitleAm" value="${entry.titleAm}" placeholder="ርዕስ (አማርኛ) / Title (Amharic)" required>
            <input type="text" id="editNotebookTitleEn" value="${entry.titleEn}" placeholder="Title (English)" required>
            <select id="editNotebookCategory">
                <option value="internal" ${entry.category === 'internal' ? 'selected' : ''}>ውስጣዊ / Internal</option>
                <option value="external" ${entry.category === 'external' ? 'selected' : ''}>ውጫዊ / External</option>
                <option value="chart" ${entry.category === 'chart' ? 'selected' : ''}>ገበታ / Chart</option>
            </select>
            <select id="editNotebookStatus">
                <option value="draft" ${entry.status === 'draft' ? 'selected' : ''}>ረቂቅ / Draft</option>
                <option value="final" ${entry.status === 'final' ? 'selected' : ''}>የተጠናቀቀ / Final</option>
            </select>
            <input type="date" id="editNotebookDate" value="${entry.date}">
            <textarea id="editNotebookContentAm" placeholder="ይዘት (አማርኛ) / Content (Amharic)" style="min-height:150px;">${entry.contentAm}</textarea>
            <textarea id="editNotebookContentEn" placeholder="Content (English)" style="min-height:150px;">${entry.contentEn}</textarea>
            <div class="modal-actions" style="margin-top:12px;">
                <button type="submit" class="modal-close-btn" style="background:rgba(52,69,45,0.08);border-color:rgba(52,69,45,0.12);color:#34452D;">💾 አስቀምጥ / Save</button>
                <button type="button" class="modal-close-btn" onclick="closeModal()">✕ ዝጋ / Close</button>
            </div>
        </form>
    `);
}

function saveNotebookEntry(e) {
    e.preventDefault();
    const entry = notebookEntries.find(e => e.id === currentNotebookId);
    if (!entry) return;
    const category = document.getElementById('editNotebookCategory').value;
    const status = document.getElementById('editNotebookStatus').value;
    const categoryMap = {
        'internal': { am: 'ውስጣዊ', en: 'Internal' },
        'external': { am: 'ውጫዊ', en: 'External' },
        'chart': { am: 'ገበታ', en: 'Chart' }
    };
    const statusMap = {
        'draft': { am: 'ረቂቅ', en: 'Draft' },
        'final': { am: 'የተጠናቀቀ', en: 'Final' }
    };
    entry.titleAm = document.getElementById('editNotebookTitleAm').value;
    entry.titleEn = document.getElementById('editNotebookTitleEn').value;
    entry.category = category;
    entry.categoryAm = categoryMap[category].am;
    entry.categoryEn = categoryMap[category].en;
    entry.status = status;
    entry.statusAm = statusMap[status].am;
    entry.statusEn = statusMap[status].en;
    entry.date = document.getElementById('editNotebookDate').value;
    entry.contentAm = document.getElementById('editNotebookContentAm').value;
    entry.contentEn = document.getElementById('editNotebookContentEn').value;
    entry.hasChart = category === 'chart';
    if (entry.hasChart && !entry.chartId) {
        entry.chartId = 'chart_' + entry.id;
    }
    closeModal();
    renderNotebookEntries();
}

function deleteNotebookEntry(id) {
    const entry = notebookEntries.find(e => e.id === id);
    if (!entry) return;
    if (confirm(`ማስታወሻውን መሰረዝ እርግጠኛ ነዎት?\nDelete "${entry.titleAm}"?`)) {
        notebookEntries = notebookEntries.filter(e => e.id !== id);
        renderNotebookEntries();
    }
}

document.getElementById('newNotebookEntryBtn').addEventListener('click', function() {
    currentNotebookId = null;
    openModal(`📓 አዲስ ማስታወሻ / New Note`, `
        <form id="newNotebookForm" onsubmit="createNotebookEntry(event)">
            <input type="text" id="newNotebookTitleAm" placeholder="ርዕስ (አማርኛ) / Title (Amharic)" required>
            <input type="text" id="newNotebookTitleEn" placeholder="Title (English)" required>
            <select id="newNotebookCategory">
                <option value="internal">ውስጣዊ / Internal</option>
                <option value="external">ውጫዊ / External</option>
                <option value="chart">ገበታ / Chart</option>
            </select>
            <select id="newNotebookStatus">
                <option value="draft">ረቂቅ / Draft</option>
                <option value="final">የተጠናቀቀ / Final</option>
            </select>
            <input type="date" id="newNotebookDate" value="${new Date().toISOString().split('T')[0]}">
            <textarea id="newNotebookContentAm" placeholder="ይዘት (አማርኛ) / Content (Amharic)" style="min-height:150px;"></textarea>
            <textarea id="newNotebookContentEn" placeholder="Content (English)" style="min-height:150px;"></textarea>
            <div class="modal-actions" style="margin-top:12px;">
                <button type="submit" class="modal-close-btn" style="background:rgba(52,69,45,0.08);border-color:rgba(52,69,45,0.12);color:#34452D;">➕ ፍጠር / Create</button>
                <button type="button" class="modal-close-btn" onclick="closeModal()">✕ ዝጋ / Close</button>
            </div>
        </form>
    `);
});

function createNotebookEntry(e) {
    e.preventDefault();
    const category = document.getElementById('newNotebookCategory').value;
    const status = document.getElementById('newNotebookStatus').value;
    const categoryMap = {
        'internal': { am: 'ውስጣዊ', en: 'Internal' },
        'external': { am: 'ውጫዊ', en: 'External' },
        'chart': { am: 'ገበታ', en: 'Chart' }
    };
    const statusMap = {
        'draft': { am: 'ረቂቅ', en: 'Draft' },
        'final': { am: 'የተጠናቀቀ', en: 'Final' }
    };
    const newEntry = {
        id: notebookNextId++,
        titleAm: document.getElementById('newNotebookTitleAm').value,
        titleEn: document.getElementById('newNotebookTitleEn').value,
        category: category,
        categoryAm: categoryMap[category].am,
        categoryEn: categoryMap[category].en,
        status: status,
        statusAm: statusMap[status].am,
        statusEn: statusMap[status].en,
        date: document.getElementById('newNotebookDate').value,
        contentAm: document.getElementById('newNotebookContentAm').value || 'ምንም ይዘት የለም',
        contentEn: document.getElementById('newNotebookContentEn').value || 'No content',
        hasChart: category === 'chart',
        chartId: category === 'chart' ? 'chart_' + notebookNextId : null
    };
    notebookEntries.push(newEntry);
    closeModal();
    renderNotebookEntries();
}

document.getElementById('notebookSearch').addEventListener('input', renderNotebookEntries);
document.getElementById('notebookFilter').addEventListener('change', renderNotebookEntries);

// ================================================================
// ===== RENDER SECTION FUNCTION =====
// ================================================================
function renderSection(containerId, items, filterId, searchId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const filter = document.getElementById(filterId);
    const search = document.getElementById(searchId);
    const filterValue = filter ? filter.value : 'all';
    const searchValue = search ? search.value.toLowerCase() : '';

    let filtered = items.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchValue) || 
                              item.titleEn.toLowerCase().includes(searchValue) ||
                              item.description.toLowerCase().includes(searchValue);
        const matchesFilter = filterValue === 'all' || item.status === filterValue;
        return matchesSearch && matchesFilter;
    });

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="section-empty">
                <i data-lucide="inbox"></i>
                <span class="bilingual"><span class="am">ምንም ዕቃዎች የሉም</span><span class="en">No items found</span></span>
            </div>
        `;
        if (typeof lucide !== 'undefined') lucide.createIcons();
        return;
    }

    container.innerHTML = `
        <div class="section-stats">
            <div class="section-stat-card">
                <div class="stat-number">${filtered.length}</div>
                <div class="stat-label"><span class="am">ጠቅላላ</span><br><span class="en">Total</span></div>
            </div>
            <div class="section-stat-card">
                <div class="stat-number">${filtered.filter(i => i.status === 'active' || i.status === 'published' || i.status === 'received').length}</div>
                <div class="stat-label"><span class="am">ንቁ</span><br><span class="en">Active</span></div>
            </div>
            <div class="section-stat-card">
                <div class="stat-number">${filtered.filter(i => i.status === 'pending').length}</div>
                <div class="stat-label"><span class="am">በመጠባበቅ</span><br><span class="en">Pending</span></div>
            </div>
            <div class="section-stat-card">
                <div class="stat-number">${filtered.filter(i => i.status === 'completed' || i.status === 'published').length}</div>
                <div class="stat-label"><span class="am">ተጠናቅቋል</span><br><span class="en">Completed</span></div>
            </div>
        </div>
        <div class="section-list">
            ${filtered.map(item => `
                <div class="section-item" onclick="viewSectionItem('${containerId}', ${item.id})">
                    <div class="item-header">
                        <div class="item-title">
                            ${item.title}
                            <span class="item-en">${item.titleEn}</span>
                        </div>
                        <span class="item-badge badge-${item.status}">${getStatusLabel(item.status)}</span>
                    </div>
                    <div class="item-meta">
                        <span>📅 ${formatDate(item.date)}</span>
                        <span>📌 ${item.status}</span>
                    </div>
                    <div class="item-description">${item.description}</div>
                </div>
            `).join('')}
        </div>
    `;
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function viewSectionItem(containerId, id) {
    let item = null;
    let categoryName = '';
    
    for (const key in categoriesData) {
        const cat = categoriesData[key];
        if (cat.items) {
            const found = cat.items.find(i => i.id === id);
            if (found) {
                item = found;
                categoryName = cat.label;
                break;
            }
        }
    }

    if (!item) return;

    openModal(`📄 ${item.title}`, `
        <div class="section-detail-content">
            <div class="detail-row"><span class="detail-label">ርዕስ / Title</span><span class="detail-value">${item.title}<br><span style="font-size:11px;color:rgba(26,26,46,0.3);">${item.titleEn}</span></span></div>
            <div class="detail-row"><span class="detail-label">ሁኔታ / Status</span><span class="detail-value"><span class="item-badge badge-${item.status}">${getStatusLabel(item.status)}</span></span></div>
            <div class="detail-row"><span class="detail-label">ቀን / Date</span><span class="detail-value">${formatDate(item.date)}</span></div>
            <div class="detail-row"><span class="detail-label">ምድብ / Category</span><span class="detail-value">${categoryName}</span></div>
            <div class="full-description">${item.description}</div>
            <div class="modal-actions" style="margin-top:16px;">
                <button class="modal-close-btn" onclick="closeModal()">✕ ዝጋ / Close</button>
            </div>
        </div>
    `);
}

let planEthYear = null;
let planNotes = {};

function initPlanYear() {
    if (planEthYear !== null) return;
    const t = gregorianToEthiopian(new Date());
    planEthYear = t.year;
}

function planPrevYear() {
    initPlanYear();
    planEthYear--;
    renderPlanCalendar('planContainer');
}

function planNextYear() {
    initPlanYear();
    planEthYear++;
    renderPlanCalendar('planContainer');
}

function openPlanDayNote(key, dayNum, monthIdx) {
    const existing = planNotes[key] || '';
    openModal(`📓 ${ethiopianMonths[monthIdx]} ${dayNum}, ${planEthYear} ዓ.ም`, `
        <form id="planNoteForm" onsubmit="savePlanNoteFromModal(event, '${key}')">
            <div class="neu-notebook-page">
                <textarea id="planNoteTextarea" class="neu-notebook-textarea" placeholder="የወርሃዊ ሪፖርት ይጻፉ እዚህ... / Write the report for this day here...">${existing}</textarea>
            </div>
            <div class="modal-actions" style="margin-top:14px;">
                <button type="submit" class="modal-close-btn" style="background:rgba(52,69,45,0.12);border-color:rgba(52,69,45,0.25);color:#34452D;">💾 አስቀምጥ / Save</button>
                <button type="button" class="modal-close-btn" onclick="closeModal()">✕ ዝጋ / Close</button>
            </div>
        </form>
    `);
    setTimeout(() => { const el = document.getElementById('planNoteTextarea'); if (el) el.focus(); }, 50);
}

function savePlanNoteFromModal(e, key) {
    e.preventDefault();
    const text = document.getElementById('planNoteTextarea').value;
    if (text.trim()) {
        planNotes[key] = text;
    } else {
        delete planNotes[key];
    }
    closeModal();
    renderPlanCalendar('planContainer');
}

function renderPlanCalendar(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    initPlanYear();

    const today = gregorianToEthiopian(new Date());

    let monthsHtml = '';
    for (let m = 0; m < 13; m++) {
        const daysInMonth = getEthiopianDaysInMonth(m, planEthYear);
        const firstDay = getEthiopianFirstDay(m, planEthYear);
        let dayCells = '';
        for (let i = 0; i < firstDay; i++) dayCells += `<div class="neu-day-empty"></div>`;
        for (let d = 1; d <= daysInMonth; d++) {
            const key = `${planEthYear}-${m}-${d}`;
            const isToday = today.year === planEthYear && today.month === m && today.day === d;
            const hasNote = !!planNotes[key];
            dayCells += `<div class="neu-day ${isToday ? 'neu-day-today' : ''} ${hasNote ? 'neu-day-has-note' : ''}" data-day="${d}" onclick="openPlanDayNote('${key}', ${d}, ${m})">${hasNote ? '<span class=\"neu-day-dot\"></span>' : ''}</div>`;
        }
        monthsHtml += `
            <div class="neu-month-card">
                <div class="neu-month-title">${ethiopianMonths[m]}</div>
                <div class="neu-day-grid">${dayCells}</div>
            </div>
        `;
    }

    container.innerHTML = `
        <div class="neu-page">
            <div class="neu-header">
                <h3>ዓመታዊ ዕቅድ<span class="en">Yearly Plan — tap any day to write a report</span></h3>
                <div class="neu-year-nav">
                    <button aria-label="Previous year" onclick="planPrevYear()">‹</button>
                    <span class="neu-year-label">${planEthYear} ዓ.ም</span>
                    <button aria-label="Next year" onclick="planNextYear()">›</button>
                </div>
            </div>
            <div class="neu-month-grid">${monthsHtml}</div>
        </div>
    `;
}

function renderFolderView(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const folderColor = '#078930';
    const folderBack = '#056023';

    let html = '<div class="pr-folders-wrap">';
    for (let i = 1; i <= 4; i++) {
        html += `
            <div class="pr-folder-slot">
                <div class="pr-folder-scale">
                    <div class="pr-folder" id="prFolder${i}" tabindex="0" role="button" aria-expanded="false" aria-label="Open folder"
                         style="--pr-folder-color:${folderColor}; --pr-folder-back:${folderBack};">
                        <div class="pr-folder__back">
                            <div class="pr-paper" data-idx="1"></div>
                            <div class="pr-paper" data-idx="2"></div>
                            <div class="pr-paper" data-idx="3"></div>
                            <div class="pr-folder__front"></div>
                            <div class="pr-folder__front pr-right"></div>
                        </div>
                    </div>
                </div>
                <div class="pr-folder-label">ማህደር ${i} <br><span style="opacity:.6;">Folder ${i}</span></div>
            </div>
        `;
    }
    html += '</div>';
    container.innerHTML = html;

    document.querySelectorAll('#' + containerId + ' .pr-folder').forEach(folder => {
        folder.addEventListener('click', () => {
            const isOpen = folder.classList.toggle('pr-open');
            folder.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            if (!isOpen) {
                folder.querySelectorAll('.pr-paper').forEach(p => {
                    p.style.setProperty('--magnet-x', '0px');
                    p.style.setProperty('--magnet-y', '0px');
                });
            }
        });
        folder.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                folder.click();
            }
        });
        folder.querySelectorAll('.pr-paper').forEach(paper => {
            paper.addEventListener('mousemove', (e) => {
                if (!folder.classList.contains('pr-open')) return;
                const rect = paper.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const offsetX = (e.clientX - centerX) * 0.15;
                const offsetY = (e.clientY - centerY) * 0.15;
                paper.style.setProperty('--magnet-x', offsetX + 'px');
                paper.style.setProperty('--magnet-y', offsetY + 'px');
            });
            paper.addEventListener('mouseleave', () => {
                paper.style.setProperty('--magnet-x', '0px');
                paper.style.setProperty('--magnet-y', '0px');
            });
        });
    });
}

let budgetDocs = {};

function openBudgetDoc(key, labelAm, labelEn) {
    const existing = budgetDocs[key] || '';
    openModal(`📄 ${labelAm} <span style="opacity:.5;font-weight:400;font-size:13px;">/ ${labelEn}</span>`, `
        <form id="budgetDocForm" onsubmit="saveBudgetDoc(event, '${key}')">
            <div class="word-doc-page">
                <div class="word-doc-title">${labelAm} <span class="en">${labelEn}</span></div>
                <textarea id="budgetDocTextarea" class="word-doc-textarea" placeholder="Write here...">${existing}</textarea>
            </div>
            <div class="modal-actions" style="margin-top:14px;">
                <button type="submit" class="modal-close-btn" style="background:rgba(52,69,45,0.12);border-color:rgba(52,69,45,0.25);color:#34452D;">💾 Save</button>
                <button type="button" class="modal-close-btn" onclick="closeModal()">✕ Close</button>
            </div>
        </form>
    `);
    setTimeout(() => { const el = document.getElementById('budgetDocTextarea'); if (el) el.focus(); }, 50);
}

function saveBudgetDoc(e, key) {
    e.preventDefault();
    budgetDocs[key] = document.getElementById('budgetDocTextarea').value;
    closeModal();
}

function renderGlassIcons(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const items = [
        { key: 'plan', icon: 'file-text', labelAm: 'ዕቅድ', labelEn: 'Plan' },
        { key: 'report', icon: 'bar-chart-2', labelAm: 'ሪፖርት', labelEn: 'Report' },
        { key: 'expenses', icon: 'trending-down', labelAm: 'ወጪ', labelEn: 'Expenses' },
        { key: 'income', icon: 'trending-up', labelAm: 'ገቢ', labelEn: 'Income' },
        { key: 'request', icon: 'edit-3', labelAm: 'ጥያቄ', labelEn: 'Request' },
        { key: 'analytics', icon: 'pie-chart', labelAm: 'ትንተና', labelEn: 'Analytics' }
    ];

    let html = '<div class="icon-btns">';
    items.forEach(item => {
        html += `
            <button type="button" class="icon-btn" aria-label="${item.labelEn}" onclick="openBudgetDoc('${item.key}', '${item.labelAm}', '${item.labelEn}')">
                <span class="icon-btn__stage">
                    <span class="icon-btn__back"></span>
                    <span class="icon-btn__front">
                        <i data-lucide="${item.icon}" class="icon-btn__icon"></i>
                    </span>
                </span>
                <span class="icon-btn__label">${item.labelAm}<br><span style="opacity:.6;">${item.labelEn}</span></span>
            </button>
        `;
    });
    html += '</div>';
    container.innerHTML = html;

    if (typeof lucide !== 'undefined') lucide.createIcons();
}

let prFolders = [
    { id: 1, icon: 'folder', am: 'ፕሬስ ሪሊዞች', en: 'Press Releases', files: [] },
    { id: 2, icon: 'folder', am: 'ማህበራዊ ሚዲያ', en: 'Social Media', files: [] },
    { id: 3, icon: 'folder', am: 'ዝግጅቶች', en: 'Events', files: [] },
    { id: 4, icon: 'folder', am: 'ሚዲያ ኪት', en: 'Media Kit', files: [] }
];
let prActiveFolderId = 1;
let prFolderNextId = 5;
let prFileNextId = 1;

function prFileIconFor(name) {
    const ext = (name.split('.').pop() || '').toLowerCase();
    if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(ext)) return { icon: 'image', color: '#a855f7' };
    if (['xlsx', 'xls', 'csv'].includes(ext)) return { icon: 'file-spreadsheet', color: '#22c55e' };
    if (['pdf'].includes(ext)) return { icon: 'file-text', color: '#e5484d' };
    return { icon: 'file-text', color: '#3b82f6' };
}

function getPrActiveFolder() {
    return prFolders.find(f => f.id === prActiveFolderId) || prFolders[0];
}

function prFolderModalHtml() {
    const folder = getPrActiveFolder();
    const initials = s => (s || '?').trim().charAt(0).toUpperCase();
    return `
        <div class="kb-write-row">
            <i data-lucide="pencil-line" class="kb-write-icon"></i>
            <textarea id="prFileWriteInput" class="kb-write-textarea" placeholder="Write a file name or a full note here — no length limit..." oninput="this.style.height='auto'; this.style.height=this.scrollHeight+'px';"></textarea>
            <button class="kb-write-add-btn" onclick="addPrFileInline()"><i data-lucide="plus"></i>Add</button>
        </div>
        ${folder.files.length === 0 ? `
            <div class="kb-files-empty">No files in this folder yet — write a name above and hit Add.</div>
        ` : `
        <table class="kb-files-table">
            <thead><tr><th>Name</th><th>Added By</th><th class="kb-th-actions"></th></tr></thead>
            <tbody>
                ${folder.files.map(f => `
                    <tr>
                        <td><span class="kb-file-name"><i data-lucide="${f.icon}"></i>${f.name}</span></td>
                        <td><span class="kb-added-by"><span class="kb-avatar" style="background:${f.color};">${initials(f.by)}</span>${f.by}</span></td>
                        <td class="kb-td-actions"><button class="kb-delete-btn" aria-label="Delete" onclick="deletePrFile(${f.id})"><i data-lucide="trash-2"></i></button></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        `}
        <div class="modal-actions" style="margin-top:14px;">
            <button type="button" class="modal-close-btn" onclick="closeModal(); renderKnowledgeBaseView('publicRelationsContainer');">✕ Close</button>
        </div>
    `;
}

function openPrFolder(id) {
    prActiveFolderId = id;
    const folder = getPrActiveFolder();
    openModal(`🗂️ ${folder.am} <span style="opacity:.5;font-weight:400;font-size:13px;">/ ${folder.en}</span>`, prFolderModalHtml());
    setTimeout(() => { const el = document.getElementById('prFileWriteInput'); if (el) el.focus(); }, 50);
}

function addPrFolder() {
    openModal('🗂️ New Folder', `
        <form id="prAddFolderForm" onsubmit="submitPrFolder(event)">
            <input type="text" id="prFolderAmInput" placeholder="Folder name (Amharic)" required>
            <input type="text" id="prFolderEnInput" placeholder="Folder name (English)" required>
            <div class="modal-actions" style="margin-top:12px;">
                <button type="submit" class="modal-close-btn" style="background:rgba(52,69,45,0.12);border-color:rgba(52,69,45,0.25);color:#34452D;">➕ Create</button>
                <button type="button" class="modal-close-btn" onclick="closeModal()">✕ Close</button>
            </div>
        </form>
    `);
    setTimeout(() => { const el = document.getElementById('prFolderAmInput'); if (el) el.focus(); }, 50);
}

function submitPrFolder(e) {
    e.preventDefault();
    const am = document.getElementById('prFolderAmInput').value.trim();
    const en = document.getElementById('prFolderEnInput').value.trim();
    if (!am || !en) return;
    const newFolder = { id: prFolderNextId++, icon: 'folder', am, en, files: [] };
    prFolders.push(newFolder);
    prActiveFolderId = newFolder.id;
    closeModal();
    renderKnowledgeBaseView('publicRelationsContainer');
}

function addPrFileInline() {
    const input = document.getElementById('prFileWriteInput');
    if (!input) return;
    const name = input.value.trim();
    if (!name) { input.focus(); return; }
    const meta = prFileIconFor(name);
    const folder = getPrActiveFolder();
    folder.files.push({ id: prFileNextId++, name, icon: meta.icon, color: meta.color, by: 'You' });
    document.getElementById('modalBody').innerHTML = prFolderModalHtml();
    if (typeof lucide !== 'undefined') lucide.createIcons();
    setTimeout(() => {
        const newInput = document.getElementById('prFileWriteInput');
        if (newInput) newInput.focus();
    }, 0);
}

function deletePrFile(id) {
    const folder = getPrActiveFolder();
    folder.files = folder.files.filter(f => f.id !== id);
    document.getElementById('modalBody').innerHTML = prFolderModalHtml();
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

let apFolders = [
    { id: 1, icon: 'folder', am: 'የመሠረተ ልማት ዕቅድ', en: 'Infrastructure Plans', files: [] },
    { id: 2, icon: 'folder', am: 'የማህበረሰብ ዕቅድ', en: 'Community Plans', files: [] },
    { id: 3, icon: 'folder', am: 'የአጭር ጊዜ ዕቅድ', en: 'Short-Term Plans', files: [] },
    { id: 4, icon: 'folder', am: 'የረጅም ጊዜ ዕቅድ', en: 'Long-Term Plans', files: [] }
];
let apActiveFolderId = 1;
let apFolderNextId = 5;
let apFileNextId = 1;

function getApActiveFolder() {
    return apFolders.find(f => f.id === apActiveFolderId) || apFolders[0];
}

let galleryStore = {};
let galleryNextId = 1;

function galleryFor(ns) {
    if (!galleryStore[ns]) galleryStore[ns] = [];
    return galleryStore[ns];
}

function addGalleryPhoto(ns) {
    openModal('🖼️ Add Photo', `
        <form id="galleryAddForm" onsubmit="submitGalleryPhoto(event, '${ns}')">
            <input type="text" id="galleryUrlInput" placeholder="Image URL (https://...)" required>
            <input type="text" id="galleryLabelInput" placeholder="Label (e.g. Site visit, June 2026)">
            <div class="modal-actions" style="margin-top:12px;">
                <button type="submit" class="modal-close-btn" style="background:rgba(44,95,138,0.12);border-color:rgba(44,95,138,0.25);color:#2C5F8A;">➕ Add</button>
                <button type="button" class="modal-close-btn" onclick="closeModal()">✕ Close</button>
            </div>
        </form>
    `);
    setTimeout(() => { const el = document.getElementById('galleryUrlInput'); if (el) el.focus(); }, 50);
}

function submitGalleryPhoto(e, ns) {
    e.preventDefault();
    const url = document.getElementById('galleryUrlInput').value.trim();
    const label = document.getElementById('galleryLabelInput').value.trim();
    if (!url) return;
    galleryFor(ns).push({ id: galleryNextId++, image: url, label: label || 'Untitled' });
    closeModal();
    renderAccordionGallery(ns);
}

function removeGalleryPhoto(ns, id, ev) {
    if (ev) ev.stopPropagation();
    galleryStore[ns] = galleryFor(ns).filter(p => p.id !== id);
    renderAccordionGallery(ns);
}

function setActiveGalleryPanel(ns, index) {
    const wrap = document.getElementById('agGallery_' + ns);
    if (!wrap) return;
    const panels = wrap.querySelectorAll('.ag-panel');
    panels.forEach((panel, i) => {
        const active = i === index;
        panel.classList.toggle('ag-active', active);
        if (typeof gsap !== 'undefined') {
            gsap.to(panel, { flexGrow: active ? panels.length * 1.6 : 1, duration: 0.5, ease: 'power3.out' });
        } else {
            panel.style.flexGrow = active ? panels.length * 1.6 : 1;
        }
    });
}

function renderAccordionGallery(ns) {
    const el = document.getElementById('agGallery_' + ns);
    if (!el) return;
    const photos = galleryFor(ns);

    if (photos.length === 0) {
        el.outerHTML = `<div class="ag-empty" id="agGallery_${ns}">No photos yet — click "Add Photo" to add one.</div>`;
        return;
    }

    el.className = 'ag-gallery';
    el.innerHTML = photos.map((p, i) => `
        <div class="ag-panel ${i === 0 ? 'ag-active' : ''}" style="flex-grow:${i === 0 ? photos.length * 1.6 : 1};" onmouseenter="setActiveGalleryPanel('${ns}', ${i})" tabindex="0" onfocus="setActiveGalleryPanel('${ns}', ${i})">
            <img src="${p.image}" alt="${p.label}" draggable="false">
            <div class="ag-panel-overlay"></div>
            <button class="ag-panel-remove" aria-label="Remove photo" onclick="removeGalleryPhoto('${ns}', ${p.id}, event)"><i data-lucide="x"></i></button>
            <div class="ag-panel-label">${p.label}</div>
        </div>
    `).join('');
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function galleryBlockHtml(ns) {
    return `
        <div class="ag-section">
            <div class="ag-header">
                <h3>📷 Photos</h3>
                <button class="kb-add-file-btn" onclick="addGalleryPhoto('${ns}')"><i data-lucide="image-plus"></i>Add Photo</button>
            </div>
            <div class="ag-empty" id="agGallery_${ns}">No photos yet — click "Add Photo" to add one.</div>
        </div>
    `;
}

let kbStores = {};

function kbInit(ns, containerId, breadcrumb, defaultFolders) {
    if (kbStores[ns]) return;
    kbStores[ns] = {
        containerId,
        breadcrumb,
        folders: defaultFolders.map((f, i) => ({ id: i + 1, icon: 'folder', am: f.am, en: f.en, files: [] })),
        activeId: 1,
        folderNextId: defaultFolders.length + 1,
        fileNextId: 1
    };
}

function kbActiveFolder(ns) {
    const s = kbStores[ns];
    return s.folders.find(f => f.id === s.activeId) || s.folders[0];
}

function kbFolderModalHtml(ns) {
    const s = kbStores[ns];
    const folder = kbActiveFolder(ns);
    const initials = x => (x || '?').trim().charAt(0).toUpperCase();
    return `
        <div class="kb-write-row kb-write-row-tall">
            <textarea id="kbWriteInput" class="kb-write-textarea" placeholder="Write a file name or a full note here — no length limit..." oninput="this.style.height='auto'; this.style.height=this.scrollHeight+'px';"></textarea>
        </div>
        <div style="text-align:right;margin-bottom:14px;">
            <button class="kb-write-add-btn" onclick="addKbFileInline('${ns}')"><i data-lucide="plus"></i>Add</button>
        </div>
        ${folder.files.length === 0 ? `
            <div class="kb-files-empty">No files in this folder yet — write above and hit Add.</div>
        ` : `
        <table class="kb-files-table">
            <thead><tr><th>Name</th><th>Added By</th><th class="kb-th-actions"></th></tr></thead>
            <tbody>
                ${folder.files.map(f => `
                    <tr>
                        <td><span class="kb-file-name kb-file-name-clip"><i data-lucide="${f.icon}"></i><span>${f.name}</span></span></td>
                        <td><span class="kb-added-by"><span class="kb-avatar" style="background:${f.color};">${initials(f.by)}</span>${f.by}</span></td>
                        <td class="kb-td-actions"><button class="kb-delete-btn" aria-label="Delete" onclick="deleteKbFile('${ns}', ${f.id})"><i data-lucide="trash-2"></i></button></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        `}
        <div class="modal-actions" style="margin-top:14px;">
            <button type="button" class="modal-close-btn" onclick="closeModal(); renderKbView('${ns}');">✕ Close</button>
        </div>
    `;
}

function openKbFolder(ns, id) {
    kbStores[ns].activeId = id;
    const folder = kbActiveFolder(ns);
    openModal(`🗂️ ${folder.am} <span style="opacity:.5;font-weight:400;font-size:13px;">/ ${folder.en}</span>`, kbFolderModalHtml(ns));
    if (typeof lucide !== 'undefined') lucide.createIcons();
    setTimeout(() => { const el = document.getElementById('kbWriteInput'); if (el) el.focus(); }, 50);
}

function addKbFolder(ns) {
    openModal('🗂️ New Folder', `
        <form id="kbAddFolderForm" onsubmit="submitKbFolder(event, '${ns}')">
            <input type="text" id="kbFolderAmInput" placeholder="Folder name (Amharic)" required>
            <input type="text" id="kbFolderEnInput" placeholder="Folder name (English)" required>
            <div class="modal-actions" style="margin-top:12px;">
                <button type="submit" class="modal-close-btn" style="background:rgba(52,69,45,0.12);border-color:rgba(52,69,45,0.25);color:#34452D;">➕ Create</button>
                <button type="button" class="modal-close-btn" onclick="closeModal()">✕ Close</button>
            </div>
        </form>
    `);
    setTimeout(() => { const el = document.getElementById('kbFolderAmInput'); if (el) el.focus(); }, 50);
}

function submitKbFolder(e, ns) {
    e.preventDefault();
    const am = document.getElementById('kbFolderAmInput').value.trim();
    const en = document.getElementById('kbFolderEnInput').value.trim();
    if (!am || !en) return;
    const s = kbStores[ns];
    const newFolder = { id: s.folderNextId++, icon: 'folder', am, en, files: [] };
    s.folders.push(newFolder);
    s.activeId = newFolder.id;
    closeModal();
    renderKbView(ns);
}

function addKbFileInline(ns) {
    const input = document.getElementById('kbWriteInput');
    if (!input) return;
    const text = input.value.trim();
    if (!text) { input.focus(); return; }
    const meta = prFileIconFor(text.split('\n')[0]);
    const s = kbStores[ns];
    const folder = kbActiveFolder(ns);
    folder.files.push({ id: s.fileNextId++, name: text, icon: meta.icon, color: meta.color, by: 'You' });
    document.getElementById('modalBody').innerHTML = kbFolderModalHtml(ns);
    if (typeof lucide !== 'undefined') lucide.createIcons();
    setTimeout(() => { const el = document.getElementById('kbWriteInput'); if (el) el.focus(); }, 0);
}

function deleteKbFile(ns, id) {
    const folder = kbActiveFolder(ns);
    folder.files = folder.files.filter(f => f.id !== id);
    document.getElementById('modalBody').innerHTML = kbFolderModalHtml(ns);
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

let green3dState = null;

function init3DViewer(containerId) {
    const el = document.getElementById(containerId);
    if (!el || typeof THREE === 'undefined') {
        if (el) el.innerHTML = '<div class="kb-3d-fallback">3D viewer library did not load — check your internet connection.</div>';
        return;
    }
    try {
        init3DViewerInner(el);
    } catch (err) {
        console.error('3D viewer failed to initialize:', err);
        el.innerHTML = '<div class="kb-3d-fallback">3D preview isn\'t supported on this browser/device.</div>';
    }
}

function init3DViewerInner(el) {
    // tear down any previous instance to avoid stacking renderers on re-render
    if (green3dState) {
        cancelAnimationFrame(green3dState.rafId);
        if (green3dState.renderer) green3dState.renderer.dispose();
        if (green3dState.resizeObserver) green3dState.resizeObserver.disconnect();
        green3dState = null;
    }
    el.innerHTML = '';

    const width = el.clientWidth || 300;
    const height = el.clientHeight || 320;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.01, 100);
    camera.position.set(1.6, 1.2, 2.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    el.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const key = new THREE.DirectionalLight(0xffffff, 1);
    key.position.set(4, 6, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x9fd8a0, 0.5);
    rim.position.set(-4, 2, -4);
    scene.add(rim);

    let controls = null;
    if (THREE.OrbitControls) {
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.08;
        controls.enablePan = false;
        controls.minDistance = 1;
        controls.maxDistance = 8;
    }

    // Placeholder low-poly "tree on a green disc" model (no external .glb dependency).
    // Swap this for THREE.GLTFLoader().load('your-model.glb', ...) if you have a real model.
    const group = new THREE.Group();
    const ground = new THREE.Mesh(
        new THREE.CylinderGeometry(1.1, 1.1, 0.12, 32),
        new THREE.MeshStandardMaterial({ color: 0x4a7a4a, roughness: 0.9 })
    );
    ground.position.y = -0.5;
    group.add(ground);
    const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.11, 0.55, 10),
        new THREE.MeshStandardMaterial({ color: 0x6b4a2f, roughness: 0.8 })
    );
    trunk.position.y = -0.16;
    group.add(trunk);
    [0, 1, 2].forEach(i => {
        const foliage = new THREE.Mesh(
            new THREE.SphereGeometry(0.5 - i * 0.12, 16, 16),
            new THREE.MeshStandardMaterial({ color: 0x2e8b3a, roughness: 0.85 })
        );
        foliage.position.y = 0.25 + i * 0.32;
        group.add(foliage);
    });
    scene.add(group);

    function onResize() {
        const w = el.clientWidth || width;
        const h = el.clientHeight || height;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    }
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(el);

    let rafId;
    function animate() {
        rafId = requestAnimationFrame(animate);
        group.rotation.y += 0.003;
        if (controls) controls.update();
        renderer.render(scene, camera);
    }
    animate();

    green3dState = { renderer, rafId, resizeObserver };
}

function renderKbView(ns) {
    const s = kbStores[ns];
    const container = document.getElementById(s.containerId);
    if (!container) return;
    const activeFolder = kbActiveFolder(ns);
    const totalFiles = s.folders.reduce((sum, f) => sum + f.files.length, 0);
    const isGreen = ns === 'green';

    const mainInner = `
                    <div class="kb-main-header">
                        <h3>Folders</h3>
                        <button class="kb-add-file-btn" onclick="addKbFolder('${ns}')"><i data-lucide="folder-plus"></i>New Folder</button>
                    </div>
                    <div class="kb-folder-grid">
                        ${s.folders.map(f => `
                            <div class="kb-folder-card ${f.id === activeFolder.id ? 'kb-folder-card-active' : ''}" onclick="openKbFolder('${ns}', ${f.id})">
                                <div class="kb-folder-art">
                                    <i data-lucide="${f.id === activeFolder.id ? 'folder-open' : f.icon}" class="kb-folder-icon"></i>
                                </div>
                                <div class="kb-folder-name">${f.am}<span class="en">${f.en}</span></div>
                                <div class="kb-folder-count">${f.files.length} Files</div>
                            </div>
                        `).join('')}
                    </div>
                    ${galleryBlockHtml(ns)}
    `;

    const mainContent = isGreen ? `
                <main class="kb-main kb-main-split">
                    <div class="kb-green-left">${mainInner}</div>
                    <div class="kb-green-right">
                        <div class="ag-header"><h3>🌳 3D Model</h3></div>
                        <div id="green3dViewer" class="kb-3d-viewer"></div>
                        <p class="kb-3d-hint">Drag to rotate · scroll to zoom</p>
                    </div>
                </main>
    ` : `
                <main class="kb-main">${mainInner}</main>
    `;

    container.innerHTML = `
        <div class="kb-panel">
            ${s.image ? `<div class="kb-banner"><img src="${s.image}" alt="${s.breadcrumb}"></div>` : ''}
            <div class="kb-topbar">
                <div class="kb-breadcrumb">${s.breadcrumb} <span class="kb-chevron">⌄</span></div>
                <div class="kb-topbar-actions">
                    <button aria-label="New Folder" onclick="addKbFolder('${ns}')"><i data-lucide="folder-plus"></i></button>
                </div>
            </div>
            <div class="kb-body">
                <aside class="kb-sidebar">
                    <div class="kb-search"><i data-lucide="search"></i><input placeholder="Search..."></div>
                    <div class="kb-tabs"><button class="active">Folders</button><button>Tags</button></div>
                    <ul class="kb-tree">
                        <li class="kb-tree-item active"><i data-lucide="folder-open"></i> አጠቃላይ <span class="count">${totalFiles}</span></li>
                        ${s.folders.map(f => `<li class="kb-tree-item sub ${f.id === activeFolder.id ? 'active' : ''}" onclick="openKbFolder('${ns}', ${f.id})"><i data-lucide="folder"></i> ${f.am} <span class="count">${f.files.length}</span></li>`).join('')}
                    </ul>
                </aside>
                ${mainContent}
            </div>
        </div>
    `;
    if (typeof lucide !== 'undefined') lucide.createIcons();
    renderAccordionGallery(ns);
    if (isGreen) init3DViewer('green3dViewer');
}

const KB_CATEGORY_CONFIG = {
    finance: { containerId: 'financeContainer', breadcrumb: 'የመ/ፋይናንስ/አስ/ መረጃ', folders: [
        { am: 'የፋይናንስ ሪፖርቶች', en: 'Finance Reports' }, { am: 'የአስተዳደር ሰነዶች', en: 'Admin Documents' }
    ]},
    findings: { containerId: 'findingsContainer', breadcrumb: 'የግኝት መረጃ', folders: [
        { am: 'የግምገማ ግኝቶች', en: 'Assessment Findings' }, { am: 'የክትትል ግኝቶች', en: 'Monitoring Findings' }
    ]},
    audit: { containerId: 'auditContainer', breadcrumb: 'የኦዲት መረጃ', folders: [
        { am: 'የውስጥ ኦዲት', en: 'Internal Audit' }, { am: 'የውጭ ኦዲት', en: 'External Audit' }
    ]},
    monitoring: { containerId: 'monitoringContainer', breadcrumb: 'የክትትልና ድጋፍ መረጃዎች', folders: [
        { am: 'የክትትል ሪፖርት', en: 'Monitoring Reports' }, { am: 'የድጋፍ እንቅስቃሴ', en: 'Support Activities' }
    ]},
    training: { containerId: 'trainingContainer', breadcrumb: 'የስልጠና መረጃዎች', folders: [
        { am: 'የስልጠና ፕሮግራሞች', en: 'Training Programs' }, { am: 'የስልጠና ሪፖርት', en: 'Training Reports' }
    ]},
    peer: { containerId: 'peerContainer', breadcrumb: 'አቻ ለአቻ ፍረም', folders: [
        { am: 'የፍረም ውይይቶች', en: 'Forum Discussions' }, { am: 'የፍረም ውጤቶች', en: 'Forum Outcomes' }
    ]},
    sdp: { containerId: 'sdpContainer', breadcrumb: 'SDP and OP ዕቅድና ሪፖርት', folders: [
        { am: 'SDP ዕቅድ', en: 'SDP Plans' }, { am: 'OP ሪፖርት', en: 'OP Reports' }
    ]},
    standard: { containerId: 'standardContainer', breadcrumb: 'ስታንዳርድ ገጽጽር ሪፖርት', folders: [
        { am: 'የገጽጽር ሪፖርቶች', en: 'Indicator Reports' }, { am: 'የአፈጻጸም ገጽጽር', en: 'Performance Indicators' }
    ]},
    satisfaction: { containerId: 'satisfactionContainer', breadcrumb: 'የተገልጋይ እርካታ', folders: [
        { am: 'የእርካታ ጥናቶች', en: 'Satisfaction Surveys' }, { am: 'የእርካታ ሪፖርት', en: 'Satisfaction Reports' }
    ]},
    complaint: { containerId: 'complaintContainer', breadcrumb: 'የቅሬታ መረጃ', folders: [
        { am: 'የቅሬታ መዝገብ', en: 'Complaint Log' }, { am: 'የቅሬታ ውሳኔዎች', en: 'Complaint Resolutions' }
    ]},
    capital: { containerId: 'capitalContainer', breadcrumb: 'የመ/ካፒታል ፕሮጀክት መረጃ', folders: [
        { am: 'የመንገድ ፕሮጀክቶች', en: 'Road Projects' }, { am: 'የህንፃ ፕሮጀክቶች', en: 'Building Projects' }
    ]},
    integrated: { containerId: 'integratedContainer', breadcrumb: 'የቅንጅታዊ አሰራር ሰነድ', folders: [
        { am: 'የቅንጅት ሰነዶች', en: 'Coordination Documents' }, { am: 'የሂደት ማሻሻያ', en: 'Process Improvement' }
    ]},
    trust: { containerId: 'trustContainer', breadcrumb: 'እምነታዊ አስተያየት', folders: [
        { am: 'የእምነት ጥናት', en: 'Trust Surveys' }, { am: 'የእምነት ሪፖርት', en: 'Trust Reports' }
    ]},
    monthlyPartner: { containerId: 'monthlyPartnerContainer', breadcrumb: 'ወርታማ ሴኞ/አብሮነት', folders: [
        { am: 'የአጋርነት ስምምነቶች', en: 'Partnership Agreements' }, { am: 'የወርሃዊ ስብሰባዎች', en: 'Monthly Meetings' }
    ]},
    externalMonitor: { containerId: 'externalMonitorContainer', breadcrumb: 'የውጭ ክትትል', folders: [
        { am: 'የፕሮጀክት ክትትል', en: 'Project Monitoring' }, { am: 'የአገልግሎት ግምገማ', en: 'Service Evaluation' }
    ]},
    woreda: { containerId: 'woredaContainer', breadcrumb: 'የወረዳዎች ዕቅድ', folders: [
        { am: 'የወረዳ ዕቅዶች', en: 'Woreda Plans' }, { am: 'የወረዳ ሪፖርቶች', en: 'Woreda Reports' }
    ]},
    knowledge: { containerId: 'knowledgeContainer', breadcrumb: 'ተቋማዊ እውቀት', folders: [
        { am: 'የፖሊሲ ሰነዶች', en: 'Policy Documents' }, { am: 'የስራ ሂደት መመሪያ', en: 'Procedure Manuals' }
    ]},
    networking: { containerId: 'networkingContainer', breadcrumb: 'የእርስ በርስ መገናኘቢ', folders: [
        { am: 'የአጋርነት ስምምነት', en: 'Partnership Agreements' }, { am: 'የስብሰባ ውጤት', en: 'Meeting Outcomes' }
    ]},
    income: { containerId: 'incomeContainer', breadcrumb: 'የገቢ መረጃ', folders: [
        { am: 'የመንግስት ድጋፍ', en: 'Government Support' }, { am: 'የለጋሽ ድጋፍ', en: 'Donor Support' }
    ]},
    experience: { containerId: 'experienceContainer', breadcrumb: 'የልምድ ልውውጥ', folders: [
        { am: 'የተሳካ ፕሮጀክቶች', en: 'Successful Projects' }, { am: 'የተማርናቸው ትምህርቶች', en: 'Lessons Learned' }
    ]},
    ngo: { containerId: 'ngoContainer', breadcrumb: 'የሲቪል ማህበራት/NGO/ መረጃ', folders: [
        { am: 'የኤንጂኦ ትብብር', en: 'NGO Collaboration' }, { am: 'የፕሮጀክት ድጋፍ', en: 'Project Support' }
    ]},
    modernization: { containerId: 'modernizationContainer', breadcrumb: 'ተቋማዊ የማዘመን ዕቅድና ሪፖርት', folders: [
        { am: 'የማዘመን ዕቅድ', en: 'Modernization Plans' }, { am: 'የማዘመን ሪፖርት', en: 'Modernization Reports' }
    ]},
    standardization: { containerId: 'standardizationContainer', breadcrumb: 'የስታንዳርዳይዜሽን ዕቅድ ሪፖርት', folders: [
        { am: 'የስታንዳርዳይዜሽን ዕቅድ', en: 'Standardization Plans' }, { am: 'የሪፎርም ሪፖርት', en: 'Reform Reports' }
    ]},
    employee: { containerId: 'employeeContainer', breadcrumb: 'ሰራተኛ የመደገፍና የማንሳሳት መረጃ', folders: [
        { am: 'የሰራተኛ ድጋፍ', en: 'Employee Support' }, { am: 'የማንሳሳት ፕሮግራም', en: 'Motivation Programs' }
    ]},
    balance: { containerId: 'balanceContainer', breadcrumb: 'የፈጻሚ እና የወረዳዎች ሚዛና መረጃ', folders: [
        { am: 'የአፈጻጸም ሚዛና', en: 'Performance Balance' }, { am: 'የሚዛና ሪፖርት', en: 'Balance Reports' }
    ]},
    green: { containerId: 'greenContainer', breadcrumb: 'ማዕድ ማጋራት/አረንዴ አሻራ', image: null, imageDisabled: 'data:image/jpeg;base64,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', folders: [
        { am: 'የአረንዴ አሻራ ፕሮጀክት', en: 'Green Footprint Projects' }, { am: 'የማዕድ ማጋራት ሪፖርት', en: 'Multi-Sector Reports' }
    ]},
    sector: { containerId: 'sectorContainer', breadcrumb: 'የዘርፍ ስብሰባ መረጃ', folders: [
        { am: 'የዘርፍ ስብሰባ ማስታወሻ', en: 'Sector Meeting Notes' }, { am: 'የስብሰባ ውጤቶች', en: 'Meeting Outcomes' }
    ]},
    bpr: { containerId: 'bprContainer', breadcrumb: 'BPR & BSC ጥናት', folders: [
        { am: 'BPR ጥናት ሪፖርት', en: 'BPR Study Reports' }, { am: 'BSC ማመዛዘኛ', en: 'BSC Assessments' }
    ]}
};

function renderKbCategory(ns) {
    const cfg = KB_CATEGORY_CONFIG[ns];
    if (!cfg) return;
    kbInit(ns, cfg.containerId, cfg.breadcrumb, cfg.folders);
    if (cfg.image) kbStores[ns].image = cfg.image;
    renderKbView(ns);
}

function apFolderModalHtml() {
    const folder = getApActiveFolder();
    const initials = s => (s || '?').trim().charAt(0).toUpperCase();
    return `
        <div class="kb-write-row">
            <i data-lucide="pencil-line" class="kb-write-icon"></i>
            <textarea id="apFileWriteInput" class="kb-write-textarea" placeholder="Write a file name or a full note here — no length limit..." oninput="this.style.height='auto'; this.style.height=this.scrollHeight+'px';"></textarea>
            <button class="kb-write-add-btn" onclick="addApFileInline()"><i data-lucide="plus"></i>Add</button>
        </div>
        ${folder.files.length === 0 ? `
            <div class="kb-files-empty">No files in this folder yet — write a name above and hit Add.</div>
        ` : `
        <table class="kb-files-table">
            <thead><tr><th>Name</th><th>Added By</th><th class="kb-th-actions"></th></tr></thead>
            <tbody>
                ${folder.files.map(f => `
                    <tr>
                        <td><span class="kb-file-name"><i data-lucide="${f.icon}"></i>${f.name}</span></td>
                        <td><span class="kb-added-by"><span class="kb-avatar" style="background:${f.color};">${initials(f.by)}</span>${f.by}</span></td>
                        <td class="kb-td-actions"><button class="kb-delete-btn" aria-label="Delete" onclick="deleteApFile(${f.id})"><i data-lucide="trash-2"></i></button></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        `}
        <div class="modal-actions" style="margin-top:14px;">
            <button type="button" class="modal-close-btn" onclick="closeModal(); renderApKnowledgeBaseView('additionalPlansContainer');">✕ Close</button>
        </div>
    `;
}

function openApFolder(id) {
    apActiveFolderId = id;
    const folder = getApActiveFolder();
    openModal(`🗂️ ${folder.am} <span style="opacity:.5;font-weight:400;font-size:13px;">/ ${folder.en}</span>`, apFolderModalHtml());
    setTimeout(() => { const el = document.getElementById('apFileWriteInput'); if (el) el.focus(); }, 50);
}

function addApFolder() {
    openModal('🗂️ New Folder', `
        <form id="apAddFolderForm" onsubmit="submitApFolder(event)">
            <input type="text" id="apFolderAmInput" placeholder="Folder name (Amharic)" required>
            <input type="text" id="apFolderEnInput" placeholder="Folder name (English)" required>
            <div class="modal-actions" style="margin-top:12px;">
                <button type="submit" class="modal-close-btn" style="background:rgba(52,69,45,0.12);border-color:rgba(52,69,45,0.25);color:#34452D;">➕ Create</button>
                <button type="button" class="modal-close-btn" onclick="closeModal()">✕ Close</button>
            </div>
        </form>
    `);
    setTimeout(() => { const el = document.getElementById('apFolderAmInput'); if (el) el.focus(); }, 50);
}

function submitApFolder(e) {
    e.preventDefault();
    const am = document.getElementById('apFolderAmInput').value.trim();
    const en = document.getElementById('apFolderEnInput').value.trim();
    if (!am || !en) return;
    const newFolder = { id: apFolderNextId++, icon: 'folder', am, en, files: [] };
    apFolders.push(newFolder);
    apActiveFolderId = newFolder.id;
    closeModal();
    renderApKnowledgeBaseView('additionalPlansContainer');
}

function addApFileInline() {
    const input = document.getElementById('apFileWriteInput');
    if (!input) return;
    const name = input.value.trim();
    if (!name) { input.focus(); return; }
    const meta = prFileIconFor(name);
    const folder = getApActiveFolder();
    folder.files.push({ id: apFileNextId++, name, icon: meta.icon, color: meta.color, by: 'You' });
    document.getElementById('modalBody').innerHTML = apFolderModalHtml();
    if (typeof lucide !== 'undefined') lucide.createIcons();
    setTimeout(() => {
        const newInput = document.getElementById('apFileWriteInput');
        if (newInput) newInput.focus();
    }, 0);
}

function deleteApFile(id) {
    const folder = getApActiveFolder();
    folder.files = folder.files.filter(f => f.id !== id);
    document.getElementById('modalBody').innerHTML = apFolderModalHtml();
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function renderApKnowledgeBaseView(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const activeFolder = getApActiveFolder();
    const totalFiles = apFolders.reduce((sum, f) => sum + f.files.length, 0);
    const initials = s => (s || '?').trim().charAt(0).toUpperCase();

    let html = `
        <div class="kb-panel">
            <div class="kb-topbar">
                <div class="kb-breadcrumb">ተጨማሪ ዕቅዶች <span class="kb-chevron">⌄</span></div>
                <div class="kb-topbar-actions">
                    <button aria-label="New Folder" onclick="addApFolder()"><i data-lucide="folder-plus"></i></button>
                </div>
            </div>
            <div class="kb-body">
                <aside class="kb-sidebar">
                    <div class="kb-search"><i data-lucide="search"></i><input placeholder="Search..."></div>
                    <div class="kb-tabs"><button class="active">Folders</button><button>Tags</button></div>
                    <ul class="kb-tree">
                        <li class="kb-tree-item active"><i data-lucide="folder-open"></i> አጠቃላይ <span class="count">${totalFiles}</span></li>
                        ${apFolders.map(f => `<li class="kb-tree-item sub ${f.id === activeFolder.id ? 'active' : ''}" onclick="openApFolder(${f.id})"><i data-lucide="folder"></i> ${f.am} <span class="count">${f.files.length}</span></li>`).join('')}
                    </ul>
                </aside>
                <main class="kb-main">
                    <div class="kb-main-header">
                        <h3>Folders</h3>
                        <button class="kb-add-file-btn" onclick="addApFolder()"><i data-lucide="folder-plus"></i>New Folder</button>
                    </div>
                    <div class="kb-folder-grid">
                        ${apFolders.map(f => `
                            <div class="kb-folder-card ${f.id === activeFolder.id ? 'kb-folder-card-active' : ''}" onclick="openApFolder(${f.id})">
                                <div class="kb-folder-art">
                                    <i data-lucide="${f.id === activeFolder.id ? 'folder-open' : f.icon}" class="kb-folder-icon"></i>
                                </div>
                                <div class="kb-folder-name">${f.am}<span class="en">${f.en}</span></div>
                                <div class="kb-folder-count">${f.files.length} Files</div>
                            </div>
                        `).join('')}
                    </div>
                    ${galleryBlockHtml('additionalPlans')}
                </main>
            </div>
        </div>
    `;
    container.innerHTML = html;
    if (typeof lucide !== 'undefined') lucide.createIcons();
    renderAccordionGallery('additionalPlans');
}

function renderKnowledgeBaseView(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const activeFolder = getPrActiveFolder();
    const totalFiles = prFolders.reduce((sum, f) => sum + f.files.length, 0);
    const initials = s => (s || '?').trim().charAt(0).toUpperCase();

    let html = `
        <div class="kb-panel">
            <div class="kb-topbar">
                <div class="kb-breadcrumb">የህዝብ ግንኙነት <span class="kb-chevron">⌄</span></div>
                <div class="kb-topbar-actions">
                    <button aria-label="New Folder" onclick="addPrFolder()"><i data-lucide="folder-plus"></i></button>
                </div>
            </div>
            <div class="kb-body">
                <aside class="kb-sidebar">
                    <div class="kb-search"><i data-lucide="search"></i><input placeholder="Search..."></div>
                    <div class="kb-tabs"><button class="active">Folders</button><button>Tags</button></div>
                    <ul class="kb-tree">
                        <li class="kb-tree-item active"><i data-lucide="folder-open"></i> አጠቃላይ <span class="count">${totalFiles}</span></li>
                        ${prFolders.map(f => `<li class="kb-tree-item sub ${f.id === activeFolder.id ? 'active' : ''}" onclick="openPrFolder(${f.id})"><i data-lucide="folder"></i> ${f.am} <span class="count">${f.files.length}</span></li>`).join('')}
                    </ul>
                </aside>
                <main class="kb-main">
                    <div class="kb-main-header">
                        <h3>Folders</h3>
                        <button class="kb-add-file-btn" onclick="addPrFolder()"><i data-lucide="folder-plus"></i>New Folder</button>
                    </div>
                    <div class="kb-folder-grid">
                        ${prFolders.map(f => `
                            <div class="kb-folder-card ${f.id === activeFolder.id ? 'kb-folder-card-active' : ''}" onclick="openPrFolder(${f.id})">
                                <div class="kb-folder-art">
                                    <i data-lucide="${f.id === activeFolder.id ? 'folder-open' : f.icon}" class="kb-folder-icon"></i>
                                </div>
                                <div class="kb-folder-name">${f.am}<span class="en">${f.en}</span></div>
                                <div class="kb-folder-count">${f.files.length} Files</div>
                            </div>
                        `).join('')}
                    </div>
                    ${galleryBlockHtml('publicRelations')}
                </main>
            </div>
        </div>
    `;
    container.innerHTML = html;
    if (typeof lucide !== 'undefined') lucide.createIcons();
    renderAccordionGallery('publicRelations');
}

function renderKnowledgeSection() {
    const container = document.getElementById('knowledgeContainer');
    const items = categoriesData.knowledge.items;
    const filter = document.getElementById('knowledgeFilter');
    const categoryFilter = document.getElementById('knowledgeCategoryFilter');
    const search = document.getElementById('knowledgeSearch');
    
    const filterValue = filter ? filter.value : 'all';
    const categoryValue = categoryFilter ? categoryFilter.value : 'all';
    const searchValue = search ? search.value.toLowerCase() : '';

    let filtered = items.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchValue) || 
                              item.titleEn.toLowerCase().includes(searchValue) ||
                              item.description.toLowerCase().includes(searchValue);
        const matchesFilter = filterValue === 'all' || item.status === filterValue;
        const matchesCategory = categoryValue === 'all' || item.category === categoryValue;
        return matchesSearch && matchesFilter && matchesCategory;
    });

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="section-empty">
                <i data-lucide="inbox"></i>
                <span class="bilingual"><span class="am">ምንም ሰነዶች የሉም</span><span class="en">No documents found</span></span>
            </div>
        `;
        if (typeof lucide !== 'undefined') lucide.createIcons();
        return;
    }

    container.innerHTML = `
        <div class="section-stats">
            <div class="section-stat-card">
                <div class="stat-number">${filtered.length}</div>
                <div class="stat-label"><span class="am">ጠቅላላ</span><br><span class="en">Total</span></div>
            </div>
            <div class="section-stat-card">
                <div class="stat-number">${filtered.filter(i => i.status === 'published').length}</div>
                <div class="stat-label"><span class="am">የታተመ</span><br><span class="en">Published</span></div>
            </div>
            <div class="section-stat-card">
                <div class="stat-number">${filtered.filter(i => i.status === 'draft').length}</div>
                <div class="stat-label"><span class="am">ረቂቅ</span><br><span class="en">Draft</span></div>
            </div>
            <div class="section-stat-card">
                <div class="stat-number">${filtered.filter(i => i.status === 'review').length}</div>
                <div class="stat-label"><span class="am">በግምገማ</span><br><span class="en">Review</span></div>
            </div>
        </div>
        <div class="section-list">
            ${filtered.map(item => `
                <div class="section-item" onclick="viewSectionItem('knowledgeContainer', ${item.id})">
                    <div class="item-header">
                        <div class="item-title">
                            ${item.title}
                            <span class="item-en">${item.titleEn}</span>
                        </div>
                        <span class="item-badge badge-${item.status}">${getStatusLabel(item.status)}</span>
                    </div>
                    <div class="item-meta">
                        <span>📅 ${formatDate(item.date)}</span>
                        <span>📁 ${item.category || 'General'}</span>
                    </div>
                    <div class="item-description">${item.description}</div>
                </div>
            `).join('')}
        </div>
    `;
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// ================================================================
// ===== RENDER SIDEBAR =====
// ================================================================
function filterSidebarCategories(query) {
    const q = query.trim().toLowerCase();
    document.querySelectorAll('.sidebar-group').forEach(group => {
        let anyVisible = false;
        group.querySelectorAll('.sidebar-item[data-category]').forEach(item => {
            const am = (item.querySelector('.amharic')?.textContent || '').toLowerCase();
            const en = (item.querySelector('.english')?.textContent || '').toLowerCase();
            const match = !q || am.includes(q) || en.includes(q);
            item.style.display = match ? '' : 'none';
            if (match) anyVisible = true;
        });
        group.style.display = anyVisible ? '' : 'none';
    });
}

function renderSidebar() {
    const container = document.getElementById('categoriesContainer');
    let html = '';
    
    const categoryKeys = [
        'bento', 'report', 'plan', 'additionalPlans', 'additionalReports',
        'scorecard', 'bpr', 'publicRelations', 'finance', 'budget',
        'findings', 'audit', 'monitoring', 'training', 'peer',
        'sdp', 'standard', 'satisfaction', 'complaint', 'capital',
        'integrated', 'trust', 'monthlyPartner', 'externalMonitor', 
        'woreda', 'knowledge', 'networking', 'income', 'experience', 
        'ngo', 'modernization', 'standardization', 'employee', 
        'balance', 'green', 'sector'
    ];

    // Group 1: Items 1-10 (Green)
    html += `<div class="sidebar-group sidebar-group-green">`;
    for (let i = 0; i < 10; i++) {
        const key = categoryKeys[i];
        const cat = categoriesData[key];
        if (!cat) continue;
        html += `
            <div class="sidebar-item" data-category="${key}" onclick="switchCategory('${key}')">
                <i data-lucide="${cat.icon}" class="icon"></i>
                <span class="label-text">
                    <span class="amharic">${cat.label}</span>
                    <span class="english">${cat.labelEn}</span>
                </span>
            </div>
        `;
    }
    html += `</div>`;

    // Group 2: Items 11-20 (Yellow)
    html += `<div class="sidebar-group sidebar-group-yellow">`;
    for (let i = 10; i < 20; i++) {
        const key = categoryKeys[i];
        const cat = categoriesData[key];
        if (!cat) continue;
        html += `
            <div class="sidebar-item" data-category="${key}" onclick="switchCategory('${key}')">
                <i data-lucide="${cat.icon}" class="icon"></i>
                <span class="label-text">
                    <span class="amharic">${cat.label}</span>
                    <span class="english">${cat.labelEn}</span>
                </span>
            </div>
        `;
    }
    html += `</div>`;

    // Group 3: Items 21-30 (Red)
    html += `<div class="sidebar-group sidebar-group-red">`;
    for (let i = 20; i < 30; i++) {
        const key = categoryKeys[i];
        const cat = categoriesData[key];
        if (!cat) continue;
        html += `
            <div class="sidebar-item" data-category="${key}" onclick="switchCategory('${key}')">
                <i data-lucide="${cat.icon}" class="icon"></i>
                <span class="label-text">
                    <span class="amharic">${cat.label}</span>
                    <span class="english">${cat.labelEn}</span>
                </span>
            </div>
        `;
    }
    html += `</div>`;

    // Group 4: Items 31-36 (Purple/Gray)
    html += `<div class="sidebar-group sidebar-group-purple">`;
    for (let i = 30; i < 36; i++) {
        const key = categoryKeys[i];
        const cat = categoriesData[key];
        if (!cat) continue;
        html += `
            <div class="sidebar-item" data-category="${key}" onclick="switchCategory('${key}')">
                <i data-lucide="${cat.icon}" class="icon"></i>
                <span class="label-text">
                    <span class="amharic">${cat.label}</span>
                    <span class="english">${cat.labelEn}</span>
                </span>
            </div>
        `;
    }
    html += `</div>`;

    container.innerHTML = html;
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// ================================================================
// ===== SWITCH CATEGORY =====
// ================================================================
function switchCategory(categoryKey) {
    document.querySelectorAll('.sidebar-item').forEach(el => el.classList.remove('active'));
    const sidebarItem = document.querySelector(`.sidebar-item[data-category="${categoryKey}"]`);
    if (sidebarItem) sidebarItem.classList.add('active');

    const allContentIds = [
        'overviewContent', 'bentoContent', 'reportContent', 'additionalReportsContent',
        'scorecardContent', 'monthlyPartnerContent', 'externalMonitorContent',
        'woredaContent', 'knowledgeContent', 'networkingContent', 'incomeContent',
        'experienceContent', 'ngoContent', 'planContent', 'additionalPlansContent',
        'bprContent', 'publicRelationsContent', 'financeContent', 'budgetContent',
        'findingsContent', 'auditContent', 'monitoringContent', 'trainingContent',
        'peerContent', 'sdpContent', 'standardContent', 'satisfactionContent',
        'complaintContent', 'capitalContent', 'integratedContent', 'trustContent',
        'modernizationContent', 'standardizationContent', 'employeeContent',
        'balanceContent', 'greenContent', 'sectorContent'
    ];
    allContentIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });

    const cat = categoriesData[categoryKey];
    if (!cat) return;

    document.getElementById('pageTitle').textContent = `${cat.label}`;
    document.getElementById('pageSubtitle').textContent = `${cat.labelEn}`;

    const contentMap = {
        'bento': 'bentoContent',
        'report': 'reportContent',
        'additionalReports': 'additionalReportsContent',
        'scorecard': 'scorecardContent',
        'monthlyPartner': 'monthlyPartnerContent',
        'externalMonitor': 'externalMonitorContent',
        'woreda': 'woredaContent',
        'knowledge': 'knowledgeContent',
        'networking': 'networkingContent',
        'income': 'incomeContent',
        'experience': 'experienceContent',
        'ngo': 'ngoContent',
        'plan': 'planContent',
        'additionalPlans': 'additionalPlansContent',
        'bpr': 'bprContent',
        'publicRelations': 'publicRelationsContent',
        'finance': 'financeContent',
        'budget': 'budgetContent',
        'findings': 'findingsContent',
        'audit': 'auditContent',
        'monitoring': 'monitoringContent',
        'training': 'trainingContent',
        'peer': 'peerContent',
        'sdp': 'sdpContent',
        'standard': 'standardContent',
        'satisfaction': 'satisfactionContent',
        'complaint': 'complaintContent',
        'capital': 'capitalContent',
        'integrated': 'integratedContent',
        'trust': 'trustContent',
        'modernization': 'modernizationContent',
        'standardization': 'standardizationContent',
        'employee': 'employeeContent',
        'balance': 'balanceContent',
        'green': 'greenContent',
        'sector': 'sectorContent'
    };

    const contentId = contentMap[categoryKey];
    if (contentId) {
        document.getElementById(contentId).classList.remove('hidden');
    }

    if (categoryKey === 'bento') {
        renderChart();
    } else if (categoryKey === 'report') {
        renderKanbanBoard(); // NEW KANBAN BOARD
    } else if (categoryKey === 'additionalReports') {
        renderNotebookEntries();
    } else if (categoryKey === 'scorecard') {
        renderScorecard();
    } else if (categoryKey === 'publicRelations') {
        renderKnowledgeBaseView('publicRelationsContainer');
    } else if (categoryKey === 'budget') {
        renderGlassIcons('budgetContainer');
    } else if (categoryKey === 'plan') {
        renderPlanCalendar('planContainer');
    } else if (categoryKey === 'additionalPlans') {
        renderApKnowledgeBaseView('additionalPlansContainer');
    } else if (['finance', 'findings', 'audit', 'monitoring', 'training', 'peer',
                'sdp', 'standard', 'satisfaction', 'complaint', 'capital',
                'integrated', 'trust', 'monthlyPartner', 'externalMonitor', 'woreda',
                'knowledge', 'networking', 'income', 'experience', 'ngo',
                'modernization', 'standardization', 'employee', 'balance',
                'green', 'sector', 'bpr'].includes(categoryKey)) {
        renderKbCategory(categoryKey);
    }

    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// ================================================================
// ===== OVERVIEW BUTTON =====
// ================================================================
document.getElementById('overviewBtn').addEventListener('click', function() {
    document.querySelectorAll('.sidebar-item').forEach(el => el.classList.remove('active'));
    this.classList.add('active');
    
    const allContentIds = [
        'overviewContent', 'bentoContent', 'reportContent', 'additionalReportsContent',
        'scorecardContent', 'monthlyPartnerContent', 'externalMonitorContent',
        'woredaContent', 'knowledgeContent', 'networkingContent', 'incomeContent',
        'experienceContent', 'ngoContent', 'planContent', 'additionalPlansContent',
        'bprContent', 'publicRelationsContent', 'financeContent', 'budgetContent',
        'findingsContent', 'auditContent', 'monitoringContent', 'trainingContent',
        'peerContent', 'sdpContent', 'standardContent', 'satisfactionContent',
        'complaintContent', 'capitalContent', 'integratedContent', 'trustContent',
        'modernizationContent', 'standardizationContent', 'employeeContent',
        'balanceContent', 'greenContent', 'sectorContent'
    ];
    allContentIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });
    
    document.getElementById('overviewContent').classList.remove('hidden');
    document.getElementById('pageTitle').textContent = '📊 Dashboard Overview';
    document.getElementById('pageSubtitle').textContent = 'Welcome back! Here\'s what\'s happening.';
    
    document.getElementById('overviewContent').innerHTML = `
        <h3>📁 Welcome to Kirikos Sub-City Dashboard</h3>
        <p>Select a category from the sidebar to view details.</p>
        <div class="meta">
            <p>📌 36 categories available • Last updated: Today</p>
        </div>
    `;
    if (typeof lucide !== 'undefined') lucide.createIcons();
});

// ================================================================
// ===== LOGOUT =====
// ================================================================
function logout() {
    if (confirm('እርግጠኛ ነዎት መውጣት ይፈልጋሉ?\nAre you sure you want to logout?')) {
        sessionStorage.removeItem('kirikos_user');
        window.location.href = 'login.html';
    }
}

// ================================================================
// ===== KANBAN BOARD LOGIC =====
// ================================================================

// Kanban state
let kanbanData = {
    todo: [],
    progress: [],
    review: [],
    completed: []
};

// Get elements
const kanbanColumns = document.querySelectorAll('.kanban-column');
const addCardBtns = document.querySelectorAll('.add-card-btn');
const saveKanbanBtn = document.getElementById('saveKanbanBtn');

// Function to render the board
function renderKanbanBoard() {
    // Clear all columns
    document.getElementById('todoCards').innerHTML = '';
    document.getElementById('progressCards').innerHTML = '';
    document.getElementById('reviewCards').innerHTML = '';
    document.getElementById('completedCards').innerHTML = '';

    // Render each column
    for (const [column, cards] of Object.entries(kanbanData)) {
        const container = document.getElementById(column + 'Cards');
        const countEl = document.getElementById(column + 'Count');
        
        if (cards.length === 0) {
            container.innerHTML = `<div class="empty-kanban-message">ምንም ካርዶች የሉም / No cards</div>`;
            countEl.textContent = '0';
        } else {
            countEl.textContent = cards.length;
            cards.forEach((card, index) => {
                const cardEl = document.createElement('div');
                cardEl.className = 'kanban-card';
                cardEl.innerHTML = `
                    <div class="card-title">${card.title}</div>
                    <div class="card-desc">${card.description || ''}</div>
                    <div class="card-footer">
                        <span class="card-date">📅 ${card.date || 'Today'}</span>
                        <button class="delete-card-btn" data-column="${column}" data-index="${index}">✕</button>
                    </div>
                `;
                container.appendChild(cardEl);
            });
        }
    }

    // Attach delete events to all delete buttons
    document.querySelectorAll('.delete-card-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const column = this.dataset.column;
            const index = parseInt(this.dataset.index);
            if (confirm('ለመሰረዝ እርግጠኛ ነዎት? / Confirm delete?')) {
                kanbanData[column].splice(index, 1);
                renderKanbanBoard();
            }
        });
    });
}

// Function to add a card to a column
function addCardToColumn(column) {
    const title = prompt('የስራውን ርዕስ ያስገቡ / Enter task title:');
    if (!title || title.trim() === '') return;
    
    const desc = prompt('መግለጫ ያስገቡ (አማራጭ) / Enter description (optional):');
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    kanbanData[column].push({
        title: title.trim(),
        description: desc || '',
        date: today
    });
    
    renderKanbanBoard();
}

// Add card button listeners
addCardBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const column = this.dataset.column;
        addCardToColumn(column);
    });
});

// Save Kanban Board as .txt file
saveKanbanBtn.addEventListener('click', function() {
    let fileContent = "📊 ሪፖርት - የስራ አመራር ሰሌዳ / Task Management Board\n";
    fileContent += "=".repeat(50) + "\n\n";
    
    const columnLabels = {
        todo: '📝 ለመስራት / To Do',
        progress: '⏳ በሂደት ላይ / In Progress',
        review: '🔍 በግምገማ ላይ / Under Review',
        completed: '✅ ተጠናቅቋል / Completed'
    };
    
    for (const [column, cards] of Object.entries(kanbanData)) {
        fileContent += `【 ${columnLabels[column]} 】\n`;
        fileContent += "-".repeat(40) + "\n";
        
        if (cards.length === 0) {
            fileContent += "  (ምንም ካርዶች የሉም / No cards)\n";
        } else {
            cards.forEach((card, i) => {
                fileContent += `  ${i+1}. ${card.title}\n`;
                if (card.description) {
                    fileContent += `     📝 ${card.description}\n`;
                }
                if (card.date) {
                    fileContent += `     📅 ${card.date}\n`;
                }
                fileContent += "\n";
            });
        }
        fileContent += "\n";
    }
    
    fileContent += "=".repeat(50) + "\n";
    fileContent += `የተጠናቀቀ በ: ${new Date().toLocaleString()}`;
    
    // Create blob and download
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Kanban_Board_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

// Initialize with sample data
kanbanData = {
    todo: [
        { title: 'Review Q4 budget', description: 'Check actual vs planned spending', date: 'Dec 20' },
        { title: 'Update employee records', description: 'Add new hires and remove terminated', date: 'Dec 22' }
    ],
    progress: [
        { title: 'Finalize annual report', description: 'Waiting for finance department inputs', date: 'Dec 24' }
    ],
    review: [
        { title: 'Draft new policy document', description: 'Legal team needs to review', date: 'Dec 18' }
    ],
    completed: [
        { title: 'Q3 performance review', description: 'Completed successfully', date: 'Dec 10' }
    ]
};

// ================================================================
// ===== INIT =====
// ================================================================
document.addEventListener('DOMContentLoaded', function() {
    const savedUser = sessionStorage.getItem('kirikos_user');
    if (!savedUser) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const user = JSON.parse(savedUser);
        const nameEl = document.getElementById('userName');
        if (nameEl && user.username) nameEl.textContent = user.username;
        const subEl = document.getElementById('pageSubtitle');
        if (subEl && user.username) subEl.textContent = `Welcome back, ${user.username}! Here's what's happening.`;
        const avatarEl = document.querySelector('.user-info .avatar');
        if (avatarEl && user.username) avatarEl.textContent = (user.username[0] || '?').toUpperCase();
    } catch (e) {}

    renderSidebar();
    renderChart();
    renderNotebookEntries();
    renderScorecard();
    renderKanbanBoard();
    
    renderSection('monthlyPartnerContainer', categoriesData.monthlyPartner.items, 'monthlyPartnerFilter', 'monthlyPartnerSearch');
    renderSection('externalMonitorContainer', categoriesData.externalMonitor.items, 'externalMonitorFilter', 'externalMonitorSearch');
    renderSection('woredaContainer', categoriesData.woreda.items, 'woredaFilter', 'woredaSearch');
    renderKnowledgeSection();
    renderSection('networkingContainer', categoriesData.networking.items, 'networkingFilter', 'networkingSearch');
    renderSection('incomeContainer', categoriesData.income.items, 'incomeFilter', 'incomeSearch');
    renderSection('experienceContainer', categoriesData.experience.items, 'experienceFilter', 'experienceSearch');
    renderSection('ngoContainer', categoriesData.ngo.items, 'ngoFilter', 'ngoSearch');

    document.querySelectorAll('.section-controls select, .section-controls input').forEach(el => {
        el.addEventListener('change', function() {
            const container = this.closest('.glass-card');
            if (!container) return;
            const sectionId = container.querySelector('.section-container')?.id;
            if (sectionId) {
                const containerMap = {
                    'monthlyPartnerContainer': 'monthlyPartner',
                    'externalMonitorContainer': 'externalMonitor',
                    'woredaContainer': 'woreda',
                    'knowledgeContainer': 'knowledge',
                    'networkingContainer': 'networking',
                    'incomeContainer': 'income',
                    'experienceContainer': 'experience',
                    'ngoContainer': 'ngo'
                };
                const categoryKey = containerMap[sectionId];
                if (categoryKey) {
                    if (categoryKey === 'knowledge') {
                        renderKnowledgeSection();
                    } else {
                        renderSection(sectionId, categoriesData[categoryKey].items, 
                            el.id.replace('Filter', '') + 'Filter', 
                            el.id.replace('Filter', '') + 'Search');
                    }
                }
            }
        });
    });

    if (typeof lucide !== 'undefined') lucide.createIcons();
    
    console.log('✅ Kirikos Dashboard loaded with all 36 categories!');
});

window.openModal = openModal;
window.closeModal = closeModal;
window.switchCategory = switchCategory;
window.viewSectionItem = viewSectionItem;
window.renderSection = renderSection;
window.renderKnowledgeSection = renderKnowledgeSection;
window.renderNotebookEntries = renderNotebookEntries;
window.viewNotebookEntry = viewNotebookEntry;
window.editNotebookEntry = editNotebookEntry;
window.deleteNotebookEntry = deleteNotebookEntry;
window.createNotebookEntry = createNotebookEntry;
window.saveNotebookEntry = saveNotebookEntry;
window.renderScorecard = renderScorecard;
window.addKpi = addKpi;
window.addGoal = addGoal;
window.logout = logout;
window.renderChart = renderChart;
window.renderKanbanBoard = renderKanbanBoard;