// Main JavaScript for CampusFix with Enhanced Animations & Glassmorphism Utilities

$(document).ready(function () {

    /* ==========================================
       Toast Notification System
       ========================================== */
    function showToast(message, type = 'info') {
        const container = $('.toast-container');
        if (!container.length) return;

        const toastId = 'toast-' + Date.now();
        const iconMap = {
            'success': 'bi-check-circle-fill text-success',
            'danger': 'bi-x-circle-fill text-danger',
            'warning': 'bi-exclamation-triangle-fill text-warning',
            'info': 'bi-info-circle-fill text-info'
        };
        // Map common flask categories to bootstrap color statuses
        let toastClass = type;
        if (type === 'error') toastClass = 'danger';
        
        const icon = iconMap[toastClass] || 'bi-info-circle-fill text-info';
        
        const toastHtml = `
            <div id="${toastId}" class="toast custom-toast ${toastClass}-toast" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="4000">
                <div class="toast-header bg-transparent border-0 text-white pb-0 d-flex align-items-center">
                    <i class="bi ${icon} me-2 fs-5"></i>
                    <strong class="me-auto text-capitalize text-light">${toastClass}</strong>
                    <button type="button" class="btn-close btn-close-white ms-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body pt-1 text-white-50">
                    ${message}
                </div>
            </div>
        `;
        
        container.append(toastHtml);
        const toastEl = document.getElementById(toastId);
        if (toastEl) {
            const toast = new bootstrap.Toast(toastEl);
            toast.show();
            
            // Remove toast elements from DOM once hidden to prevent bloating
            toastEl.addEventListener('hidden.bs.toast', function () {
                toastEl.remove();
            });
        }
    }

    // Check for Flash Messages on page load
    $('.flash-msg').each(function () {
        const category = $(this).data('category');
        const message = $(this).data('message');
        showToast(message, category);
    });


    /* ==========================================
       Instant Client-side Table & Card Search
       ========================================== */
    $('#tableSearch').on('keyup', function () {
        const value = $(this).val().toLowerCase();
        
        // Filter table rows
        $('table tbody tr').filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
        
        // Filter list items or card lists (e.g. complaint lists)
        $('.complaint-item, .card-searchable').filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });

        // Show "no results" message if all hidden
        const visibleRows = $('table tbody tr:visible').length;
        const visibleCards = $('.complaint-item:visible, .card-searchable:visible').length;
        
        if (visibleRows === 0 && $('table').length && value !== '') {
            if (!$('#no-search-results').length) {
                $('table').after('<div id="no-search-results" class="text-center py-4 text-muted"><i class="bi bi-search fs-3"></i><p class="mt-2">No matching records found.</p></div>');
            }
        } else {
            $('#no-search-results').remove();
        }
    });


    /* ==========================================
       Bootstrap Tooltips & Popovers
       ========================================== */
    const tooltipTriggerList = [].slice.call(
        document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    const popoverTriggerList = [].slice.call(
        document.querySelectorAll('[data-bs-toggle="popover"]')
    );
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });


    /* ==========================================
       Delete Confirmation (Sweet Alerts Fallback)
       ========================================== */
    $('.delete-confirm').on('click', function (e) {
        if (!confirm('Are you sure you want to delete this item?')) {
            e.preventDefault();
        }
    });


    /* ==========================================
       Image Upload Preview
       ========================================== */
    $('#images').on('change', function () {
        const preview = $('#image-preview');
        preview.html('');
        const files = this.files;

        if (!files.length) return;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (!file.type.startsWith('image/')) continue;

            const reader = new FileReader();
            reader.onload = function (e) {
                const imgContainer = $('<div>').addClass('position-relative m-2');
                const img = $('<img>')
                    .attr('src', e.target.result)
                    .addClass('img-thumbnail')
                    .css({
                        width: '120px',
                        height: '120px',
                        objectFit: 'cover',
                        borderRadius: '10px',
                        background: 'rgba(255,255,255,0.05)',
                        borderColor: 'rgba(255,255,255,0.1)'
                    });
                
                imgContainer.append(img);
                preview.append(imgContainer);
            };
            reader.readAsDataURL(file);
        }
    });


    /* ==========================================
       Dashboard Counter Animation
       ========================================== */
    $('.counter').each(function () {
        const $this = $(this);
        const target = parseInt($this.attr('data-target')) || 0;

        $({ countNum: 0 }).animate(
            { countNum: target },
            {
                duration: 1200,
                easing: 'swing',
                step: function () {
                    $this.text(Math.floor(this.countNum));
                },
                complete: function () {
                    $this.text(this.countNum);
                }
            }
        );
    });


    /* ==========================================
       Form Input Interaction Effects
       ========================================== */
    $('.form-control, .form-select').on('focus', function () {
        $(this).closest('.mb-3').find('label').css('color', 'var(--neon-indigo)');
    }).on('blur', function () {
        $(this).closest('.mb-3').find('label').css('color', '');
    });

});