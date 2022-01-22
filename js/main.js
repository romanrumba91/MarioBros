// obtener el canvas del html
const canvas = document.getElementById("myCanvas");
 // set up context
const ctx = canvas.getContext("2d");
/*
*Todas las variables globales que necesitemos se declaran al inicio de nuestro documento
* frames, requestID, arrayImages, defaultValues
*/
let frames = 0;
const imageEnemies = ["assets/images/enemyOne.png","assets/images/enemyTwo.jpg","assets/images/EnemyThree.png"]
//necesito un arreglo para guardar a todos los enemigos que vaya creando
const enemies = []
let requestID;
let bullets = []
let audio = new Audio()
//audio.loop = true // suena para siempre
audio.loop = false
audio.src = "assets/audio/mario_run_escupir.mp3"
//Vamos a recordar
//1.
// const demo1 = new Image ()
// demo1.src = "assets/images/marioStop.png";
// demo1.onload = () => {
//     // le decimos al contexto (ctx) que dibuje nuestra iamgen
//     //drawImage (img,x,y,w,h)
//     ctx.drawImage(demo1,100,100,100,100)
// }
// Clase background
class Background{
    constructor(){
        //mis propiedades
        this.x = 0;
        this.y = 0;
        this.width = canvas.width;
        this.height = canvas.height;
        this.image = new Image();
        this.image.src = "assets/images/fondo.png"
    }  
    //metodos
    draw() {
        this.x --;
        if(this.x < -canvas.width){
            this.x = 0
        }
        ctx.drawImage(this.image,this.x,this.y, this.width,this.height)
        //colocamos una segunda imagen
        ctx.drawImage(
            this.image,
            this.x + this.width,  //coloca la imagen seguidita de la primera
            this.y ,
            this.width,
            this.height    
            )
    }
    gameOver(){
        ctx.font = "80px Arial"
        ctx.fillText("Te moriste banda!! u.u",150,150)
    }
}
class Character {
    constructor(x,y,w,h,img){
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.image = new Image()
        this.image.src = img
    }
    //metodos
    draw(){
        if(frames % 10 === 0) {
            this.x -= 5;
        }
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
    collision(item){
        return(
            this.x < item.x + item.width &&
            this.x + this.width > item.x &&
            this.y < item.y + item.height &&
            this.y + this.height > item.y
        )
    }
}
class Mario extends Character{
    constructor(x,y,w,h){
        super(x,y,w,h)
        this.image1 = new Image()
        this.image1.src = "assets/images/marioStop.png"
        this.image2 = new Image()
        this.image2.src = "assets/images/marioRun.png"
        this.image = this.image1 //sera mi imagen oficial
        this.jump = false
        this.lifePoint = 100
    }
    draw(){
        if (frames % 10 === 0){
            // if ternario (condicion) "?" (resultado true) ":" (result false)
            this.image = this.image === this.image1 ? this.image2 : this.image1
            /*
            *if (this.image === this.image1){
                this.image = this.image2
            }else{
                this.image = this.image1
            }
            */
        }
        if(this.jump){
            this.y +=5;
            if(this.y >= 288){
                this.y = 288;
                this.jump = false
            }
        }
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
}
class Enemy extends Character{
    constructor (x,y,w,h,img){
        super(x,y,w,h,img)
    }
}
class Fireball {
    constructor(x, y){
        this.x = x
        this.y = y
        this.width = 30
        this.height = 30
        this.image = new Image()
        this.image.src = "assets/images/fireball.png"
    }
    draw(){
        if(frames % 10 === 0){
            this.x +=5
        }
        ctx.drawImage(this.image,this.x,this.y, this.width, this.height)
    }
}
//llamar a las clases o instanciar a las clases para poder utilizar sus metodos y propiedades
const fondo = new Background()
const mario = new Mario(100,288,40,50)
//prueba enemy
//const enemy = new Enemy (canvas.width,288,50,50,imageEnemies[0])
//functions
function updateCanvas(){
    frames ++;
    //limpiamos el canvas es MUY importante para que no se sobreponga las capas anteriores
    ctx.clearRect(0,0,canvas.width, canvas.height)
    fondo.draw()
    mario.draw()
    generateEnemies()
    drawEnemies()
    //enemy.draw()
    // prueba collision
    // if(mario.collision(enemy)){
    //     console.log("Me esta tocando")
    //     requestID = undefined
    //     fondo.gameOver()
    // }
//endprueba
//validar si el requestID tiene un valor continuieamos con el juego
if(requestID){
    requestID = requestAnimationFrame(updateCanvas)
    }
}
/*generar enemigos y dibujar enemigos
    generar Enemigos y los va a guardar en un array
    dibujar enemigos va a llamar lel metodo draw y estara verificando si mario toca con uno
*/
function generateEnemies(){
    //decirle en que intervalo de tiempo quiero que se genere mi enemigo
    if(frames % 1100===0 || frames % 360 === 0 || frames % 500 ===0){
        let y = Math.floor(Math.random() * (288 - 10) ) + 10
        let imgRand = Math.floor(Math.random() * imageEnemies.length)
        const enemy = new Enemy (canvas.width,y,50,50,imageEnemies[imgRand])
        enemies.push(enemy)
    }
}
function drawEnemies(){
    // iteramos en el arreglo enemies para poder utilizar el .draw de cada enemigo
    // item  = enemy, index = 0, arregloOriginal
    enemies.forEach((enemy,index_enemy) => {
        enemy.draw()
        //hacer collision
            if(mario.collision(enemy)){
        //console.log("Me esta tocando")
        requestID = undefined
        fondo.gameOver()
        }
        bullets.forEach((bullet,index_bullet) =>{
            bullet.draw()
            //validar si choca con un enemigo
            if(enemy.collision(bullet)){
                enemies.splice(index_enemy,1)
                /*
                if (enemy.type === 2){
                    score += 100
                }              
                */
            }
            //sacar la bala si se sale del canvas
            if(bullet.x + bullet.width >= 800){
                bullets.splice(index_bullet,1)
            }
        })
        //eliminar al enemigo si se sale del canvas
        //para sacar al enemigo y evitar que el browser se alente y se coma toda la ram
        //vamos a limpiar el array de los enemigos que ya no vemos en el canvas
        if (enemy.x + enemy.width <= 0){
            enemies.splice(index_enemy,1)
        }
    });
}
//updateCanvas()
function startGame() {
    requestID = requestAnimationFrame(updateCanvas)
}
startGame()
//Mover a mi mario
addEventListener("keydown",(event) => {
    //izq
    if(event.keyCode === 65) {
        mario.x -= 20;
    }
    //derecha
    if(event.keyCode === 68){
        mario.x += 20
    }
    //salto
    if(event.keyCode ===32){
        mario.y -= 60;
        mario.jump = true
    }
    //disparar
    if (event.keyCode === 75){
        if(bullets.length >= 3){
            console.log('no se pueden disparar')
        }else{
            bullets.push(new Fireball(mario.x, mario.y))
            audio.play() // reproducir sonido
        }
    }
})