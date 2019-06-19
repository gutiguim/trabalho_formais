/*
Gustavo Ferreira Guimarães 
Matrícula: 11200638
*/

function transformRGIntoNDFA(rg_corrected, alphabet_number){
  let NDFA = [];
  let number_of_alphabet = alphabet_number;
  var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n'];

  // Unshift -> Add to the beggining    array.unshift(newStuff);
  
  for (let index = 0; index < rg_corrected.length; index++) {
    delete rg_corrected[index]["leftside"];

    NDFA[index] = new Object;
    NDFA[index]['statename'] = index.toString();
    NDFA[index]['final'] = '';
    // Set all possible productions with empty strings
    for (let inside_index = 0; inside_index < number_of_alphabet; inside_index++) {
      NDFA[index][alphabet[inside_index]] = "";
    }

    for (var key in rg_corrected[index]) {
      let terminal = "";

      if (rg_corrected[index].hasOwnProperty(key)) {
        if(key != 'statename'){
          switch (rg_corrected[index][key].length) {
            case 1:
            terminal = rg_corrected[index][key].charAt(0);
            // If the transition by some symbol is not empty (it means it will be a NDFA) make it also go to the final state
            if(NDFA[index][terminal] == "" || NDFA[index][terminal] == undefined ){
                NDFA[index][terminal] = number_of_alphabet.toString();
            }else {
                NDFA[index][terminal] = NDFA[index][terminal] + ',' + number_of_alphabet.toString();
            }
            break;
            case 2:
            terminal = rg_corrected[index][key].charAt(0);
            non_terminal = rg_corrected[index][key].charAt(1);
            // If the transition by some symbol is not empty (it means it will be a NDFA) make it also go to the indicate state
            if(NDFA[index][terminal] == "" || NDFA[index][terminal] == undefined){
                NDFA[index][terminal] = "" + non_terminal;
            }else {
                NDFA[index][terminal] = NDFA[index][terminal] + ',' + non_terminal;
            }
            break
            default:
            window.alert("ERROR");
            break;
          }
        }
      }
    }
  }

  // Create a new state for recieving the "single productions" from the new 
  let new_final_state = new Object;
  
  // Set all possible productions with empty strings
  for (let index = 0; index < number_of_alphabet; index++) {
    new_final_state[alphabet[index]] = "";
  }
  new_final_state["final"] = "s";
  new_final_state["statename"] = number_of_alphabet.toString();

  // Add to the new created NDFA
  NDFA.push(new_final_state);

  return NDFA;
}

function testTransformRGIntoNDFA() {
  let aproved = false;

  let rg = [];
  rg[0] = {"leftside": '0', "rightside": 'a0|b1|b', "statename": '0'};
  rg[1] = {"leftside": '1', "rightside": 'a1|a|b0', "statename": '1'};
  rg_corrected = correctRG(rg);
  console.log(rg_corrected);

  let test_dfa = transformRGIntoNDFA(rg_corrected, 2);
  console.log(test_dfa);

  let ndfa = [];
  ndfa[0] = {'a': '0', 'b': '1,2', 'final': '', 'statename': '0'};
  ndfa[1] = {'a': '1,2', 'b': '0', 'final': '', 'statename': '1'};
  ndfa[2] = {'a': '', 'b': '', 'final': 's', 'statename': '2'};
  console.log(ndfa);


  aproved = Object.compare(test_dfa, ndfa);

  if(aproved){
    window.alert("TESTE DE TRANSFORMAR AUTOMATO FINITO EM GRAMATICA REGULAR APROVADO");
  } else {
    window.alert("TESTE DE TRANSFORMAR AUTOMATO FINITO EM GRAMATICA REGULAR REPROVADO");
  }
  }

// Cleans the RG -> Remove whitespaces and separate it on object properties
function correctRG(data){
    let corrected_rg = data;
    const length = 2;
    for (let index = 0; index < length; index++) {
      // Removing spaces
      let replace = data[index]["rightside"].replace(/\s/g,'');
      
      // Making properties out of the right site
      let replace_array = replace.split("|");
      for (let replace_index = 0; replace_index < replace_array.length; replace_index++) {
        corrected_rg[index][replace_index.toString()] = replace_array[replace_index];
      }
      delete corrected_rg[index]["rightside"];
    }
  
    return corrected_rg;
  }

// FUNCTION FOR COMPRING OBJECTS -> https://gist.github.com/nicbell/6081098
Object.compare = function (obj1, obj2) {
	//Loop through properties in object 1
	for (var p in obj1) {
		//Check property exists on both objects
		if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) return false;
 
		switch (typeof (obj1[p])) {
			//Deep compare objects
			case 'object':
				if (!Object.compare(obj1[p], obj2[p])) return false;
				break;
			//Compare function code
			case 'function':
				if (typeof (obj2[p]) == 'undefined' || (p != 'compare' && obj1[p].toString() != obj2[p].toString())) return false;
				break;
			//Compare values
			default:
				if (obj1[p] != obj2[p]) return false;
		}
	}
 
	//Check object 2 for any extra properties
	for (var p in obj2) {
		if (typeof (obj1[p]) == 'undefined') return false;
	}
	return true;
};