document.addEventListener('DOMContentLoaded', function () {
  var typed = new Typed('#typed', {
    stringsElement: '#typed-strings',
    typeSpeed: 20,
    backSpeed: 20,
    startDelay: 1000,
    loop: false,
    loopCount: Infinity,
    onBegin: function (self) {
      prettyLog('onBegin ' + self);
    },
    onComplete: function (self) {
      prettyLog('onComplete ' + self);
    },
    preStringTyped: function (pos, self) {
      prettyLog('preStringTyped ' + pos + ' ' + self);
    },
    onStringTyped: function (pos, self) {
      prettyLog('onStringTyped ' + pos + ' ' + self);
    },
    onLastStringBackspaced: function (self) {
      prettyLog('onLastStringBackspaced ' + self);
    },
    onTypingPaused: function (pos, self) {
      prettyLog('onTypingPaused ' + pos + ' ' + self);
    },
    onTypingResumed: function (pos, self) {
      prettyLog('onTypingResumed ' + pos + ' ' + self);
    },
    onReset: function (self) {
      prettyLog('onReset ' + self);
    },
    onStop: function (pos, self) {
      prettyLog('onStop ' + pos + ' ' + self);
    },
    onStart: function (pos, self) {
      prettyLog('onStart ' + pos + ' ' + self);
    },
    onDestroy: function (self) {
      prettyLog('onDestroy ' + self);
    },
  });

  document.querySelector('.toggle').addEventListener('click', function () {
    typed.toggle();
  });
  document.querySelector('.stop').addEventListener('click', function () {
    typed.stop();
  });
  document.querySelector('.start').addEventListener('click', function () {
    typed.start();
  });
  document.querySelector('.reset').addEventListener('click', function () {
    typed.reset();
  });
  document.querySelector('.destroy').addEventListener('click', function () {
    typed.destroy();
  });
  document.querySelector('.loop').addEventListener('click', function () {
    toggleLoop(typed);
  });

  var typed2 = new Typed('#typed2', {
    strings: [
      'Some <i>strings</i> with',
      'Some <strong>HTML</strong>',
      'Chars &times; &copy;',
    ],
    typeSpeed: 0,
    backSpeed: 0,
    fadeOut: true,
    loop: true,
  });
  document.querySelector('.loop2').addEventListener('click', function () {
    toggleLoop(typed2);
  });

  new Typed('#typed3', {
    strings: [
      'My strings are: <i>strings</i> with',
      'My strings are: <strong>HTML</strong>',
      'My strings are: Chars &times; &copy;',
    ],
    typeSpeed: 0,
    backSpeed: 0,
    smartBackspace: true,
    loop: true,
  });

  new Typed('#typed4', {
    strings: ['Some strings without', 'Some HTML', 'Chars'],
    typeSpeed: 0,
    backSpeed: 0,
    attr: 'placeholder',
    bindInputFocusEvents: true,
    loop: true,
  });

  new Typed('#typed5', {
    strings: [
      '1 Some <i>strings</i> with',
      '2 Some <strong>HTML</strong>',
      '3 Chars &times; &copy;',
    ],
    typeSpeed: 0,
    backSpeed: 0,
    shuffle: true,
    cursorChar: '_',
    smartBackspace: false,
    loop: true,
  });

  // Example of a working string:
  // ! strings: ['npm install^1000\ninstalling components... ^1000\nFetching from source...'],

  new Typed('#typed6', {
    strings: convertArrayToFormattedString([
      'It’s one of the paradoxes of love that we can from the outside immediately see something that it can take us a lifetime to unravel in ourselves: people pick hugely inappropriate partners.\n\n',
      'There goes one unfortunate lover with a person who is obviously sour and judgemental. There goes another with an evident cold fish. And there’s a third devoting themselves with all their might to a chancer it takes only an instant for an outsider to see is unreliable, mean-minded and half-witted.\n\n',
      'Our ill-fated crusades seem like an insult to common-sense but only because we are not grasping the internal logic at play. What most of us are trying to do is not fall in love with the most appropriate - that is, the kindest, most generous, most thoughtful or most admiring - partner. We’re trying to find one who feels most intensely familiar. We’re trying to locate someone who can evoke - in all their difficulties and immaturities - the very sort of character we once knew, loved and depended on immeasurably in the long-distant past, probably the parent of the gender we’re attracted to.\n\n',
      'We then devote inordinate energy to loving this unusual choice over so many years, despite their (to others) evident mediocrity and unkindness, because we’re trying to give our story a happier ending than it once had. Our mother may well have been cold and emotionally shut-down. But now we’ve identified someone much like her and we’re going to spend a few decades at least attempting to convince this person to open up, go to therapy and turn into a paragon of self-awareness. Our father might have been an angry and inarticulate bully; but here’s someone much like him who we’ll have a couple of children with while we try - more than we’ve ever tried at anything else in our lives - to calm down the angry tiger and teach him to express himself like a latter day version of Socrates or the Buddha.\n\n',
      'These may seem like absurd and doomed quests, and generally that’s precisely how they end up. But we miss the rationale of love when we simply dismiss what’s going on as without sense. There is an important aspiration at stake: we’re trying to convert our lovers into the kind of people our hugely influential, but heartbreakingly disappointing yet beloved parents might have been, if only we could have had a hand at altering their hurtful natures.\n\n',
      'At one level, we’re squabbling and fighting and sulking with someone we should never have gone anywhere near for more than an evening. At another, we’re striving to pull off a project we’ve been inwardly longing to execute properly since childhood: changing someone for the better.\n\n',
    ]),
    typeSpeed: 10,
    backSpeed: 0,
    loop: true,
  });
});

function prettyLog(str) {
  console.log('%c ' + str, 'color: green; font-weight: bold;');
}

function toggleLoop(typed) {
  if (typed.loop) {
    typed.loop = false;
  } else {
    typed.loop = true;
  }
}

function convertArrayToFormattedString(array) {
  const result = array
    .map(function (str) {
      // Wrap each string in backticks and add '^1000'
      return ''.concat(str, '^1000');
    })
    .join('\n');

  console.log(result);
  return [result];
}
