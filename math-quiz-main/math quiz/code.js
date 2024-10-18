document.addEventListener('DOMContentLoaded', function() {
    let question1 = document.querySelector('.qest');
    let answer = document.querySelectorAll('.answer');
    let h3class = document.querySelector('.h3class');
    let container_start = document.querySelector('.start');
    let container_main = document.querySelector('.main');
    let start_btn = document.querySelector('.start-btn');

    function randint(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    let signs = ['+', '-', '*', '/'];

    function getRandomSign() {
        return signs[randint(0, signs.length - 1)];
    }

    function shuffle(array) {
        let currentIndex = array.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    class Answer {
        constructor() {
            let a = randint(1, 30);
            let b = randint(1, 30);
            let sign = getRandomSign();
            if (sign === "+") {
                this.question = `${a} + ${b}`;
                this.correct = a + b;
            } else if (sign === "-") {
                this.question = `${a} - ${b}`;
                this.correct = a - b;
            } else if (sign === "*") {
                this.question = `${a} * ${b}`;
                this.correct = a * b;
            } else {
                b = randint(1, 30); // Ensure b is not zero for division.
                this.question = `${a} / ${b}`;
                this.correct = Math.round(a / b); // Round for simplicity
            }

            this.mass = [
                this.correct,
                randint(this.correct - 15, this.correct - 1),
                randint(this.correct + 1, this.correct + 15),
                randint(this.correct + 1, this.correct + 15),
                randint(this.correct - 15, this.correct - 1)
            ];

            this.mass = [...new Set(this.mass)];
            while (this.mass.length < 5) {
                this.mass.push(randint(this.correct - 15, this.correct + 15));
            }

            shuffle(this.mass);
        }

        display() {
            if (!question1 || answer.length === 0) {
                console.error('Question or answers not found in the DOM');
                return;
            }
            
            question1.innerHTML = this.question;
            for (let i = 0; i < answer.length; i++) {
                answer[i].innerHTML = this.mass[i];
                answer[i].style.background = '#FFFFFF'; // Reset background color
            }
        }
    }

    let counterRel = 0;
    let right = 0;
    let current_question = new Answer();
    current_question.display();

    start_btn.addEventListener('click', function () {
        container_start.style.display = 'none';
        container_main.style.display = 'flex';
        counterRel = 0;
        right = 0;

        setTimeout(function () {
            let statistics = (right / counterRel) * 100 || 0; // Avoid NaN
            statistics = Math.round(statistics);
            h3class.innerHTML = `Вы ответили верно на ${right} из ${counterRel}, ваш процент правильных ответов: ${statistics}%`;
            container_start.style.display = 'flex';
            container_main.style.display = 'none';
        }, 10000);
    });

    for (let i = 0; i < answer.length; i++) {
        answer[i].addEventListener('click', function () {
            if (parseInt(answer[i].innerHTML) === current_question.correct) {
                console.log('Верно');
                right += 1;
                answer[i].style.background = '#00FF00';
            } else {
                console.log('Неверно');
                answer[i].style.background = '#FF0000';
            }

            counterRel += 1;
            current_question = new Answer();
            current_question.display();
        });
    }
});
