/*global H5P*/

/**
 * Mark The Letters module
 * @external {jQuery} $ H5P.jQuery
 * @external {UI} UI H5P.JoubelUI
 */
H5P.MarkTheLetters = (function ($, Question, UI, Letter, XapiGenerator) {
  /**
   * Initialize module.
   *
   * @class H5P.MarkTheLetters
   * @param {Object} params Behavior settings
   * @param {Number} contentId Content identification
   *
   * @returns {Object} MarkTheLetters Mark the letters instance
   */

  function MarkTheLetters(params, contentId, contentData) {
    //constructor
    this.params = params;
    this.contentId = contentId;
    this.contentData = contentData;
    this.introductionId = 'mark-the-letters-introduction-' + contentId;
    Question.call(this, 'mark-the-letters');
    this.$inner = $('<div class="h5p-letter-inner"></div>');
    this.addTaskTo(this.$inner);
    this.XapiGenerator = new MarkTheLetters.XapiGenerator(this);
  }

  MarkTheLetters.prototype.constructor = MarkTheLetters;

  /**
   * Recursive function that creates html for the letters
   * @method
   * @param  {Array}           nodes Array of dom nodes
   * @return {string}
   */
  MarkTheLetters.prototype.createHtmlForLetters = function (nodes) {
    var html = '';
    for (let i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      var text = $(node).text();
      var selectableStrings = text.match(/[.,/;'` ]|[a-zA-Z]|(\*[a-zA-Z]\*)|/g);

      if (selectableStrings) {
        selectableStrings.forEach(function (entry) {

          entry = entry.trim();

          /**
           * Add span to all entries except special characters.
           */

          if (entry !== "." && entry !== "," && entry !== "'" ) {
            // letter
            if (entry.length) {
              html += '<span role="option">' + entry + '</span>';
            }

            // Add space after every letter.
            else if ($(html).text()) {
              html += ' ';
            }
          }
          else {
            html += entry;
          }

        });
      }
      else if ((selectableStrings !== null) && text.length) {
        html += '<span role="option">' + text + '</span>';
      }
    }

    return html;
  };

  /**
   * Handle task and add it to container.
   * @param {jQuery} $container The object which our task will attach to.
   */
  MarkTheLetters.prototype.addTaskTo = function ($container) {
    $container.addClass("h5p-mark-the-letters");
    var that = this;
    // Task description
    that.selectableLetters = [];
    that.answers = 0;

    // Wrapper
    var $letterContainer = $('<div/>', {
      'class': 'h5p-letter-selectable-letters',
      'aria-labelledby': that.introductionId,
      'aria-multiselect': true,
      'role': 'listbox',
      html: that.createHtmlForLetters($.parseHTML(that.params.textField))
    });

    $letterContainer.find('[role="option"]').each(function () {
      /**
       * Initialize the letter to be used in the task
       */
      var selectableLetter = new MarkTheLetters.Letter($(this), that.params.addSolution, that.params.solution);

      if (selectableLetter.isAnswer()) {
        that.answers += 1;
      }
      that.selectableLetters.push(selectableLetter);
      /**
       * Set tabindex of first element to 0.
       */
      var $current = $letterContainer.find('[role="option"]').first().attr("tabindex", 0);
      var clkCount = 0;

      // on letter clicked
      $(this).click(function () {
        clkCount++;
        that.onClickSelectables(selectableLetter, clkCount);
        that.triggerXAPI('interacted');
      })
        .keydown(function (event) {
          switch (event.which) {
            case 13: // Enter
            case 32: // Space

              clkCount++;
              that.onClickSelectables(selectableLetter, clkCount);
              that.triggerXAPI('interacted');
              break;

            case 37: // Left Arrow
            case 38: // Up Arrow
              // Go to previous dot
              $(this).attr('tabindex', '-1');
              if ($(this).prev().index() != -1) {
                $current = $(this).prev();
              }
              else {
                $current = $letterContainer.find('[role="option"]').last();
              }
              $current.attr('tabindex', 0).focus();
              break;

            case 39: // Right Arrow
            case 40: // Down Arrow
              // Go to next dot
              $(this).attr('tabindex', '-1');
              if ($(this).next().index() !== -1) {
                $current = $(this).next();
              }
              else {
                $current = $letterContainer.find('[role="option"]').first();
              }
              $current.attr('tabindex', 0).focus();
              break;
          }
        });
    });


    /**
     * Attach dom elements to the container.
     */
    $letterContainer.appendTo($container);
    that.$letterContainer = $letterContainer;
    /**
     * Resize event
     *
     * @event MarkTheLetters#resize
     */
    this.trigger('resize');
  };

  // When letter clicked
  MarkTheLetters.prototype.onClickSelectables = function (selectableLetter, clkCount) {
    if (clkCount % 2 !== 0) {
      selectableLetter.setSelected();
    }
    else {
      selectableLetter.isSelected() ? selectableLetter.unsetSelected() : selectableLetter.setSelected();
    }
  };

  /**
   * Add check answer, show solution, and retry buttons.
   */
  MarkTheLetters.prototype.addButtons = function () {
    var that = this;
    that.$buttonContainer = $('<div/>', {
      'class': 'h5p-button-bar'
    });


    this.addButton('check-answer', that.params.checkAnswerButton, function () {
      that.isAnswered = true;
      that.$letterContainer.find('[role="option"]').unbind('click');
      var answers = that.calculateScore();
      that.feedbackSelectedLetters();

      if (!that.showEvaluation(answers)) {
        // Only show if a correct answer was not found.
        if (that.params.behaviour.enableSolutionsButton && (answers.correct < that.answers)) {
          that.showButton('show-solution');
        }
        if (that.params.behaviour.enableRetry) {
          that.showButton('try-again');
        }
      }
      that.hideButton('check-answer');
      that.trigger(that.XapiGenerator.generateAnsweredEvent());
    });

    this.addButton('try-again', this.params.tryAgainButton, this.resetTask.bind(this), false);

    this.addButton('show-solution', this.params.showSolutionButton, function () {
      that.setAllMarks();
      if (that.params.behaviour.enableRetry) {
        that.showButton('try-again');
      }
      that.hideButton('check-answer');
      that.hideButton('show-solution');

      that.read(that.params.displaySolutionDescription);
    }, false);
  };

  /**
   * Clear the evaluation text.
   *
   * @fires MarkTheLetters#resize
   */
  MarkTheLetters.prototype.hideEvaluation = function () {
    this.removeFeedback();
    this.trigger('resize');
  };

  // When retry button is clicked
  MarkTheLetters.prototype.resetTask = function () {
    // Reset task
    const that = this;
    that.$letterContainer.find('[role="option"]').bind('click');
    this.isAnswered = false;
    this.clearAllMarks();
    this.hideEvaluation();
    this.hideButton('try-again');
    this.hideButton('show-solution');
    this.showButton('check-answer');
    /**
     * Resize event
     *
     * @event MarkTheLetters#resize
     */
    this.trigger('resize');
  };

  /**
   * Clear styling on marked letters.
   *
   * @fires MarkTheLetters#resize
   */
  MarkTheLetters.prototype.clearAllMarks = function () {
    this.selectableLetters.forEach(function (entry) {
      entry.markClear();
    });

    this.$letterContainer.removeClass('h5p-disable-hover');
    this.trigger('resize');
  };

  /**
   * Mark the selected letters as correct or wrong.
   *
   * @fires MarkTheLetters#resize
   */
  MarkTheLetters.prototype.feedbackSelectedLetters = function () {
    var scorePoints = new H5P.Question.ScorePoints();

    this.selectableLetters.forEach(function (entry) {
      if (entry.isSelected()) {
        entry.markCheck(scorePoints);
      }
    });

    this.$letterContainer.addClass('h5p-disable-hover');
    this.trigger('resize');
  };

  /**
   * Display the evaluation of the task, with proper markings.
   *
   * @fires MarkTheLetters#resize
   */
  MarkTheLetters.prototype.showEvaluation = function (answers) {
    this.hideEvaluation();
    this.score = answers.score;
    this.max = this.answers;
    //replace editor variables with values, uses regexp to replace all instances.
    var scoreText = H5P.Question.determineOverallFeedback(this.params.overallFeedback, this.score / this.max).replace(/@score/g, this.score.toString())
      .replace(/@total/g, this.max.toString())
      .replace(/@correct/g, answers.correct.toString())
      .replace(/@wrong/g, answers.wrong.toString())
      .replace(/@missed/g, answers.missed.toString());

    this.setFeedback(scoreText, this.score, this.max, this.params.scoreBarLabel);

    this.trigger('resize');
    return this.score === this.max;
  };

  /**
   * Calculate the score.
   *
   * @return {Answers}
   */
  MarkTheLetters.prototype.calculateScore = function () {
    var that = this;

    /**
     * @typedef {Object} Answers
     * @property {number} correct The number of correct answers
     * @property {number} wrong The number of wrong answers
     * @property {number} missed The number of answers the user missed
     * @property {number} score The calculated score
     */
    var initial = {
      correct: 0,
      wrong: 0,
      missed: 0,
      score: 0
    };

    // iterate over letters, and calculate score
    var answers = that.selectableLetters.reduce(function (result, letter) {
      if (letter.isCorrect()) {
        result.correct++;
      }
      else if (letter.isWrong()) {
        result.wrong++;
      }
      else if (letter.isMissed()) {
        result.missed++;
      }

      return result;
    }, initial);

    // no negative score
    answers.score = Math.max(answers.correct - answers.wrong, 0);

    return answers;
  };

  /**
   * Mark the letters as correct, wrong or missed.
   *
   * @fires MarkTheLetters#resize
   */
  MarkTheLetters.prototype.setAllMarks = function () {
    this.selectableLetters.forEach(function (entry) {
      entry.markCheck();
      entry.clearScorePoint();
    });

    /**
     * Resize event
     *
     * @event MarkTheLetters#resize
     */
    this.trigger('resize');
  };

  /**
   * Get Xapi Data.
   *
   * @return {Object}
   */
  MarkTheLetters.prototype.getXAPIData = function () {
    return {
      statement: this.XapiGenerator.generateAnsweredEvent().data.statement
    };
  };

  MarkTheLetters.prototype.registerDomElements = function () {
    // wrap introduction in div with id
    var introduction = '<div class= "h5p-task-description" id="' + this.introductionId + '">' + this.params.question + '</div>';

    // Register description
    this.setIntroduction(introduction);

    // Register content
    this.setContent(this.$inner, {
      'class': 'h5p-letter'
    });

    // Register buttons
    this.addButtons();
  };

  return MarkTheLetters;
})(H5P.jQuery, H5P.Question, H5P.JoubelUI, H5P.Letter, H5P.XapiGenerator);
