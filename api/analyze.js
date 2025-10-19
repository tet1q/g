import { Chess } from 'chess.js';

// URL dari API publik yang gratis dan tidak butuh verifikasi
const EXTERNAL_API_URL = "https://chess-api.com/v1";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  const { fen, depth = 12 } = req.body;

  if (!fen) {
    return res.status(400).json({ error: 'FEN string is required' });
  }

  // Validasi FEN menggunakan chess.js
  try {
    new Chess(fen);
  } catch (e) {
    return res.status(400).json({ error: 'Invalid FEN string.' });
  }

  // Panggil API eksternal untuk melakukan pekerjaan berat
  try {
    const externalResponse = await fetch(EXTERNAL_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fen, depth }),
    });

    // Jika API eksternal error, teruskan informasinya
    if (!externalResponse.ok) {
      const errorData = await externalResponse.json();
      return res.status(externalResponse.status).json({
        error: 'External analysis service failed.',
        details: errorData,
      });
    }

    const result = await externalResponse.json();
    
    // Kirim kembali hasil dari API eksternal ke pengguna
    return res.status(200).json(result);

  } catch (error) {
    console.error('Error contacting external API:', error.message);
    return res.status(502).json({
      error: 'Could not connect to the analysis service.',
      details: error.message
    });
  }
}
