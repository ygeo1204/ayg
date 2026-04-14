(function() {
    'use strict';
    
    const opening = document.getElementById('opening');
    const main = document.getElementById('main');
    const rsvpForm = document.getElementById('rsvpForm');
    const rsvpResult = document.getElementById('rsvpResult');
    let envelopeOpened = false;
    let initialScrollDone = false;
    
    function openEnvelope() {
        if (envelopeOpened) return;
        envelopeOpened = true;
        
        opening.classList.add('hidden');
        main.classList.add('visible');
        sessionStorage.setItem('envelopeOpened', 'true');
        
        setTimeout(function() {
            opening.style.display = 'none';
            initScrollAnimation();
        }, 600);
    }
    
    if (sessionStorage.getItem('envelopeOpened')) {
        envelopeOpened = true;
        opening.classList.add('hidden');
        main.classList.add('visible');
        opening.style.display = 'none';
        
        setTimeout(function() {
            initScrollAnimation();
        }, 100);
    }
    
    window.openEnvelope = function() {
        openEnvelope();
    };
    
    if (opening && !envelopeOpened) {
        document.addEventListener('touchstart', function() {
            openEnvelope();
        }, { once: true });
        
        document.addEventListener('scroll', function() {
            openEnvelope();
        }, { once: true });
        
        setTimeout(function() {
            if (!envelopeOpened) {
                openEnvelope();
            }
        }, 2500);
    }
    
    function initScrollAnimation() {
        if (initialScrollDone) return;
        initialScrollDone = true;
        
        var observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };
        
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);
        
        var sections = document.querySelectorAll('.section-inner');
        sections.forEach(function(section) {
            observer.observe(section);
        });
    }
    
    window.addToCalendar = function() {
        var event = {
            title: '어연걸 ♥ 김소정 결혼식',
            start: '20260920T132000',
            end: '20260920T150000',
            location: 'KU컨벤션웨딩홀',
            description: '2026년 9월 20일 일요일 오후 1시 20분'
        };
        
        var icsContent = [
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
        
        var blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        var url = URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = url;
        link.download = 'wedding-invitation.ics';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };
    
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            var formData = new FormData(rsvpForm);
            var data = {
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
        var data = window.rsvpData || { name: '', attendance: '' };
        var text = '어연걸 ♥ 김소정 결혼식 참석 여부\n이름: ' + data.name + '\n참석: ' + (data.attendance === 'yes' ? '참석합니다' : '참석 불가능합니다');
        
        if (navigator.share) {
            navigator.share({
                text: text
            }).catch(function() {});
        } else if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(function() {
                alert('복사되었습니다!');
            }).catch(function() {});
        }
    };
    
})();