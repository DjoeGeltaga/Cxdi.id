document.addEventListener('DOMContentLoaded', async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    showDashboard();
  }
});

async function handleLogin() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    alert('Login Gagal: ' + error.message);
  } else {
    showDashboard();
  }
}

async function handleLogout() {
  await supabase.auth.signOut();
  window.location.reload();
}

function showDashboard() {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('adminPanel').style.display = 'block';
  loadSettingsInput();
}

async function loadSettingsInput() {
  const { data } = await supabase.from('settings').select('*').single();
  if (data) {
    document.getElementById('settingWa').value = data.wa_link;
    document.getElementById('settingDiscord').value = data.discord_link;
  }
}

async function saveSettings() {
  const wa_link = document.getElementById('settingWa').value;
  const discord_link = document.getElementById('settingDiscord').value;

  const { error } = await supabase.from('settings').update({ wa_link, discord_link }).eq('id', 1);
  if (error) alert('Gagal update link');
  else alert('Link Community berhasil diperbarui!');
}

async function uploadFile(fileInput) {
  const file = fileInput.files[0];
  if (!file) return null;

  const fileName = `${Date.now()}_${file.name}`;
  const { data, error } = await supabase.storage.from('cxdi-media').upload(fileName, file);

  if (error) {
    alert('Upload gambar gagal: ' + error.message);
    return null;
  }

  const { data: publicUrlData } = supabase.storage.from('cxdi-media').getPublicUrl(fileName);
  return publicUrlData.publicUrl;
}

async function addEvent() {
  const title = document.getElementById('evtTitle').value;
  const event_date = document.getElementById('evtDate').value;
  const event_time = document.getElementById('evtTime').value;
  const mode = document.getElementById('evtMode').value;
  const description = document.getElementById('evtDesc').value;
  const fileInput = document.getElementById('evtFile');

  const image_url = await uploadFile(fileInput);

  const { error } = await supabase.from('events').insert([{ title, event_date, event_time, mode, description, image_url }]);

  if (error) alert('Gagal menambah event: ' + error.message);
  else {
    alert('Event berhasil ditambahkan!');
    window.location.reload();
  }
}

async function addGallery() {
  const title = document.getElementById('galTitle').value;
  const category = document.getElementById('galCategory').value;
  const fileInput = document.getElementById('galFile');

  const image_url = await uploadFile(fileInput);
  if (!image_url) return alert('Silakan pilih foto terlebih dahulu.');

  const { error } = await supabase.from('gallery').insert([{ title, category, image_url }]);

  if (error) alert('Gagal upload galeri: ' + error.message);
  else {
    alert('Foto berhasil diupload ke galeri!');
    window.location.reload();
  }
}
