(function() {
    'use strict';
    
    var opening = document.getElementById('opening');
    var main = document.getElementById('main');
    var rsvpForm = document.getElementById('rsvpForm');
    var rsvpResult = document.getElementById('rsvpResult');
    var galleryTrack = document.getElementById('galleryTrack');
    var galleryDots = document.getElementById('galleryDots');
    var galleryModal = document.getElementById('galleryModal');
    var modalSlider = document.getElementById('modalSlider');
    var modalIdxEl = document.getElementById('modalIdx');
    
    var WEDDING_DATE = new Date('2026-09-20T13:20:00');
    var envelopeOpened = false;
    var initialScrollDone = false;
    var countdownTimer = null;
    
    var currentGallery = 0;
    var totalGallery = 3;
    var modalCurrent = 0;
    var totalModal = 3;
    
    function updateCountdown() {
        var daysEl = document.getElementById('days');
        var hoursEl = document.getElementById('hours');
        var minsEl = document.getElementById('mins');
        var secsEl = document.getElementById('secs');
        
        if (!daysEl) return;
        
        var now = new Date();
        var diff = WEDDING_DATE - now;
        
        if (diff <= 0) {
            daysEl.textContent = '000';
            if (hoursEl) hoursEl.textContent = '00';
            if (minsEl) minsEl.textContent = '00';
            if (secsEl) secsEl.textContent = '00';
            if (countdownTimer) clearInterval(countdownTimer);
            return;
        }
        
        var totalSecs = Math.floor(diff / 1000);
        var days = Math.floor(totalSecs / 86400);
        var hours = Math.floor((totalSecs % 86400) / 3600);
        var mins = Math.floor((totalSecs % 3600) / 60);
        var secs = totalSecs % 60;
        
        daysEl.textContent = days.toString().padStart(3, '0');
        if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
        if (minsEl) minsEl.textContent = mins.toString().padStart(2, '0');
        if (secsEl) secsEl.textContent = secs.toString().padStart(2, '0');
    }
    
    function openEnvelope() {
        if (envelopeOpened) return;
        envelopeOpened = true;
        
        opening.classList.add('hidden');
        main.classList.add('visible');
        sessionStorage.setItem('envelopeOpened', 'true');
        
        setTimeout(function() {
            opening.style.display = 'none';
            startCountdown();
            initScrollAnimation();
        }, 600);
    }
    
    if (sessionStorage.getItem('envelopeOpened')) {
        envelopeOpened = true;
        opening.classList.add('hidden');
        main.classList.add('visible');
        opening.style.display = 'none';
        
        setTimeout(function() {
            startCountdown();
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
        
        setTimeout(function() {
            updateCountdown();
        }, 100);
    }
    
    function startCountdown() {
        if (countdownTimer) clearInterval(countdownTimer);
        updateCountdown();
        countdownTimer = setInterval(updateCountdown, 1000);
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
    
    function generateCalendar() {
        var grid = document.getElementById('calGrid');
        if (!grid) return;
        
        var dayNames = ['일', '월', '화', '수', '목', '금', '토'];
        var html = '';
        
        dayNames.forEach(function(d, i) {
            var cls = i === 0 ? 'sun' : i === 6 ? 'sat' : '';
            html += '<div class=\u0027cal-day-name ' + cls + '\u0027>' + d + '</div>';
        });
        
        var startDay = 2;
        var totalDays = 30;
        var weddingDay = 20;
        
        for (var i = 0; i < startDay; i++) {
            html += '<div class=\u0027cal-cell empty\u0027><div class=\u0027cal-day\u0027></div></div>';
        }
        for (var d = 1; d <= totalDays; d++) {
            var col = (startDay + d - 1) % 7;
            var isSun = col === 0;
            var isSat = col === 6;
            var isWed = d === weddingDay;
            var cls = [];
            if (isWed) cls.push('wedding');
            if (isSun) cls.push('sun');
            if (isSat) cls.push('sat');
            html += '<div class=\u0027cal-cell\u0027><div class=\u0027cal-day ' + cls.join(' ') + '\u0027>' + d + '</div></div>';
        }
        
        grid.innerHTML = html;
    }
    generateCalendar();
    
    if (galleryTrack) {
        var touchStartX = 0;
        var touchDeltaX = 0;
        var isDragging = false;
        
        function setGallerySlide(idx) {
            currentGallery = (idx + totalGallery) % totalGallery;
            galleryTrack.style.transform = 'translateX(' + (-currentGallery * 100) + '%)';
            
            if (galleryDots) {
                var dots = galleryDots.querySelectorAll('.dot');
                dots.forEach(function(dot, i) {
                    dot.classList.toggle('active', i === currentGallery);
                });
            }
        }
        
        galleryTrack.addEventListener('touchstart', function(e) {
            touchStartX = e.touches[0].clientX;
            isDragging = true;
        }, { passive: true });
        
        galleryTrack.addEventListener('touchmove', function(e) {
            if (!isDragging) return;
            touchDeltaX = e.touches[0].clientX - touchStartX;
        }, { passive: true });
        
        galleryTrack.addEventListener('touchend', function() {
            if (!isDragging) return;
            isDragging = false;
            if (Math.abs(touchDeltaX) > 50) {
                setGallerySlide(touchDeltaX < 0 ? currentGallery + 1 : currentGallery - 1);
            }
            touchDeltaX = 0;
        });
        
        if (galleryDots) {
            galleryDots.querySelectorAll('.dot').forEach(function(dot) {
                dot.addEventListener('click', function() {
                    setGallerySlide(parseInt(dot.getAttribute('data-idx'), 10));
                });
            });
        }
    }
    
    window.openModal = function(idx) {
        modalCurrent = idx;
        if (galleryModal) {
            galleryModal.classList.add('open');
            document.body.style.overflow = 'hidden';
            updateModalSlider();
        }
    };
    
    window.closeModal = function() {
        if (galleryModal) {
            galleryModal.classList.remove('open');
            document.body.style.overflow = '';
        }
    };
    
    window.modalPrev = function() {
        modalCurrent = (modalCurrent - 1 + totalModal) % totalModal;
        updateModalSlider();
    };
    
    window.modalNext = function() {
        modalCurrent = (modalCurrent + 1) % totalModal;
        updateModalSlider();
    };
    
    function updateModalSlider() {
        if (modalSlider) {
            modalSlider.style.transform = 'translateX(' + (-modalCurrent * 100) + '%)';
        }
        if (modalIdxEl) {
            modalIdxEl.textContent = (modalCurrent + 1) + ' / ' + totalModal;
        }
    }
    
    if (galleryModal) {
        galleryModal.addEventListener('click', function(e) {
            if (e.target === galleryModal) window.closeModal();
        });
    }
    
    window.switchTab = function(side) {
        var groomBtn = document.getElementById('tab-groom-btn');
        var brideBtn = document.getElementById('tab-bride-btn');
        var groomPanel = document.getElementById('panel-groom');
        var bridePanel = document.getElementById('panel-bride');
        
        if (side === 'groom') {
            groomBtn.classList.add('active');
            brideBtn.classList.remove('active');
            groomPanel.style.display = 'flex';
            bridePanel.style.display = 'none';
        } else {
            brideBtn.classList.add('active');
            groomBtn.classList.remove('active');
            bridePanel.style.display = 'flex';
            groomPanel.style.display = 'none';
        }
    };
    
    window.copyAccount = function(accountNum, btn) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(accountNum).then(function() {
                alert('계좌번호가 복사되었습니다!');
            }).catch(function() {});
        }
    };
    
    window.addToCalendar = function() {
        var icsContent = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Wedding Invitation//EN',
            'BEGIN:VEVENT',
            'DTSTART:20260920T132000',
            'DTEND:20260920T150000',
            'SUMMARY:어연걸 ♥ 김소정 결혼식',
            'LOCATION:KU컨벤션웨딩홀',
            'DESCRIPTION:2026년 9월 20일 일요일 오후 1시 20분',
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
    
    window.shareLink = function() {
        var url = window.location.href;
        var text = '어연걸 ♥ 김소정 결혼식 청첩장\n' + url;
        
        if (navigator.share) {
            navigator.share({
                title: '청첩장 | 어연걸 ♥ 김소정',
                text: text,
                url: url
            }).catch(function() {});
        } else if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(function() {
                alert('링크가 복사되었습니다!');
            }).catch(function() {});
        }
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
            
            console.log('RSVP:', data);
            rsvpForm.style.display = 'none';
            rsvpResult.style.display = 'block';
        });
    }
    
})();