const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

canvas.width = 600
canvas.height = 440

const sizeDeLosPuntajes = 65 // va ir en la parte de arriba
const barraDePuntajes = {
    width: canvas.width,
    height: sizeDeLosPuntajes 
}

let rightPressed = false
let leftPressed = false
let espacioPressed = false

let ataquesPersonaje = []
let ataquesPersonajeClones = []
let costoChackraAtaqueBasicoPersonaje = 10
let dañoAtaquePersonaje = 30
let ataquesRasenShurikenPersonaje = []
let costoChackraRasenShurikenPersonaje = 100
let dañoRasenShurikenPersonaje = 100
let clonesDeSombraPersonaje = []
let costoChackraClonesSombra = 30

let vidaPersonaje = 500
let chackraDelPersonaje = 300
let personajeImageDerecha = new Image()
let personajeImageIzquierda = new Image()
let personajeImageQuieto = new Image()
let personajeImageAtaqueBasico = new Image()
let personajeImageRasenShuriken = new Image()
let personajeImageClones = new Image()

personajeImageDerecha.src = "images/spritederechasinfondo.png"
personajeImageIzquierda.src = "images/spriteizquierdasinfondo.png"
personajeImageQuieto.src = "images/spritequietonarutofondoblanco.png"
personajeImageAtaqueBasico.src = "images/spriteshurikensinfondo.png"
personajeImageRasenShuriken.src = "images/rasenshurikenspritesinfondo.png"
personajeImageClones.src = "images/clonesnarutospritesinfondo.png"

let ataquesEnemigo = []
let vidaEnemigo = 300
let chackraDelEnemigo = 500
let costoChackraAtaqueBasicoEnemigo = 50
let enemigoImageDerecha = new Image()
let enemigoImageIzquierda = new Image()
let enemigoImageAtaqueBasico = new Image()

enemigoImageDerecha.src = "images/spritesasukesinfondoderecha.png"
enemigoImageIzquierda.src = "images/spritesasukesinfondoizquierda.png"
enemigoImageAtaqueBasico.src = "images/spriteataquedesasuke.png"

let gameFrame = 0

document.addEventListener("keydown", teclaPresionada, false);
document.addEventListener("keyup", teclaSoltada, false);

// clones 
class ClonesDeSombra {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.clones = []
        this.pixelesLados = -100
        this.timer = 0
        this.timer2 = 150
    }
    makeClones() {
        for(let i=0; i<4; i++) {
            if(i==2){
                this.pixelesLados += 50
            }
            this.clones.push(new Clon(this.x + this.pixelesLados, this.y))
            this.pixelesLados += 50
        }
    }
    handleClones() {
        this.timer2++
        for(let j=0; j<this.clones.length; j++) {
            this.clones[j].update()
            this.clones[j].draw()

            if(this.timer2 % 170 == 0) {
                this.clones[j].disparar()
            }
            
            for(let i=0; i<ataquesEnemigo.length; i++) {
                if(this.clones[j] && ataquesEnemigo[i] && collision(ataquesEnemigo[i], this.clones[j])) {
                    ataquesEnemigo.splice(i, 1)
                    this.clones.splice(j, 1)
                }
            }
        }  
    }
    update() {
        this.timer++
        if(this.timer % 270 == 0) {
            for(let u=0; u<clonesDeSombraPersonaje.length; u++) {
                clonesDeSombraPersonaje.splice(0,1)
            }
        }
    }
}

class Clon {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.spriteWidth = 120.75
        this.spriteHeight = 197
        this.width = this.spriteWidth/4.4
        this.height = this.spriteHeight/4.4
        this.velocidadFrame = 5
        this.frame = 0
        this.timerDeFrame = 0
    }

    update() {
        this.timerDeFrame++
        if(this.timerDeFrame % this.velocidadFrame == 0) {
            this.frame > 2 ? this.frame = 0 : this.frame++
        }
    }

    draw() {
        ctx.drawImage(personajeImageClones, this.frame*this.spriteWidth, 0, this.spriteWidth, this.spriteHeight,
            this.x, this.y, this.width, this.height)
    } 

    disparar() {
        ataquesPersonaje.push(new AtaqueDelPersonaje(this.x+3, this.y, 30, 7, 179, 171, 6))
    }
}

function encargoDeClones() {
    for(let i=0; i<clonesDeSombraPersonaje.length; i++) {
        clonesDeSombraPersonaje[i].handleClones()
        clonesDeSombraPersonaje[i].update()
    }
}

