    // Variables globales
    let cols, rows;                     // Número de columnas y filas de la cuadrícula
    let w = 40;                         // Ancho y alto de cada celda del laberinto
    let grid = [];                      // Arreglo que almacena todas las celdas del laberinto
    let current;                        // Celda actual en la generación del laberinto (algoritmo de backtracking)
    let stack = [];                     // Pila para retroceder en el algoritmo del laberinto
    let x = 0, y = 0, indexP = 0, m;    // Posición del jugador (x, y), índice en el array y número de columnas (m)
    let llegoMeta = false;


    function setup() {
        let canvas = createCanvas(600, 500);
        canvas.parent('canvas-container'); // ¡IMPORTANTE!
        // createCanvas(700, 700);                       // Crea un lienzo de 400x400 píxeles
        colorMode(RGB);           // Configura modo de color en HSB para colores dinámicos
        cols = floor(width / w);                     // Calcula número de columnas según tamaño de celda
        rows = floor(height / w);                    // Calcula número de filas
        m = cols;                                     // Guarda columnas como referencia para cálculo de movimiento

        // Crear la cuadrícula de celdas
        for (let j = 0; j < rows; j++) {
            for (let i = 0; i < cols; i++) {
                grid.push(new Cell(i, j));           // Crea y guarda cada celda con sus coordenadas
            }
        }

        current = grid[0];                           // La primera celda es el punto inicial del laberinto

        
    }

    function mostrarBoton() {
    let boton = createButton('Siguiente nivel');
    boton.position(width / 2 - 50, height + 20); // Puedes ajustar la posición
    boton.style('padding', '10px 20px');
    boton.style('font-size', '16px');
    boton.style('background-color', '#99c1b9');
    boton.style('border', 'none');
    boton.style('border-radius', '8px');
    boton.mousePressed(() => {
        window.location.href = "otra_pagina.html"; // Cambia esto por la URL que quieras
    });
}



    function draw() {
        background(241, 227, 211);     // COLOR DEL FONDO

        // Mostrar todas las celdas del laberinto
        for (let i = 0; i < grid.length; i++) {
            grid[i].show();                            // Dibuja las paredes y fondo de la celda
        }

        current.visited = true;                        // Marca la celda actual como visitada
        current.highlight();                           // Resalta visualmente la celda actual

        let next = current.checkNeighbours();          // Busca vecinos no visitados
        if (next) {
            next.visited = true;
            stack.push(current);                       // Guarda la celda actual en la pila
            removeWalls(current, next);                // Elimina las paredes entre actual y siguiente
            current = next;                            // Avanza a la siguiente celda
        } else if (stack.length > 0) {
            current = stack.pop();                     // Retrocede si no hay vecinos disponibles
        }

        moved();                                       // Detecta y procesa el movimiento del jugador

        // Dibujar los premios como estrellas giratorias
        push(); // Guardar estado de transformación

        pop();

        

        // Dibujar al jugador como un círculo
        fill(142, 125, 190);
        circle(x + w / 2, y + w / 2, w * 0.6);

        // Dibujar la meta como un cuadrado en la esquina inferior derecha
        fill(153, 193, 185);
        
        flower(width - w / 2, height - w / 2, w/2, 15, 5);

        // Verifica si el jugador llegó a la meta
        let metaX = (cols - 1) * w;
        let metaY = (rows - 1) * w;
        if (x === metaX && y === metaY && !llegoMeta) {
            llegoMeta = true;
            mostrarBoton();
        }

    }


    function moved() {
        if (keyIsPressed) {
            frameRate(30); // Limita la velocidad de movimiento a 30 frames por segundo

            // Movimiento del jugador si no hay muro en esa dirección
            if (keyCode === RIGHT_ARROW && !grid[indexP].walls[1]) {
                indexP += 1; x += w;
            }
            if (keyCode === LEFT_ARROW && !grid[indexP].walls[3]) {
                indexP -= 1; x -= w;
            }
            if (keyCode === UP_ARROW && !grid[indexP].walls[0]) {
                indexP -= m; y -= w;
            }
            if (keyCode === DOWN_ARROW && !grid[indexP].walls[2]) {
                indexP += m; y += w;
            }

            
        }
    }


    function removeWalls(a, b) {
        let x = a.i - b.i;
        if (x === 1) { a.walls[3] = false; b.walls[1] = false; }   // Elimina pared izquierda de a y derecha de b
        else if (x === -1) { a.walls[1] = false; b.walls[3] = false; }

        let y = a.j - b.j;
        if (y === 1) { a.walls[0] = false; b.walls[2] = false; }   // Elimina pared superior de a y inferior de b
        else if (y === -1) { a.walls[2] = false; b.walls[0] = false; }
    }


    function flower(x, y, petalLength, petalWidth, nPetals) {
    let angle = TWO_PI / nPetals;
    push();
    translate(x, y);
    for (let i = 0; i < nPetals; i++) {
        push();
        rotate(i * angle);
        drawPetal(petalLength, petalWidth);
        pop();
    }
    pop();
    
    // Centro de la flor
    fill(255, 204, 0);
    noStroke();
    ellipse(x, y, petalWidth, petalWidth);
    }

    function drawPetal(length, width) {
    fill(255, 100, 150); // Color del pétalo
    noStroke();
    beginShape();
    vertex(0, 0);
    bezierVertex(width / 2, -length / 3, width / 2, -2 * length / 3, 0, -length);
    bezierVertex(-width / 2, -2 * length / 3, -width / 2, -length / 3, 0, 0);
    endShape(CLOSE);
    }


    class Cell {
        constructor(i, j) {
            this.i = i;                         // Coordenada columna
            this.j = j;                         // Coordenada fila
            this.walls = [true, true, true, true]; // Paredes: top, right, bottom, left
            this.visited = false;              // Si ya fue visitada (para generación del laberinto)
        }

        checkNeighbours() {
            let neighbours = [];

            // Obtiene las celdas vecinas
            let top = grid[index(this.i, this.j - 1)];
            let right = grid[index(this.i + 1, this.j)];
            let bottom = grid[index(this.i, this.j + 1)];
            let left = grid[index(this.i - 1, this.j)];

            // Agrega solo las que no han sido visitadas
            if (top && !top.visited) neighbours.push(top);
            if (right && !right.visited) neighbours.push(right);
            if (bottom && !bottom.visited) neighbours.push(bottom);
            if (left && !left.visited) neighbours.push(left);

            if (neighbours.length > 0) {
                return neighbours[floor(random(neighbours.length))]; // Elige una aleatoria
            } else {
                return undefined; // Si no hay, retorna indefinido
            }
        }

        highlight() {
            let x = this.i * w;
            let y = this.j * w;
            noStroke();
            fill(241, 227, 211); // Color semitransparente
            // rect(x, y, w, w); // Resalta la celda actual
        }

        show() {
            let x = this.i * w;
            let y = this.j * w;

            strokeWeight(5);
            stroke(153,193,185);

            // Dibuja las paredes si están activas
            if (this.walls[0]) line(x, y, x + w, y);         // Top
            if (this.walls[1]) line(x + w, y, x + w, y + w); // Right
            if (this.walls[2]) line(x + w, y + w, x, y + w); // Bottom
            if (this.walls[3]) line(x, y + w, x, y);         // Left

            
        }
    }


    function index(i, j) {
        if (i < 0 || j < 0 || i >= cols || j >= rows) return -1; // Valida límites
        return i + j * cols; // Convierte coordenadas 2D en índice 1D
    }

