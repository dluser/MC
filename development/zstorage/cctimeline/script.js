const timelineData = [
  {
    "startDate": "1990",
    "endDate": "2000",
    "headline": "The Internet Meets Copyright",
    "text": "<p>The internet made it possible to access, share, and collaborate on creative works at an unprecedented scale. However, copyright laws continued to regulate copying and sharing in ways that often conflicted with the possibilities created by digital technology. Creative Commons was later created to help address this tension.</p>",
    "image": "assets/thumbnail-6a21ac445d7f6.png",
    "caption": "screenshot of napster, the music downloading software"
  },
  {
    "startDate": "1998",
    "endDate": "",
    "headline": "The Sonny Bono Copyright Term Extension Act",
    "text": "<p>In 1998, the United States enacted the Sonny Bono Copyright Term Extension Act (CTEA), extending copyright protection by an additional twenty years. For individual creators, copyright protection became life of the author plus seventy years. Critics argued that longer copyright terms delayed works from entering the public domain.</p>",
    "image": "assets/mm.png",
    "caption": "mickey mouse protection act"
  },
  {
    "startDate": "1999",
    "endDate": "",
    "headline": "Lawrence Lessig Challenges Copyright Expansion",
    "text": "<p>Stanford Law Professor Lawrence Lessig believed that repeated copyright term extensions undermined the original purpose of copyright. He partnered with publisher Eric Eldred to challenge the constitutionality of the Sonny Bono Act.</p>",
    "image": "assets/ll.png",
    "caption": "Lawrence Lessig's book 'Free Culture'"
  },
  {
    "startDate": "2001",
    "endDate": "",
    "headline": "A New Idea: Creative Commons",
    "text": "<p>Inspired by Eric Eldred's goal of making more creative works available online, Lawrence Lessig and others founded Creative Commons. Instead of changing copyright law itself, they sought a practical way for creators to voluntarily share their works.</p>",
    "image": "assets/cc.jpg",
    "caption": "Creative Commons logo"
  },
  {
    "startDate": "2002",
    "endDate": "",
    "headline": "The First Creative Commons Licenses",
    "text": "<p>Creative Commons released its first public licenses in 2002. These free licenses allowed creators to keep their copyright while granting the public permission to share and reuse their works under specified conditions.</p>",
    "image": "assets/commons.jpg",
    "caption": "three figures sharing papers amongst each other"
  },
  {
    "startDate": "2002",
    "endDate": "",
    "headline": "From \"All Rights Reserved\" to \"Some Rights Reserved\"",
    "text": "<p>Creative Commons licenses work within copyright law rather than replacing it. They provide creators with a flexible alternative to the traditional \"all rights reserved\" approach by allowing them to choose which rights they wish to share with others.</p>",
    "image": "assets/allrightsreserved.jpg",
    "caption": "The phrase 'all rights reserved' appearing on a DVD"
  },
  {
    "startDate": "2002",
    "endDate": "",
    "headline": "Creative Commons Becomes More Than Licenses",
    "text": "<p>Today, Creative Commons is three things at once. It is a nonprofit organization that stewards the licenses, a set of legal tools that allow creators to share their work more openly, and a global movement of people who support openness, collaboration, and access to knowledge and culture.</p>",
    "image": "assets/flickrphotowalk.jpg",
    "caption": "Flickr photowalk at the Creative Commons Global Summit 2019, Lisbon"
  },
  {
    "startDate": "2003",
    "endDate": "",
    "headline": "Eldred v. Ashcroft Reaches the Supreme Court",
    "text": "<p>The case Eldred v. Ashcroft argued that repeatedly extending copyright terms conflicted with the constitutional goal of promoting progress through limited monopolies. The case ultimately reached the U.S. Supreme Court, where Eldred lost.</p>",
    "image": "assets/eva.png",
    "caption": ""
  },
  {
    "startDate": "2010",
    "endDate": "Present",
    "headline": "Creative Commons Around the World",
    "text": "<p>Creative Commons licenses are now used on tens of billions of works worldwide, including educational resources, research articles, photographs, music, videos, and cultural heritage collections. They have become the global standard for open licensing and support a worldwide digital commons.</p>",
    "image": "assets/sharinginfo.png",
    "caption": ""
  }
];

const state = { index: 0 };

const els = {
  eventList: document.querySelector('#eventList'),
  range: document.querySelector('#timelineRange'),
  year: document.querySelector('#yearLabel'),
  headline: document.querySelector('#eventHeadline'),
  dates: document.querySelector('#eventDates'),
  body: document.querySelector('#eventBody'),
  media: document.querySelector('#eventMedia'),
  prev: document.querySelector('#prevBtn'),
  next: document.querySelector('#nextBtn'),
  progress: document.querySelector('#progressText')
};

function labelFor(item) {
  return item.endDate && item.endDate !== item.startDate
    ? `${item.startDate}–${item.endDate}`
    : item.startDate;
}

function renderEventList() {
  els.eventList.innerHTML = '';
  timelineData.forEach((item, index) => {
    const button = document.createElement('button');
    button.className = 'timeline-marker';
    button.type = 'button';
    button.setAttribute('aria-label', `${labelFor(item)}: ${item.headline}`);
    button.innerHTML = `<span class="marker-dot"></span><span class="marker-year">${item.startDate}</span>`;
    button.addEventListener('click', () => setIndex(index));
    els.eventList.appendChild(button);
  });
}

function render() {
  const item = timelineData[state.index];
  document.querySelectorAll('.timeline-marker').forEach((marker, i) => {
    marker.classList.toggle('is-active', i === state.index);
  });
  els.range.value = state.index;
  els.year.textContent = labelFor(item);
  els.headline.textContent = item.headline;
  els.dates.textContent = labelFor(item);
  els.body.innerHTML = item.text;
  els.media.innerHTML = '';
  if (item.image) {
    const figure = document.createElement('figure');
    figure.innerHTML = `<img src="${item.image}" alt="${item.caption || item.headline}">` +
      (item.caption ? `<figcaption>${item.caption}</figcaption>` : '');
    els.media.appendChild(figure);
  }
  els.prev.disabled = state.index === 0;
  els.next.disabled = state.index === timelineData.length - 1;
  els.progress.textContent = `${state.index + 1} of ${timelineData.length}`;
}

function setIndex(index) {
  state.index = Math.max(0, Math.min(timelineData.length - 1, Number(index)));
  render();
}

els.range.min = 0;
els.range.max = timelineData.length - 1;
els.range.step = 1;
els.range.addEventListener('input', e => setIndex(e.target.value));
els.prev.addEventListener('click', () => setIndex(state.index - 1));
els.next.addEventListener('click', () => setIndex(state.index + 1));
document.addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft') setIndex(state.index - 1);
  if (event.key === 'ArrowRight') setIndex(state.index + 1);
});

renderEventList();
render();
