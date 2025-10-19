// api/analyze.js

import { Chess } from 'chess.js';
import { openingBook } from './openingBook.js';

const EXTERNAL_API_URL = "https://stockfish.online/api/s/v2.php";

// Fungsi kalkulasi Win Chance (tidak berubah)
function calculateWinChanceLichess(evaluation, mate) {
    if (mate !== null) return mate > 0 ? 100.0 : 0.0;
    if (typeof evaluation !== 'number') return 50.0;
    const centipawns = evaluation * 100;
    const winChance = 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * centipawns)) - 1);
    return parseFloat(winChance.toFixed(2));
}

/**
 * Fungsi baru untuk mencari posisi di buku pembukaan secara lebih toleran.
 * Fungsi ini hanya membandingkan 3 bagian pertama dari FEN (posisi, giliran, rokade).
 * @param {string} fen - FEN yang masuk dari klien.
 * @returns {object|null} - Entri buku jika ditemukan, atau null jika tidak.
 */
function findBookMove(fen) {
    // Ambil 3 bagian inti dari FEN yang masuk: [posisi, giliran, rokade]
    const incomingFenParts = fen.split(' ').slice(0, 3).join(' ');

    for (const bookFenKey in openingBook) {
        // Ambil 3 bagian inti dari setiap kunci FEN di buku kita
        const bookKeyParts = bookFenKey.split(' ').slice(0, 3).join(' ');
        
        // Jika bagian intinya cocok, kita menemukan posisi di buku!
        if (incomingFenParts === bookKeyParts) {
            console.log(`[Book] Match found! Incoming FEN core: ${incomingFenParts}`);
            return openingBook[bookFenKey]; // Kembalikan seluruh entri buku
        }
    }
    
    // Jika loop selesai dan tidak ada yang cocok
    return null;
}

// Handler utama API
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }

    let { fen, depth = 13 } = req.body;
    depth = parseInt(depth, 10);

    if (!fen) return res.status(400).json({ error: 'FEN string is required' });
    
    let chess;
    try { 
        chess = new Chess(fen);
    } 
    catch (e) { return res.status(400).json({ error: 'Invalid FEN string.' }); }

    // --- LOGIKA BUKU PEMBUKAAN YANG DIPERBARUI ---
    const bookEntry = findBookMove(fen);

    if (bookEntry) {
        console.log(`[Book] Position is in the opening book. Found name: "${bookEntry.name}".`);
        
        const possibleMoves = bookEntry.moves;
        const openingName = bookEntry.name;
        const randomSanMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        
        console.log(`[Book] Attempting to play book move (SAN): ${randomSanMove}`);
        const moveObject = chess.move(randomSanMove, { sloppy: true });
        
        if (!moveObject) {
            console.error(`[Book] CRITICAL: The SAN move "${randomSanMove}" is invalid for FEN "${fen}". Check your openingBook.js!`);
            return res.status(500).json({ 
                success: false, 
                error: "Internal Server Error: Invalid book move found.",
                details: `Move ${randomSanMove} is not valid.`
            });
        }
        
        const uciMove = moveObject.from + moveObject.to;
        console.log(`[Book] Successfully converted to UCI: ${uciMove}. Sending response.`);
        
        return res.status(200).json({
            success: true,
            note: "Playing a book move.",
            openingName: openingName,
            bestmove: uciMove,
            evaluation: 0.2,
            winChance: 52.5,
        });
    }

    // Menangani permintaan "hanya cek buku" dari skrip Lua (depth=0)
    if (depth === 0) {
        console.log(`[Book] Book-only check requested, but no match found for FEN: ${fen}`);
        return res.status(200).json({
            success: true,
            note: "Position is out of book.",
        });
    }
    // --- AKHIR LOGIKA BUKU PEMBUKAAN ---

    console.log(`[Stockfish] Position is out of book. Analyzing with Stockfish at depth ${depth}.`);
    if (depth > 15) depth = 15; // Batasi depth maksimum untuk mencegah timeout

    try {
        const url = new URL(EXTERNAL_API_URL);
        url.searchParams.append('fen', fen);
        url.searchParams.append('depth', depth);

        const externalResponse = await fetch(url.toString());
        const data = await externalResponse.json();

        if (data.success === false) throw new Error(data.error || 'API call failed');
        
        const uciBestMove = data.bestmove.split(' ')[0];
        const winChanceForWhite = calculateWinChanceLichess(data.evaluation, data.mate);

        console.log(`[Stockfish] Analysis complete. Best move: ${uciBestMove}`);
        return res.status(200).json({
            success: true,
            bestmove: uciBestMove,
            evaluation: data.evaluation,
            mate: data.mate,
            continuation: data.continuation,
            winChance: winChanceForWhite,
        });

    } catch (error) {
        console.error('[Stockfish] Error contacting external API:', error.message);
        return res.status(502).json({
            success: false,
            error: 'Could not connect to the analysis service.',
            details: error.message
        });
    }
}
