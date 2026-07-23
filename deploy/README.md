# bbb-playback — bbb.kursadresi.com deploy notları

Akış: `custom` branch'ine push → GitHub Actions imajı build edip
`ghcr.io/harunalpak/bbb-playback:custom` olarak yayınlar → sunucudaki
Watchtower ~2 dakika içinde yeni imajı çekip container'ı yeniler.

## Tek seferlik kurulum (Hetzner sunucusunda)

### 0. Ön koşul: Docker

```bash
docker version || curl -fsSL https://get.docker.com | sh
```

### 1. GHCR paketini public yap (bir kere, GitHub web arayüzünden)

İlk başarılı Actions çalışmasından sonra:
`github.com/harunalpak?tab=packages` → `bbb-playback` → **Package settings**
→ **Change visibility** → **Public**.
(Public yapılmazsa sunucuda `docker login ghcr.io` ile PAT girmek gerekir.)

### 2. Dosyaları sunucuya koy

```bash
mkdir -p /var/bbb-play/kursadresi && cd /var/bbb-play/kursadresi
# Bu klasördeki docker-compose.yml ile playback-site.conf dosyalarını buraya kopyala
docker compose up -d
curl -s http://127.0.0.1:8090/ | head -5   # index.html dönmeli
```

### 3. Host nginx + SSL

```bash
# nginx-host-bbb.kursadresi.com.conf içeriğini kopyala:
nano /etc/nginx/sites-available/bbb.kursadresi.com
ln -s /etc/nginx/sites-available/bbb.kursadresi.com /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
certbot --nginx -d bbb.kursadresi.com
```

DNS: `bbb.kursadresi.com` A kaydı sunucu IP'sine bakmalı (certbot'tan önce).

### 4. Test

`https://bbb.kursadresi.com/playback/presentation/2.3/<recordId>`
(recordId, Bunny CDN'de `records/<recordId>/` altında bulunan bir kayıt olmalı.)

## Notlar

- Medya kökü build sırasında `.env` dosyasındaki `REACT_APP_MEDIA_ROOT_URL`
  ile gömülür: `https://bbbstorage.b-cdn.net/records`. Değiştirmek için
  `.env`'i güncelleyip push etmek yeterli (yeni imaj otomatik yayına girer).
- Eski kurulum (bbb.derspaneli.com, pm2) bu kurulumdan tamamen bağımsızdır;
  bu stack sadece 127.0.0.1:8090 portunu ve kendi vhost'unu kullanır.
- Upstream'den yeni sürüm almak için: `git fetch upstream && git rebase v<yeni-sürüm> custom && git push --force-with-lease origin custom`
