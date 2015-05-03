// My project includes:
// AJAX with an API provided by Wordnik ("http://developer.wordnik.com/")
// Creating/Modifying DOM elements (adding "magnets", scrambling them via iteration over an array of DOM elements)
// Handling events (clicks, focusout)
// Use of a closure (to count iterations of word creation without putting it in the global scope, to toggle 
// and find the value of Flarf mode).

// This function does the majority of the work in this small app. It generates a random number
// and maps that to an API call to Wordnik. If Flarf mode is on, some adjustments are made to
// the API options, like lowering the corpus count of the word and in some cases using a more
// obscure sebset of that part of speech. One array was created because the Wordnik API does not reliably 
// return articles.
function randomWordGenerator(){
		var randomNum = Math.floor((Math.random() * 4) + 1);

		var flarfFlag = flarfMode.getFlarf();
		console.log(flarfFlag);
		if (flarfFlag == true){
			var dictionaryDef = false;
			var frequency = 0;
			var verbType = 'verb-intransitive';
			var nounType = 'idiom';
		} else {
			var dictionaryDef = true;
			var frequency = 500;
			var verbType = 'verb';
			var nounType = 'noun';
		}

		// verb
		if (randomNum == 1){
			var requestStr = "http://api.wordnik.com:80/v4/words.json/randomWord";
		  $.ajax({
		      type: "GET",
		      withCredentials: false, 
  				dataType: 'json', 		      
  				url: requestStr,
		      data: { hasDictionaryDef: dictionaryDef,
		       				api_key: 'a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5',
		      				minCorpusCount: frequency, 
		      				includePartOfSpeech: verbType
		      			},
		      success: function(data){
		      	randomWordComplete(data);
		      	console.log(data);
		      }
		  	});
			}
		// adjective
		else if(randomNum == 2){
			var requestStr = "http://api.wordnik.com:80/v4/words.json/randomWord";
		  $.ajax({
		      type: "GET",
		      withCredentials: false, 
  				dataType: 'json', 		      
  				url: requestStr,
		      data: { hasDictionaryDef: dictionaryDef,
		       				api_key: 'a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5',
		      				minCorpusCount: frequency, // this retrieves a word that is fairly common
		      				includePartOfSpeech: 'adjective'
		      			},
		      success: function(data){
		      	randomWordComplete(data);
		      	console.log(data);
		      }
		  	});		
			}
		// noun
		else if(randomNum == 3){
			var requestStr = "http://api.wordnik.com:80/v4/words.json/randomWord";
		  $.ajax({
		      type: "GET",
		      withCredentials: false, 
  				dataType: 'json', 		      
  				url: requestStr,
		      data: { hasDictionaryDef: dictionaryDef,
		       				api_key: 'a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5',
		      				minCorpusCount: frequency, // this retrieves a word that is fairly common
		      				includePartOfSpeech: nounType
		      			},
		      success: function(data){
		      	randomWordComplete(data);
		      	console.log(data);
		      }
		  	});
		}

		// articles, pronouns, prepositions, endings
		else {
			var fillerPartsOfSpeech = ["a", "an", "the", "he", "she", "they", "with", "under", "until",
			  "since", "of", "it", "above", "over", "across", "aboard", "about", "for", "with", "to", "near",
			   "before", "up", "beside", "from", "toward", "under", "concerning", "past", "above", "plus",
			   "against", "at", "since", "considering", "over", "like", "excepting", "minus", "anti", "into",
			   "in", "despite", "around", "but", "during", "versus", "via", "following", "along", "save",
			   "round", "underneath", "per", "towards", "within", "among", "except", "by", "excluding", 
			   "on", "besides", "than", "beyond", "between", "after", "until", "onto", "of", "unlike", 
			   "outside", "down", "through", "below", "amid", "regarding", "inside", "off", "as", "opposite", 
			   "upon", "beneath", "behind", "without", "across", "s", "ed", "d"]; 
		  var randomWord = fillerPartsOfSpeech[Math.floor(Math.random()*fillerPartsOfSpeech.length)];
	  	randomWordComplete(randomWord);
	  			      	console.log(randomWord);

	  }
}

// This is a self-invoking function that uses a closure to make the iteration count
// for magnet numbers in span ids available to other functions without being in the 
// global scope. Alain helped me figure this out in Piazza, so thanks to him for the
// basic gist of this function.
var magnetCounter = (function(){
   var magNumber = 0;    
   return function increaseCounter(){
     return magNumber++;    
   }
})()

// This function is called after the word has been generated in randomWordGenerator.
// It parses the JSON (if that's where the word came from), and then creates a magnet 
// out of it.
function randomWordComplete(data) {
	if (typeof data == "object"){
		var word = data.word;
  } else {
	  var word = data;
	}
	console.log(word);
	var magNumber = magnetCounter();
  $('#words-container').prepend('<span class="magnet" id="magnet' + magNumber + '">' + word + '</span>');
  $('#magnet'+magNumber).draggable({ containment: "wrapper" });
}

// This function creates an input box in the middle top of the fridge so that the user
// can create a title magnet of their choosing.
function poemTitle(){
	$('#words-container').prepend('<input type="text" class="poem-title">');
	$('input.poem-title').focusout(poemTitleConversion);
}

// This function converts the user input into a specially-styled title magnet.
function poemTitleConversion(title){
	var userPoemTitle = $('input.poem-title').val();
	$(this).replaceWith( '<span class="magnet" id="poem-title">' + userPoemTitle + '</span>' );
	$('#poem-title').draggable({
	 containment: "wrapper" });
}

// This function removes all the buttons so the user can start the game over.
function startOver(){
	$('#words-container').html("");
}

// This function scrambles the magnets to provide creative possibility for the user!
function scrambleWords(){
  currentMagnetArray = $('.magnet').toArray();

  for (var i = 0; i < currentMagnetArray.length; i++) {
    var wordsContainer = $('#words-container');
	  var width = wordsContainer[0].clientWidth;
	  var height = wordsContainer[0].clientHeight;
    var x = parseInt(( Math.random() * width), 10);
    var y = parseInt(( Math.random() * height), 10);
    currentMagnetArray[i].style.left = parseInt(x)+'px';
  	currentMagnetArray[i].style.top = parseInt(y)+'px';
  };
}

// This self invoking function uses a closure to allow other functions to 
// set and access the Flarf mode toggle.
var flarfMode = (function(){
   var flarfFlag = false;    
   return { 
   	toggleFlarf: function(){
     if (flarfFlag == true){
     	flarfFlag = false;
     	return flarfFlag;
     } else {
     	flarfFlag = true;
     	return flarfFlag;
     }
   	},
		getFlarf: function() {
       return flarfFlag;
    }
   }
})()

// Finally, these event listeners drive the user interaction.
$('#random-word').click(randomWordGenerator);
$('#scramble').click(scrambleWords);
$('#start-over').click(startOver);
$('#title').click(poemTitle);
$('#flarf').click(function(){
	flarfMode.toggleFlarf()
});






