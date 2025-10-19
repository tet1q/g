import { Chess } from 'chess.js';

const EXTERNAL_API_URL = "https://stockfish.online/api/s/v2.php";

// --- BUKU PEMBUKAAN YANG DIPERLUAS ---
const openingBook = {
    // King's Pawn Openings (1. e4)
    "1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5": "Giuoco Piano (Italian Game)",
    "1. e4 e5 2. Nf3 Nc6 3. Bb5": "Ruy-Lopez Opening (Spanish Game)",
    "1. e4 e5 2. Nf3 d6": "Philidor Defense",
    "1. e4 e5 2. f4": "King's Gambit",
    "1. e4 e5 2. Nc3": "Vienna Game",
    "1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6": "Sicilian Defense: Najdorf Variation",
    "1. e4 c5": "Sicilian Defense",
    "1. e4 e6": "French Defense",
    "1. e4 c6": "Caro-Kann Defense",
    "1. e4 d5": "Scandinavian Defense",
    "1. e4 Nf6": "Alekhine's Defense",
    "1. e4 g6": "Modern Defense",
    
    // Queen's Pawn Openings (1. d4)
    "1. d4 d5 2. c4 e6 3. Nc3 Nf6": "Queen's Gambit Declined",
    "1. d4 d5 2. c4 c6": "Slav Defense",
    "1. d4 d5 2. c4 dxc4": "Queen's Gambit Accepted",
    "1. d4 Nf6 2. c4 e6 3. Nc3 Bb4": "Nimzo-Indian Defense",
    "1. d4 Nf6 2. c4 g6 3. Nc3 Bg7": "King's Indian Defense",
    "1. d4 Nf6 2. c4 e5": "Budapest Gambit",
    "1. d4 f5": "Dutch Defense",
    
    // Flank & Other Openings
    "1. c4": "English Opening",
    "1. Nf3": "Réti Opening",
    "1. f4": "Bird's Opening",
    "1. b3": "Larsen's Opening",

    // General Categories (for shorter move sequences)
    "1. e4 e5 2. Nf3 Nc6": "Open Game",
    "1. e4 e5": "King's Pawn Game",
    "1. d4 d5": "Queen's Pawn Game",
    "1. e4": "King's Pawn Opening",
    "1. d4": "Queen's Pawn Opening"
};

// Urutkan kunci buku pembukaan dari yang terpanjang ke terpendek
// Ini memastikan kita mendapatkan nama yang paling spesifik.
const sortedOpeningKeys = Object.keys(openingBook).sort((a, b) => b.length - a.length);

/**
 * Fungsi yang diperbarui untuk mengidentifikasi nama pembukaan dari riwayat PGN.
 * @param {string} pgn - Riwayat langkah permainan.
 * @returns {string} - Nama pembukaan atau "Unknown Opening".
 */
function identifyOpening(pgn) {
    if (!pgn) return "Unknown Opening";
    // Cari kecocokan pertama (yang akan menjadi yang terpanjang)
    for (const moves of sortedOpeningKeys) {
        if (pgn.startsWith(moves)) {
            return openingBook[moves];
        }
    }
    return "Unknown Opening";
}

function calculateWinChanceLichess(evaluation, mate) {
    if (mate !== null) return mate > 0 ? 100.0 : 0.0;
    if (typeof evaluation !== 'number') return 50.0;
    const centipawns = evaluation * 100;
    const winChance = 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * centipawns)) - 1);
    return parseFloat(winChance.toFixed(2));
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }

    let { fen, depth = 13, pgn = "" } = req.body;

    if (!fen) return res.status(400).json({ error: 'FEN string is required' });

    try { new Chess(fen); } 
    catch (e) { return res.status(400).json({ error: 'Invalid FEN string.' }); }

    // --- LOGIKA VARIASI PEMBUKAAN ---
    const chess = new Chess(fen);
    // Kita perlu memeriksa giliran siapa untuk memberikan variasi yang tepat
    if (chess.history().length < 4 && chess.turn() === 'w') { // Variasi untuk putih di 2 langkah pertama
        const openingMoves = ['e4', 'd4', 'Nf3', 'c4'];
        const randomMove = openingMoves[Math.floor(Math.random() * openingMoves.length)];
        
        return res.status(200).json({
            note: "Playing a random book move.",
            bestmove: randomMove,
            evaluation: 0.2,
            winChance: 52.5,
            openingName: identifyOpening(pgn)
        });
    }
    // ------------------------------------

    if (depth > 15) depth = 15;

    try {
        const url = new URL(EXTERNAL_API_URL);
        url.searchParams.append('fen', fen);
        url.searchParams.append('depth', depth);

        const externalResponse = await fetch(url.toString());
        const data = await externalResponse.json();

        if (data.success === false) throw new Error(data.error || 'API call failed');

        const winChanceForWhite = calculateWinChanceLichess(data.evaluation, data.mate);

        return res.status(200).json({
            success: true,
            bestmove: data.bestmove,
            evaluation: data.evaluation,
            mate: data.mate,
            continuation: data.continuation,
            winChance: winChanceForWhite,
            openingName: identifyOpening(pgn)
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
