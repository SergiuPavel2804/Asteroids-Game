let canvasGame;
let context;
let canvasW = 1200;
let canvasH = 600;
let keys = [];
let spaceship;
let rockets = [];
let asteroids = [];
let scoreOfPlayer = 0;
let lives = 4;
let play_button;


//setarea canvas ului dupa incarcarea elementelor
document.addEventListener('DOMContentLoaded', function() {
    SetupCanvas();
    
});


//functie ce arata display-ul canvas-ului daca setez toggle pe adevarat si il ascunde daca toggle este fals
function toggleCanvas(id, toggle) {
    let element = document.getElementById(id);
    let display = (toggle) ? "block" : "none";
    element.style.display = display;
    let buttonPlay = document.getElementsByTagName("button")[0];
    let buttonRetry = document.getElementsByTagName("button")[1];
    buttonPlay.style.display = "none";
    buttonRetry.style.display = "block";
}



//crearea canvas-ului
function SetupCanvas() {
    canvasGame = document.getElementById('game_canvas');
    context = canvasGame.getContext('2d');
    canvasGame.width = canvasW;
    canvasGame.height = canvasH;
    context.fillStyle = 'black';
    context.fillRect(0,0, canvasGame.width, canvasGame.height);
    spaceship = new Spaceship();
    
    for(let i = 0; i < 2; i++){
        asteroids.push(new Asteroid());
    }
    //verificarea tastei apasate
    document.body.addEventListener("keydown", function(e) {
        keys[e.code] = true;
        
    });

    document.body.addEventListener("keyup", function(e) {
        keys[e.code] = false;
        if(e.code === "KeyX"){
            shoot();
            }
    });

    Render();
}

//functie ce arata ca nava trage
function shoot() {
    
    rockets.push(new Rocket(spaceship.angle));
   
}



//avem nevoie de o clasa pentru reprezentarea navei
class Spaceship {
    constructor(){
        //ne asiguram ca e vizibila
        this.visible = true;
        //punem nava in mijlocul ecranului
        this.x = canvasW/2;
        this.y = canvasH/2;
        //nava trebuie sa nu se miste la inceputul jocului
        this.movingForward = false;
        this.movingRight = false;
        this.movingLeft = false;
        this.movingDown = false;
        //viteza navei sugereaza si distanta pe care o parcurge nava
        this.speed = 0.065;
        //velocitatea reprezinta viteza de schimbare a pozitiei navei pe ecran
        this.velocityX = 0;
        this.velocityY = 0;
        this.rotateSpeed = 0.001;
        this.radius = 15;
        this.angle = 0;
        //cand incepem jocul, nava este orientata inspre stanga        
        //nava va avea conturul alb
        this.strokeColor = 'white'; 
        //avem nevoie de coordonatele varfului navei intrucat din varf sunt trase gloantele
        this.topShipX = canvasW/2 + 15;
        this.topShipY = canvasH/2;

        

    }

    //functia de rotire a navei
    Rotate(dir){
        this.angle += this.rotateSpeed * dir;
    }

    //avem nevoie de o functie ce asigura miscarea si rotirea navei
    Update(){
        //convertire grade in radiani
        let radians = this.angle / Math.PI * 180;
    
        //formula pentru aflarea noului x si y dupa miscare:
        //x + cos(radiani) * distanta
        //y + sin(radiani) * distanta
        //actualizam pozitia navei in functie de unde o miscam pe ecran cu ajutorul trigonometriei
        if(this.movingForward) {
            this.velocityX += Math.cos(radians) * this.speed;
            this.velocityY += Math.sin(radians) * this.speed;
        }

        if(this.movingRight) {
            this.velocityX += Math.sin(radians) * this.speed * (-1);
            this.velocityY += Math.cos(radians) * this.speed;
        }

        if(this.movingDown) {
            this.velocityX -= Math.cos(radians) * this.speed;
            this.velocityY -= Math.sin(radians) * this.speed;
        }
        if(this.movingLeft) {
            this.velocityX -= Math.sin(radians) * this.speed * (-1);
            this.velocityY -= Math.cos(radians) * this.speed;
        }

        //verificam daca nava iese din ecran prin stanga 
        if(this.x < this.radius){
            //o vom prelua in dreapta ecranului
            this.x = canvasGame.width;
        }
        
        //verificam daca nava iese din ecran prin dreapta
        if(this.x > canvasGame.width){
            //o vom prelua in stanga ecranului
            this.x = this.radius;
        }
        //analog si pentru iesirea navei prin capetele de sus sau de jos
        if(this.y < this.radius){
            this.y = canvasGame.height;
        }
        if(this.y > canvasGame.height){
            this.y = this.radius;
        }

        //de fiecare data cand apelam functia de update, nava trebuie sa incetineasca
        this.velocityX *= 0.99;
        this.velocityY *= 0.99;

        //in functie de viteza de schimbare a pozitiei, trebuie schimbata si pozitia in sine
        this.x -= this.velocityX;
        this.y -= this.velocityY;
    }

