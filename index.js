window.addEventListener('load', () => {
    setTimeout(() => {
        document.querySelector('.Loading').classList.add('is-loaded');
    }, 1000);

    const vmin = Math.min(document.body.clientHeight, document.body.clientWidth) / 100;
    new CircleType(document.querySelector('.CircleBox-labelTitle'))
        .radius(14*vmin);
    new CircleType(document.querySelector('.CircleBox-labelName'))
        .radius(10*vmin);
    new CircleType(document.querySelector('.CircleBox-labelGithub > a'))
        .radius(10*vmin).dir(-1);
    new CircleType(document.querySelector('.CircleBox-labelYear'))
        .radius(10*vmin).dir(-1);

    const stylus = document.querySelector('.StylusBox');
    let p = -1;
    stylus.style.transform = 'rotate(-8deg)';

    const rotateAmounts = {
        '-1': -8,
        '0': 2.75,
        '1': 8,
        '2': 14,
        '3': 19.75,
    };

    const trackCount = 4;

    const trackEls = {};
    const tracks = {};

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();
    const gainNode = audioContext.createGain();
    for (let i = 0; i < trackCount; i++) {
        trackEls[i] = document.querySelector('#track' + i);
    }

    const volumeControl = document.querySelector('#volume');

    volumeControl.addEventListener('input', function() {
        gainNode.gain.value = this.value;
    }, false);

    gainNode.connect(audioContext.destination);

    for (let i = 0; i < trackCount; i++) {
        tracks[i] = audioContext.createMediaElementSource(trackEls[i]);
        tracks[i].connect(gainNode);
        trackEls[i].addEventListener('ended', () => {
            stylus.style.transform = 'rotate(' + rotateAmounts[-1] + 'deg)';
            for (let j = 0; j < trackCount; j++) {
                document.querySelector('.CircleBox-disc' + j).classList.remove('is-active');
            }
            document.querySelector('.CircleBox-label').classList.remove('is-clickable');
            document.querySelector('.CircleBox').classList.remove('is-spinning');
            p = 0;
        }, false);
    }

    for (let i = 0; i < trackCount; i++) {
        const disc = document.querySelector('.CircleBox-disc' + i);
        disc.addEventListener('click', () => {
            if (p != i) {
                stylus.style.transform = 'rotate(' + rotateAmounts[i] + 'deg)';
                for (let j = 0; j < trackCount; j++) {
                    document.querySelector('.CircleBox-disc' + j).classList.remove('is-active');
                    trackEls[j].pause();
                }
                disc.classList.add('is-active');
                document.querySelector('.CircleBox').classList.add('is-spinning');
                document.querySelector('.CircleBox-label').classList.add('is-clickable');
                p = i;
                // Start Playing
                if (audioContext.state === 'suspended') {
                    audioContext.resume();
                }

                trackEls[i].currentTime = 0;
                trackEls[i].play();
            } else {
                p = -1;
                for (let j = 0; j < trackCount; j++) {
                    document.querySelector('.CircleBox-disc' + j).classList.remove('is-active');
                }
                document.querySelector('.CircleBox-label').classList.remove('is-clickable');
                document.querySelector('.CircleBox').classList.remove('is-spinning');
                stylus.style.transform = 'rotate(' + rotateAmounts[-1] + 'deg)';
                trackEls[i].pause();
            }
        });
    }

    document.querySelector('.CircleBox-label').addEventListener('click', () => {
        stylus.style.transform = 'rotate(' + rotateAmounts[-1] + 'deg)';
        for (let j = 0; j < trackCount; j++) {
            document.querySelector('.CircleBox-disc' + j).classList.remove('is-active');
            trackEls[j].pause();
        }
        document.querySelector('.CircleBox-label').classList.remove('is-clickable');
        document.querySelector('.CircleBox').classList.remove('is-spinning');
        p = 0;
    });

    document.querySelector('.StopBox-button').addEventListener('click', () => {
        stylus.style.transform = 'rotate(' + rotateAmounts[-1] + 'deg)';
        for (let j = 0; j < trackCount; j++) {
            document.querySelector('.CircleBox-disc' + j).classList.remove('is-active');
            trackEls[j].pause();
        }
        document.querySelector('.CircleBox-label').classList.remove('is-clickable');
        document.querySelector('.CircleBox').classList.remove('is-spinning');
        p = 0;
    });
});
