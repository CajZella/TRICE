window.HELP_IMPROVE_VIDEOJS = false;

// More Works Dropdown Functionality
function toggleMoreWorks() {
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');

    if (!dropdown || !button) return;
    
    if (dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    } else {
        dropdown.classList.add('show');
        button.classList.add('active');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    const container = document.querySelector('.more-works-container');
    const dropdown = document.getElementById('moreWorksDropdown');
    const button = document.querySelector('.more-works-btn');
    
    if (container && !container.contains(event.target)) {
        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Close dropdown on escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const dropdown = document.getElementById('moreWorksDropdown');
        const button = document.querySelector('.more-works-btn');

        if (!dropdown || !button) return;

        dropdown.classList.remove('show');
        button.classList.remove('active');
    }
});

// Copy BibTeX to clipboard
function copyBibTeX() {
    const bibtexElement = document.getElementById('bibtex-code');
    const button = document.querySelector('.copy-bibtex-btn');
    const copyText = button.querySelector('.copy-text');
    
    if (bibtexElement) {
        navigator.clipboard.writeText(bibtexElement.textContent).then(function() {
            // Success feedback
            button.classList.add('copied');
            copyText.textContent = 'Copied';
            
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        }).catch(function(err) {
            console.error('Failed to copy: ', err);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = bibtexElement.textContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            button.classList.add('copied');
            copyText.textContent = 'Copied';
            setTimeout(function() {
                button.classList.remove('copied');
                copyText.textContent = 'Copy';
            }, 2000);
        });
    }
}

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/hide scroll to top button
window.addEventListener('scroll', function() {
    const scrollButton = document.querySelector('.scroll-to-top');
    if (window.pageYOffset > 300) {
        scrollButton.classList.add('visible');
    } else {
        scrollButton.classList.remove('visible');
    }
});

// Video carousel autoplay when in view
function setupVideoCarouselAutoplay() {
    const carouselVideos = document.querySelectorAll('.results-carousel video');
    
    if (carouselVideos.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                // Video is in view, play it
                video.play().catch(e => {
                    // Autoplay failed, probably due to browser policy
                    console.log('Autoplay prevented:', e);
                });
            } else {
                // Video is out of view, pause it
                video.pause();
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% of the video is visible
    });
    
    carouselVideos.forEach(video => {
        observer.observe(video);
    });
}