    //desenam nava
    Draw(){
        context.strokeStyle = this.strokeColor;
        context.beginPath();
        //variabila vertAngle indica si tipul de poligon pe care l construim. Impartind 360 de grade la 3, vom desena un triunghi pentru nava
        let vertAngle = ((Math.PI * 2) / 3);
        let radians = this.angle / Math.PI * 180;
        //acestea sunt poztiile varfului navei
        this.topShipX = this.x - this.radius * Math.cos(radians);
        this.topShipY = this.y - this.radius * Math.sin(radians);
        
        //aici se trag liniile virtuale ale triunghiului propriu-zis
        for(let i=0; i<3; i++){
            context.lineTo(this.x - this.radius * Math.cos(vertAngle * i + radians), 
            this.y - this.radius * Math.sin(vertAngle * i + radians));
        }
        context.closePath();
        context.stroke();
    }   
}


class Rocket{
    //construirea rachetelor
    constructor(angle){
        this.visible = true;
        //se vede ca pozitia initiala a rachetei corespunde cu varful navei 
        this.x = spaceship.topShipX;
        this.y = spaceship.topShipY;
        //aici definim trasaturile de baza ale rachetei, asemanatoare cu ale navei
        this.angle = angle;
        this.height = 4;
        this.width = 4;
        this.speed = 5;
        this.velocityX = 0;
        this.velocityY = 0;


    }

    //functia de miscare a rachetei
    Update() {
        var radians = this.angle / Math.PI * 180;
        this.x -= Math.cos(radians) * this.speed;
        this.y -= Math.sin(radians) * this.speed;
    }

    Draw(){
        //desenam racheta ca pe un dreptunghi alb
        context.fillStyle = 'white';
        context.fillRect(this.x, this.y, this.width, this.height); 
    }
}

class Asteroid{
    constructor(x,y,radius,level,collisionRadius){
        this.visible = true;

        //definim pozitia random a asteroidului
        this.x = x || Math.floor(Math.random() * canvasW);
        this.y = y || Math.floor(Math.random() * canvasH);
        this.speed = 1;
        this.radius = radius || 50;
        //asteroidul se afla la un unghi random pentru a se putea duce in toate directiile
        this.angle = Math.floor(Math.random() * 359);
        this.strokeColor = 'white';
        //asteroidul va avea o raza de coliziune mai mica decat raza sa pentru a deteca coliziunea mai repede
        this.collisionRadius = collisionRadius || 48;
        //aici generam level-ul random al asteroidului in momentul in care acestea apar pe canvas
        this.level = level || Math.floor(Math.random() * 4 + 1);

    }
    Update(){
        //se defineste miscarea asteroidului prin aceleasi functii trigonometrice definite anterior
        var radians = this.angle / Math.PI * 180;
        this.x += Math.cos(radians) * this.speed;
        this.y += Math.sin(radians) * this.speed;

        if(this.x < this.radius){
            //il vom prelua in dreapta ecranului
            this.x = canvasGame.width;
        }
        
        //verificam daca asteroidul iese din ecran prin dreapta
        if(this.x > canvasGame.width){
            //il vom prelua in stanga ecranului
            this.x = this.radius;
        }
        //analog si pentru iesirea asteroidul prin capetele de sus sau de jos
        if(this.y < this.radius){
            this.y = canvasGame.height;
        }
        if(this.y > canvasGame.height){
            this.y = this.radius;
        }
    }

