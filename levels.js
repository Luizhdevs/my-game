const LEVELS = {
    1: {
        platforms: [
            { x: 0, y: 550, width: 100, height: 50, color: '#808080' },
            { x: 1650, y: 550, width: 600, height: 50, color: '#808080' },
            { x: 150, y: 480, width: 150, height: 20 },
            { x: 400, y: 400, width: 150, height: 20 },
            { x: 650, y: 320, width: 150, height: 20 },
            { x: 1000, y: 400, width: 150, height: 20 },
            { x: 1300, y: 480, width: 150, height: 20 },
        ],
        spikes: [
            { x: 200, y: 455, visible: false },
            { x: 1050, y: 375, visible: false },
        ],
        door: { x: 1900, y: 480 }
    },

    // 1: {
    //     // LEVEL 3
    //     platforms: [
    //         { x: 0, y: 550, width: 150, height: 50, color: '#808080' },
    //         { x: 1100, y: 280, width: 100, height: 20 },
    //         { x: 1350, y: 240, width: 150, height: 20 },
    //         { x: 1700, y: 200, width: 250, height: 20 },

    //     ],
    //     icePlatforms: [
    //         { x: 400, y: 400, width: 400, height: 20 }
    //     ],
    //     boosterPlatforms: [
    //         { x: 150, y: 520, width: 80, height: 20, boostPower: 20 },
    //         { x: 800, y: 370, width: 80, height: 20, boostPower: 20 }
    //     ],
    //     shooterTraps: [
    //         { x: 600, y: 360, fireRate: 3000, direction: 'left' }
    //     ],
    //     spikes: [
    //         { x: 450, y: 375, visible: true },
    //         { x: 750, y: 375, visible: true },
    //         { x: 1400, y: 220, visible: false },
    //     ],
    //     door: { x: 1800, y: 130 }
    // },

    2: {
        platforms: [
            // Chão dividido em 3 partes
            { x: 0, y: 550, width: 400, height: 50, color: '#808080' },
            { x: 600, y: 550, width: 300, height: 50, color: '#808080' }, // Plataforma do meio
            // AJUSTE: A plataforma final agora começa em x: 1500 (antes era 1600)
            { x: 1500, y: 550, width: 500, height: 50, color: '#808080' },

            // Plataformas de pulo (inalteradas)
            { x: 1000, y: 400, width: 150, height: 20 },
            { x: 1300, y: 480, width: 150, height: 20 },
        ],

        trapDoors: [
            // Alçapão 1 (o original, inalterado)
            { id: 1, x: 400, y: 550, width: 100, height: 50 },

            // AJUSTE: Novo alçapão agora tem 100 de largura (antes era 200)
            { id: 2, x: 1400, y: 550, width: 500, height: 50 }
        ],

        triggers: [
            // Gatilho 1 (o original, inalterado)
            { targetId: 1, x: 350, y: 500, width: 50, height: 50 },

            // Gatilho 2 (inalterado, ainda ativa a armadilha na mesma posição)
            { targetId: 2, x: 1350, y: 500, width: 50, height: 50 }
        ],

        spikes: [
            // AJUSTE: Menos espinhos para caber no buraco mais estreito
            { x: 1720, y: 525, visible: false },
            { x: 1550, y: 525, visible: false },

            // Outros espinhos do nível
            { x: 200, y: 525, visible: false },
            { x: 1050, y: 375, visible: false },
        ],
        door: { x: 1750, y: 480 }
    },

    3: {
        platforms: [
            // Plataformas iniciais (inalteradas)
            { x: 0, y: 550, width: 200, height: 50, color: '#808080' },
            { x: 800, y: 300, width: 150, height: 20 },

            // AJUSTE: A plataforma de chão antes do buraco foi encurtada
            { x: 1200, y: 550, width: 400, height: 50, color: '#808080' }, // Vai de 1200 a 1600

            // AJUSTE: A plataforma de chão após o buraco agora começa em x: 1800
            { x: 1800, y: 550, width: 200, height: 50, color: '#808080' }, // Começa depois do buraco de 200
        ],
        icePlatforms: [
            { x: 200, y: 550, width: 300, height: 50 }
        ],
        trapDoors: [
            // Alçapão com 200 de largura, como você pediu
            { id: 1, x: 1600, y: 550, width: 200, height: 50 }
        ],
        triggers: [
            // Gatilho para o alçapão
            { targetId: 1, x: 1550, y: 500, width: 50, height: 50 } // Gatilho um pouco antes do buraco
        ],
        spikes: [
            // Espinhos existentes
            { x: 350, y: 525, visible: false }
        ],
        boosterPlatforms: [
            { x: 600, y: 520, width: 80, height: 20, boostPower: 20 }
        ],
        door: { x: 1850, y: 480 }
    },

    4: {
        platforms: [
            { x: 0, y: 550, width: 150, height: 50, color: '#808080' },
            { x: 1800, y: 550, width: 200, height: 50, color: '#808080' },
            { x: 380, y: 450, width: 100, height: 20 },
            { x: 730, y: 380, width: 100, height: 20 },
        ],
        movingFallingPlatforms: [
            {
                x: 1100, y: 450, width: 100, height: 20,
                endX: 1600,
                speed: 2,
                triggerX: 1550
            }
        ],
        shooterTraps: [
            { x: 400, y: 350, fireRate: 2000, direction: 'right' },
            { x: 1000, y: 300, fireRate: 3000, direction: 'left' }
        ],
        door: { x: 1900, y: 480 }
    },

    5: {
        platforms: [
            { x: 0, y: 550, width: 150, height: 50, color: '#808080' },
            { x: 1100, y: 280, width: 100, height: 20 },
            { x: 1350, y: 240, width: 150, height: 20 },
            { x: 1700, y: 200, width: 250, height: 20 },

        ],
        icePlatforms: [
            { x: 400, y: 400, width: 400, height: 20 }
        ],
        boosterPlatforms: [
            { x: 150, y: 520, width: 80, height: 20, boostPower: 20 },
            { x: 800, y: 370, width: 80, height: 20, boostPower: 20 }
        ],
        shooterTraps: [
            { x: 600, y: 360, fireRate: 3000, direction: 'left' }
        ],
        spikes: [
            { x: 450, y: 375, visible: false },
            { x: 750, y: 375, visible: false },
            { x: 1400, y: 220, visible: false },
        ],
        door: { x: 1800, y: 130 }
    },
    6: {
        // Desafio: "A Escada Quebrada" - Foco em pulos precisos e chão que cai.
        platforms: [
            { x: 0, y: 550, width: 150, height: 50, color: '#808080' },
            { x: 1800, y: 550, width: 200, height: 50, color: '#808080' },
        ],
        fallingFloors: [
            { x: 250, y: 500, width: 80, height: 20 },
            { x: 450, y: 450, width: 80, height: 20 },
            { x: 650, y: 400, width: 80, height: 20 },
            { x: 850, y: 450, width: 80, height: 20 },
            { x: 1050, y: 500, width: 80, height: 20 },
        ],
        spikes: [
            { x: 1300, y: 525, visible: false },
            // { x: 1400, y: 525, visible: true },
            { x: 1500, y: 525, visible: false },
        ],
        platforms: [ // Plataformas seguras no meio do caminho
            { x: 0, y: 550, width: 150, height: 50, color: '#808080' },
            { x: 1200, y: 550, width: 400, height: 50, color: '#808080' },
            { x: 1800, y: 550, width: 200, height: 50, color: '#808080' },
        ],
        door: { x: 1900, y: 480 }
    },

    7: {
        // Desafio: "Corredor de Gelo" - Foco em controle no gelo com armadilhas.
        platforms: [
            { x: 0, y: 550, width: 200, height: 50, color: '#808080' },
            { x: 1800, y: 550, width: 200, height: 50, color: '#808080' },
        ],
        icePlatforms: [
            { x: 200, y: 550, width: 1600, height: 50 }
        ],
        shooterTraps: [
            { x: 500, y: 525, fireRate: 2500, direction: 'left' },
            { x: 1500, y: 525, fireRate: 2500, direction: 'right' }
        ],
        spikes: [
            { x: 800, y: 525, visible: false },
            { x: 1200, y: 525, visible: false },
        ],
        door: { x: 1900, y: 480 }
    },

    // 8: {
    //     // Desafio: "Salto de Fé" - Foco em plataformas fantasmas e trampolins.
    //     platforms: [
    //         { x: 0, y: 550, width: 150, height: 50, color: '#808080' },
    //         { x: 1850, y: 550, width: 150, height: 50, color: '#808080' },
    //     ],
    //     boosterPlatforms: [
    //         { x: 50, y: 520, width: 80, height: 20, boostPower: 45 }
    //     ],
    //     ghostPlatforms: [ // O jogador precisa memorizar o caminho
    //         { x: 400, y: 300, width: 100, height: 20 },
    //         { x: 900, y: 300, width: 100, height: 20 },
    //         { x: 1400, y: 300, width: 100, height: 20 },
    //     ],
    //     platforms: [ // Plataformas reais intercaladas
    //         { x: 0, y: 550, width: 150, height: 50, color: '#808080' },
    //         { x: 650, y: 300, width: 100, height: 20 },
    //         { x: 1150, y: 300, width: 100, height: 20 },
    //         { x: 1650, y: 300, width: 100, height: 20 },
    //         { x: 1850, y: 550, width: 150, height: 50, color: '#808080' },
    //     ],
    //     door: { x: 1920, y: 480 }
    // },

    8: {
        // Desafio: "A Travessia Perigosa" - Foco na plataforma móvel que cai.
        platforms: [
            { x: 0, y: 550, width: 150, height: 50, color: '#808080' },
            { x: 1850, y: 550, width: 150, height: 50, color: '#808080' },
        ],
        movingFallingPlatforms: [
            { x: 200, y: 500, width: 150, height: 20, endX: 1700, speed: 3, triggerX: 1650 }
        ],
        shooterTraps: [ // Atiradores para forçar o jogador a se abaixar ou pular na plataforma móvel
            { x: 600, y: 420, fireRate: 2000, direction: 'right' },
            { x: 1200, y: 420, fireRate: 2000, direction: 'left' }
        ],
        door: { x: 1920, y: 480 }
    },

    9: {
        // Desafio: "A Torre Final" - Combinação de tudo, com foco na verticalidade.
        platforms: [
            { x: 0, y: 550, width: 300, height: 50, color: '#808080' },
            { x: 1800, y: 150, width: 200, height: 20 }, // Plataforma da porta
        ],
        boosterPlatforms: [
            { x: 170, y: 520, width: 80, height: 20, boostPower: 17 },
            { x: 800, y: 370, width: 80, height: 20, boostPower: 14 },
        ],
        icePlatforms: [
            { x: 300, y: 350, width: 350, height: 20 }
        ],
        spikes: [
            { x: 350, y: 325, visible: false },
            { x: 550, y: 325, visible: false },
            { x: 1550, y: 225, visible: false },

        ],
        movingFallingPlatforms: [
            { x: 1000, y: 250, width: 200, height: 20, endX: 1550, speed: 2.5, triggerX: 1580 }
        ],
        shooterTraps: [
            { x: 1300, y: 200, fireRate: 1500, direction: 'left' }
        ],
        door: { x: 1900, y: 80 }
    }

};
