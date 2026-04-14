(function() {
    'use strict';
    
    const opening = document.getElementById('opening');
    const main = document.getElementById('main');
    const rsvpForm = document.getElementById('rsvpForm');
    const rsvpResult = document.getElementById('rsvpResult');
    
    if (!opening || !main) return;
    
    window.openEnvelope = function() {
        opening.classList.add('hidden');
        main.classList.add('visible');
        
        setTimeout(function() {
            opening.style.display = 'none';
        }, 800);
    };
    
    if (sessionStorage.getItem('envelopeOpened')) {
        opening.classList.add('hidden');
        main.classList.add('visible');
        opening.style.display = 'none';
    }
    
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('open-btn')) {
            sessionStorage.setItem('envelopeOpened', 'true');
        }
    }, { once: true });
    
    window.addToCalendar = function() {
        const event = {
            title: '어연걸 ♥ 김소정 결혼식',
            start: '20260920T132000',
            end: '20260920T150000',
            location: 'KU컨벤션웨딩홀',
            description: '2026년 9월 20일 일요일 오후 1시 20분'
        };
        
        const icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Wedding Invitation//EN',
            'BEGIN:VEVENT',
            'DTSTART:' + event.start,
            'DTEND:' + event.end,
            'SUMMARY:' + event.title,
            'LOCATION:' + event.location,
            'DESCRIPTION:' + event.description,
            'END:VEVENT',
            'END:VCALENDAR'
        ].join('\r\n');
        
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'wedding-invitation.ics';
        link.click();
        URL.revokeObjectURL(url);
    };
    
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(rsvpForm);
            const data = {
                name: formData.get('guestName'),
                attendance: formData.get('attendance'),
                guests: formData.get('guests'),
                message: formData.get('message')
            };
            
            rsvpForm.style.display = 'none';
            rsvpResult.style.display = 'block';
            
            window.rsvpData = data;
        });
    }
    
    window.copyRSVP = function() {
        const data = window.rsvpData || { name: '', attendance: '' };
        const text = '어연걸 ♥ 김소정 결혼식 참석 여부\n이름: ' + data.name + '\n참석: ' + (data.attendance === 'yes' ? '참석합니다' : '참석 불가능합니다');
        
        if (navigator.share) {
            navigator.share({
                text: text
            }).catch(function() {});
        } else if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(function() {
                alert('복사되었습니 다!');
            }).catch(function() {
                kakaoLink(text);
            });
        } else {
            kakaoLink(text);
        }
    };
    
    function kakaoLink(text) {
        const url = encodeURIComponent(window.location.href);
        const kakaoUrl = 'https://kakaolink.line.me/action/share?url=' + url + '&text=' + encodeURIComponent(text);
        window.location.href = kakaoUrl;
    }
    
    var links = document.querySelectorAll('a[href^="http"]');
    links.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.target.href;
        });
    });
    
    document.addEventListener('touchmove', function(e) {
        if (e.target.closest('.rsvp-form')) {
            e.stopPropagation();
        }
    }, { passive: true });
    
})();