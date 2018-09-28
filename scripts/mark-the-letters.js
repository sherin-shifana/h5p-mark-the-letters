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
        var wrong = 0;
        var correct = 0;
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
                var $el = $('<div class="h5p-mark-the-words-descriptions"></div>');
                for (j = 0; j < correctAnswers.length; j++) {
                    if (el == correctAnswers[j]) {
                        $(this).attr("aria-describedby", "h5p-description-correct");
                        $(this).append('<div class="question-plus-one"></div>');
                        correct++;
                    }
                }
                for (j = 0; j < wrongAnswers.length; j++) {
                    if (el == wrongAnswers[j]) {
                        // console.log($(this).position(), $(this).height());
                        $(this).attr("aria-describedby", "h5p-description-incorrect");
                        wrong++;
                        $(this).append('<div class="question-minus-one"></div>');

                    }
                }
                return $el;
            });

            if (correct >= wrong) {
                var score = (correct - wrong);
            } else {
                score = 0;
            }
            // var $feedbackContainer = $('<div class=feedback-container></div>').appendTo($container);
            var $buttonContainer = $('<div class="button-container"></div>').appendTo($container);
            var ratio = (score / max);
            var feedback = H5P.Question.determineOverallFeedback(self.params.overallFeedback, ratio);
            feedback = feedback.charAt(0).toUpperCase() + feedback.substr(1).toLowerCase();
            feedback.replace('@score', score).replace('@total', max);
            var $feedbackDialog = $('' +
                '<div class="h5p-feedback-dialog">' +
                '<div class="h5p-feedback-inner">' +
                '<div class="h5p-feedback-text" aria-hidden="true">' + feedback + '</div>' +
                '</div>' +
                '</div><br />').appendTo($buttonContainer);

            self.setFeedback(feedback, score, max, self.params.scoreBarLabel);
            self.$progressBar = UI.createScoreBar(max, self.params.scoreBarLabel);
            self.$progressBar.setScore(score);
            self.$progressBar.appendTo($buttonContainer);

            self.$retry = UI.createButton({
                title: 'Retry Button',
                'text': self.params.tryAgainButton,
                'class': 'retry h5p-question-try-again h5p-joubelui-button',
                click: function() {
                    $container.empty();
                    score = 0;
                    wrong = 0;
                    correct = 0;
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
                                if (!$(this).attr("aria-describedby")) {
                                    $(this).attr("aria-describedby", "h5p-description-missed");
                                }
                            }
                        }
                    });
                },
            });

            if (clickedLetters.length > 0) {
                if (correctAnswers.length === 0) {
                    console.log("incorrect");
                    self.$retry.appendTo($buttonContainer);
                    self.$showSolution.appendTo($buttonContainer);
                }
                if (wrongAnswers.length === 0) {
                    console.log("correct");
                    if (correctAnswers.length != index.length) {
                        self.$retry.appendTo($buttonContainer);
                        self.$showSolution.appendTo($buttonContainer);
                    }
                }
                if (correctAnswers.length > 0 && wrongAnswers.length > 0) {
                    console.log("mixed");
                    if (correctAnswers.length == index.length) {
                        self.$retry.appendTo($buttonContainer);
                    } else {
                        self.$retry.appendTo($buttonContainer);
                        self.$showSolution.appendTo($buttonContainer);
                    }
                }
            } else {
                self.$retry.appendTo($buttonContainer);
                self.$showSolution.appendTo($buttonContainer);
            }
        }

        self.attach = function($container) {
            $container.addClass("h5p-mark-the-letters");

            $container.append('<div class="task-description">'+( self.params.question) + '</div>');
            var answer = self.params.solution;
            if (self.params.addSolution == "false") {
                input = [];
                index = [];
                input = str.match(/(\*.\*)/g);
                str = str.replace(/\*\*/g, '*');
                str = str.replace(/(\*)/g, "");
                for (i = 0; i < input.length; i++) {
                    input[i] = input[i].replace(/(\*)/g, "");
                    // index.push(str.indexOf(input[i]));
                    var res = str.split(answer[i]);
                    var a = res.join("*" + answer[i] + "*");
                    str = a;
                }

            } else {
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

                var $current = $("li").first().attr("tabindex", 0);

                if (str.charCodeAt(i) !== 32) {
                    if (str.charCodeAt(i) !== 44) {
                        if (str.charCodeAt(i) !== 46) {
                            $li.addClass("new-li");
                        }
                    }
                }
                else {
                  $li.addClass("special-char");

                }
                $li.find("special-char").off("click");
                var clkCount = 0;
                var keyCount = 0;
                $li.click(function() {
                        clkCount++;
                        $(this).attr("role","option");
                        if(!$(this).hasClass("special-char")){
                          $(this).toggleClass("div-alpha");
                          $(this).removeClass("new-li");
                          var x = $(this).data('id');
                          if($(this).hasClass("div-alpha")){
                            clickedLetters.push(x);
                            for (k = 0; k < index.length; k++) {
                                if (index[k] === x) {
                                    flag = 1;
                                    correctAnswers.push(x);
                                }
                            }
                            wrongAnswers = $.grep(clickedLetters, function(value) {
                                return $.inArray(value, correctAnswers) < 0;
                            });
                          }
                        }
                    })
                    .keydown(function(event) {
                      if($(this).hasClass("special-char")){
                        $(this).attr("tabindex",-1);
                      }
                        switch (event.which) {
                            case 13: // Enter
                            case 32: // Space;
                              // keyCount++;
                              if (!$(this).hasClass("special-char")) {
                                  $(this).toggleClass("div-alpha");
                                  $(this).removeClass("new-li");
                                  var x = $(this).data('id');
                                  if($(this).hasClass("div-alpha")){
                                    clickedLetters.push(x);
                                    for (k = 0; k < index.length; k++) {
                                        if (index[k] === x) {
                                            flag = 1;
                                            correctAnswers.push(x);
                                        }
                                    }
                                    wrongAnswers = $.grep(clickedLetters, function(value) {
                                        return $.inArray(value, correctAnswers) < 0;
                                    });
                                  }
                                }
                                break;
                            case 37: // Left Arrow
                            case 38: // Up Arrow
                                // Go to previous dot
                                $(this).attr('tabindex', '-1');
                                $current = $(this).prev();
                                $current.attr('tabindex', 0).focus();
                                console.log($current);
                                break;

                            case 39: // Right Arrow
                            case 40: // Down Arrow
                                // Go to next dot
                                $(this).attr('tabindex', '-1');
                                $current = $(this).next();
                                $current.attr('tabindex', 0).focus();
                                console.log($current);
                                break;
                        }
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
                    $("li").attr("disabled", true);
                    $("li").removeAttr('class');
                    $("li").off("click");
                    $("li").attr("tabindex","-1");
                    checkAnswer($container, $ul, $li, correctAnswers, wrongAnswers, clickedLetters, $checkButtonContainer, index);
                },
            }).appendTo($checkButtonContainer);
        }
        self.trigger('resize');
    }
    MarkTheLetters.prototype = Object.create(H5P.EventDispatcher.prototype);
    MarkTheLetters.prototype.constructor = MarkTheLetters;
    return MarkTheLetters;

})(H5P.jQuery, H5P.Question, H5P.JoubelUI);
