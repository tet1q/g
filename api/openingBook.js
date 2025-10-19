export const openingBook = {
    // Kunci (key) adalah FEN, Nilai (value) adalah array langkah balasan dalam format SAN.
    // Kode di `analyze.js` akan otomatis mengubahnya ke format UCI.

    // ==========================================================
    // POSISI AWAL (Giliran Putih)
    // ==========================================================
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1': 
        ['e4', 'd4', 'Nf3', 'c4', 'g3', 'b3'], // Tambah Réti, Catalan, Larsen's Opening

    // ==========================================================
    // KELOMPOK PEMBUKAAN BIDAK RAJA (1. e4)
    // ==========================================================

    // Setelah 1. e4 (Giliran Hitam)
    'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1':
        ['e5', 'c5', 'e6', 'c6', 'd5', 'Nf6', 'd6', 'g6'], // Tambah Pirc, Modern Defense

    // --- Jawaban Simetris 1... e5 ---
    // Setelah 1. e4 e5 (Giliran Putih)
    'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2': 
        ['Nf3', 'f4', 'Nc3', 'Bc4', 'd4'], // Tambah King's Gambit, Vienna, Bishop's, Center Game

    // Setelah 1. e4 e5 2. Nf3 (Giliran Hitam)
    'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2':
        ['Nc6', 'Nf6', 'd6', 'f5'], // Tambah Latvian Gambit

    // Setelah 1. e4 e5 2. Nf3 Nc6 (Giliran Putih)
    'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3':
        ['Bb5', 'Bc4', 'd4', 'Nc3'], // Ruy-Lopez, Italian, Scotch, Four Knights Game

    // Setelah Giuoco Piano: 1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 (Giliran Putih)
    'r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4':
        ['c3', 'b4', 'O-O'], // Main Line, Evans Gambit, Standard play

    // --- Pertahanan Sisilia (Sicilian Defense) ---
    // Setelah 1. e4 c5 (Giliran Putih)
    'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2': 
        ['Nf3', 'c3', 'Nc3', 'f4', 'b4'], // Open, Alapin, Closed, King's Gambit Attack, Wing Gambit

    // Setelah 1. e4 c5 2. Nf3 d6 (Giliran Hitam)
    'rnbqkbnr/pp2pppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 3':
        ['d4'],

    // Setelah 1. e4 c5 2. Nf3 Nc6 (Giliran Putih)
    'r1bqkbnr/pp1ppppp/2n5/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 3':
        ['d4', 'Bb5'], // Main Line, Rossolimo Variation
    
    // --- Pertahanan Perancis (French Defense) ---
    // Setelah 1. e4 e6 (Giliran Putih)
    'rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2':
        ['d4'],
        
    // Setelah 1. e4 e6 2. d4 d5 (Giliran Putih)
    'rnbqkbnr/ppp2ppp/4p3/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3':
        ['e5', 'exd5', 'Nc3', 'Nd2'], // Advance, Exchange, Main Line, Tarrasch

    // ==========================================================
    // KELOMPOK PEMBUKAAN BIDAK MENTERI (1. d4)
    // ==========================================================

    // Setelah 1. d4 (Giliran Hitam)
    'rnbqkbnr/pppppppp/8/8/3P4/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1':
        ['d5', 'Nf6', 'f5', 'e6', 'g6'], // Tambah QID setup, KID setup

    // --- Jawaban Simetris 1... d5 ---
    // Setelah 1. d4 d5 (Giliran Putih)
    'rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPPPPPPP/RNBQKBNR w KQkq - 0 2': 
        ['c4', 'Nf3', 'Bf4'], // Queen's Gambit, Colle System, London System

    // Setelah Queen's Gambit: 1. d4 d5 2. c4 (Giliran Hitam)
    'rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PPPPPPPP/RNBQKBNR b KQkq - 0 2':
        ['e6', 'dxc4', 'c6', 'e5'], // QGD, QGA, Slav, Albin Countergambit

    // --- Pertahanan India (Indian Defenses) ---
    // Setelah 1. d4 Nf6 (Giliran Putih)
    'rnbqkb1r/pppppppp/5n2/8/3P4/8/PPPPPPPP/RNBQKBNR w KQkq - 1 2': 
        ['c4', 'Nf3', 'Bg5'], // Main line, Trompowsky Attack

    // Setelah 1. d4 Nf6 2. c4 (Giliran Hitam)
    'rnbqkb1r/pppppppp/5n2/8/2PP4/8/PP2PPPP/RNBQKBNR b KQkq - 0 2':
        ['e6', 'g6', 'c5'], // Nimzo/Queen's Indian, King's Indian, Benoni Defense

    // Setelah Benoni Defense: 1. d4 Nf6 2. c4 c5 3. d5 (Giliran Hitam)
    'rnbqkb1r/pp1ppppp/5n2/2pP4/2P5/8/PP2PPPP/RNBQKBNR b KQkq - 0 3':
        ['b5', 'e6'], // Benko Gambit, Modern Benoni
        
    // ==========================================================
    // PEMBUKAAN SAYAP (FLANK OPENINGS) & LAINNYA
    // ==========================================================

    // Setelah 1. c4 (English Opening, Giliran Hitam)
    'rnbqkbnr/pppppppp/8/8/2P5/8/PPPPPPPP/R1BQKBNR b KQkq - 0 1':
        ['e5', 'Nf6', 'c5', 'g6', 'f5'],

    // Setelah 1. Nf3 (Réti Opening, Giliran Hitam)
    'rnbqkbnr/pppppppp/8/8/8/5N2/PPPPPPPP/RNBQKB1R b KQkq - 1 1':
        ['d5', 'Nf6', 'c5', 'g6'],
        
    // ==========================================================
    // PEMBUKAAN TIDAK UMUM (UNCOMMON & SURPRISE OPENINGS)
    // ==========================================================

    // Setelah 1. g4 (Grob's Attack). Sebuah serangan sayap yang mencoba mengontrol petak h5.
    // Jarang dimainkan karena melemahkan struktur pion raja putih.
    'rnbqkbnr/pppppppp/8/8/6P1/8/PPPPPP1P/RNBQKBNR b KQkq - 0 1':
        ['d5', 'e5'], // Balasan terbaik adalah langsung menguasai pusat.

    // Setelah 1. b4 (Orangutan Opening / Sokolsky Opening). Bertujuan mengontrol petak c5 dan fianchetto Gajah Menteri.
    'rnbqkbnr/pppppppp/8/8/1P6/8/P1PPPPPP/RNBQKBNR b KQkq - 0 1':
        ['e5', 'd5', 'Nf6', 'c6'], // Menantang kontrol putih di sayap dengan permainan pusat.

    // Menawarkan Tennison Gambit setelah 1. Nf3 d5 2. e4
    // FEN untuk posisi ini: rnbqkbnr/ppp1pppp/8/3p4/8/5N2/PPPPPPPP/RNBQKB1R w KQkq - 0 2
    // FEN ini sudah ada, kita hanya perlu menambahkan 'e4' ke dalam array langkah yang ada.
    // (Langkah ini akan ditambahkan ke entri yang sudah ada di atas, tidak perlu duplikat)
    // Untuk kejelasan, posisi setelah 1. Nf3 d5:
    'rnbqkbnr/ppp1pppp/8/3p4/8/5N2/PPPPPPPP/RNBQKB1R w KQkq - 0 2':
        ['d4', 'c4', 'g3', 'e4'], // Menambahkan 'e4' untuk Tennison Gambit
        
    // ==========================================================
    // COUNTER UNTUK PEMBUKAAN TIDAK UMUM
    // ==========================================================

    // --- Counter untuk Grob's Attack ---
    // Setelah 1. g4 d5 (Putih biasanya lanjut dengan Bg2)
    'rnbqkbnr/ppp1pppp/8/3p4/6P1/8/PPPPPP1P/RNBQKBNR w KQkq - 0 2':
        ['Bg2', 'h3'],

    // Setelah 1. g4 d5 2. Bg2 (Hitam bisa menawarkan pion untuk menghancurkan struktur Putih)
    'rnbqkbnr/ppp1pppp/8/3p4/6P1/8/PPPPPPBP/RNBQK1NR b KQkq - 1 2':
        ['Bxg2', 'c6'], // Bxg2 adalah langkah counter-gambit yang sangat kuat.

    // --- Counter untuk Orangutan Opening ---
    // Setelah 1. b4 e5 (Putih biasanya akan menyerang pion e5 dengan Bb2)
    'rnbqkbnr/pppp1ppp/8/4p3/1P6/8/P1PPPPPP/RNBQKBNR w KQkq - 0 2':
        ['Bb2'],

    // Setelah 1. b4 e5 2. Bb2 (Hitam harus mempertahankan pionnya)
    'rnbqkbnr/pppp1ppp/8/4p3/1P6/8/P1PPPPPP/RN1QKBNR b KQkq - 1 2':
        ['f6', 'Bxb2', 'd6'], // f6 adalah balasan yang solid.

    // --- Counter untuk Tennison Gambit ---
    // Setelah 1. Nf3 d5 2. e4 (Hitam menerima gambit)
    'rnbqkbnr/ppp1pppp/8/3p4/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 0 2':
        ['dxe4'], // Menerima gambit adalah cara terbaik untuk melawannya.

    // Setelah 1. Nf3 d5 2. e4 dxe4 3. Ng5 (Putih menyerang pion e4)
    'rnbqkbnr/ppp1pppp/8/6N1/4p3/8/PPPP1PPP/RNBQKB1R b KQkq - 1 3':
        ['Nf6', 'f5'], // Nf6 adalah langkah pengembangan yang paling solid dan aman.
};
