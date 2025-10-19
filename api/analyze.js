import { Chess } from 'chess.js';
import stockfish from 'stockfish.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  const { fen, depth = 15 } = req.body;

  if (!fen) {
    return res.status(400).json({ error: 'FEN string is required' });
  }

  try {
    new Chess(fen);
  } catch (e) {
    return res.status(400).json({ error: 'Invalid FEN string.' });
  }

  try {
    const engine = stockfish();
    let bestMove = '';
    let evaluation = null;

    await new Promise((resolve, reject) => {
      const analysisTimeout = setTimeout(() => {
        engine.postMessage('quit');
        reject(new Error("Analysis timed out after 9.5 seconds. Try a lower depth."));
      }, 9500);

      engine.onmessage = function (event) {
        const line = event.data || event;
        console.log("Stockfish.js:", line);

        if (line.includes('score cp')) {
          const scoreMatch = line.match(/score cp (-?\d+)/);
          if (scoreMatch) {
            evaluation = parseInt(scoreMatch[1], 10) / 100.0;
          }
        }

        if (line.startsWith('bestmove')) {
          bestMove = line.split(' ')[1];
          clearTimeout(analysisTimeout);
          engine.postMessage('quit');
          resolve();
        }
      };

      engine.postMessage(`position fen ${fen}`);
      engine.postMessage(`go depth ${depth}`);
    });

    if (bestMove) {
      res.status(200).json({
        fen,
        bestmove: bestMove,
        evaluation,
        depth
      });
    } else {
      throw new Error("Analysis completed but failed to find a best move.");
    }
  } catch (error) {
    console.error('Stockfish.js analysis error:', error.message);
    res.status(500).json({
      error: 'Failed to analyze the position.',
      details: error.message
    });
  }
}
