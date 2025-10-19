// api/openingBook.js

export const openingBook = {
    // Kunci (key) adalah FEN.
    // Nilai (value) sekarang adalah objek { name: "...", moves: [...] }.

    // ==========================================================
    // POSISI AWAL
    // ==========================================================
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1': {
        name: "Starting Position",
        moves: ['e4', 'd4', 'Nf3', 'c4', 'g3', 'b3']
    },

    // ==========================================================
    // KELOMPOK PEMBUKAAN BIDAK RAJA (1. e4)
    // ==========================================================
    'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1': {
        name: "King's Pawn Game",
        moves: ['e5', 'c5', 'e6', 'c6', 'd5', 'Nf6', 'd6', 'g6']
    },

    // --- Jawaban Simetris 1... e5 ---
    'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2': {
        name: "King's Pawn Game: Open Game",
        moves: ['Nf3', 'f4', 'Nc3', 'Bc4', 'd4']
    },
    'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2': {
        name: "King's Pawn Game: Open Game",
        moves: ['Nc6', 'Nf6', 'd6', 'f5']
    },
    'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3': {
        name: "Italian Game / Ruy-Lopez / Scotch Game",
        moves: ['Bb5', 'Bc4', 'd4', 'Nc3']
    },
    'r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4': {
        name: "Giuoco Piano (Italian Game)",
        moves: ['c3', 'b4', 'O-O']
    },

    // --- Pertahanan Sisilia (Sicilian Defense) ---
    'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2': {
        name: "Sicilian Defense",
        moves: ['Nf3', 'c3', 'Nc3', 'f4', 'b4']
    },
    'rnbqkbnr/pp2pppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 3': {
        name: "Sicilian Defense: Open",
        moves: ['d4']
    },
    'r1bqkbnr/pp1ppppp/2n5/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 3': {
        name: "Sicilian Defense: Open",
        moves: ['d4', 'Bb5']
    },
    
    // --- Pertahanan Perancis (French Defense) ---
    'rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2': {
        name: "French Defense",
        moves: ['d4']
    },
    'rnbqkbnr/ppp2ppp/4p3/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3': {
        name: "French Defense: Main Lines",
        moves: ['e5', 'exd5', 'Nc3', 'Nd2']
    },

    // ==========================================================
    // KELOMPOK PEMBUKAAN BIDAK MENTERI (1. d4)
    // ==========================================================
    'rnbqkbnr/pppppppp/8/8/3P4/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1': {
        name: "Queen's Pawn Game",
        moves: ['d5', 'Nf6', 'f5', 'e6', 'g6']
    },
    
    // --- Jawaban Simetris 1... d5 ---
    'rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPPPPPPP/RNBQKBNR w KQkq - 0 2': {
        name: "Queen's Pawn Game: Symmetrical Variation",
        moves: ['c4', 'Nf3', 'Bf4']
    },
    'rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PPPPPPPP/RNBQKBNR b KQkq - 0 2': {
        name: "Queen's Gambit",
        moves: ['e6', 'dxc4', 'c6', 'e5']
    },

    // --- Pertahanan India (Indian Defenses) ---
    'rnbqkb1r/pppppppp/5n2/8/3P4/8/PPPPPPPP/RNBQKBNR w KQkq - 1 2': {
        name: "Indian Game",
        moves: ['c4', 'Nf3', 'Bg5']
    },
    'rnbqkb1r/pppppppp/5n2/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2': {
        name: "Indian Game: Main Lines",
        moves: ['e6', 'g6', 'c5']
    },
    'rnbqkb1r/pp1ppppp/5n2/2pP4/2P5/8/PP2PPPP/RNBQKBNR b KQkq - 0 3': {
        name: "Benoni Defense",
        moves: ['b5', 'e6']
    },
        
    // ==========================================================
    // PEMBUKAAN SAYAP (FLANK OPENINGS) & LAINNYA
    // ==========================================================
    'rnbqkbnr/pppppppp/8/8/2P5/8/PPPPPPPP/R1BQKBNR b KQkq - 0 1': {
        name: "English Opening",
        moves: ['e5', 'Nf6', 'c5', 'g6', 'f5']
    },
    'rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq - 1 1': {
        name: "Réti Opening",
        moves: ['d5', 'Nf6', 'c5', 'g6']
    },

    // ==========================================================
    // PEMBUKAAN TIDAK UMUM (UNCOMMON & SURPRISE OPENINGS)
    // ==========================================================
    'rnbqkbnr/pppppppp/8/8/6P1/8/PPPPPP1P/RNBQKBNR b KQkq - 0 1': {
        name: "Grob's Attack",
        moves: ['d5', 'e5']
    },
    'rnbqkbnr/pppppppp/8/8/1P6/8/P1PPPPPP/RNBQKBNR b KQkq - 0 1': {
        name: "Orangutan Opening (Sokolsky)",
        moves: ['e5', 'd5', 'Nf6', 'c6']
    },
    'rnbqkbnr/ppp1pppp/8/3p4/8/5N2/PPPPPPPP/RNBQKB1R w KQkq - 0 2': {
        name: "Réti Opening / Tennison Gambit setup",
        moves: ['d4', 'c4', 'g3', 'e4']
    },
        
    // ==========================================================
    // COUNTER UNTUK PEMBUKAAN TIDAK UMUM
    // ==========================================================
    'rnbqkbnr/ppp1pppp/8/3p4/6P1/8/PPPPPP1P/RNBQKBNR w KQkq - 0 2': {
        name: "Grob's Attack, d5 variation",
        moves: ['Bg2', 'h3']
    },
    'rnbqkbnr/ppp1pppp/8/3p4/6P1/8/PPPPPPBP/RNBQK1NR b KQkq - 1 2': {
        name: "Grob's Attack: Counter-Gambit",
        moves: ['Bxg2', 'c6']
    },
    'rnbqkbnr/pppp1ppp/8/4p3/1P6/8/P1PPPPPP/RNBQKBNR w KQkq - 0 2': {
        name: "Orangutan Opening, e5 variation",
        moves: ['Bb2']
    },
    'rnbqkbnr/pppp1ppp/8/4p3/1P6/8/P1PPPPPP/RN1QKBNR b KQkq - 1 2': {
        name: "Orangutan Opening: Counter",
        moves: ['f6', 'Bxb2', 'd6']
    },
    'rnbqkbnr/ppp1pppp/8/3p4/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 0 2': {
        name: "Tennison Gambit",
        moves: ['dxe4']
    },
    'rnbqkbnr/ppp1pppp/8/6N1/4p3/8/PPPP1PPP/RNBQKB1R b KQkq - 1 3': {
        name: "Tennison Gambit Accepted",
        moves: ['Nf6', 'f5']
    },
};
