H5P.MarkTheLetters = H5P.MarkTheLetters || {};

/**
 * Mark the letters XapiGenerator
 */
H5P.MarkTheLetters.XapiGenerator = (function ($) {
  /**
   * Xapi statements Generator
   * @param {H5P.MarkTheLetters} MarkTheLetters
   * @constructor
   */
  function XapiGenerator(MarkTheLetters) {

    /**
     * Generate answered event
     * @return {H5P.XAPIEvent}
     */
    this.generateAnsweredEvent = function () {
      var xAPIEvent = MarkTheLetters.createXAPIEventTemplate('answered');
      // Extend definition
      var objectDefinition = createDefinition(MarkTheLetters);
      $.extend(true, xAPIEvent.getVerifiedStatementValue(['object', 'definition']), objectDefinition);
      // Set score
      xAPIEvent.setScoredResult(MarkTheLetters.getScore(),
        MarkTheLetters.getMaxScore(),
        MarkTheLetters,
        true,
        MarkTheLetters.getScore() === MarkTheLetters.getMaxScore()
      );
      // Extend user result
      var userResult = {
        response: getUserSelections(MarkTheLetters)
      };

      $.extend(xAPIEvent.getVerifiedStatementValue(['result']), userResult);
      return xAPIEvent;
    };
  }

  /**
   * Create object definition for question
   *
   * @param {H5P.MarkTheLetters} MarkTheLetters
   * @return {Object} Object definition
   */
  function createDefinition(MarkTheLetters) {
    var definition = {};
    definition.description = {
      'en-US': replaceLineBreaks(MarkTheLetters.params.question)
    };
    definition.type = 'http://adlnet.gov/expapi/activities/cmi.interaction';
    definition.interactionType = 'choice';
    definition.correctResponsesPattern = [getCorrectResponsesPattern(MarkTheLetters)];
    definition.choices = getChoices(MarkTheLetters);
    return definition;
  }

  /**
   * Replace line breaks
   *
   * @param {string} description
   * @return {string}
   */
  function replaceLineBreaks(description) {
    var sanitized = $('<div>' + description + '</div>').text();
    return sanitized.replace(/(\n)+/g, '<br/>');
  }

  /**
   * Get all choices that it is possible to choose between
   *
   * @param {H5P.MarkTheLetters} MarkTheLetters
   * @return {Array}
   */
  function getChoices(MarkTheLetters) {
    return MarkTheLetters.selectableLetters.map(function ($li, index) {
      var text = $li.getText();
      return {
        id: index.toString(),
        description: {
          'en-US': $('<div>' + text + '</div>').text()
        }
      };
    });
  }

  /**
   * Get selected letters as a user response pattern
   *
   * @param {H5P.MarkTheLetters} MarkTheLetters
   * @return {string}
   */
  function getUserSelections(MarkTheLetters) {
    return MarkTheLetters.selectableLetters
      .reduce(function (prev, letter, index) {
        if (letter.isSelected()) {
          prev.push(index);
        }
        return prev;
      }, []).join('[,]');
  }

  /**
   * Get correct response pattern from correct letters
   *
   * @param {H5P.MarkTheLetters} MarkTheLetters
   * @return {string}
   */
  function getCorrectResponsesPattern(MarkTheLetters) {
    return MarkTheLetters.selectableLetters
      .reduce(function (prev, letter, index) {
        if (letter.isAnswer()) {
          prev.push(index);
        }
        return prev;
      }, []).join('[,]');
  }
  return XapiGenerator;
})(H5P.jQuery);
