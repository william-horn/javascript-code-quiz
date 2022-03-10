/*
? @document-start
===========================
| MAIN QUIZ PROGRAM LOGIC |
==================================================================================================================================

? @author:                 William J. Horn
? @document-name:          main.js
? @document-created:       03/04/2022
? @document-modified:      03/10/2022
? @document-version:       v1.0.0

==================================================================================================================================

? @document-info
==================
| ABOUT DOCUMENT |
==================================================================================================================================

Code Quiz

This program is responsible for handling the main logic of the code quiz.

==================================================================================================================================

? @document-todo
=================
| DOCUMENT TODO |
==================================================================================================================================

-   Sort highscores from highest to lowest
-   Change questions to coding questions - DONE
-   Look over libraries for any major bugs - DONE
-   Add button functionality to highscores section and nav bar - DONE

==================================================================================================================================
*/

/* ----------------------- */
/* Import Custom Libraries */
/* ----------------------- */

import gutil from "../../libs/gutil.js";
import eutil from "../../libs/eutil.js";
import { QuizBuilder, Question } from "../../libs/quizbuilder.js";

// enable debug features like prefixed print messages
gutil.enableDebugMode();

/* --------------------- */
/* Get Document Elements */
/* --------------------- */

const $startQuizButton = document.querySelector("#start-quiz-button");
const $introScreen = document.querySelector("#intro-screen");
const $questionScreen = document.querySelector("#question-screen");
const $infoBar = document.querySelector("#top-bar-info");
const $timerDisplay = $infoBar.querySelector("p"); // timer display element
const $answerButtonContainer = $questionScreen.querySelector("ul");
const $finishScreen = document.querySelector("#finish-screen");
const $main = document.querySelector("main");
const $questionFeedback = document.querySelector("#question-feedback");
const $scoreEntryContainer = document.querySelector("#score-entry");
const $submitScoreButton = $scoreEntryContainer.querySelector("button");
const $initialsTextField = $scoreEntryContainer.querySelector("input");
const $highscoresScreen = document.querySelector("#highscores-screen");
const $viewHighscoresButton = $infoBar.querySelector("button");

// current/previous visible window
let $currentWindow = $introScreen;
let $prevWindow = $introScreen;


/* ------------------------------ */
/* Create Main QuizBuilder Object */
/* ------------------------------ */

// main quiz interface
const quiz = new QuizBuilder();

// start adding questions
quiz.addQuestion(
    new Question("Which of the following is an example of an array?")
        .setRightAnswer("var array = []")
        .setChoices("var array = {}", "var array = ()", "var array = <>")
);

quiz.addQuestion(
    new Question("Which DOM method is used to create a new HTML element?")
        .setRightAnswer("document.createElement()")
        .setChoices("document.newElement()", "document.element()", "document.spawnElement()")
);

quiz.addQuestion(
    new Question("True or False: Functions can be passed as arguments to other functions.")
        .setRightAnswer("true")
        .setChoices("false")
);

quiz.addQuestion(
    new Question("Which operator is used to represent AND statements?")
        .setRightAnswer("&&")
        .setChoices("||", "+", "&")
);

quiz.addQuestion(
    new Question("True or False: jQuery is a different language from JavaScript.")
        .setRightAnswer("false")
        .setChoices("true")
);

quiz.addQuestion(
    new Question("Which of the following is an example of a valid variable assignment?")
        .setRightAnswer("All Choices.")
        .setChoices("const x = \"string\";", "let y = 10;", "var z = [];")
);

quiz.addQuestion(
    new Question("Which operator will compare if two literals are the exact same?")
        .setRightAnswer("===")
        .setChoices("==", "*=", "!=")
);


/* ------------------- */
/* Dedicated Functions */
/* ------------------- */

// update timer element to current time
// this function can also be used as a callback to the 'startTimer()` method of 'quiz'
function updateQuizTimer(time) {
    $timerDisplay.textContent = "Time Left: " + time;
}

// switch between current and previous screens
function switchScreen($newScreen) {
    if ($newScreen === $currentWindow) return;
    eutil.hideElement($currentWindow);
    $prevWindow = $currentWindow;
    eutil.showElement($newScreen);
    $currentWindow = $newScreen;

    // if the quiz has started 
    if (quiz.currentQuestionIndex > 0) {
        eutil.showElement($main);
    } else {
        eutil.hideElement($main, true);
    }
}

// handle procedurally generated questions and display them on screen
function generateNextQuestion() {
    eutil.clearChildrenOnElement($answerButtonContainer); // remove old answer buttons
    eutil.hideElement($questionFeedback);       // hide question feedback footer

    const question = quiz.getNextQuestion();    // get next question from quiz builder
    if (!question) return;                      // if no next question exists, exit function with null

    // randomize answer choices inside of question object
    const answerChoices = question.getRandomChoices();

    // get question title from HTML and update it's content
    const $questionTitle = $questionScreen.querySelector("h2");
    const $questionFeedbackTitle = $questionFeedback.querySelector("p");

    // generate question title subtexts
    eutil.generateDynamicText($questionTitle, [
        {content: "Q." + quiz.currentQuestionIndex + ") "},
        {content: question.title}
    ]);

    // !! Generate answer buttons !!
    answerChoices.forEach((choice) => {
        // create <li> and <button> elements
        const $li = document.createElement("li");
        const $button = document.createElement("button");

        // set the answer button text to the given choice
        $button.textContent = choice;

        // parent the <button> and <li> elements
        $li.appendChild($button);
        $answerButtonContainer.appendChild($li);

        // lock the button heights
        $li.style.minHeight = $li.clientHeight + "px";
        $button.style.minHeight = $li.style.minHeight;

        // store a reference to the <button> and corresponding choice text inside the question object
        question.setButtonForChoice($button, choice)
    });

    // !! Question answered event !!
    question.onAnswerStateChanged.connect("onAnswer", (input, state) => {
        gutil.debugPrint("answer selected (answer state: " + state + ") answer:", input);
        question.onAnswerStateChanged.disconnect("onAnswer");

        let correctColor = "#88dc8a";
        let incorrectColor = "#bb2f2f";

        for (let [button, choice] of question.buttons) {
            if (choice === input) {
                button.parentElement.style.width = "60%"; // lock width of selected answer at 60%

                // handle when answer is correct
                if (state === "correct") {
                    $questionFeedbackTitle.style.color = correctColor;
                    $questionFeedbackTitle.textContent = "Correct!";
                } else {
                    // handle when answer is wrong
                    button.style.backgroundColor = incorrectColor;
                    $questionFeedbackTitle.style.color = incorrectColor;
                    $questionFeedbackTitle.textContent = "Incorrect";
                    quiz.subtractTime(5);
                    updateQuizTimer(quiz.getTimeLeft());
                }
            }

            // highlight correct answer
            if (choice === question.rightAnswer) {
                button.style.backgroundColor = "#39912b";
            }
        }

        eutil.showElement($questionFeedback);
        setTimeout(generateNextQuestion, 2000);
    });
}
