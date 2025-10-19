// api/analyze.js

import { Chess } from 'chess.js';
// Impor buku pembukaan yang baru kita buat
import { openingBook } from './openingBook.js';

const EXTERNAL_API_URL = "https://stockfish.online/api/s/v2.php";

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

    let { fen, depth = 13 } = req.body;

    if (!fen) return res.status(400).json({ error: 'FEN string is required' });
    
    let chess;
    try { 
        chess = new Chess(fen);
    } 
    catch (e) { return res.status(400).json({ error: 'Invalid FEN string.' }); }

    // --- LOGIKA BUKU PEMBUKAAN BARU ---
    // Cek apakah FEN saat ini ada di buku pembukaan kita
    if (openingBook[fen]) {
        console.log("Position is in the opening book. Playing a random move.");
        
        const bookEntry = openingBook[fen]; // <-- PERUBAHAN: Ambil seluruh entri buku (objek)
        const possibleMoves = bookEntry.moves; // <-- PERUBAHAN: Ambil array 'moves' dari objek
        const openingName = bookEntry.name; // <-- PERUBAHAN: Ambil nama pembukaan

        const randomSanMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        
        const moveObject = chess.move(randomSanMove);
        const uciMove = moveObject.from + moveObject.to;
        
        return res.status(200).json({
            success: true,
            note: "Playing a book move.",
            openingName: openingName, // <-- PERUBAHAN: Tambahkan nama pembukaan ke respons
            bestmove: uciMove,
            evaluation: 0.2,
            winChance: 52.5,
        });
    }
    // --- AKHIR LOGIKA BUKU PEMBUKAAN ---

    // Jika posisi tidak ada di buku, baru kita panggil Stockfish
    console.log("Position is out of book. Analyzing with Stockfish.");
    if (depth > 15) depth = 15;

    try {
        const url = new URL(EXTERNAL_API_URL);
        url.searchParams.append('fen', fen);
        url.searchParams.append('depth', depth);

        const externalResponse = await fetch(url.toString());
        const data = await externalResponse.json();

        if (data.success === false) throw new Error(data.error || 'API call failed');
        
        const uciBestMove = data.bestmove.split(' ')[1];
        const winChanceForWhite = calculateWinChanceLichess(data.evaluation, data.mate);

        return res.status(200).json({
            success: true,
            bestmove: uciBestMove,
            evaluation: data.evaluation,
            mate: data.mate,
            continuation: data.continuation,
            winChance: winChanceForWhite,
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
