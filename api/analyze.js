// api/analyze.js

import { Chess } from 'chess.js';
import { openingBook } from './openingBook.js';

const EXTERNAL_API_URL = "https://stockfish.online/api/s/v2.php";

// Fungsi kalkulasi Win Chance
function calculateWinChanceLichess(evaluation, mate) {
    if (mate !== null) return mate > 0 ? 100.0 : 0.0;
    if (typeof evaluation !== 'number') return 50.0;
    const centipawns = evaluation * 100;
    const winChance = 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * centipawns)) - 1);
    return parseFloat(winChance.toFixed(2));
}

// Fungsi pencarian buku yang fleksibel
function findBookMove(fen) {
    const incomingFenParts = fen.split(' ').slice(0, 3).join(' ');
    for (const bookFenKey in openingBook) {
        const bookKeyParts = bookFenKey.split(' ').slice(0, 3).join(' ');
        if (incomingFenParts === bookKeyParts) {
            console.log(`[Book] Match found! Incoming FEN core: ${incomingFenParts}`);
            return openingBook[bookFenKey];
        }
    }
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

    // --- LOGIKA BUKU PEMBUKAAN ---
    const bookEntry = findBookMove(fen);

    if (bookEntry) {
        console.log(`[Book] Position is in the opening book. Found name: "${bookEntry.name}".`);
        const possibleMoves = bookEntry.moves;
        const openingName = bookEntry.name;
        const randomSanMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        const moveObject = chess.move(randomSanMove, { sloppy: true });
        
        if (!moveObject) {
            console.error(`[Book] CRITICAL: The SAN move "${randomSanMove}" is invalid for FEN "${fen}".`);
            return res.status(500).json({ success: false, error: "Internal Server Error: Invalid book move found." });
        }
        
        const uciMove = moveObject.from + moveObject.to;
        console.log(`[Book] Successfully converted to UCI: ${uciMove}. Sending response.`);
        return res.status(200).json({ success: true, note: "Playing a book move.", openingName: openingName, bestmove: uciMove, evaluation: 0.2, winChance: 52.5 });
    }

    // --- LOGIKA PERMINTAAN BOOK-ONLY (depth=0) ---
    if (depth === 0) {
        console.log(`[Book] Book-only check requested, but no match found for FEN: ${fen}`);
        return res.status(200).json({ success: true, note: "Position is out of book." });
    }

    // --- LOGIKA STOCKFISH ---
    console.log(`[Stockfish] Position is out of book. Analyzing with Stockfish at depth ${depth}.`);
    if (depth > 15) depth = 15;

    try {
        const url = new URL(EXTERNAL_API_URL);
        url.searchParams.append('fen', fen);
        url.searchParams.append('depth', depth);

        const externalResponse = await fetch(url.toString());
        const data = await externalResponse.json();

        if (data.success === false) throw new Error(data.error || 'API call failed');
        
        // --- PERBAIKAN KRUSIAL: Ambil langkah dari 'continuation' ---
        let uciBestMove;
        if (data.continuation && typeof data.continuation === 'string' && data.continuation.length > 0) {
            uciBestMove = data.continuation.split(' ')[0];
        } else {
            console.error('[Stockfish] CRITICAL: "continuation" field is missing from external API. Response:', data);
            throw new Error('Invalid response from analysis engine: missing continuation.');
        }

        if (!/^[a-h][1-8][a-h][1-8]/.test(uciBestMove)) {
             console.error('[Stockfish] CRITICAL: Parsed move is not valid UCI format. Parsed:', uciBestMove);
             throw new Error('Invalid response from analysis engine: malformed move.');
        }
        // --- AKHIR DARI PERBAIKAN ---
        
        const winChanceForWhite = calculateWinChanceLichess(data.evaluation, data.mate);

        console.log(`[Stockfish] Analysis complete. Best move parsed: ${uciBestMove}`);
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