// ataque
class AtaqueDelPersonaje {
    constructor(x, y, daño, speed, spriteWidth, spriteHeight, divisionDelSprite) {
        this.x = x
        this.y = y
        this.daño = daño
        this.speed = speed
        this.spriteWidth = spriteWidth
        this.spriteHeight = spriteHeight
        this.width = this.spriteWidth/divisionDelSprite
        this.height = this.spriteHeight/divisionDelSprite
        this.velocidadFrame = 3
        this.timerDeMovimiento = 0
        this.frame = 0
    }
    update() {
        this.y = this.y - this.speed
        this.timerDeMovimiento++
        if(this.timerDeMovimiento % this.velocidadFrame == 0) {
            this.frame > 1 ? this.frame = 0 : this.frame++
        }
    }
    draw(imageDelAtaque) {
        ctx.drawImage(imageDelAtaque, this.frame*this.spriteWidth, 0, this.spriteWidth, this.spriteHeight,
            this.x, this.y, this.width, this.height)
    }
}

function handleAtaquesDelPersonaje() { // arreglar funcion -> refactorizarla
    for(let i=0; i<ataquesPersonaje.length; i++) {
        ataquesPersonaje[i].draw(personajeImageAtaqueBasico)
        ataquesPersonaje[i].update()

        if(ataquesPersonaje[i] && collision(ataquesPersonaje[i], enemy)) {
            vidaEnemigo = vidaEnemigo - ataquesPersonaje[i].daño
            ataquesPersonaje.splice(i, 1)
            i--
        }

        if(ataquesPersonaje[i] && ataquesPersonaje[i].y < barraDePuntajes.height) {
            ataquesPersonaje.splice(i, 1)
            i--
        }

        for(let j=0; j < ataquesEnemigo.length; j++) { // si colisionan los 2 ataques -> el del enemigo y del personaje
            if(ataquesPersonaje[i] && ataquesEnemigo[j] && collision(ataquesPersonaje[i], ataquesEnemigo[j])) {
                ataquesPersonaje.splice(i, 1)
                ataquesEnemigo.splice(j, 1)
            }
        }
    }

    for(let i=0; i<ataquesRasenShurikenPersonaje.length; i++) {
        ataquesRasenShurikenPersonaje[i].draw(personajeImageRasenShuriken)
        ataquesRasenShurikenPersonaje[i].update()

        if(ataquesRasenShurikenPersonaje[i] && collision(ataquesRasenShurikenPersonaje[i], enemy)) {
            vidaEnemigo = vidaEnemigo - ataquesRasenShurikenPersonaje[i].daño
            ataquesRasenShurikenPersonaje.splice(i, 1)
            i--
        }

        if(ataquesRasenShurikenPersonaje[i] && ataquesRasenShurikenPersonaje[i].y < barraDePuntajes.height) {
            ataquesRasenShurikenPersonaje.splice(i, 1)
            i--
        }

        for(let j=0; j < ataquesEnemigo.length; j++) { // si colisionan los 2 ataques -> el del enemigo y del personaje
            if(ataquesRasenShurikenPersonaje[i] && ataquesEnemigo[j] && collision(ataquesRasenShurikenPersonaje[i], ataquesEnemigo[j])) {
                ataquesEnemigo.splice(j, 1)
            }
        }
    }
}


