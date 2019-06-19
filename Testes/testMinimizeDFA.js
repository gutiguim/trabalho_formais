/*
Gustavo Ferreira Guimarães 
Matrícula: 11200638
*/

// DFA MINIMIZATION BEGIN
function minimizeDFA(dfa_test){
  const dfa = dfa_test;

  // Add false accessible properties to object
  let dfaCheckAccessible = [];
  for (let index = 0; index < dfa.length; index++) {
    dfaCheckAccessible[index] = { ...dfa[index], accessible: false};
  }
  
  dfaCheckAccessible[0]['accessible'] = true;

  let stateChanged = true;
  while (stateChanged){
    stateChanged = false;
    for (let index = 0; index < dfa.length; index++) {
      if(dfaCheckAccessible[index]['accessible'] == true){

        for (var key in dfaCheckAccessible[index]) {
          if (dfaCheckAccessible[index].hasOwnProperty(key)) {
            if(key != 'statename' && key != 'accessible' && key != 'final'){
              const nextState = dfaCheckAccessible[index][key];
                if(nextState != '' && dfaCheckAccessible[nextState]['accessible'] == false){
                  dfaCheckAccessible[nextState]['accessible'] = true;
                  stateChanged = true;
              }
            }
          }
        }

      }
      
    }
  }

  let dfaAccessible = [];
  for (let index = 0; index < dfa.length; index++) {
    if (dfaCheckAccessible[index]['accessible'] == true) {
      dfaAccessible[index] = dfa[index];
    }
  }

  // Add true dead properties to object
  let dfaCheckDead = []
  for (let index = 0; index < dfaAccessible.length; index++) {
    if(dfaAccessible[index] != undefined){
      if(dfaAccessible[index]['final']){
        dfaCheckDead[index] = { ...dfa[index], dead: false};
      } else {
        dfaCheckDead[index] = { ...dfa[index], dead: true};
      }
    }
  }

  stateChanged = true;
  while (stateChanged){
    stateChanged = false;
    for (let index = 0; index < dfa.length; index++) {
      if(dfaCheckDead[index]) {
        if(dfaCheckDead[index]['dead'] == true){

          for (var key in dfaCheckDead[index]) {
            if (dfaCheckDead[index].hasOwnProperty(key)) {
              if(key != 'statename' && key != 'dead' && key != 'final'){
                const nextState = dfaCheckDead[index][key];
                if(nextState != '' && dfaCheckDead[nextState]['dead'] == false){
                  dfaCheckDead[index]['dead'] = false;
                  stateChanged = true;
                }
              }
            }
          }

        }
      }
      
    }
  }

  let dfaAlive = [];
  for (let index = 0; index < dfa.length; index++) {
    if(dfaCheckDead[index]){
      if (dfaCheckDead[index]['dead'] == false) {
        dfaAlive[index] = dfa[index];
      }
    }
  }

  for (let index = 0; index < dfaAlive.length; index++) {
    for (var key in dfaAlive[index]) {
      if (dfaAlive[index].hasOwnProperty(key)) {
        if(key != 'statename' && key != 'final'){
          const nextState = dfaAlive[index][key];
          if(dfaAlive[nextState] == undefined){
            dfaAlive[index][key] = '';
          }
        }
      }
    }
  }

  return dfaAlive;
}
// DFA MINIMIZATION END

function testMinimizeDFA(){
  let aproved = false;
  
  let dfa_not_acessible = [
    { statename: '0', a: '0', b: '0', final: 's'},
    { statename: '1', a: '0', b: '0', final: 's'},
    { statename: '2', a: '0', b: '0', final: 's'},
  ];

  let test_dfa_not_acessible = minimizeDFA(dfa_not_acessible);

  let dfa_acessible = [
    { statename: '0', a: 0, b: 0, final: 's'},
  ];

  aproved = Object.compare(test_dfa_not_acessible, dfa_acessible);
  console.log("Primeiro Teste: " + aproved);

  let dfa_dead = [
    { statename: '0', a: '1', b: '2', final: ''},
    { statename: '1', a: '1', b: '1', final: ''},
    { statename: '2', a: '2', b: '2', final: 's'},
  ];

  let test_dfa_dead = minimizeDFA(dfa_dead);

  let dfa_alive = [];
  dfa_alive[0] = { statename: '0', a: '', b: '2', final: ''};
  dfa_alive[1];
  dfa_alive[2] = { statename: '2', a: '2', b: '2', final: 's'};

  aproved = Object.compare(test_dfa_dead, dfa_alive);
  console.log("Segundo Teste: " + aproved);

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