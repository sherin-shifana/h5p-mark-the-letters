/*global H5P*/

/**
 * Mark The Words module
 * @external {jQuery} $ H5P.jQuery
 * @external {UI} UI H5P.JoubelUI
 */
H5P.MarkTheLetters = (function ($, UI, Letter, XapiGenerator) {
  /**
   * Initialize module.
   *
   * @class H5P.MarkTheLetters
   * @param {Object} params Behavior settings
   * @param {Number} contentId Content identification
   *
   * @returns {Object} MarkTheLetters Mark the letters instance
   */

  function MarkTheLetters(params, contentId) {
    //constructor
    this.params = params;
    this.contentId = contentId;
    this.$inner = $('<div class="h5p-letter-inner"></div>');
    this.XapiGenerator = new MarkTheLetters.XapiGenerator(this);
  }

  MarkTheLetters.prototype = Object.create(H5P.EventDispatcher.prototype);
  MarkTheLetters.prototype.constructor = MarkTheLetters;

  /**
  * Recursive function that creates html for the letters
  * @method createHtmlForLetters
  * @param  {Array}           nodes Array of dom nodes
  * @return {string}
  */
  MarkTheLetters.prototype.createHtmlForLetters = function (nodes) {
    var html = '';
    for (let i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      var text = $(node).text();
      var selectableStrings = text.match(/[.,/;'`]|[a-zA-Z]|(\*[a-zA-Z]\*)|/g);

      if (selectableStrings) {
        selectableStrings.forEach(function (entry) {
          entry = entry.trim();

          /**
          * Add span to all entries except special characters.
          */
          if (entry !== "." && entry !== "," && entry !== "'") {

            // letter
            if (entry.length) {
              html += '<span role="option">' + entry + '</span>';
            }

            // Add space after every word.
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
  MarkTheLetters.prototype.attach = function ($container) {
    $container.addClass("h5p-mark-the-letters");
    var that = this;
    // Task description
    var $questionContainer = $('<div class="task-description">' + (that.params.question) + '</div>');
    $questionContainer.attr('tabindex',0);
    that.selectableLetters = [];
    that.answers = 0;

    // Wrapper
    var $letterContainer = $('<div/>', {
      'class': 'h5p-letter-selectable-letters',
      'aria-multiselect': true,
      'role': 'listbox',
      html: that.createHtmlForLetters($.parseHTML(that.params.textField))
    });

    $letterContainer.find('[role="option"]').each(function () {
      /**
      * Initialize the letter to be used in the task
      */
      var selectableLetter = new MarkTheLetters.Letter($(this), that.params.addSolution==='true', that.params.solution);

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
              $current = $(this).prev();
              $current.attr('tabindex', 0).focus();
              break;

            case 39: // Right Arrow
            case 40: // Down Arrow
              // Go to next dot
              $(this).attr('tabindex', '-1');
              $current = $(this).next();
              $current.attr('tabindex', 0).focus();
              break;
          }
        });
    });

    /**
    * Attach dom elements to the container.
    */
    $letterContainer.appendTo(that.$inner);
    $questionContainer.appendTo($container);
    that.$inner.appendTo($container);
    that.$letterContainer = $letterContainer;
    that.addButtons($container);
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
  MarkTheLetters.prototype.addButtons = function ($container) {
    var that = this;
    that.$buttonContainer = $('</br /><div/>', {
      'class': 'h5p-button-bar'
    });
    that.$feedbackContainer = $('<div/>', {
      'class': 'h5p-feedback-container'
    });
    // Check answer button
    that.$checkButton = UI.createButton({
      title: 'Button',
      'class': 'check-answer h5p-question-check-answer h5p-joubelui-button',
      'text': that.params.checkAnswerButton,
      click: function () {
        that.checkAnswer();
      },
    });

    // Retry button
    that.$retry = UI.createButton({
      title: 'Retry Button',
      'text': that.params.tryAgainButton,
      'class': 'retry h5p-question-try-again h5p-joubelui-button',
      click: function () {
        that.resetTask($container);
      },
    });

    // Show solution button
    that.$showSolution = UI.createButton({
      title: 'Show Solution Button',
      'text': that.params.showSolutionButton,
      'class': 'show-solution h5p-question-show-solution h5p-joubelui-button',
      click: function () {
        that.showSolutions();
      },
    });

    // Attach the buttons to the container
    that.$feedbackContainer.appendTo(that.$buttonContainer);
    that.$checkButton.appendTo(that.$buttonContainer);
    that.$retry.appendTo(that.$buttonContainer);
    that.$showSolution.appendTo(that.$buttonContainer);
    that.$retry.hide();
    that.$showSolution.hide();
    that.$buttonContainer.appendTo($container);
    /**
    * Resize event
    *
    * @event MarkTheLetters#resize
    */
    this.trigger('resize');
  };

  // When check answer button is clicked
  MarkTheLetters.prototype.checkAnswer = function () {
    var that = this;
    that.isAnswered = true;
    var answers = that.calculateScore();
    this.score = answers.score;
    this.max = this.answers;
    this.$letterContainer.addClass('h5p-disable-hover');
    this.$letterContainer.attr("tabindex", "-1");
    var scorePoints = new H5P.Question.ScorePoints();
    this.selectableLetters.forEach(function (entry) {
      if (entry.isSelected()) {
        entry.markCheck(scorePoints);
      }
      $(this).attr('disabled', true);
      $(this).off("click");
    });

    /**
    * Add feedback when check button is clicked.
    */
    var scoreText = H5P.Question.determineOverallFeedback(this.params.overallFeedback, this.score / this.max).replace(/@score/g, this.score.toString())
      .replace(/@total/g, this.answers.toString())
      .replace(/@correct/g, answers.correct.toString())
      .replace(/@wrong/g, answers.wrong.toString())
      .replace(/@missed/g, answers.missed.toString());
    var $feedbackDialog = $('' +
                  '<div class="h5p-feedback-dialog">' +
                  '<div class="h5p-feedback-inner">' +
                  '<div class="h5p-feedback-text" aria-hidden="true">' + scoreText + '</div>' +
                  '</div>' +
                  '</div><br />');
    that.$progressBar = UI.createScoreBar(this.answers, that.params.scoreBarLabel);
    that.$progressBar.setScore(this.score);
    that.$feedbackContainer.append($feedbackDialog);
    that.$progressBar.appendTo(that.$feedbackContainer);
    /**
    * If not correct answers, then add retry and show solution button.
    */
    that.$retry.show();
    if (answers.correct < that.answers) {
      that.$showSolution.show();
    }
    that.$checkButton.hide();
    that.$checkButton.attr('tabindex', '-1');
    that.$feedbackContainer.attr('tabindex', '0');
    that.$retry.attr('tabindex', 0).focus();
    that.trigger(that.XapiGenerator.generateAnsweredEvent());
  };

  // When retry button is clicked
  MarkTheLetters.prototype.resetTask = function ($container) {
    var that = this;
    // Reset task
    $container.empty();
    that.$inner.empty();
    that.attach($container);
    this.isAnswered = false;
    this.selectableLetters.forEach(function (entry) {
      entry.markClear();
    });
    this.$letterContainer.removeClass('h5p-disable-hover');
    that.$retry.hide();
    that.$showSolution.hide();
    that.$checkButton.show();
    that.$retry.attr('tabindex', '-1');
    that.$checkButton.attr('tabindex', 0).focus();
    /**
    * Resize event
    *
    * @event MarkTheLetters#resize
    */
    this.trigger('resize');
  };

  // When show solution button is clicked
  MarkTheLetters.prototype.showSolutions = function () {
    var that = this;
    that.setAllMarks();
    that.$retry.show();
    that.$showSolution.hide();
    that.$checkButton.hide();
    that.$showSolution.attr('tabindex',-1);
    that.$retry.focus();
    that.readspeaker(that.params.displaySolutionDescription);
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

  return MarkTheLetters;
})(H5P.jQuery, H5P.JoubelUI, H5P.Letter, H5P.XapiGenerator);