// personaje
class Personaje {
    constructor() {
        this.x = canvas.width/2
        this.y = canvas.height - 80
        this.speed = 5
        this.movement = this.speed // guardo el atributo velocidad en movimiento para poder usarlo más tarde o poder modificarlo y volver a su estado original
        this.spriteWidth = 86.5
        this.spriteHeight = 98
        this.width = this.spriteWidth/2
        this.height = this.spriteHeight/2
        this.velocidadFrame = 3
        this.timerDeMovimiento = 0
        this.frame = 0

        // personaje quieto
        this.spriteWidthQuieto = 54
        this.spriteHeightQuieto = 125
        this.widthQuieto = this.spriteWidthQuieto/2
        this.heightQuieto = this.spriteHeightQuieto/2
        this.velocidadFrameQuieto = 6
    }
    update() {
        if(rightPressed && this.x < canvas.width - this.width) { // limitando por la derecha
            this.x = this.x + this.movement
        } else if(leftPressed && this.x > 0) { // limitando por la izquierda
            this.x = this.x - this.movement
        }

        this.timerDeMovimiento++
        if((this.timerDeMovimiento % this.velocidadFrame == 0)&&((rightPressed == true) || (leftPressed == true))) {
            this.frame > 6 ? this.frame = 0 : this.frame++
        } else if(this.timerDeMovimiento % this.velocidadFrameQuieto == 0) {
            this.frame > 1 ? this.frame = 0 : this.frame++
        }
    }
    draw() {
        if(rightPressed) {
            this.width = this.spriteWidth/2
            ctx.drawImage(personajeImageDerecha, this.frame*this.spriteWidth, 0, this.spriteWidth, this.spriteHeight,
                this.x, this.y, this.width, this.height)
        } else if(leftPressed) {
            this.width = this.spriteWidth/2
            ctx.drawImage(personajeImageIzquierda, this.frame*this.spriteWidth, 0, this.spriteWidth, this.spriteHeight,
                this.x, this.y, this.width, this.height)
        } else {
            this.width = this.widthQuieto
            ctx.drawImage(personajeImageQuieto, this.frame*this.spriteWidthQuieto, 0, this.spriteWidthQuieto, this.spriteHeightQuieto,
                this.x, this.y, this.widthQuieto, this.heightQuieto)
        }
    }   
    agregandoUnAtaqueAlPersonaje() {
        // ejeX, ejeY, daño, speed, spriteWidth, spriteHeight, divisionDelSprite
        ataquesPersonaje.push(new AtaqueDelPersonaje(this.x+3, this.y, dañoAtaquePersonaje, 7, 179, 171, 6))
    }
    agregandoUnRasenShurikenAlPersonaje() {
        ataquesRasenShurikenPersonaje.push(new AtaqueDelPersonaje(this.x+3, this.y, dañoRasenShurikenPersonaje, 16, 104, 153, 4))
    }

    agregandoUnJutsuClonesDeSombraAlPersonaje() {
        clonesDeSombraPersonaje.push(new ClonesDeSombra(this.x, this.y))
        clonesDeSombraPersonaje[clonesDeSombraPersonaje.length-1].makeClones()
    }
    
}

function handlePersonaje() {
    if(vidaPersonaje > 0) {
        personaje.draw()
        personaje.update()
    } else {
        vidaPersonaje = 0
    }
}

let personaje = new Personaje()

function teclaPresionada(e) {
    if(e.keyCode == 39) { // flecha derecha
        rightPressed = true;
    }
    else if(e.keyCode == 37) { // flecha izquierda
        leftPressed = true;
    }

    if(e.keyCode == 32) { // tecla espacio -> shuriken
        if(chackraDelPersonaje >= costoChackraAtaqueBasicoPersonaje) {
            personaje.agregandoUnAtaqueAlPersonaje() 
            chackraDelPersonaje = chackraDelPersonaje - costoChackraAtaqueBasicoPersonaje
        }
    }

    if(e.keyCode == 82) { // tecla R presionada
        if(chackraDelPersonaje >= costoChackraRasenShurikenPersonaje) {
            personaje.agregandoUnRasenShurikenAlPersonaje()
            chackraDelPersonaje = chackraDelPersonaje - costoChackraRasenShurikenPersonaje
        }
    }

    if(e.keyCode == 87) { // tecla W presionada
        if(chackraDelPersonaje >= costoChackraClonesSombra) {
            personaje.agregandoUnJutsuClonesDeSombraAlPersonaje()
            chackraDelPersonaje = chackraDelPersonaje - costoChackraClonesSombra
        }
    }
} 

function teclaSoltada(e) {
    if(e.keyCode == 39) { // flecha derecha
        rightPressed = false;
    }
    else if(e.keyCode == 37) { // flecha izquierda
        leftPressed = false;
    }

}

// Enemigo y Ataque Enemigo
class AtaqueDelEnemigo {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.daño = 35
        this.speed = 7
        this.spriteWidth = 60.25
        this.spriteHeight = 39
        this.width = this.spriteWidth/2.25
        this.height = this.spriteHeight/2
        this.velocidadFrame = 3
        this.timerDeMovimiento = 0
        this.frame = 0
    }
    update() {
        this.y = this.y + this.speed
        this.timerDeMovimiento++
        if(this.timerDeMovimiento % this.velocidadFrame == 0) {
            this.frame > 1 ? this.frame = 0 : this.frame++
        }
    }
    draw() {
        ctx.drawImage(enemigoImageAtaqueBasico, this.frame*this.spriteWidth, 0, this.spriteWidth, this.spriteHeight,
            this.x, this.y, this.width, this.height)
    }
}

