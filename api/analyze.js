import { Chess } from 'chess.js';

const EXTERNAL_API_URL = "https://stockfish.online/api/s/v2.php";

function calculateWinChanceLichess(evaluation, mate) {
    if (mate !== null) return mate > 0 ? 100.0 : 0.0;
    if (typeof evaluation !== 'number') return 50.0;
    const centipawns = evaluation * 100;
    const winChance = 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * centipawns)) - 1);
    return parseFloat(winChance.toFixed(2));
}

/**
 * Fungsi baru untuk menganalisis satu posisi FEN.
 */
async function analyzePosition(fen, depth) {
    const url = new URL(EXTERNAL_API_URL);
    url.searchParams.append('fen', fen);
    url.searchParams.append('depth', depth);
    const response = await fetch(url.toString());
    const data = await response.json();
    if (!data.success) throw new Error(data.error || 'API call failed');
    return data;
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }

    let { fen, depth = 13 } = req.body;
    if (depth > 14) depth = 14; // Batasi depth untuk pencarian multi-langkah

    if (!fen) return res.status(400).json({ error: 'FEN string is required' });
    try { new Chess(fen); }
    catch (e) { return res.status(400).json({ error: 'Invalid FEN string.' }); }

    try {
        // 1. Dapatkan analisis awal untuk posisi saat ini
        const initialAnalysis = await analyzePosition(fen, depth);
        const initialWinChance = calculateWinChanceLichess(initialAnalysis.evaluation, initialAnalysis.mate);

        // 2. Jika persentase kemenangan rendah, cari langkah remis
        if (initialWinChance < 20) {
            console.log(`Win chance is low (${initialWinChance}%). Searching for drawing moves...`);
            const chess = new Chess(fen);
            const legalMoves = chess.moves();
            let bestDrawingMove = null;
            let bestDrawEval = Infinity; // Cari evaluasi yang paling dekat dengan 0

            // Analisis setiap langkah legal untuk mencari yang paling mendekati remis
            for (const move of legalMoves) {
                chess.move(move);
                const newFen = chess.fen();
                const moveAnalysis = await analyzePosition(newFen, depth - 2); // Gunakan depth lebih rendah agar cepat
                chess.undo(); // Kembalikan ke posisi semula

                // Jika evaluasi ini lebih dekat ke 0 daripada yang terbaik sejauh ini
                if (Math.abs(moveAnalysis.evaluation) < Math.abs(bestDrawEval)) {
                    bestDrawEval = moveAnalysis.evaluation;
                    bestDrawingMove = move;
                }
            }

            // Jika kita menemukan langkah yang evaluasinya di bawah ambang batas (misal, |0.3|),
            // anggap itu sebagai langkah remis yang bagus.
            if (bestDrawingMove && Math.abs(bestDrawEval) < 0.3) {
                return res.status(200).json({
                    ...initialAnalysis,
                    winChance: initialWinChance,
                    note: `Forced draw found!`,
                    drawingMove: bestDrawingMove,
                    drawingMoveEvaluation: bestDrawEval
                });
            }
        }
        
        // Jika tidak mencari remis, atau tidak ditemukan, kembalikan analisis standar
        return res.status(200).json({
            ...initialAnalysis,
            winChance: initialWinChance
        });

    } catch (error) {
        console.error('Error in handler:', error.message);
        return res.status(502).json({
            success: false,
            error: 'Could not complete analysis.',
            details: error.message
        });
    }
}
