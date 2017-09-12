$(document).ready(function() {
  MatchGame.renderCards(MatchGame.generateCardValues(), $('#game'));
});

var MatchGame = {};
var flippedCount = 0;
var timerID = 0;
var gameTime = 0;
var topScores = [];

/*
  Sets up a new game after HTML document has loaded.
  Renders a 4x4 board of cards.
*/

/*
  Generates and returns an array of matching card values.
 */

MatchGame.generateCardValues = function() {
  var cardValues = [];
  var randomIndex = 0;
  for (i = 1; i < 9; i++) {
    cardValues.push(i);
    cardValues.push(i);
  }
  var randomCardValues = [];
  while (cardValues.length > 0) {
    randomIndex = Math.floor(Math.random() * (cardValues.length));
    randomCardValues.push(cardValues[randomIndex]);
    cardValues.splice(randomIndex, 1);
  }
  return randomCardValues;
};

/*
  Converts card values to jQuery card objects and adds them to the supplied game
  object.
*/

MatchGame.renderCards = function(cardValues, $game) {
  var colorArray = [
    'hsl(25, 85%, 65%)',
    'hsl(55, 85%, 65%)',
    'hsl(90, 85%, 65%)',
    'hsl(160, 85%, 65%)',
    'hsl(220, 85%, 65%)',
    'hsl(265, 85%, 65%)',
    'hsl(310, 85%, 65%)',
    'hsl(360, 85%, 65%)'
  ];
  var $card = {};
  $game.data('flippedCards', []);
  $game.data('inProgress', false);
  $game.data('flippedCount', 0);
  flippedCount = 0;
  $game.empty();
  for (i = 0; i < 16; i++) {
    $card = $('<div class="card col-xs-3"></div>');
    $card.data('value', cardValues[i]);
    $card.data('flipped', false);
    $card.data('color', colorArray[cardValues[i] - 1]);
    $game.append($card);
  }
  $('.card').on('click', function() {
    MatchGame.flipCard($(this), $('#game'));
  });
  $('#reset-button').on('click', function() {
    clearInterval(timerID);
    $('.timer').text("");
    MatchGame.renderCards(MatchGame.generateCardValues(), $('#game'));
  });
};

/*
  Flips over a given card and checks to see if two cards are flipped over.
  Updates styles on flipped cards depending whether they are a match or not.
 */

MatchGame.flipCard = function($card, $game) {
  if ($card.data('flipped')) {
    return;
  }
  if ($game.data('inProgress') === false) {
    MatchGame.gameTimer();
  }
  $game.data('inProgress', true);
  $card.css('background-color', $card.data('color'));
  $card.text($card.data('value'));
  $card.data('flipped', true);
  var flippedCards = $game.data('flippedCards');
  flippedCards.push($card);
  if (flippedCards.length === 2) {
    if (flippedCards[0].data('value') === flippedCards[1].data('value')) {
      flippedCards[0].css('color', 'rgb(204, 204, 204)');
      flippedCards[0].css('background-color', 'rgb(153, 153, 153)');
      flippedCards[1].css('color', 'rgb(204, 204, 204)');
      flippedCards[1].css('background-color', 'rgb(153, 153, 153)');
      flippedCount = flippedCount + 2;
      $game.data('flippedCount', flippedCount)
    } else {
      window.setTimeout(function() {
        flippedCards[0].css('color', 'rgb(255, 255, 255)');
        flippedCards[0].css('background-color', 'rgb(32, 64, 86)');
        flippedCards[0].text('');
        flippedCards[0].data('flipped', false);
        flippedCards[1].css('color', 'rgb(255, 255, 255)');
        flippedCards[1].css('background-color', 'rgb(32, 64, 86)');
        flippedCards[1].text('');
        flippedCards[1].data('flipped', false);
      }, 500);
    }
    $game.data('flippedCards', []);
    if (flippedCount === 16) {
      clearInterval(timerID);
      $('.card').each(function() {
        $('.card').css({
          "background-color": "green",
          "color": "black"
        });
      });
      window.setTimeout(function() {
        alert('Game over man! You finished in ' + gameTime + " seconds!");
      }, 500);
      if (topScores.length < 3) {
        topScores.push(gameTime);
        topScores.sort(function(a, b) {
          return a - b
        });
      } else {
        for (var i = 0; i < topScores.length; i++) {
          if (gameTime < topScores[i]) {
            topScores[i] = gameTime;
            topScores.sort(function(a, b) {
              return a - b
            });
            break;
          }
        }
      }
      if (topScores.length > 0) {
        $('#score1').text('#1 - ' + topScores[0] + ' Seconds');
      }
      if (topScores.length > 1) {
        $('#score2').text('#2 - ' + topScores[1] + ' Seconds');
      }
      if (topScores.length > 2) {
        $('#score3').text('#3 - ' + topScores[2] + ' Seconds');
      }
    }
  }
};

/* timer function */

MatchGame.gameTimer = function() {
  var start = new Date;
  gameTime = 0;
  timerID = setInterval(function() {
    gameTime = Math.round((new Date - start) / 1000, 0)
    $('.timer').text(gameTime + " Seconds");
  }, 1000);
};
