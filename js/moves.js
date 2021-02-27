function moves(){

    // Управление с телефона

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {

    addEventListener('touchstart', (event) => { // Событие нажатия
        touched = true;
        touchX = event.touches[0].pageX;
        touchY = event.touches[0].pageY;
    })
    addEventListener('touchend', () => { // Событие отжатия
        touched = false;
    })
    
    if(touched){ // Перемещение 
        if(!freeze && touchX >= innerWidth / 2 && hero.x + size < w){
            hero.xVel = speed;
        }
        else if(!freeze && touchX < innerWidth / 2 && hero.x !=0){
            hero.xVel = -speed;
        }
    }
    else hero.xVel = 0;
    
    if(hero.x <= 0) hero.x = 0;
    if(hero.x + size >= w) hero.x = w - size;
}
    // Управление с пк

    else{

    document.addEventListener('keydown', (event) => {

    // Проверка выхода за границы

    if(hero.x <= 0){
        hero.x = 0;
    }

    if(hero.x + size >= w){
        hero.x = w - size;
    }

    if(!freeze && event.code == 'KeyA'){
        hero.xVel = -speed;
    }
    else if(!freeze && event.code == 'KeyD'){
        hero.xVel = speed;
    }

    if(freeze) hero.xVel = 0;
    })

    document.addEventListener('keyup', () => {hero.xVel = 0})

    }

    requestAnimationFrame(moves);
}

moves();