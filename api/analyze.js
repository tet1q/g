import { Chess } from 'chess.js';

const EXTERNAL_API_URL = "https://stockfish.online/api/s/v2.php";

/**
 * Mengubah skor evaluasi catur menjadi persentase kemenangan menggunakan formula Lichess.
 * @param {number} evaluation - Skor evaluasi dalam pion, e.g., 0.75.
 * @param {number|null} mate - Jumlah langkah menuju skakmat, jika ada.
 * @returns {number} - Persentase kemenangan untuk Putih.
 */
function calculateWinChanceLichess(evaluation, mate) {
  // Jika ada skakmat, win chance adalah 100% atau 0%.
  if (mate !== null) {
    return mate > 0 ? 100.0 : 0.0;
  }
  // Jika tidak ada evaluasi, anggap posisi seimbang.
  if (typeof evaluation !== 'number') {
    return 50.0;
  }

  // 1. Ubah evaluasi (pion) menjadi centipawns.
  const centipawns = evaluation * 100;

  // 2. Terapkan formula Lichess.
  const winChance = 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * centipawns)) - 1);

  // 3. Kembalikan hasil dengan 2 angka desimal.
  return parseFloat(winChance.toFixed(2));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  let { fen, depth = 13 } = req.body;

  if (!fen) {
    return res.status(400).json({ error: 'FEN string is required' });
  }

  try {
    new Chess(fen);
  } catch (e) {
    return res.status(400).json({ error: 'Invalid FEN string.' });
  }

  if (depth > 15) {
    depth = 15;
  }

  try {
    const url = new URL(EXTERNAL_API_URL);
    url.searchParams.append('fen', fen);
    url.searchParams.append('depth', depth);

    const externalResponse = await fetch(url.toString());
    const data = await externalResponse.json();

    if (data.success === false) {
      throw new Error(data.error || 'The external API returned an error.');
    }

    // --- BAGIAN BARU: HITUNG WIN CHANCE DENGAN FORMULA LICHESS ---
    const winChanceForWhite = calculateWinChanceLichess(data.evaluation, data.mate);
    // -----------------------------------------------------------

    return res.status(200).json({
      success: true,
      bestmove: data.bestmove,
      evaluation: data.evaluation,
      mate: data.mate,
      continuation: data.continuation,
      winChance: winChanceForWhite // Tambahkan hasil perhitungan baru ke respons
    });

  } catch (error) {
    console.error('Error contacting external API:', error.message);
    return res.status(502).json({
      success: false,
      error: 'Could not connect to the analysis service.',
      details: error.message
    });
  }
}
