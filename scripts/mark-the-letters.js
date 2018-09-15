H5P.MarkTheLetters = (function($, Question, UI) {


    function MarkTheLetters(params, id) {
        //constructor
        H5P.Question.call(this, 'mark-the-letters');

        var self = this;
        this.id = id;
        this.params = params;
        var str = self.params.textField;
        str = $(str).text();
        var str1 = str;
        var flag = 0;
        var nodeIndex;
        var clickedLetters = [];
        var correctAnswers = [];
        var wrongAnswers = [];
        var index = [];
        var input = [];
        var score = 0;
        var max;
        var defaults = {
            image: null,
            question: "No question text provided",
            answers: [{
                tipsAndFeedback: {
                    tip: '',
                    chosenFeedback: '',
                    notChosenFeedback: ''
                },
                text: "Answer 1",
                correct: true
            }],
            overallFeedback: [],
            weight: 1,
            userAnswers: [],
            UI: {
                checkAnswerButton: 'Check',
                showSolutionButton: 'Show solution',
                tryAgainButton: 'Try again',
                scoreBarLabel: 'You got :num out of :total points'
            }
        };

        var checkAnswer = function($container, $ul, $li, correctAnswers, wrongAnswers, clickedLetters, $checkButtonContainer, index) {
            max = index.length;
            $checkButtonContainer.hide();
            var top;
            $("li").each(function(el) {
                for (j = 0; j < correctAnswers.length; j++) {
                    top = 0;
                    if (el == correctAnswers[j]) {
                        $(this).attr("aria-describedby", "h5p-description-correct");
                        // $(this).append('<div class="question-plus-one"></div>');
                        score++;
                        // var qHeight = $(this).height();
                        // var pos = $(".question-plus-one").position();
                        // var cHeight = $(".question-plus-one").height();
                        // console.log(qHeight);
                        // console.log(pos);
                        // top = pos.top;
                        // top = top - cHeight - qHeight;
                        // $(".question-plus-one").css('top', (top));
                        // console.log(top);
                    }
                }
                for (j = 0; j < wrongAnswers.length; j++) {
                    if (el == wrongAnswers[j]) {
                        $(this).attr("aria-describedby", "h5p-description-incorrect");
                        // $(this).append('<div class="question-minus-one"></div>');
                        // qHeight = $(this).height();
                        // pos = $(".question-minus-one").position();
                        // cHeight = $(".question-minus-one").height();
                        // console.log(qHeight);
                        // console.log(pos);
                        // $(".question-minus-one").css('top', (pos.top - qHeight - cHeight));

                    }
                }
            });

            var $feedbackContainer = $('<div class=feedback-container></div>').appendTo($container);
            var ratio = (score / max);
            var feedback = H5P.Question.determineOverallFeedback(self.params.overallFeedback, ratio);
            feedback.replace('@score', score).replace('@total', max);
            var $feedbackDialog = $('' +
                '<div class="h5p-feedback-dialog">' +
                '<div class="h5p-feedback-inner">' +
                '<div class="h5p-feedback-text" aria-hidden="true">' + feedback + '</div>' +
                '</div>' +
                '</div><br />').appendTo($feedbackContainer);

            self.setFeedback(feedback, score, max, self.params.scoreBarLabel);
            self.$progressBar = UI.createScoreBar(max, 'scoreBarLabel');
            self.$progressBar.setScore(score);
            self.$progressBar.appendTo($feedbackDialog);

            self.$retry = UI.createButton({
                title: 'Retry Button',
                'text': self.params.tryAgainButton,
                'class': 'retry h5p-question-try-again h5p-joubelui-button',
                click: function() {
                    $container.empty();
                    clickedLetters.length = 0;
                    wrongAnswers.length = 0;
                    correctAnswers.length = 0;
                    self.attach($container);
                },
            });
            self.$showSolution = UI.createButton({
                title: 'Show Solution Button',
                'text': self.params.showSolutionButton,
                'class': 'show-solution h5p-question-show-solution h5p-joubelui-button',
                click: function() {
                    $(".question-plus-one").hide();
                    $(".question-minus-one").hide();
                    $(this).hide();
                    $("li").each(function(el) {
                        for (i = 0; i < index.length; i++) {
                            if ($(this).attr("data-id") == index[i]) {
                                $(this).attr("aria-describedby","h5p-description-missed");
                            }
                        }
                    });
                },
            });

            if (clickedLetters.length > 0) {
                if (correctAnswers.length === 0) {
                    console.log("incorrect");
                    self.$retry.appendTo($container);
                    self.$showSolution.appendTo($container);
                }
                if (wrongAnswers.length === 0) {
                    console.log("correct");
                    if (correctAnswers.length != index.length) {
                        self.$retry.appendTo($container);
                        self.$showSolution.appendTo($container);
                    }
                }
                if (correctAnswers.length > 0 && wrongAnswers.length > 0) {
                    console.log("mixed");
                    if (correctAnswers.length == index.length) {
                        self.$retry.appendTo($container);
                    } else {
                        self.$retry.appendTo($container);
                        self.$showSolution.appendTo($container);
                    }
                }
            }
            else {
                self.$retry.appendTo($container);
                self.$showSolution.appendTo($container);
            }
        }

        self.attach = function($container) {

            $container.append('<div class="task-description">' + self.params.question + '</div>');
            var answer = self.params.solution;
            if (self.params.addSolution == "false") {
                input = [];
                index = [];
                input = str.match(/(\*.\*)/g);
                str = str.replace(/\*\*/g, '*');
                str = str.replace(/(\*)/g, "");
                for (i = 0; i < input.length; i++) {
                    input[i] = input[i].replace(/(\*)/g, "");
                    index.push(str.indexOf(input[i]));
                }
            }
            else {
                answer = answer.replace(/\,/g, "");
                str = str.replace(/\*\*/g, '*');
                str = str.replace(/(\*)/g, "");
                if ($(answer).val() !== null) {
                    for (i = 0; i < answer.length; i++) {
                        var res = str.split(answer[i]);
                        var a = res.join("*" + answer[i] + "*");
                        str = a;
                    }
                }

                input = [];
                var correctInput = [];
                input = str.match(/(\*.\*)/g);
                str = str.replace(/\*\*/g, '*');
                str = str.replace(/(\*)/g, "");

                for (i = 0; i < input.length; i++) {
                    input[i] = input[i].replace(/(\*)/g, "");
                }
                for (i = 0; i < str.length; i++) {
                    for (j = 0; j < input.length; j++) {
                        if (str[i] === input[j]) {
                            correctInput.push(i);
                        }
                    }
                }

                index = [];
                $.each(correctInput, function(i, el) {
                    if ($.inArray(el, index) === -1) index.push(el);
                });
            }

            console.log(input);
            console.log(index);
            var $ul = $('<ul class="list"></ul>').appendTo($container);
            for (i = 0; i < str.length; i++) {

                var node = str[i];
                nodeIndex = i;
                $(this).data('id', nodeIndex);
                var $li = $('<li id="li-class" data-id="' + nodeIndex + '">' + node + '</li>').appendTo($ul);
                if (str.charCodeAt(i) !== 32) {
                    if (str.charCodeAt(i) !== 44) {
                        if (str.charCodeAt(i) !== 46) {
                            $li.addClass("new-li");
                        }
                    }
                }
                else {
                    $li.removeClass("new-li");
                }

                $li.click(function() {

                    $(this).addClass("div-alpha");
                    $(this).removeClass("new-li");

                    var x = $(this).data('id');
                    clickedLetters.push(x);

                    console.log(x);
                    for (k = 0; k < index.length; k++) {
                        if (index[k] === x) {
                            flag = 1;
                            correctAnswers.push(x);

                        }
                    }
                    wrongAnswers = $.grep(clickedLetters, function(value) {
                        return $.inArray(value, correctAnswers) < 0;
                    });
                });
            }

            console.log(answer);


            var $checkButtonContainer = $('<div class="button-container" />').appendTo($container);
            self.$checkAnswer = UI.createButton({
                title: 'Button',
                'class': 'check-answer h5p-question-check-answer h5p-joubelui-button',
                'text': self.params.checkAnswerButton,
                click: function() {
                    $(this).attr("disabled", true);
                    $("li").attr('disabled', true);
                    $("li").removeAttr('class');
                    $("li").off("click");
                    checkAnswer($container, $ul, $li, correctAnswers, wrongAnswers, clickedLetters, $checkButtonContainer, index);
                },
            }).appendTo($checkButtonContainer);
        }
    }
    return MarkTheLetters;

})(H5P.jQuery, H5P.Question, H5P.JoubelUI);
