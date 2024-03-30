let question1=document.querySelector('.qest')
let answer=document.querySelectorAll('.answer')
let h3class = document.querySelector('.h3class')

let container_start=document.querySelector('.start')
let container_main = document.querySelector('.main')
let start_btn = document.querySelector('.start-btn')

function randint(min,max){
    return Math.round(Math.random() * (max - min) + min)
}

let signs=['+', '-', '*', '/']

function getRandomSign(){
    return signs[randint(0,3)]
}

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;

    while (currentIndex != 0) { // Цикл повторяется до тех пор, пока остаются элементы для перемешивания
        randomIndex = Math.floor(Math.random() * currentIndex); // Выбираем оставшийся элемент.
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [    // Меняем местами с текущим элементом.
        array[randomIndex], array[currentIndex]];
    }
    return array; // Возвращаем перемешанный массив
    }





        
class Answer{
    constructor(){
        let a = randint(1,30)
        let b = randint(1,30)
        let signs = getRandomSign(0,3)
        

        if (signs == "+"){
            this.question=`${a}+${b}`;
            this.correct= a + b;
        }
        else if(signs == "-"){
            this.question =`${a}-${b}`;
            this.correct= a - b;
        }

        else if(signs == "*"){
            this.question=`${a}*${b}`;
            this.correct= a * b;
        }        

        else if(signs == "/"){
            this.question=`${a}/${b}`;
            this.correct= Math.round(a/b);
        }
        this.mass=[
            randint(this.correct-15,this.correct-1),
            randint(this.correct-15,this.correct-1), 
            this.correct,
            randint(this.correct+1,this.correct+15),
            randint(this.correct+1,this.correct+15),          
        ]
        shuffle(this.mass)
        

    }

    
    display(){
        
        question1.innerHTML = this.question
        for(let i = 0;i < 5;i += 1){
        answer[i].innerHTML=this.mass[i]
        }
    }

    }
let counterRel
let right
let current_question = new Answer()
current_question.display()

start_btn.addEventListener('click',function(){
    container_start.style.display = 'none'
    container_main.style.display = 'flex'

    counterRel = 0
    right = 0
setTimeout(function(){

statistics = (right/counterRel) * 100
statistics = (Math.round(statistics))
console.log(statistics)  
beauteafull = `Потрясающе!`
good = `хорошо!`
// sredne = `старайся!`             фича на будущее
bad=`плохо!`
h3class.innerHTML = `Потрясающе!
Из ${counterRel} вопросов вы ответели верно на ${right}, за 5 секунд!
Ваш процент правильных ответов:${statistics}%`
    container_start.style.display = 'flex'
    container_main.style.display = 'none'
},10000) 


})   



for(let i = 0; i < 5; i += 1) {
    answer[i].addEventListener('click',function(){
        
        if(answer[i].innerHTML == current_question.correct){
            console.log('Верно')
            right += 1
            answer[i].style.background = '#00FF00'
            anime({
                targets: answer[i],
                backgroundColor:'#FFFFFF',
                delay:100,
                duration:300,
                easing:"linear"
            })
        }
        else{
            console.log('Неверно')
                    answer[i].style.background = '#FF0000'
            anime({
                targets: answer[i],
                backgroundColor:'#FFFFFF',
                delay:100,
                duration:300,
                easing:"linear"    })
        }
        counterRel += 1
        current_question = new Answer()
        current_question.display()

        
    })

}        




