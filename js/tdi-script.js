  // 한국시간 시계 (YYYY-MM-DD HH:MM, 24h)
  (function () {
    var el = document.getElementById('clock');
    function tick() {
      var p = {};
      new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
        .formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
      el.textContent = p.year + '-' + p.month + '-' + p.day + ' ' + p.hour + ':' + p.minute + ' KST';
    }
    tick(); setInterval(tick, 1000);
  })();

  // 달력 (샘플 데이터는 2026-11만)
  (function () {
    var g = document.getElementById('grid');
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    // [시간, 이름, 상태, 위치, 사진]
    var data = {
      '2026-11': {
        3:  [['19:00', '양재 시민의숲 코트', '', '서울 서초구', 'tennis3.jpg']],
        8:  [['07:00', '탄천 테니스장', 'full', '서울 강남구', 'tennis6.jpg']],
        11: [['20:00', '잠실 테니스장', 'sub', '서울 송파구', 'tennis8.jpg']],
        15: [['10:00', '올림픽공원 테니스장', '', '서울 송파구', 'tennis10.jpg']],
        19: [['19:30', '양재 시민의숲 코트', '', '서울 서초구', 'tennis3.jpg']],
        22: [['09:00', '탄천 테니스장', 'full', '서울 강남구', 'tennis6.jpg'], ['14:00', '반포 테니스장', '', '서울 서초구', 'tennis9.jpg'], ['18:00', '양재 시민의숲 코트', '', '서울 서초구', 'tennis3.jpg']],
        28: [['16:00', '올림픽공원 테니스장', 'sub', '서울 송파구', 'tennis10.jpg']]
      }
    };
    var Y = 2026, M = 10, sel = 15, MAX = 2;   // M: 0-index

    function show(y, m, d) {
      var ev = ((data[y + '-' + pad(m + 1)] || {})[d]) || [];
      if (!ev.length) return;
      var e = ev[0];
      document.getElementById('d-name').textContent = e[1];
      document.getElementById('d-meta').textContent = y + '-' + pad(m + 1) + '-' + pad(d) + ' · ' + e[0];
      document.getElementById('d-loc').textContent = e[3];
      document.getElementById('d-pic').src = 'img/' + e[4];
      document.getElementById('d-label').textContent = e[2] === 'full' ? 'CLOSED' : e[2] === 'sub' ? 'NEED SUBSTITUTE' : 'OPEN';
    }

    function render() {
      var key = Y + '-' + pad(M + 1), ev = data[key] || {}, html = '';
      ['일','월','화','수','목','금','토'].forEach(function (d) { html += '<div class="dow">' + d + '</div>'; });
      var first = new Date(Y, M, 1).getDay(), days = new Date(Y, M + 1, 0).getDate();
      for (var i = 0; i < first; i++) html += '<div class="day off"></div>';
      for (var d = 1; d <= days; d++) {
        var list = ev[d] || [];
        html += '<div class="day' + (list.length ? ' has' : '') + (d === sel ? ' sel' : '') + '" data-d="' + d + '"><span class="num">' + pad(d) + '</span>';
        list.slice(0, MAX).forEach(function (e) {
          html += '<span class="ev ' + e[2] + '"><span class="t">' + e[0] + '</span><span class="n">' + e[1] + '</span><span class="v">' + e[3] + '</span></span>';
        });
        if (list.length > MAX) html += '<span class="more">+ ' + (list.length - MAX) + ' 일정</span>';
        html += '</div>';
      }
      g.innerHTML = html;
      var pm = new Date(Y, M - 1, 1), nm = new Date(Y, M + 1, 1);
      document.getElementById('title').textContent = pad(M + 1) + '월 ' + Y;
      document.getElementById('prev').textContent = '← ' + pad(pm.getMonth() + 1) + '월 ' + pm.getFullYear();
      document.getElementById('next').textContent = pad(nm.getMonth() + 1) + '월 ' + nm.getFullYear() + ' →';
    }

    g.addEventListener('click', function (e) {
      var c = e.target.closest('.day[data-d]');
      if (!c) return;
      sel = +c.dataset.d; render(); show(Y, M, sel);
    });
    function move(n) { var t = new Date(Y, M + n, 1); Y = t.getFullYear(); M = t.getMonth(); sel = 0; render(); }
    document.getElementById('prev').onclick = function () { move(-1); };
    document.getElementById('next').onclick = function () { move(1); };
    render();
  })();