function handleAtaqueDelEnemigo() {
    for(let i=0; i < ataquesEnemigo.length; i++) {
        ataquesEnemigo[i].update()
        ataquesEnemigo[i].draw()

        if(ataquesEnemigo[i] && collision(ataquesEnemigo[i], personaje)) {
            vidaPersonaje = vidaPersonaje - ataquesEnemigo[i].daño
            ataquesEnemigo.splice(i, 1)
            i--
        }

        if(ataquesEnemigo[i] && ataquesEnemigo[i].y > canvas.height) {
            ataquesEnemigo.splice(i, 1)
            i--
        }
    }
}

class Enemy {
    constructor() {
        this.x = canvas.width/2
        this.y = barraDePuntajes.height + 20
        this.speed = 3
        this.movement = this.speed // guardo el atributo velocidad en movimiento para poder usarlo más tarde o poder modificarlo y volver a su estado original
        this.direccion = "derecha"
        this.spriteWidth = 100.25
        this.spriteHeight = 80
        this.width = this.spriteWidth/2
        this.height = this.spriteHeight/2
        this.velocidadFrame = 5
        this.timerDeMovimiento = 0
        this.frame = 0
        this.timerDeAtaque = 0
    }
    update() {
        if((this.x <= canvas.width - 30) && this.direccion == "derecha" ) {
            this.x = this.x + this.movement
        } else if(this.x >= canvas.width - 30) {
            this.direccion = "izquierda"
        }
        
        if((this.x >= 0) && this.direccion == "izquierda") {
            this.x = this.x - this.movement
            if(this.timerDeMovimiento % 10 == 0){
                this.movement = this.movement
            }
        } else {
            this.direccion = "derecha"
        }
        this.timerDeMovimiento++
        if(this.timerDeMovimiento % this.velocidadFrame == 0) {
            this.frame > 6 ? this.frame = 0 : this.frame++
        }

        this.timerDeAtaque++
        if(this.timerDeAtaque % 15 == 0) {
            ataquesEnemigo.push(new AtaqueDelEnemigo(this.x+15, this.y+15))
        }

    }
    draw() {
        if(this.direccion == "derecha") {
            // ctx.fillStyle = 'white'
            // ctx.fillRect(this.x, this.y, this.width, this.height)
            ctx.drawImage(enemigoImageDerecha, this.frame*this.spriteWidth, 0, this.spriteWidth, this.spriteHeight,
                this.x, this.y, this.width, this.height)
        } else if(this.direccion == "izquierda") {
            // ctx.fillStyle = 'white'
            // ctx.fillRect(this.x, this.y, this.width, this.height)
            ctx.drawImage(enemigoImageIzquierda, this.frame*this.spriteWidth, 0, this.spriteWidth, this.spriteHeight,
                this.x, this.y, this.width, this.height)
        }
    }
}

let enemy = new Enemy 

function handleEnemy() {
    if(vidaEnemigo > 0) {
        enemy.update()
        enemy.draw()
    } else {
        vidaEnemigo = 0
    }
}

// estado de los puntajes (vida y chackra del personaje y enemigo)
function handleEstadoDelJuego() {
    ctx.fillStyle = 'gold'
    ctx.font = '18px Arial'
    ctx.fillText('Vida del Personaje: ' + vidaPersonaje, 15, 27)
    ctx.fillText('Chackra del Personaje: ' + chackraDelPersonaje, 15, 48)
    ctx.fillText('Vida del Enemigo: ' + vidaEnemigo, 380, 27)
    ctx.fillText('Chackra del Enemigo: ' + chackraDelEnemigo, 380, 48)
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = 'blue'
    ctx.fillRect(0, 0, barraDePuntajes.width, barraDePuntajes.height)

    handlePersonaje()
    handleAtaquesDelPersonaje()
    encargoDeClones()

    handleEnemy()
    handleAtaqueDelEnemigo()

    handleEstadoDelJuego()

    requestAnimationFrame(animate)
}

animate()

function collision(first, second) {
    if((first.x <= second.x + second.width && first.x + first.width >= second.x)&&
        (first.y >= second.y)&&(first.y <= second.y + second.height)) {
        return true
    }
}