    Draw(){
        
        //aici realizez desenul asteroidului
        context.beginPath();
        let vertAngle = Math.PI * 2;
        var radians = this.angle / Math.PI * 180;

        //se formeaza cercul initial
        context.arc(this.x - this.radius * Math.cos(radians), this.y - this.radius * Math.sin(radians), this.radius, this.angle, vertAngle + this.angle);
        context.closePath();
        context.stroke();
        
        //pentru ficeare nivel, se implementeaza o dimensiune si culoare diferita a asteroidului
        if(this.level === 1){
        
            context.fillStyle = 'white';
            context.fill();
            context.fillStyle = 'black';
            context.font = '12pt Arial';
            context.textAlign = 'center';
            context.fillText("4", this.x - this.radius * Math.cos(radians), this.y - this.radius * Math.sin(radians), 50);
            }
        else if (this.level === 2){
            this.radius = 25;
            context.fillStyle = 'red';
            context.fill();
            context.fillStyle = 'black';
            context.font = '10pt Arial';
            context.textAlign = 'center';
            context.fillText("3", this.x - this.radius * Math.cos(radians), this.y - this.radius * Math.sin(radians), 50);
        }
        else if (this.level === 3){
            this.radius = 18;
            context.fillStyle = 'yellow';
            context.fill();
            context.fillStyle = 'black';
            context.font = '8pt Arial';
            context.textAlign = 'center';
            context.fillText("2", this.x - this.radius * Math.cos(radians), this.y - this.radius * Math.sin(radians), 50);
        }
        else if (this.level === 4){
            this.radius = 10;
            context.fillStyle = 'cyan';
            context.fill();
            context.fillStyle = 'black';
            context.font = '7pt Arial';
            context.textAlign = 'center';
            context.fillText("1", this.x - this.radius * Math.cos(radians), this.y - this.radius * Math.sin(radians), 50);
        }

    }

}

//Aceasta este functia care detecteaza ciocnirea dintre doua cercuri
function CircleCollision(p1x, p1y, r1, p2x, p2y, r2) {
    let SumOfRadius;
    let DifferenceBetX;
    let DifferenceBetY;
    SumOfRadius = r1 + r2;
    DifferenceBetX = p1x - p2x;
    DifferenceBetY = p1y - p2y;

    //matematic vorbind, cand suma razelor devine mai mica decat distanta dintre centrul cercurilor, atunci putem afirma ca cele doua cercuri sunt unul peste altul, mai exact se ciocnesc
    if(SumOfRadius > Math.sqrt((DifferenceBetX * DifferenceBetX) + (DifferenceBetY * DifferenceBetY))){
        return true;
    } else {
        return false;
    }
}


//in aceasta functie se deseneaza vietile ramase ale jucatorului
function DrawLives() {
    let Xstart = 1150;
    let Ystart = 10;
    let points = [[9,9] , [-9,9]];
    context.strokeStyle = 'white';

    //desenul se aseamana cu cel al navei intrucat vietile apar tot sub froma de triunghiuri
    for(let i=0; i < lives; i++){
        context.beginPath();
        context.moveTo(Xstart, Ystart);
        for(let j=0; j < points.length; j++){
            context.lineTo(Xstart + points[j][0], Ystart + points[j][1]);
        }
        context.closePath();
        context.stroke();
        //se lasa o distanta de 30 intre ele pentru vizibilitate
        Xstart -= 30;
    }
}

//o functie importanta pentru ciocnirea dintre asterioizi, nefolosita
// function CheckOverlap(p1x, p1y, p2x, p2y, r1, r2){
    
//     let DifferenceBetX;
//     let DifferenceBetY;
    
//     DifferenceBetX = p1x - p2x;
//     DifferenceBetY = p1y - p2y;
   
//    let dist = Math.sqrt((DifferenceBetX * DifferenceBetX) + (DifferenceBetY * DifferenceBetY));
   
//    if(r1 + r2 >= dist){ 
        
//          let nx = DifferenceBetX / dist;
//          let ny = DifferenceBetY / dist;

//          let touchDistFromAsteroid1 = (dist * (r1 / (r1 + r2)))         
//          let contactX = p1x + nx * touchDistFromAsteroid1;
//          let contactY = p1y + ny * touchDistFromAsteroid1;

//          p1x = contactX - nx * r1;
//          p1y = contactY - ny * r1;

//          p2x = contactX + nx * r2;
//          p2y = contactY + ny * r2;
//     }


// }

//functie ce trece la nivelul urmator
function NextLevel() {
    if(asteroids.length === 0){
        //atunci cand nu mai sunt astroizi ramasi pe ecran, repunem nava in pozitia initiala, dar si asteroizii cu diferenta de viteza si de numar intre nivele
        spaceship.x = canvasW / 2;
        spaceship.y = canvasH / 2;
        spaceship.velocityX = 0;
        spaceship.velocityY = 0;
        for(let i = 0; i < 4; i++){
            let asteroid = new Asteroid();
            asteroid.speed += .1;
            asteroids.push(asteroid);
        }
    }
}

//pentru reluare joc se face refresh la pagina
function RetryLevel() {
    window.location.reload();
}


