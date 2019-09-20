(function (MarkTheLetters, $, EventDispatcher) {

  /**
   * Controls all the operations for each letter
   *
   * @class H5P.MarkTheLetters.Letter
   * @extends H5P.EventDispatcher
   * @param {jQuery} $letter
   */
  MarkTheLetters.Letter = function ($letter, addSolution, solution) {
  /**
   * @constant
   *
   * @type {string}
   */
    MarkTheLetters.Letter.ID_MARK_MISSED = "h5p-description-missed";
    /**
     * @constant
     *
     * @type {string}
     */
    MarkTheLetters.Letter.ID_MARK_CORRECT = "h5p-description-correct";
    /**
     * @constant
     *
     * @type {string}
     */
    MarkTheLetters.Letter.ID_MARK_INCORRECT = "h5p-description-incorrect";

    var that = this;
    EventDispatcher.call(that);
    var input = $letter.text();
    var handledInput = input;
    var isAnswer;

    if (addSolution) {
      /**
      *
      * Also the letters given the add solution field is counted as answers along with the letters marked with asterisks(*) before and after.
      */
      if (solution != undefined) {
        solution = solution.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
        handledInput = handledInput.toLowerCase();
        for (var i=0; i<solution.length; i++) {
          if (handledInput === solution[i]) {
            handledInput = '*' + handledInput + '*' ;
          }
        }
      }

      // Check if letter is an answer
      isAnswer = checkForAnswer();
      handledInput = input;
      // Remove single asterisks
      handleAsterisks();
    }
    else {
      /**
      *
      * Only letters marked with asterisks (*) before and after in task description are the answers.
      */

      // Check if letter is an answer
      isAnswer = checkForAnswer();
      // Remove single asterisks
      handleAsterisks();
    }

    /**
     * Checks if the letter is an answer by checking the end characters.
     *
     * @private
     * @return {Boolean} Returns true if the letter is an answer.
     */
    function checkForAnswer() {
      if (handledInput.includes('*')) {
        return true;
      }
      else {
        return false;
      }
    }

    if (isAnswer) {
      $letter.text(handledInput);
    }

    // Remove the single asterisk before and after the letter.
    function handleAsterisks() {
      if (handledInput.includes('*')) {
        handledInput = handledInput.slice(1,-1);
      }
    }

    /**
     * Removes any score points added to the marked letter.
     */
    that.clearScorePoint = function () {
      for (var i = 0; $letter[0].children.length; i++) {
        var scorePoint = $letter[0].children[i];
        scorePoint.parentNode.removeChild(scorePoint);
      }
    };

    /**
     * Get letter as a string
     *
     * @return {string} Letter as text
     */
    this.getText = function () {
      return input;
    };

    /**
     * Clears all marks from the letter.
     *
     * @public
     */
    this.markClear = function () {
      $letter
        .removeAttr('aria-selected')
        .removeAttr('aria-describedby');
      this.clearScorePoint();
    };

    /**
     * Check if the letter is correctly marked and style it accordingly.
     * Reveal result
     *
     * @public
     * @param {H5P.Question.ScorePoints} scorePoints
     */
    this.markCheck = function (scorePoints) {
      if (this.isSelected()) {
        $letter.attr('aria-describedby', isAnswer ? MarkTheLetters.Letter.ID_MARK_CORRECT : MarkTheLetters.Letter.ID_MARK_INCORRECT);

        if (scorePoints) {
          $letter[0].appendChild(scorePoints.getElement(isAnswer));
        }
      }
      else if (isAnswer) {
        $letter.attr('aria-describedby', MarkTheLetters.Letter.ID_MARK_MISSED);
      }
    };

    /**
     * Checks if the letter is marked correctly.
     *
     * @public
     * @returns {Boolean} True if the marking is correct.
     */
    this.isCorrect = function () {
      return (isAnswer && this.isSelected());
    };

    /**
     * Checks if the letter is marked wrong.
     *
     * @public
     * @returns {Boolean} True if the marking is wrong.
     */
    this.isWrong = function () {
      return (!isAnswer && this.isSelected());
    };

    /**
    * Checks if the letter is correct, but has not been marked.
    *
    * @public
    * @returns {Boolean} True if the marking is missed.
    */
    this.isMissed = function () {
      return (isAnswer && !this.isSelected());
    };

    /**
     * Checks if the letter is an answer.
     *
     * @public
     * @returns {Boolean} True if the letter is an answer.
     */
    this.isAnswer = function () {
      return isAnswer;
    };

    /**
     * Checks if the letter is selected.
     *
     * @public
     * @returns {Boolean} True if the letter is selected.
     */
    this.isSelected = function () {
      return $letter.attr('aria-selected') === 'true';
    };

    /**
     * Sets that the Letter is selected
     *
     * @public
     */
    this.setSelected = function () {
      $letter.attr('aria-selected', true);
    };

    /**
     * Sets that the Letter is unselected
     *
     * @public
     */
    this.unsetSelected = function () {
      $letter.attr('aria-selected', false);
    };

  };
  MarkTheLetters.Letter.prototype = Object.create(EventDispatcher.prototype);
  MarkTheLetters.Letter.prototype.constructor = MarkTheLetters.Letter;

  return MarkTheLetters.Letter;

})(H5P.MarkTheLetters, H5P.jQuery, H5P.EventDispatcher);
