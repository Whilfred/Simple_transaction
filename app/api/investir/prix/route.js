import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // On demande les prix pour tes cryptos
    const ids = 'bitcoin,ethereum,tether,solana,binancecoin,ripple,litecoin,dogecoin';
    
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
      { next: { revalidate: 60 } } // Cache de 60 secondes
    );

    if (!res.ok) throw new Error('Erreur API CoinGecko');

    const data = await res.json();

    // On formate pour que ce soit facile à lire dans le frontend
    const cryptos = {
      BTC: { prix_usd: data.bitcoin?.usd || 0, variation_24h: data.bitcoin?.usd_24h_change || 0 },
      ETH: { prix_usd: data.ethereum?.usd || 0, variation_24h: data.ethereum?.usd_24h_change || 0 },
      USDT: { prix_usd: data.tether?.usd || 0, variation_24h: data.tether?.usd_24h_change || 0 },
      SOL: { prix_usd: data.solana?.usd || 0, variation_24h: data.solana?.usd_24h_change || 0 },
      BNB: { prix_usd: data.binancecoin?.usd || 0, variation_24h: data.binancecoin?.usd_24h_change || 0 },
      XRP: { prix_usd: data.ripple?.usd || 0, variation_24h: data.ripple?.usd_24h_change || 0 },
      LTC: { prix_usd: data.litecoin?.usd || 0, variation_24h: data.litecoin?.usd_24h_change || 0 },
      DOGE: { prix_usd: data.dogecoin?.usd || 0, variation_24h: data.dogecoin?.usd_24h_change || 0 },
    };

    return NextResponse.json({ cryptos });
  } catch (error) {
    console.error('Erreur prix:', error);
    return NextResponse.json({ erreur: 'Impossible de récupérer les prix' }, { status: 500 });
  }
}