//actualizarea pozitiei formelor afisate pe ecran, dar si desenarea acestora
function Render(){
    
    //miscam nava in fata pe up arrow
    spaceship.movingForward = (keys["ArrowUp"]);
    spaceship.movingDown = (keys["ArrowDown"]);
    spaceship.movingRight = (keys["ArrowRight"]);
    spaceship.movingLeft = (keys["ArrowLeft"]);
    
    //rotim la dreapta pe c
    if(keys["KeyC"]){
        spaceship.Rotate(1);
    }
    //rotim la dreapta pe z
    if(keys["KeyZ"]){
        spaceship.Rotate(-1);
    }
    
    //aici punem doua texte importante pe ecran, si anume cel al scorului si al vietilor
    context.clearRect(0,0,canvasW, canvasH);
    context.fillStyle = 'white';
    context.font = '18px Arial';
    context.fillText('SCORE: ' + scoreOfPlayer.toString(), 75, 35);
    context.fillText('LIVES: ', 1000, 25);
    
    //cand numarul de vieti este 0, apare textul GAME OVER si se sterge nava
    if(lives <= 0){
        spaceship.visible = false;
        context.fillStyle = 'white';
        context.font = '50px Arial';
        context.fillText('GAME OVER', canvasW / 2, canvasH / 2);
        spaceship.splice();
    }

    DrawLives();

    //nava reapare in pozitia initiala si jucatorul pierde o viata la coliziunea dintre nava si asteroizi
    if(asteroids.length !== 0){
        for(let k = 0; k < asteroids.length; k++){
            if(CircleCollision(spaceship.x, spaceship.y, 11, asteroids[k].x, asteroids[k].y, asteroids[k].collisionRadius)){
                spaceship.x = canvasW / 2;
                spaceship.y = canvasH / 2;
                spaceship.velocityX = 0;
                spaceship.velocityY = 0;
                lives -= 1;
            }
        }
    }

    //de fiecare data cand jucatorul atinge un scor divizibil cu 500, castiga o viata in plus
    if(scoreOfPlayer % 500 == 0 && lives < 4){
        scoreOfPlayer += 50;
        lives += 1;
    }

    //toata aceasta portiune realizeaza coliziunea dintre racheta si asteroizi
    if(asteroids.length !== 0 && rockets.length !=0){
        loop1:
            for(let l = 0; l < asteroids.length; l++){
                for(let m = 0; m < rockets.length; m++){
                    //aici se verifica coliziunea
                    if(CircleCollision(rockets[m].x, rockets[m].y, 3, asteroids[l].x, asteroids[l].y, asteroids[l].collisionRadius)){
                        //pentru fiecare coliziune, in functie de nivel, apar alti doi asteroizi cu dimensiuni reduse si porniti dintr-un unghi asemanator cu asteroidul distrus anterior
                        if(asteroids[l].level === 1) {
                            asteroids.push(new Asteroid(asteroids[l].x - 20, 
                                asteroids[l].y - 20, 25, 2, 23));
                            asteroids.push(new Asteroid(asteroids[l].x + 20, 
                                    asteroids[l].y + 20, 25, 2, 23));    
                        } else if(asteroids[l].level === 2){
                            asteroids.push(new Asteroid(asteroids[l].x - 15, 
                                asteroids[l].y - 15, 18, 3, 16));
                            asteroids.push(new Asteroid(asteroids[l].x + 15, 
                                    asteroids[l].y + 15, 18, 3, 16));
                        } else if(asteroids[l].level === 3){
                            asteroids.push(new Asteroid(asteroids[l].x - 10, 
                                asteroids[l].y - 10, 10, 4, 8));
                            asteroids.push(new Asteroid(asteroids[l].x + 10, 
                                    asteroids[l].y + 10, 10, 4, 8));
                        }   
                        
                        //asteroidul mare si racheta dispar dupa coliziune, iar scorul creste cu 50 la fiecare asteroid distrus
                        asteroids.splice(l,1);
                        rockets.splice(m,1);
                        scoreOfPlayer += 50;
                        break loop1;
                    }
                }
            }
    }

    NextLevel();

    //ultimele randuri asigura de fapt miscarea si desenarea navei, asteroizilor si a rachetelor pe ecran la fiecare frame, atat timp cat exista sau sunt vizibile
    if(spaceship.visible){
        spaceship.Update();
        spaceship.Draw();
    }

    spaceship.Update();
    spaceship.Draw();
    if(rockets.length !== 0){
        for(let i=0; i < rockets.length; i++){
            rockets[i].Update();
            rockets[i].Draw();
        }
    }

    if(asteroids.length !== 0){
        for(let j=0; j < asteroids.length; j++){
            asteroids[j].Update();
            asteroids[j].Draw(j);
        }
    }

    requestAnimationFrame(Render);

}
