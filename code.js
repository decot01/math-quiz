document.addEventListener('DOMContentLoaded', () => {
    // === DOM ЭЛЕМЕНТЫ ===
    const themeDiv = document.querySelector('.theme');
    const themeImage = themeDiv.querySelector('img');
    const langDiv = document.querySelector('.lang');
    const langImage = langDiv.querySelector('img');

    const h3class = document.querySelector('.h3class');
    const nameText = document.querySelector('.name');
    const timerInput = document.querySelector('.timer-input'); // Убедитесь, что ваш input имеет класс "timer-input"

    const startButton = document.querySelector('.start-btn');

    const question1 = document.querySelector('.qest');
    const answerElements = document.querySelectorAll('.answer');

    const container_start = document.querySelector('.container.start');
    const container_main = document.querySelector('.container.main');

    let quizTimerId;        // ID для таймера викторины (для setTimeout)
    let countdownIntervalId; // ID для интервала обратного отсчета (для setInterval)
    let quizDurationSeconds = 60; // Длительность викторины в секундах по умолчанию (1 минута)
    let timeLeftSeconds;    // Оставшееся время в секундах

    // === ЛОКАЛИЗАЦИЯ ===
    const localization = {
        en: {
            title: 'Math test by⠀<span class="author">Decot</span>',
            placeholder: '1:00',
            startButton: 'Start Test',
            langIcon: 'assets/ru.svg',
            langAlt: 'Russian Language',
            perfect: 'Perfect!',
            impressive: 'Impressive!',
            notBad: 'Not bad!',
            roomTogrow: 'Room to grow!',
            tryAgain: 'Try again!',
            resultsMessage: (right, total, percentage, phrase) => { // Убран textColor
                const incorrect = total - right;
                const rightColor = `<span style="color: #59B200;">${right}</span>`;
                const incorrectColor = `<span style="color: #FF3344;">${incorrect}</span>`;
                const percentageColor = (percentage < 50) ? '#FF3344' : 'inherit'; // Процент красный если < 50%
                return `<p>${phrase}</p>
                <p>You answered correctly on ${rightColor} out of ${total},</p>
                <p>your percentage of correct answers: <span style="color: ${percentageColor};">${percentage}%</span></p>`;
            }
        },
        ru: {
            title: 'Математический тест от⠀<span class="author">Decot</span>',
            placeholder: '1:00',
            startButton: 'Начать тест',
            langIcon: 'assets/en.svg',
            langAlt: 'English Language',
            perfect: 'Идеально!',
            impressive: 'Впечатляюще!',
            notBad: 'Не плохо!',
            roomTogrow: 'Есть куда расти!',
            tryAgain: 'Попробуй еще раз!',
            resultsMessage: (right, total, percentage, phrase) => { // Убран textColor
                const incorrect = total - right;
                const rightColor = `<span style="color: #59B200;">${right}</span>`;
                const incorrectColor = `<span style="color: #FF3344;">${incorrect}</span>`;
                const percentageColor = (percentage < 50) ? '#FF3344' : 'inherit'; // Процент красный если < 50%
                return `<p>${phrase}</p>
                <p>Вы ответили верно на ${rightColor} из ${total},</p> 
                <p>ваш процент правильных ответов: <span style="color: ${percentageColor};">${percentage}%</span></p> `;
            }
        }
    };

    let currentLanguage = localStorage.getItem('language') || 'en';

    // === ФУНКЦИИ ФОРМАТИРОВАНИЯ ВРЕМЕНИ ===
    function formatTime(totalSeconds) {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    function parseTime(timeString) {
        if (!timeString || typeof timeString !== 'string') return null;
        const parts = timeString.split(':');
        if (parts.length === 2) {
            const minutes = parseInt(parts[0], 10);
            const seconds = parseInt(parts[1], 10);
            if (!isNaN(minutes) && !isNaN(seconds) && minutes >= 0 && seconds >= 0 && seconds < 60) {
                return minutes * 60 + seconds;
            }
        }
        return null;
    }

    // === ФУНКЦИЯ ДЛЯ ПОЛУЧЕНИЯ ФРАЗЫ ПО ПРОЦЕНТУ ===
    const getResultPhrase = (percentage) => {
        const langData = localization[currentLanguage];
        if (percentage === 100) return langData.perfect;
        if (percentage >= 70) return langData.impressive;
        if (percentage >= 50) return langData.notBad;
        if (percentage >= 30) return langData.roomTogrow;
        return langData.tryAgain;
    };


    // === ФУНКЦИИ УПРАВЛЕНИЯ СТИЛЯМИ ===
    let dynamicStyleElement = document.getElementById('dynamic-styles');
    let startBtnStyleElement = document.getElementById('start-btn-style');

    const updateOrCreateDynamicStyles = () => {
        if (!dynamicStyleElement) {
            dynamicStyleElement = document.createElement('style');
            dynamicStyleElement.id = 'dynamic-styles';
            document.head.append(dynamicStyleElement);
        }
        // Убраны классы .h3class.success и .h3class.fail
        dynamicStyleElement.textContent = `
          .start-btn {
            width: auto;
            min-width: 214px;
            padding-left: 20px;
            padding-right: 20px;
          }
        `;

        if (!startBtnStyleElement) {
            startBtnStyleElement = document.createElement('style');
            startBtnStyleElement.id = 'start-btn-style';
            document.head.append(startBtnStyleElement);
        }
        startBtnStyleElement.textContent = `.start-btn:before { content: "${localization[currentLanguage].startButton}"; }`;
    };

    // === ФУНКЦИИ ОБНОВЛЕНИЯ КОНТЕНТА ===
    const updateLanguageContent = () => {
        const langData = localization[currentLanguage];

        if (nameText) nameText.innerHTML = langData.title;
        
        if (timerInput) {
            const currentInputValue = timerInput.value;
            const parsedCurrentValue = parseTime(currentInputValue);
            if (parsedCurrentValue === null || parsedCurrentValue === 0) {
                 timerInput.value = formatTime(quizDurationSeconds);
            }
        }
        if (startBtnStyleElement) {
             startBtnStyleElement.textContent = `.start-btn:before { content: "${langData.startButton}"; }`;
        }

        if (langImage) {
            langImage.src = langData.langIcon;
            langImage.alt = langData.langAlt;
        }
    };

    // === ФУНКЦИИ СМЕНЫ ТЕМЫ ===
    let isDarkTheme = true;

    const setLightTheme = () => {
      document.documentElement.style.setProperty('--background-color', '#dedede');
      document.documentElement.style.setProperty('--text-color', '#1A1A1A');
      document.documentElement.style.setProperty('--primary-color', '#1A1A1A');
      document.documentElement.style.setProperty('--input-background', '#232323');
      themeImage.src = 'assets/blackTheme.svg';
      themeImage.alt = 'Light Theme';
      isDarkTheme = false;
      document.body.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    };

    const setDarkTheme = () => {
      document.documentElement.style.setProperty('--background-color', '#1A1A1A');
      document.documentElement.style.setProperty('--text-color', '#191919');
      document.documentElement.style.setProperty('--primary-color', '#E6E6E6');
      document.documentElement.style.setProperty('--input-background', '#dedede');
      themeImage.src = 'assets/whiteTheme.svg';
      themeImage.alt = 'Dark Theme';
      isDarkTheme = true;
      document.body.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    };

    // === ИНИЦИАЛИЗАЦИЯ ТЕМЫ И ЯЗЫКА ПРИ ЗАГРУЗКЕ ===
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        setLightTheme();
    } else {
        setDarkTheme();
    }
    updateOrCreateDynamicStyles(); // Создаем/обновляем стили при загрузке
    updateLanguageContent();

    // === ОБРАБОТЧИКИ СОБЫТИЙ ДЛЯ ТЕМЫ/ЯЗЫКА ===
    themeDiv.addEventListener('click', () => {
      if (isDarkTheme) {
        setLightTheme();
      } else {
        setDarkTheme();
      }
      updateLanguageContent();
    });

    langDiv.addEventListener('click', () => {
        currentLanguage = currentLanguage === 'en' ? 'ru' : 'en';
        localStorage.setItem('language', currentLanguage);
        updateOrCreateDynamicStyles(); // Обновит текст кнопки "Start" и другие стили
        updateLanguageContent();
    });

    // === ОБРАБОТЧИК ДЛЯ ВВОДА ТАЙМЕРА ===
    if (timerInput) {
        timerInput.value = formatTime(quizDurationSeconds);

        timerInput.addEventListener('input', (event) => {
            let value = event.target.value.replace(/[^0-9:]/g, '');

            let minutes = 0;
            let seconds = 0;

            const parts = value.split(':');
            if (parts.length === 1) {
                if (value.length > 2) {
                    minutes = parseInt(value, 10) || 0;
                    seconds = 0;
                } else {
                    minutes = 0;
                    seconds = parseInt(value, 10) || 0;
                }
            } else if (parts.length >= 2) {
                minutes = parseInt(parts[0], 10) || 0;
                seconds = parseInt(parts[1], 10) || 0;
            }
            
            if (seconds >= 60) {
                minutes += Math.floor(seconds / 60);
                seconds = seconds % 60;
            }

            event.target.value = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            
            const parsedSeconds = parseTime(event.target.value);
            if (parsedSeconds !== null && parsedSeconds > 0) {
                quizDurationSeconds = parsedSeconds;
            } else {
                quizDurationSeconds = 1; 
            }
        });
        timerInput.addEventListener('blur', (event) => {
            const parsedSeconds = parseTime(event.target.value);
            if (parsedSeconds === null || parsedSeconds === 0) {
                event.target.value = formatTime(quizDurationSeconds);
            } else {
                event.target.value = formatTime(parsedSeconds);
            }
        });
    }


    // === ЛОГИКА ВИКТОРИНЫ ===
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
                do {
                    a = randint(1, 30);
                    b = randint(1, 30);
                } while (b === 0 || a % b !== 0);
                this.question = `${a} / ${b}`;
                this.correct = a / b;
            }

            this.mass = [this.correct];

            while (this.mass.length < 5) {
                let newAnswer = randint(this.correct - 15, this.correct + 15);
                if (!this.mass.includes(newAnswer)) {
                    this.mass.push(newAnswer);
                }
            }
            while (this.mass.length < 5) {
                let newAnswer = randint(this.correct - 30, this.correct + 30);
                if (!this.mass.includes(newAnswer)) {
                    this.mass.push(newAnswer);
                }
            }
            shuffle(this.mass);
        }

        display() {
            if (!question1 || answerElements.length === 0) {
                console.error('Question or answers not found in the DOM');
                return;
            }
            question1.innerHTML = this.question;
            for (let i = 0; i < answerElements.length; i++) {
                answerElements[i].innerHTML = this.mass[i];
                answerElements[i].style.background = '#E6E6E6';
            }
        }
    }

    let counterRel = 0;
    let right = 0;
    let current_question = new Answer();
    current_question.display();

    // === ЗАПУСК ВИКТОРИНЫ ===
    startButton.addEventListener('click', function () {
        if (quizTimerId) clearTimeout(quizTimerId);
        if (countdownIntervalId) clearInterval(countdownIntervalId);

        const userInputTime = parseTime(timerInput.value);
        if (userInputTime !== null && userInputTime > 0) {
            quizDurationSeconds = userInputTime;
        } else {
            timerInput.value = formatTime(quizDurationSeconds);
        }
        timeLeftSeconds = quizDurationSeconds;

        container_start.style.display = 'none';
        container_main.style.display = 'flex';
        h3class.style.display = 'none';
        counterRel = 0;
        right = 0;

        countdownIntervalId = setInterval(() => {
            timeLeftSeconds--;
            timerInput.value = formatTime(timeLeftSeconds);
            console.log(`Осталось времени: ${formatTime(timeLeftSeconds)}`);

            if (timeLeftSeconds <= 0) {
                clearInterval(countdownIntervalId);
                endQuiz();
            }
        }, 1000);

        quizTimerId = setTimeout(function () {
            endQuiz();
        }, quizDurationSeconds * 1000);

        function endQuiz() {
            if (quizTimerId) clearTimeout(quizTimerId);
            if (countdownIntervalId) clearInterval(countdownIntervalId);

            let statistics = (counterRel > 0) ? Math.round((right / counterRel) * 100) : 0;

            const phrase = getResultPhrase(statistics);
            // Определяем цвет для всего сообщения (теперь он не нужен в resultsMessage)
            // const textColor = (statistics >= 50) ? '#59B200' : '#FF3344';

            // Передаем только то, что нужно для формирования сообщения
            const message = localization[currentLanguage].resultsMessage(right, counterRel, statistics, phrase);

            h3class.innerHTML = message;
            h3class.style.display = 'flex';
            
            // Убираем классы success/fail, так как стилизация теперь происходит внутри HTML-строки message
            h3class.classList.remove('success', 'fail'); 
            // h3class.style.color = 'var(--primary-color)'; // Сбрасываем цвет на основной, если он был изменен

            container_start.style.display = 'flex';
            container_main.style.display = 'none';

            timerInput.value = formatTime(quizDurationSeconds);
            console.log('Тест завершен!');
        }
    });

    for (let i = 0; i < answerElements.length; i++) {
        answerElements[i].addEventListener('click', function () {
            if (parseInt(answerElements[i].innerHTML) === current_question.correct) {
                console.log('Верно');
                right += 1;
                answerElements[i].style.background = '#59B200';
            } else {
                console.log('Неверно');
                answerElements[i].style.background = '#FF3344';
            }
            counterRel += 1;
            setTimeout(() => {
                current_question = new Answer();
                current_question.display();
            }, 500);
        });
    }
});