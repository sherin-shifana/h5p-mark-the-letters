H5P.MarkTheLetters = (function($, Question, UI) {


    function MarkTheLetters(params, id) {
        //constructor

        var self = this;
        this.id = id;
        this.params = params;
        var str = self.params.textField;
        str = $(str).text();
        var str1 = str;
        var flag = 0;
        var nodeIndex;
        var clickedLetters = [];
        var correctAnswer = [];
        var wrongAnswer = [];
        var score = 0;
        var maxScore;
        var defaults = {
           image: null,
           question: "No question text provided",
           answers: [
             {
               tipsAndFeedback: {
                 tip: '',
                 chosenFeedback: '',
                 notChosenFeedback: ''
               },
               text: "Answer 1",
               correct: true
             }
           ],
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
        // var ans = [];
        var checkAnswer = function($container,$ul, $li, correctAnswer, wrongAnswer,clickedLetters,$checkButtonContainer,index) {
            // console.log(correctAnswer);
            // console.log(wrongAnswer);
            // console.log(clickedLetters);
            maxScore = index.length;
            $checkButtonContainer.hide();
            var dataList = $(".list li").map(function() {
                return $(this).data("id");
            }).get();

            $("li").each(function(el) {
                for (j = 0; j < correctAnswer.length; j++) {
                    if (el == correctAnswer[j]) {
                        $(this).attr("aria-describedby", "h5p-description-correct");
                        $(this).addClass("correct-position");
                        $(this).append('<div class="question-plus-one"></div>');
                        score++;

                        var qHeight= $(this).height();
                        var pos=$(this).position();
                        console.log(pos.top-qHeight );
                    }
                }
                for (j = 0; j < wrongAnswer.length; j++) {
                    if (el == wrongAnswer[j]) {
                        $(this).attr("aria-describedby", "h5p-description-incorrect");
                        $(this).addClass("incorrect-position");
                        $(this).append('<div class="question-minus-one"></div>');
                        var iTop=$(".incorrect-position").position();
                    }
                }
            });

            console.log(score);
            console.log(maxScore);


              self.$retry = UI.createButton({
                title: 'Retry Button',
                'text' : self.params.tryAgainButton,
                'class': 'retry h5p-question-try-again h5p-joubelui-button',
                click : function(){
                  $container.empty();
                  self.attach($container);
                },

              });
              var $showSolutionButtonContainer = $('<div class="retry-button-container" />');
              self.$showSolution = UI.createButton(
                {
                  title: 'Show Solution Button',
                  'text' : self.params.showSolutionButton,
                  'class': 'show-asolutionr h5p-question-show-solution h5p-joubelui-button',
                  click : function(){
                    $(".question-plus-one").hide();
                    $(".question-minus-one").hide();
                    $(this).hide();

                     $("li").each(function(el){
                       for(i=0;i<index.length;i++){
                         if($(this).attr("data-id")==index[i]){
                           $(this).addClass("div-alpha");
                         }
                       }
                     });
                  },
                });

            var $scoreLabel = $('<div></div>').appendTo($container);


            if(correctAnswer.length===0  && clickedLetters.length>0){
              console.log("incorrect");

              self.$retry.appendTo($container);
              self.$showSolution.appendTo($container);

            }

            if(wrongAnswer.length===0 && clickedLetters.length>0){
              console.log("correct");
              if(correctAnswer.length!=index.length){
                self.$retry.appendTo($container);
                self.$showSolution.appendTo($container);
              }
            }

            if( correctAnswer.length>0 && wrongAnswer.length >0){
              console.log("mixed");
              if(correctAnswer.length==index.length){
                self.$retry.appendTo($container);
              }
              else{
                self.$retry.appendTo($container);
                self.$showSolution.appendTo($container);
              }
            }
        }

        self.attach = function($container) {

            $container.append('<div class="task-description">' + self.params.question + '</div>');
            var str2 = str;
            var answer = self.params.solution;
            answer = answer.replace(/\,/g, "");
            var result = [];

            if ($(answer).val() !== null) {
                for (i = 0; i < answer.length; i++) {
                    var res = str.split(answer[i]);
                    var a = res.join("*" + answer[i] + "*");
                    str = a;
                }
            }

            var input = [];
            var correctInput = [];
            input = str.match(/(\*.\*)/g);
            str = str.replace(/\*\*/g, '*');
            console.log(str);
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
            var index = [];
            $.each(correctInput, function(i, el) {
                if ($.inArray(el, index) === -1) index.push(el);
            });

            console.log(input);
            console.log(index);
            var $ul = $('<ul class="list"></ul>').appendTo($container);
            for (i = 0; i < str.length; i++) {

                var node = str[i];
                nodeIndex = i;
                $(this).data('id', nodeIndex);

                // console.log(str.charCodeAt(i));
                var $li = $('<li id="li-class" data-id="' + nodeIndex + '">' + node + '</li>').appendTo($ul);
                if (str.charCodeAt(i) !== 32) {
                    if (str.charCodeAt(i) !== 44) {
                        if (str.charCodeAt(i) !== 46) {
                            $li.addClass("new-li");
                        }
                    }
                } else {
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
                            correctAnswer.push(x);
                            // $(this).attr("aria-label","correct");
                            // $(this).attr("aria-describedby","h5p-description-correct");
                            // $(this).a('<div class="h5p-question-plus-one"></div>');
                        }
                    }
                    wrongAnswer = $.grep(clickedLetters, function(value) {
                        return $.inArray(value, correctAnswer) < 0;
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
                    checkAnswer($container, $ul, $li, correctAnswer, wrongAnswer, clickedLetters, $checkButtonContainer,index);
                },
            }).appendTo($checkButtonContainer);
        }
    }
    return MarkTheLetters;
})(H5P.jQuery, H5P.Question, H5P.JoubelUI);
