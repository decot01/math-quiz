document.addEventListener('DOMContentLoaded', () => {
    const themeDiv = document.querySelector('.theme');
    const themeImage = document.querySelector('img');
    themeImage.id = 'theme-toggler-image';
    themeDiv.appendChild(themeImage);
  
    let isDarkTheme = true;
  
    const setLightTheme = () => {
      document.documentElement.style.setProperty('--background-color', '#dedede');
      document.documentElement.style.setProperty('--text-color', '#1A1A1A');
      document.documentElement.style.setProperty('--primary-color', '#1A1A1A');
      document.documentElement.style.setProperty('--input-background', '#232323');
      themeImage.src = '/assets/blackTheme.svg';
      themeImage.alt = 'Light Theme';
      isDarkTheme = false;
      document.body.setAttribute('data-theme', 'light');
    };

  
    const setDarkTheme = () => {
      document.documentElement.style.setProperty('--background-color', '#1A1A1A');
      document.documentElement.style.setProperty('--text-color', '#191919');
      document.documentElement.style.setProperty('--primary-color', '#E6E6E6');
      document.documentElement.style.setProperty('--input-background', '#dedede');
      themeImage.src = '/assets/whiteTheme.svg';
      themeImage.alt = 'Dark Theme';
      isDarkTheme = true;
      document.body.setAttribute('data-theme', 'dark');
    };
    
    themeDiv.addEventListener('click', () => {
      if (isDarkTheme) {
        setLightTheme();
      } else {
        setDarkTheme();
      }
    });
  
    // Add some basic styling for the image and smooth transition
    const style = document.createElement('style');
    style.textContent = `
      body {
        transition: background-color 0.5s ease, color 0.5s ease;
      }
      .theme {
        cursor: pointer;
        width: 75px;
        height: 75px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background-color 0.5s ease;
      }
      .theme img {
        width: 80%; /* Adjust image size within the div */
        height: 80%;
        object-fit: contain;
        transition: transform 0.3s ease;
      }
      .theme img:hover {
          transform: scale(1.1);
      }
    `;
    document.head.append(style);
  });

  const localization = {
      en: {
          title: 'Math test by⠀<span class="author">Decot</span>',
          placeholder: 'time: 1:00',
          startButton: 'Start Test',
          langIcon: 'assets/ru.svg', // Icon for switching to Russian (when currently English)
          langAlt: 'Russian Language' // Alt text for the Russian flag
      },
      ru: {
          title: 'Математический тест от⠀<span class="author">Decot</span>',
          placeholder: 'время: 1:00',
          startButton: 'Начать тест',
          langIcon: 'assets/en.svg', // Icon for switching to English (when currently Russian)
          langAlt: 'English Language' // Alt text for the English flag
      }
  };

  let currentLanguage = 'en'; // Start with English as the default




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
                b = randint(1, 30);
                this.question = `${a} / ${b}`;
                this.correct = Math.round(a / b);
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
                answer[i].style.background = '#E6E6E6';
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
        h3class.style.display = 'none';
        counterRel = 0;
        right = 0;

        setTimeout(function () {
            let statistics = (right / counterRel) * 100 || 0;
            statistics = Math.round(statistics);
            h3class.innerHTML = `Вы ответили верно на ${right} из ${counterRel}, ваш процент правильных ответов: ${statistics}%`;
            h3class.style.display = 'flex';
            container_start.style.display = 'flex';
            container_main.style.display = 'none';
        }, 10000);
    });

    for (let i = 0; i < answer.length; i++) {
        answer[i].addEventListener('click', function () {
            if (parseInt(answer[i].innerHTML) === current_question.correct) {
                console.log('Верно');
                right += 1;
                answer[i].style.background = '#59B200';
            } else {
                console.log('Неверно');
                answer[i].style.background = '#FF3344';
            }

            counterRel += 1;
            current_question = new Answer();
            current_question.display();
        });
    }
});
