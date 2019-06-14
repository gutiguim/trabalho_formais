/*
Gustavo Ferreira Guimarães 
Matrícula: 11200638
*/

function transformDFAIntoRG(dfa){
    let final_states = new Object();
    let RG = [];

    // Mark final states
    for (let index = 0; index < dfa.length; index++) {
        if(dfa[index]["final"] != ""){
        final_states[index.toString()] = "s";
        }
    }

    if(final_states["0"] == "s"){
        for (let index = 0; index < dfa.length+1; index++) {
        RG[index] = new Object();
        RG[index]["leftside"] = index.toString();
        }
    }else {
        for (let index = 0; index < dfa.length; index++) {
        RG[index] = new Object();
        RG[index]["leftside"] = index.toString();
        }
    }

    // If the FA accepts an empty sentence -> Add 1 to all statenames and add to the beggining a new state like first one and add &
    if(final_states["0"] == "s"){
        let new_beggining_state = true;
        for (let index = 1; index < dfa.length+1; index++) {
        let first = true;
        RG[index]["statename"] = index.toString();
        for (var key in dfa[index-1]) {
            if (dfa[index-1].hasOwnProperty(key) && !(key == "statename" || key == "final")) {
            if(first == true){
                RG[index]["rightside"] = "" + key + (parseInt(dfa[index-1][key]) + 1).toString();
                first = false;

                // If it takes to a final state, add the terminal itself (a0|a -> if 0 is final_state)
                if(final_states[dfa[index-1][key]]){
                RG[index]["rightside"] += "|" + key;
                }

                // Adding the new starting state with & BEGIN
                if(new_beggining_state){
                RG[0]["statename"] = "0";
                RG[0]["rightside"] = "" + key + (parseInt(dfa[index-1][key]) + 1).toString();

                // If it takes to a final state, add the terminal itself (a0|a -> if 0 is final_state)
                if(final_states[dfa[0][key]]){
                    RG[0]["rightside"] += "|" + key;
                }
                // new_beggining_state = false;
                }
                // Adding the new starting state with & END
            } else  {
                RG[index]["rightside"] += "|" + key + (parseInt(dfa[index-1][key]) + 1).toString();

                // If it takes to a final state, add the terminal itself (a0|a -> if 0 is final_state)
                if(final_states[dfa[index-1][key]]){
                RG[index]["rightside"] += "|" + key;
                }

                // Adding the new starting state with & BEGIN
                if(new_beggining_state){
                RG[0]["rightside"] += "|" + key + (parseInt(dfa[0][key]) + 1).toString();
                // If it takes to a final state, add the terminal itself (a0|a -> if 0 is final_state)
                if(final_states[dfa[0][key]]){
                    RG[0]["rightside"] += "|" + key;
                }
                // new_beggining_state = false;
                }
                // Adding the new starting state with & END
            }
            }
        }
        if(index == 1){
            RG[0]["rightside"] += "|" + "&";
        }
        new_beggining_state = false;
        }
    }else{
        for (let index = 0; index < dfa.length; index++) {
        let first = true;
        RG[index]["statename"] = index.toString();
        for (var key in dfa[index]) {
            if (dfa[index].hasOwnProperty(key) && !(key == "statename" || key == "final")) {
            if(first == true){
                RG[index]["rightside"] = "" + key + dfa[index][key];
                first = false;

                // If it takes to a final state, add the terminal itself (a0|a -> if 0 is final_state)
                if(final_states[dfa[index][key]]){
                RG[index]["rightside"] += "|" + key;
                }
            } else {
                RG[index]["rightside"] += "|" + key + dfa[index][key];

                // If it takes to a final state, add the terminal itself (a0|a -> if 0 is final_state)
                if(final_states[dfa[index][key]]){
                RG[index]["rightside"] += "|" + key;
                }
            }
            }
        }
        }
    }

    return RG;
}
  
function testDFAIntoRG() {
  let aproved = true;

  let dfa = [];
  dfa[0] = {'statename': '0', 'a': '0', 'b': '1', 'final': ''};
  dfa[1] = {'statename': '1', 'a': '1', 'b': '0', 'final': 's'};

  let test_rg = transformDFAIntoRG(dfa);
  console.log(test_rg);

  let rg = [];
  rg[0] = {"leftside": '0', "rightside": 'a0|b1|b', "statename": '0'};
  rg[1] = {"leftside": '1', "rightside": 'a1|a|b0', "statename": '1'};
  console.log(rg);

  aproved = Object.compare(test_rg, rg);

  if(aproved){
    window.alert("TESTE DE TRANSFORMAR AUTOMATO FINITO EM GRAMATICA REGULAR APROVADO");
  } else {
    window.alert("TESTE DE TRANSFORMAR AUTOMATO FINITO EM GRAMATICA REGULAR REPROVADO");
  }
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