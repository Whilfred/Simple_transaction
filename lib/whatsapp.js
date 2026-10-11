const NUMERO_WHATSAPP = '22662656423';

export function redirigerVersWhatsApp(message) {
  const url = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(message)}`;

  window.location.href = url;
}
