// Utilidades de formato en es-MX
const locale = "es-MX";
const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const tzEl   = document.getElementById("tz");
const coordsEl = document.getElementById("coords");
const btn = document.getElementById("locBtn");

// Mostrar zona horaria del sistema
const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "Desconocida";
tzEl.textContent = tz;

// Reloj en vivo
function renderNow(){
  const now = new Date();
  // Hora con segundos 24h
  const timeFmt = new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: tz
  });
  // Fecha larga
  const dateFmt = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: tz
  });

  timeEl.textContent = timeFmt.format(now);
  // Capitalizar la primera letra del día (algunos navegadores ya lo hacen)
  const formattedDate = dateFmt.format(now);
  dateEl.textContent = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
}
renderNow();
setInterval(renderNow, 1000);

// Geolocalización (solo coordenadas, sin servicios externos)
async function detectLocation(){
  if(!("geolocation" in navigator)){
    coordsEl.textContent = "Geolocalización no soportada en este navegador.";
    return;
  }
  coordsEl.textContent = "Obteniendo coordenadas…";
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude, accuracy } = pos.coords;
      const lat = latitude.toFixed(5);
      const lon = longitude.toFixed(5);
      coordsEl.textContent = `${lat}, ${lon} (±${Math.round(accuracy)} m)`;
    },
    (err) => {
      switch (err.code) {
        case err.PERMISSION_DENIED:
          coordsEl.textContent = "Permiso denegado. Habilita la ubicación para ver coordenadas.";
          break;
        case err.POSITION_UNAVAILABLE:
          coordsEl.textContent = "Ubicación no disponible.";
          break;
        case err.TIMEOUT:
          coordsEl.textContent = "Tiempo de espera agotado al obtener ubicación.";
          break;
        default:
          coordsEl.textContent = "Error al obtener ubicación.";
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 8000,
      maximumAge: 0
    }
  );
}

btn.addEventListener("click", detectLocation);