function setupAimeLeaderboardCharts() {
    const charts = [
        {
            elementId: 'aime-chart-4b',
            data: [
                { name: 'Qwen3.5-4B', value: 75.8, mode: 'no-tool' },
                { name: 'TRICE-4B', value: 79.2, mode: 'no-tool', trice: true },
                { name: 'Qwen3-4B-\nThinking-2507', value: 82.5, mode: 'no-tool' },
                { name: 'AgentMath-8B†', value: 84.7, mode: 'tool' },
                { name: 'Qwen3.5-9B', value: 85.8, mode: 'no-tool' },
                { name: 'ASTER-4B†', value: 90.0, mode: 'tool' },
                { name: 'TRICE-4B', value: 96.7, mode: 'tool', trice: true }
            ]
        },
        {
            elementId: 'aime-chart-30b',
            data: [
                { name: 'GPT-OSS-20B', value: 86.7, mode: 'tool' },
                { name: 'Qwen3-30B-A3B-\nThinking-2507', value: 88.8, mode: 'no-tool' },
                { name: 'TRICE-30B', value: 89.2, mode: 'no-tool', trice: true },
                { name: 'Qwen3.5-35B-A3B', value: 94.2, mode: 'no-tool' },
                { name: 'GLM-4.7-Flash', value: 95.0, mode: 'tool' },
                { name: 'Nemotron-3-Nano-\n30B-A3B', value: 96.7, mode: 'tool' },
                { name: 'GLM-4.7-Flash\nw/ recipe', value: 98.3, mode: 'tool' },
                { name: 'TRICE-30B', value: 99.2, mode: 'tool', trice: true }
            ]
        }
    ];

    const palette = {
        ink: '#22435f',
        muted: '#5f7180',
        line: '#d7e7eb',
        baseline: '#8e99a8',
        baselineLight: '#d6e0ee',
        trice4b: '#00b7c7',
        trice30b: '#2f6df6',
        triceLight: '#7ee7f0'
    };

    function getItemColor(item) {
        if (item.trice && item.mode === 'no-tool') return palette.baseline;
        if (item.trice && item.name.includes('30B')) return palette.trice30b;
        if (item.trice) return palette.trice4b;
        return palette.baseline;
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function renderChart(config, element) {
        const width = Math.max(Math.round(element.clientWidth), 320);
        const height = Math.max(Math.round(element.clientHeight), 360);
        const compact = width < 430;
        const margin = {
            top: compact ? 26 : 30,
            right: compact ? 18 : 24,
            bottom: compact ? 132 : 142,
            left: compact ? 38 : 46
        };
        const minValue = 70;
        const maxValue = 100;
        const plotWidth = width - margin.left - margin.right;
        const plotHeight = height - margin.top - margin.bottom;
        const axisY = margin.top + plotHeight;
        const step = plotWidth / config.data.length;
        const barWidth = Math.min(compact ? 30 : 38, step * 0.58);
        const labelFont = compact ? 10 : 11;
        const scoreFont = compact ? 10 : 12;
        const patternId = `${config.elementId}-stripe`;
        const stripePatterns = config.data.map((item, index) => {
            const color = getItemColor(item);
            return `
                <pattern id="${patternId}-${index}" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
                    <rect width="8" height="8" fill="${color}"></rect>
                    <rect width="3" height="8" fill="rgba(255,255,255,0.42)"></rect>
                </pattern>
            `;
        }).join('');

        const y = value => margin.top + ((maxValue - value) / (maxValue - minValue)) * plotHeight;
        const gridTicks = [100, 90, 80, 70];
        const gridLines = gridTicks.map(tick => {
            const tickY = y(tick);
            return `
                <line x1="${margin.left}" y1="${tickY}" x2="${width - margin.right}" y2="${tickY}" class="aime-grid-line"></line>
                <text x="${margin.left - 10}" y="${tickY + 4}" class="aime-axis-label" text-anchor="end">${tick}</text>
            `;
        }).join('');

        const bars = config.data.map((item, index) => {
            const centerX = margin.left + step * index + step / 2;
            const barX = centerX - barWidth / 2;
            const barY = y(item.value);
            const barHeight = Math.max(axisY - barY, 2);
            const color = getItemColor(item);
            const strokeColor = item.trice && item.mode === 'no-tool' ? '#8fcbd1' : color;
            const fill = item.mode === 'tool' ? `url(#${patternId}-${index})` : color;
            const labelLines = item.name.split('\n');
            const labelColor = item.trice ? palette.ink : palette.muted;
            const labelWeight = item.trice ? 800 : 650;
            const labelText = labelLines.map((line, lineIndex) => (
                `<tspan x="0" dy="${lineIndex === 0 ? 0 : 12}">${escapeHtml(line)}</tspan>`
            )).join('');

            return `
                <g class="aime-bar-group" style="--bar-delay:${index * 70}ms">
                    <rect class="aime-bar ${item.trice ? 'is-trice' : ''} ${item.trice && item.mode === 'no-tool' ? 'is-text-only-trice' : ''}" x="${barX}" y="${barY}" width="${barWidth}" height="${barHeight}" rx="5" fill="${fill}" stroke="${item.trice ? strokeColor : 'none'}" stroke-width="${item.trice ? 2 : 0}"></rect>
                    <text x="${centerX}" y="${barY - 7}" class="aime-score ${item.trice ? 'is-trice' : ''}" text-anchor="middle" style="font-size:${scoreFont}px">${item.value.toFixed(1)}</text>
                    <g transform="translate(${centerX - 4}, ${axisY + 20}) rotate(45)">
                        <text class="aime-x-label ${item.trice ? 'is-trice' : ''}" text-anchor="start" style="font-size:${labelFont}px;font-weight:${labelWeight};fill:${labelColor}">${labelText}</text>
                    </g>
                </g>
            `;
        }).join('');

        element.innerHTML = `
            <svg class="aime-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(element.getAttribute('aria-label') || 'AIME leaderboard chart')}">
                <defs>
                    ${stripePatterns}
                </defs>
                ${gridLines}
                <line x1="${margin.left}" y1="${axisY}" x2="${width - margin.right}" y2="${axisY}" class="aime-axis-line"></line>
                ${bars}
            </svg>
        `;
    }

    charts.forEach(config => {
        const element = document.getElementById(config.elementId);
        if (!element) return;

        renderChart(config, element);

        let resizeFrame = null;
        const resize = () => {
            if (resizeFrame) cancelAnimationFrame(resizeFrame);
            resizeFrame = requestAnimationFrame(() => {
                renderChart(config, element);
            });
        };

        window.addEventListener('resize', resize);

        if ('ResizeObserver' in window) {
            const observer = new ResizeObserver(resize);
            observer.observe(element);
        }
    });
}

function setupRevealAnimations() {
    const targets = document.querySelectorAll('.leaderboard-card, .takeaway-card, .purpose-card');

    if (targets.length === 0) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
        targets.forEach(target => target.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.18,
        rootMargin: '0px 0px -8% 0px'
    });

    targets.forEach((target, index) => {
        target.style.setProperty('--reveal-delay', `${Math.min(index * 70, 420)}ms`);
        observer.observe(target);
    });
}

$(document).ready(function() {
    var options = {
		slidesToScroll: 1,
		slidesToShow: 1,
		loop: true,
		infinite: true,
		autoplay: true,
		autoplaySpeed: 5000,
    }

	// Initialize all div with carousel class
    if (typeof bulmaCarousel !== 'undefined' && document.querySelector('.carousel')) {
        bulmaCarousel.attach('.carousel', options);
    }
	
    if (typeof bulmaSlider !== 'undefined') {
        bulmaSlider.attach();
    }
    
    // Setup video autoplay for carousel
    setupVideoCarouselAutoplay();
    setupAimeLeaderboardCharts();
    setupRevealAnimations();

})
