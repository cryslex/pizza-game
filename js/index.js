const cvs = document.querySelector('#cvs');
const ctx = cvs.getContext('2d');

let [w, h] = [cvs.width, cvs.height] = [450, 800]

const size = 96;

const hero = {
    x: w / 2 - size / 2,
    y: h - size - 125,
    xVel: 0,
    yVel: 0,
    color: 'red'
}

let touched = false;
let touchY = 0;
let touchX = 0;

let speed = 5;

const objects = [
    {type: 'pizza', x: randomInteger(0, w - size), y: -(5 * size), w: 90, h: 80},
    {type: 'cookie', x: randomInteger(0, w - size), y: -size, w:80, h:64}
]

let hp = 3;

let pause = false;

let money = 0;

if(localStorage.money === undefined){
    money = 0;
}
else{
    money = Number(localStorage.money);
}

let stopGenerate = false; // Остановка генерации новых объектов

let x2 = false; // Х2

let freeze = false; // Заморозка

let boosting = false;

let angle = 0; // Угол поворота снежинки

const snowAngleSpeed = 10; // Скорость вращения снежинки

let objectSpeed = speed * 2.2; // Скорость объектов

let CS = 0; // Кол-во словленных объектов

function render(){

    if(hero.x <= 0) hero.x = 0;
    if(hero.x + size >= w) hero.x = w - size;
    
    angle+=snowAngleSpeed;

    ctx.clearRect(0, 0, w, h); // Очистка холста
    
    for(let y = 0; y < h / 96; y++){
        for(let x = 0; x < w / 210; x++){
            ctx.drawImage(bricksIMG, x * 210, y * 96, 210, 96);
        }
    } // Отрисовка фона

    // Отрисовка платформы

    // ctx.drawImage(platformIMG, 0, h - 150, w, 150);

    ctx.fillStyle = '#000';
    
    ctx.fillRect(0, h - 125, w, h);

    ctx.fillStyle = hero.color; // Цвет квадрата
    
    ctx.fillRect(hero.x, hero.y, size, size); // Отрисовка квадрата
    
    // Ускорение
    
    hero.x += hero.xVel;
    hero.y += hero.yVel;
    
    for(let i = 0; i < objects.length; i++) {
        
        if(objects[i].y >= h){ // Выход за границы
            objects.splice(i, 1);
            continue;
        }
        
        objects[i].y += objectSpeed; // Падание объектов
        
        if(objects[i].type === 'pizza'){
            ctx.drawImage(pizzaIMG, objects[i].x, objects[i].y, objects[i].w, objects[i].h);
        }
        
        else if(objects[i].type === 'cola'){
            ctx.drawImage(colaIMG, objects[i].x, objects[i].y, objects[i].w, objects[i].h);
        }
        
        else if(objects[i].type === 'cookie'){
            ctx.drawImage(cookieIMG, objects[i].x, objects[i].y, objects[i].w, objects[i].h);
        }
        
        else if(objects[i].type === 'x2'){
            ctx.drawImage(x2IMG, objects[i].x, objects[i].y, objects[i].w, objects[i].h);
        }

        else if(objects[i].type === 'boost'){
            ctx.drawImage(boostIMG, objects[i].x, objects[i].y, objects[i].w, objects[i].h);
        }
        
        else if(objects[i].type === 'ice'){
            
        
            let dx = (objects[i].x) + objects[i].w / 2,
                dy = (objects[i].y) + objects[i].h / 2;
            if(angle){
                ctx.save();
                ctx.translate(dx, dy);
                ctx.rotate((Math.PI / 180) * angle);
                ctx.translate(-dx, -dy);
            }
  
            ctx.drawImage(iceIMG, objects[i].x, objects[i].y, objects[i].w, objects[i].h);
  
            if(angle){
                ctx.restore();
            }

        }
        
        if(isCollision(objects[i].x, objects[i].y, objects[i].type, objects[i].w, objects[i].h)){
            objects.splice(i, 1);
        }
        
    }
    
    for(let q = 0; q < 3; q++){
        ctx.drawImage(blackHeartIMG,  4 + 4 * q + 32 * q, 4, 32, 32);
    }
    
    for(let t = 0; t < hp; t++){ // Отрисовка жизней
        ctx.drawImage(heartIMG,  4 + 4 * t + 32* t, 4, 32, 32);
    }
    
    // ctx.drawImage(pauseIMG, w - 40 - 4, 0 + 4, 40, 40);
    
        if(x2){
            ctx.drawImage(x2IMG, 0, h/2 - 256, 128, 64);
        }
        if(freeze){
            ctx.drawImage(freezeIMG, 0, h/2 - 256 + 75, 128, 64);
        }
        if(boosting){
            ctx.drawImage(boostBonusIMG, 0, h/2 - 256 + 150, 128, 64);
        }
        
        ctx.drawImage(moneyIMG, 4, h / 2 - 312, 25, 25);
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(`${money}`, 34, h/2 - 307);
    
}

