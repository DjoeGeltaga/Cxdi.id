document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  menuToggle?.addEventListener('click', () => navMenu.classList.toggle('active'));

  loadSettings();
  loadEvents();
  loadGiveaways();
  loadGallery();
});

async function loadSettings() {
  const { data } = await supabase.from('settings').select('*').single();
  if (data) {
    document.getElementById('btnWaHero').href = data.wa_link;
    document.getElementById('btnWaFooter').href = data.wa_link;
    document.getElementById('btnDiscordHero').href = data.discord_link;
    document.getElementById('btnDiscordFooter').href = data.discord_link;
    document.getElementById('statMembers').innerText = data.member_count;
  }
}

async function loadEvents() {
  const { data: events } = await supabase.from('events').select('*').order('created_at', { ascending: false });
  const container = document.getElementById('eventsGrid');
  document.getElementById('statEvents').innerText = events ? events.length : 0;

  if (!events || events.length === 0) {
    container.innerHTML = `<p style="color:var(--text-muted)">Belum ada event mendatang.</p>`;
    return;
  }

  container.innerHTML = events.map(e => `
    <div class="card">
      <img src="${e.image_url || 'https://via.placeholder.com/400x200'}" class="card-img" alt="Poster">
      <div class="card-body">
        <span class="badge badge-${e.status ? e.status.toLowerCase() : 'upcoming'}">${e.status}</span>
        <h3>${e.title}</h3>
        <p style="font-size: 0.85rem; color: var(--accent-red); margin: 5px 0;">📅 ${e.event_date} | ⏰ ${e.event_time}</p>
        <p style="font-size: 0.9rem; margin-bottom: 10px;"><strong>Mode:</strong> ${e.mode}</p>
        <p style="font-size: 0.85rem; color: var(--text-muted);">${e.description || ''}</p>
      </div>
    </div>
  `).join('');
}

async function loadGiveaways() {
  const { data: giveaways } = await supabase.from('giveaways').select('*').order('created_at', { ascending: false });
  const container = document.getElementById('giveawayGrid');
  document.getElementById('statGiveaways').innerText = giveaways ? giveaways.length : 0;

  if (!giveaways || giveaways.length === 0) {
    container.innerHTML = `<p style="color:var(--text-muted)">Belum ada giveaway aktif.</p>`;
    return;
  }

  container.innerHTML = giveaways.map(g => `
    <div class="card">
      <img src="${g.image_url || 'https://via.placeholder.com/400x200'}" class="card-img" alt="Giveaway">
      <div class="card-body">
        <span class="badge badge-ongoing">${g.status}</span>
        <h3>${g.title}</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin: 8px 0;">${g.description || ''}</p>
      </div>
    </div>
  `).join('');
}

async function loadGallery() {
  const { data: photos } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
  const container = document.getElementById('galleryGrid');
  document.getElementById('statGallery').innerText = photos ? photos.length : 0;

  if (!photos || photos.length === 0) {
    container.innerHTML = `<p style="color:var(--text-muted)">Galeri foto kosong.</p>`;
    return;
  }

  container.innerHTML = photos.map(p => `
    <div class="card" onclick="openModal('${p.image_url}')" style="cursor: pointer;">
      <img src="${p.image_url}" class="card-img" alt="${p.title}">
      <div class="card-body">
        <span class="badge" style="background: #242936; color: #fff;">${p.category}</span>
        <h4>${p.title}</h4>
      </div>
    </div>
  `).join('');
}

function openModal(url) {
  const modal = document.getElementById('imageModal');
  document.getElementById('modalImg').src = url;
  modal.style.display = 'flex';
}

document.getElementById('imageModal')?.addEventListener('click', () => {
  document.getElementById('imageModal').style.display = 'none';
});
