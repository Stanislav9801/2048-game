// Добавляем код для создания снежинок в начало файла
function createSnowflakes() {
    const snowflakesCount = 50;
    const container = document.body;
    
    for (let i = 0; i < snowflakesCount; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.innerHTML = '❄';
        snowflake.style.left = `${Math.random() * 100}vw`;
        snowflake.style.animationDuration = `${Math.random() * 3 + 2}s`;
        snowflake.style.opacity = Math.random();
        snowflake.style.fontSize = `${Math.random() * 10 + 10}px`;
        container.appendChild(snowflake);
    }
}

class Game2048 {
    constructor() {
        this.grid = Array(4).fill().map(() => Array(4).fill(0));
        this.score = 0;
        this.gridElement = document.getElementById('grid');
        this.scoreElement = document.getElementById('score');
        this.messageElement = document.querySelector('.game-message p');
        this.init();
    }

    init() {
        // Create grid cells
        for (let i = 0; i < 16; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            this.gridElement.appendChild(cell);
        }

        // Add initial tiles
        this.addRandomTile();
        this.addRandomTile();
        this.updateDisplay();

        // Add event listeners
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
        document.getElementById('restart').addEventListener('click', () => {
            this.restart();
        });
    }

    addRandomTile() {
        const emptyCells = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.grid[i][j] === 0) {
                    emptyCells.push({x: i, y: j});
                }
            }
        }
        if (emptyCells.length > 0) {
            const {x, y} = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.grid[x][y] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    updateDisplay() {
        const cells = document.querySelectorAll('.cell');
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const value = this.grid[i][j];
                const cell = cells[i * 4 + j];
                cell.textContent = value || '';
                cell.className = `cell ${value ? 'cell-' + value : ''}`;
            }
        }
        this.scoreElement.textContent = this.score;
    }

    move(direction) {
        let moved = false;
        const newGrid = JSON.parse(JSON.stringify(this.grid));

        // Helper function to move and merge tiles
        const moveTiles = (row) => {
            const filtered = row.filter(cell => cell !== 0);
            for (let i = 0; i < filtered.length - 1; i++) {
                if (filtered[i] === filtered[i + 1]) {
                    filtered[i] *= 2;
                    this.score += filtered[i];
                    filtered.splice(i + 1, 1);
                    moved = true;
                }
            }
            while (filtered.length < 4) filtered.push(0);
            return filtered;
        };

        // Process each row/column based on direction
        if (direction === 'left' || direction === 'right') {
            for (let i = 0; i < 4; i++) {
                let row = this.grid[i];
                if (direction === 'right') row = row.reverse();
                row = moveTiles(row);
                if (direction === 'right') row = row.reverse();
                if (row.join(',') !== this.grid[i].join(',')) moved = true;
                newGrid[i] = row;
            }
        } else {
            for (let j = 0; j < 4; j++) {
                let column = this.grid.map(row => row[j]);
                if (direction === 'down') column = column.reverse();
                column = moveTiles(column);
                if (direction === 'down') column = column.reverse();
                for (let i = 0; i < 4; i++) {
                    if (newGrid[i][j] !== column[i]) moved = true;
                    newGrid[i][j] = column[i];
                }
            }
        }

        if (moved) {
            this.grid = newGrid;
            this.addRandomTile();
            this.updateDisplay();
            if (this.isGameOver()) {
                this.messageElement.textContent = 'Game Over!';
            } else if (this.hasWon()) {
                this.messageElement.textContent = 'You Won!';
            }
        }
    }

    handleKeyPress(event) {
        switch(event.key) {
            case 'ArrowLeft': this.move('left'); break;
            case 'ArrowRight': this.move('right'); break;
            case 'ArrowUp': this.move('up'); break;
            case 'ArrowDown': this.move('down'); break;
        }
    }

    isGameOver() {
        // Check for empty cells
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (this.grid[i][j] === 0) return false;
            }
        }
        // Check for possible merges
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const current = this.grid[i][j];
                if ((j < 3 && current === this.grid[i][j + 1]) ||
                    (i < 3 && current === this.grid[i + 1][j])) {
                    return false;
                }
            }
        }
        return true;
    }

    hasWon() {
        return this.grid.some(row => row.some(cell => cell === 2048));
    }

    restart() {
        this.grid = Array(4).fill().map(() => Array(4).fill(0));
        this.score = 0;
        this.messageElement.textContent = '';
        this.addRandomTile();
        this.addRandomTile();
        this.updateDisplay();
    }
}

// Модифицируем существующий код запуска игры
window.onload = () => {
    createSnowflakes();
    new Game2048();
}; 