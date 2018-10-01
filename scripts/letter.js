H5P.MarkTheLetters = H5P.MarkTheLetters || {};
H5P.MarkTheLetters.Letter = (function () {

  Letter.ID_MARK_MISSED = "h5p-description-missed";
  Letter.ID_MARK_CORRECT = "h5p-description-correct";
  Letter.ID_MARK_INCORRECT = "h5p-description-incorrect";

  function Letter($letter) {
    var self = this;
    H5P.EventDispatcher.call(self);

    var input = $letter.text();
    var handledInput = input;

    // Check if letter is an answer
    var isAnswer = checkForAnswer();

    // Remove single asterisk and escape double asterisks.
    handleAsterisks();

    if (isAnswer) {
      $letter.text(handledInput);
    }

    function checkForAnswer() {
      // Check last and next to last character, in case of punctuations.
      var letterString = removeDoubleAsterisks(input);
      if (letterString.charAt(0) === ('*') && letterString.length > 0) {
        if (letterString.charAt(letterString.length - 1) === ('*')) {
          handledInput = input.slice(1, input.length - 1);
          return true;
        }
        // If punctuation, add the punctuation to the end of the letter.
        else if(letterString.charAt(letterString.length - 2) === ('*')) {
          handledInput = input.slice(1, input.length - 2);
          return true;
        }
        return false;
      }
      return false;
    }

    function removeDoubleAsterisks(letterString) {
      var asteriskIndex = letterString.indexOf('*');
      var slicedLetter = letterString;

      while (asteriskIndex !== -1) {
        if (letterString.indexOf('*', asteriskIndex + 1) === asteriskIndex + 1) {
          slicedLetter = letterString.slice(0, asteriskIndex) + letterString.slice(asteriskIndex + 2, input.length);
        }
        asteriskIndex = letterString.indexOf('*', asteriskIndex + 1);
      }

      return slicedLetter;
    }

    function handleAsterisks() {
      var asteriskIndex = handledInput.indexOf('*');

      while (asteriskIndex !== -1) {
        handledInput = handledInput.slice(0, asteriskIndex) + handledInput.slice(asteriskIndex + 1, handledInput.length);
        asteriskIndex = handledInput.indexOf('*', asteriskIndex + 1);
      }
    }

    self.clearScorePoint = function () {
      for (var i = 0; $letter[0].children.length; i++) {
        var scorePoint = $letter[0].children[i];
        scorePoint.parentNode.removeChild(scorePoint);
      }
    };

    this.getText = function () {
      return input;
    };

    this.markClear = function () {
      $letter
        .removeAttr('aria-selected')
        .removeAttr('aria-describedby');

      this.clearScorePoint();
    };

    this.markCheck = function (scorePoints) {
      if (this.isSelected()) {
        $letter.attr('aria-describedby', isAnswer ? Letter.ID_MARK_CORRECT : Letter.ID_MARK_INCORRECT);

        if (scorePoints) {
          $letter[0].appendChild(scorePoints.getElement(isAnswer));
        }
      }
      else if (isAnswer) {
        $letter.attr('aria-describedby', Letter.ID_MARK_MISSED);
      }
    };

    this.isCorrect = function () {
      return (isAnswer && this.isSelected());
    };

    this.isWrong = function () {
      return (!isAnswer && this.isSelected());
    };

    this.isMissed = function () {
      return (isAnswer && !this.isSelected());
    };

    this.isAnswer = function () {
      return isAnswer;
    };

    this.isSelected = function () {
      return $letter.attr('aria-selected') === 'true';
    };

    this.setSelected = function () {
      $letter.attr('aria-selected', true);
    };
  }
  Letter.prototype = Object.create(H5P.EventDispatcher.prototype);
  Letter.prototype.constructor = Letter;

  return Letter;
})();
