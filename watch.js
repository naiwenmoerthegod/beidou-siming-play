const film = document.querySelector('#film');
const watch = document.querySelector('#watch');
const playlist = './pv/v26.m3u8';
let prepared = false;

function showAlternate() {
  document.querySelector('#alternate').hidden = false;
}

function prepareFilm() {
  if (film.canPlayType('application/vnd.apple.mpegurl')) {
    film.src = playlist;
  } else if (window.Hls && Hls.isSupported()) {
    const stream = new Hls();
    stream.on(Hls.Events.ERROR, (_, info) => { if (info.fatal) showAlternate(); });
    stream.loadSource(playlist);
    stream.attachMedia(film);
  } else {
    showAlternate();
    return false;
  }
  return true;
}

film.addEventListener('error', showAlternate);
watch.addEventListener('click', () => {
  const opening = film.hidden;
  film.hidden = !opening;
  document.querySelector('#cover').hidden = opening;
  document.querySelector('#line').hidden = opening;
  document.querySelector('#film-title').hidden = !opening;
  document.querySelector('#alternate').hidden = true;
  watch.setAttribute('aria-expanded', String(opening));
  watch.textContent = opening ? '返回封面' : '观看宣传片';
  if (opening) {
    if (!prepared) prepared = prepareFilm();
    if (prepared) film.play().catch(e => { if (e.name !== 'AbortError' && e.name !== 'NotAllowedError') showAlternate(); });
  } else {
    film.pause();
  }
});
