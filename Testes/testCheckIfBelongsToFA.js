/*
Gustavo Ferreira Guimarães 
Matrícula: 11200638
*/

function checkIfBelongsToFA(finite_automate_to_test, sentence_to_test){
  // @TODO Pegar de um seletor entre os nomes dos FA's o index e adicionar na variável index

  const sentence = sentence_to_test;
  const finite_automate = finite_automate_to_test;
  const length = sentence.length;

  let actual_state = finite_automate['0'];
  let at_position = 0;
  let next_state_statename = '';
  while( at_position < length ) {

    // Getting the next state name
    next_state_statename = actual_state[sentence.charAt(at_position)];
    if(next_state_statename == undefined || next_state_statename == ''){
      return false;
    }
    
    // Set the actual state for the next While iteration
    actual_state = finite_automate[next_state_statename];

    // If the actual state doesn't exist there is something wrong with the F.A.
    if(actual_state == undefined){
      return false;
    }

    at_position++;
  }
  if(actual_state["final"].length == 0){
    return false;
  }

  return true;
}

function testFiniteAutomateSentence() {

  let dfa = []
  dfa[0] = {'statename': '0', 'a': '0', 'b': '1', 'final': ''};
  dfa[1] = {'statename': '1', 'a': '1', 'b': '0', 'final': 's'};

  let aproved = true;

  if (checkIfBelongsToFA(dfa,"aba")) {
    console.log("Test 1 succeded");
  } else {
    console.log("Test 1 failed");
    aproved = false;
  }

  if (checkIfBelongsToFA(dfa,"aab")) {
    console.log("Test 2 succeded");
  } else {
    console.log("Test 2 failed");
    aproved = false;
  }

  if (checkIfBelongsToFA(dfa,"babb")) {
    console.log("Test 3 succeded");
  } else {
    console.log("Test 3 failed");
    aproved = false;
  }

  if (checkIfBelongsToFA(dfa,"b")) {
    console.log("Test 4 succeded");
  } else {
    console.log("Test 4 failed");
    aproved = false;
  }

  if (checkIfBelongsToFA(dfa,"ababb")) {
    console.log("Test 5 succeded");
  } else {
    console.log("Test 5 failed");
    aproved = false;
  }

  if (checkIfBelongsToFA(dfa,"abaaaaaaaa")) {
    console.log("Test 6 succeded");
  } else {
    console.log("Test 6 failed");
    aproved = false;
  }

  if (checkIfBelongsToFA(dfa,"aaabbba")) {
    console.log("Test 7 succeded");
  } else {
    console.log("Test 7 failed");
    aproved = false;
  }

  if(aproved){
    window.alert("TESTE DE PERTENCIMENTO DE SENTENÇA APROVADO");
  }else {
    window.alert("TESTE DE PERTENCIMENTO DE SENTENÇA REPROVADO");
  }
}