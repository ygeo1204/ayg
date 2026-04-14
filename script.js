(function() {
    'use strict';
    
    const opening = document.getElementById('opening');
    const main = document.getElementById('main');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const rsvpForm = document.getElementById('rsvpForm');
    const rsvpResult = document.getElementById('rsvpResult');
    let envelopeOpened = false;
    
    function openEnvelope(auto) {
        if (envelopeOpened) return;
        envelopeOpened = true;
        
        opening.classList.add('hidden');
        main.classList.add('visible');
        sessionStorage.setItem('envelopeOpened', 'true');
        
        setTimeout(function() {
            opening.style.display = 'none';
        }, 800);
    }
    
    if (sessionStorage.getItem('envelopeOpened')) {
        envelopeOpened = true;
        opening.classList.add('hidden');
        main.classList.add('visible');
        opening.style.display = 'none';
    }
    
    window.openEnvelope = function() {
        openEnvelope(true);
    };
    
    if (opening && !envelopeOpened) {
        setTimeout(function() {
            openEnvelope(true);
        }, 2000);
        
        document.addEventListener('touchstart', function() {
            openEnvelope(true);
        }, { once: true });
        
        document.addEventListener('scroll', function() {
            openEnvelope(true);
        }, { once: true });
    }
    
    if (scrollIndicator && main) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const heroObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    scrollIndicator.style.opacity = '0';
                    scrollIndicator.style.transition = 'opacity 0.3s ease';
                } else {
                    scrollIndicator.style.opacity = '0.6';
                }
            });
        }, observerOptions);
        
        const hero = document.getElementById('hero');
        if (hero) {
            heroObserver.observe(hero);
        }
    }
    
    function smoothScrollTo(target) {
        const elem = document.querySelector(target);
        if (!elem) return;
        
        const start = window.pageYOffset;
        const elemTop = elem.getBoundingClientRect().top + start;
        const startTime = performance.now();
        const duration = 600;
        
        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            
            window.scrollTo(0, start + (elemTop - start) * easeOut);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }
        
        requestAnimationFrame(animate);
    }
    
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
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
                alert('복사되었습니다!');
            }).catch(function() {});
        }
    };
    
})();