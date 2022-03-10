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