function checking(){
    if(hp <= 0){
        setText('GAMEOVER')
        pause = true;
        addEventListener('click', () => {location.reload();})
    }
    if(stopGenerate){
        setInterval(generateNewObject, 1500);
        stopGenerate = false;
    }
    if(freeze){
        hero.color = '#b9e8ea';
    }
    else hero.color = 'red';
}

function generateNewObject(){
    let z = randomInteger(0, types.length - 1);
    let a = types[z].type
    objects.push({type: a, w: types[z].w, h: types[z].h, y: -size, x: randomInteger(0, w - types[z].w), size: types[z] === 'cola' ? size / 2 : size})
}

function isCollision(x, y, type, width, height){
    if((hero.x <= x + width &&
       hero.x + size >= x &&
       hero.y <= y + height&&
       hero.y + size >= y) ||
       
       hero.x + size >= x &&
       hero.x <= x  &&
       hero.y + size >= y &&
       hero.y <= y){
        if(type === 'cola') hp--;
        if(type === 'x2'){ 
            if(!x2){
            x2 = true;
            setTimeout(function() {x2 = false;}, 10000);
        }}
        else if(type === 'ice'){
            if(!freeze){
                freeze = true;
                hero.xVel = 0;
                setTimeout(function() {freeze = false;}, 3500);
            }
        }

        else if(type === 'boost' && !boosting){
            let aSpeed = speed;
            speed *= 3.5;
            boosting = true;
            setTimeout(function(){boosting = false; speed = aSpeed;}, 5000);
        }

        if(type != 'cola' && type!= 'x2' && type != 'ice' && type != 'boost'){
            if(x2) money += 2;
            else money++;
        }
        CS++; // Кол - во словленных объектов

        if(CS % 50 === 0){
            console.log('speed+=0.5');
            objectSpeed+=0.5;
        }

        return true;
        
    }
    else return false;
}

function setText(text){ // Вывод текста на экран
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3);';
    ctx.fillRect(0, h/2 - 17, w, 30);
    ctx.fillStyle = '#000';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText(text, w/2, h/2);

}

function randomInteger(min, max) {
   // получить случайное число от (min-0.5) до (max+0.5)
   let rand = min - 0.5 + Math.random() * (max - min + 1);
   return Math.round(rand);
}

function loop(){
    localStorage.money = money;
    
    if(!pause){
        render();
        checking();
    }
    
    if(pause){ clearInterval(generateInterval); stopGenerate = true}
    

}

let generateInterval;

function init(){
    started = true;
    setInterval(loop, 1000/60);
    generateInterval = setInterval(generateNewObject, 750);
}

let started = false;

function start(){
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle = 'whitesmoke';
    ctx.fillRect(0,0,w,h);
    ctx.fillStyle = '#000';
    ctx.font = `${w / 20}px "Press Start 2P"`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    ctx.fillText('Click for start',w/2,h/2); 
    
    window.onclick = () => {
        if(!started) init();
    }
    
    if(!started) requestAnimationFrame(start);
}

start();