/*
Gustavo Ferreira Guimarães 
Matrícula: 11200638
*/

// Get the Sidebar
var mySidebar = document.getElementById("mySidebar");

// Get the DIV with overlay effect
var overlayBg = document.getElementById("myOverlay");

// Toggle between showing and hiding the sidebar, and add overlay effect
function w3_open() {
  if (mySidebar.style.display === 'block') {
    mySidebar.style.display = 'none';
    overlayBg.style.display = "none";
  } else {
    mySidebar.style.display = 'block';
    overlayBg.style.display = "block";
  }
}

// Close the sidebar with the close button
function w3_close() {
  mySidebar.style.display = "none";
  overlayBg.style.display = "none";
}

var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n'];
var array_all_FA = [];
var array_all_RG = [];
var array_name = [];

var array_all_RE = [];

var array_all_CFG = [];
var array_all_CNFCFG = [];
var array_name_CFG = [];

// FINITE AUTOMATE FUNCTIONS BEGIN
// This function generate a representations of an empty Finite Automaton 
function generateFATable(){

    // Building columns
    let number_of_alphabet = document.getElementById('input_alphabet').value;

    let table = document.getElementById('af_table');
    let thead = table.createTHead();
    let row = thead.insertRow();

    let first_th = document.createElement("th");
    let first_text = document.createTextNode("StateName");
    first_th.appendChild(first_text);
    row.appendChild(first_th);

    for (let index = 0; index < number_of_alphabet; index++) {
        let th = document.createElement("th");
        let text = document.createTextNode(alphabet[index]);
        th.appendChild(text);
        row.appendChild(th);   
    }

    let th = document.createElement("th");
    let text = document.createTextNode("Final");
    th.appendChild(text);
    row.appendChild(th);
    number_of_alphabet++; 

    // Building rows
    let number_of_states = document.getElementById('input_states').value;

    for (let index = 0; index < number_of_states; index++) {
        let row = table.insertRow(); 
        for (let j = 0; j <= number_of_alphabet; j++) {
            let cell = row.insertCell();
            // cell.contentEditable = "true";
            let text;
            if(j == 0){
              text = document.createTextNode(index);
            } else {
              text = document.createTextNode("");
              cell.contentEditable = true;
            }
            cell.appendChild(text);
        }
    }
}

function saveFA() {
  let name = document.getElementById('input_name_fa').value;
  if(name.length == 0){
    alert("Don't forget to name your FA, please");
    return;
  }

  let table = document.getElementById('af_table');
  let DFA = tableToJson(table);
  
  let RG = transformDFAIntoRG(DFA);

  array_all_FA.push(DFA);
  array_all_RG.push(RG);
  array_name.push(name);

  addToSelector();
  
  console.log(array_all_FA);
  console.log(array_all_RG);
  console.log(array_name);
}

function transformNDFAToDFA(ndfa){
  let ndfa_test = [
    { a: '', b: '1', c: '2', epsilon: '0,1', final: '', statename: '0' },
    { a: '0', b: '2', c: '0,1', epsilon: '', final: '', statename: '1' },
    { a: '', b: '', c: '', epsilon: '', final: 's', statename: '2' },
  ]
  ndfa = ndfa_test;

  let haveEpsilonTransitions = false;
  for (let index = 0; index < ndfa.length && !haveEpsilonTransitions; index++) {
    if(ndfa[index]['epsilon']) {
      haveEpsilonTransitions = true;
    }
  }

  let epsilonFecho = [];
  let newStates =[];
  if(haveEpsilonTransitions) {
    epsilonFecho = calculateEpsilonFecho(ndfa);
    ndfa = calculateNDFAEpsilonFree(epsilonFecho, ndfa);
  } else {
    for (let index = 0; index < ndfa.length; index++) {
      delete (ndfa[index])['epsilon'];
    }
  }

}

function calculateNDFAEpsilonFree(epsilonFecho, ndfa){
  // let newStates = [];
  // let number_of_alphabet = document.getElementById('input_alphabet').value;
  // console.log(ndfa);
  // console.log(epsilonFecho);

  // let isFinal = '';
  // for (let index = 0; index < epsilonFecho.length; index++) {
  //   isFinal = '';
  //   newStates[index] = { statename: index.toString() };
  //   // console.log('newStates[index]:');
  //   // console.log(newStates[index]);
    
  //   for (let inside_index = 0; inside_index < epsilonFecho[index].length; inside_index++) {

  //     for (let alphabet_index = 0; alphabet_index < number_of_alphabet; alphabet_index++) {
  //       if(inside_index == 0 || newStates[index][alphabet[alphabet_index]] == '') {
  //         newStates[index] = { ...newStates[index], [alphabet[alphabet_index]]: ndfa[parseInt(epsilonFecho[index][inside_index])][alphabet[alphabet_index]]}; 
  //         // console.log('newStates[index] alphabet_inside ');
  //         // console.log(newStates[index]);
  //       } else {
  //         let test = newStates[index][alphabet[alphabet_index]];
  //         let test2 = ndfa[parseInt(epsilonFecho[index][inside_index])][alphabet[alphabet_index]];
  //         console.log('TEST: ' + test);
  //         // console.log('TEST2: ' + test2);
  //         if(!test.includes(test2)){
  //           let add_comma = test + ',' + test2;
  //           console.log("ADD COMMA: " + add_comma);
  //           newStates[index] = { ...newStates[index], [alphabet[alphabet_index]]: add_comma };
  //         }
  //       }
  //     } 

  //     // console.log('AAAAA');
  //     // console.log(newStates);
  //     if(ndfa[parseInt(epsilonFecho[index][inside_index])]['final'] != '' && ndfa[parseInt(epsilonFecho[index][inside_index])]['final'] != undefined){
  //       isFinal = 's';
  //     }
  //   }
  //   newStates[index] = { ...newStates[index], final: isFinal};
  // }

  // let index = 0; //FOR 1
  // let isFinal = ''; // Dentro do for 1
  // let inside_index = 0; //FOR 2
  // newStates[index] = {
  //   statename: index.toString(), 
  //   a: ndfa[parseInt(epsilonFecho[index][inside_index])]['a'] + ',' + ndfa[parseInt(epsilonFecho[index][inside_index+1])]['a'] 
  // }
  // if(ndfa[parseInt(epsilonFecho[index][inside_index])]['final'] != '' && ndfa[parseInt(epsilonFecho[index][inside_index])]['final'] != undefined){
  //   isFinal = 's';
  // }

  // if(ndfa[parseInt(epsilonFecho[index][inside_index+1])]['final'] != '' && ndfa[parseInt(epsilonFecho[index][inside_index+1])]['final'] != undefined){
  //   isFinal = 's';
  // }


  // newStates[index] = { ...newStates[index], final: isFinal}
  // console.log("CHEGOU AQUI")
  // console.log(newStates);

  // TODO Fazer repetições pra cada um dos epsilonFecho[index]
}

function calculateEpsilonFecho(ndfa){
  let eachEpsilon = [];
  for (let index = 0; index < ndfa.length; index++) {
    if(ndfa[index]['epsilon'] != undefined && ndfa[index]['epsilon'] != ''){
      eachEpsilon[index] = (ndfa[index]['epsilon']).split(',');
    } else {
      eachEpsilon[index] = [];
    }
    if(!eachEpsilon[index].includes(index.toString())){
      eachEpsilon[index].unshift(index.toString());
    }
  }

  let changed = true;
  while(changed) {
    changed = false;
    for (let index = 0; index < eachEpsilon.length; index++) {
      for (let inside_index = 0; inside_index < eachEpsilon[index].length; inside_index++) {
        let aux = parseInt(eachEpsilon[index][inside_index]);

        if(eachEpsilon[aux] != undefined){
          for (let inside_inside_index = 0; inside_inside_index < eachEpsilon[aux].length; inside_inside_index++) {
            if(!eachEpsilon[index].includes(eachEpsilon[aux][inside_inside_index])){
              eachEpsilon[index].push(eachEpsilon[aux][inside_inside_index]);
            }
          }
        }

      }
    }
  }
  
  return eachEpsilon;

}

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

function checkIfBelongsToFA(){

  let selector = document.getElementById('dfa_recognize_sentence');
  let index = selector.selectedIndex;

  const sentence = document.getElementById('input_expression_to_be_recognized').value;
  const finite_automate = array_all_FA[index];
  const length = sentence.length;

  let actual_state = finite_automate['0'];
  let at_position = 0;
  let next_state_statename = '';
  while( at_position < length ) {

    // Getting the next state name
    next_state_statename = actual_state[sentence.charAt(at_position)];
    if(next_state_statename == undefined || next_state_statename == ''){
      alert('The F.A. DOESN\'T recognize the sentence');
      return false;
    }
    
    // Set the actual state for the next While iteration
    actual_state = finite_automate[next_state_statename];

    // If the actual state doesn't exist there is something wrong with the F.A.
    if(actual_state == undefined){
      alert('The F.A. doesn\'t recognize the sentence');
      return false;
    }

    at_position++;
  }
  if(actual_state["final"].length == 0){
    alert('The F.A. doesn\'t recognize the sentence');
    return false;
  }

  alert("The F.A. recognize the sentence");
  return true;
}
// FINITE AUTOMATE END

// RG FUNCTIONS BEGIN

// This functions create a visual table of an empty Regular Grammar
function generateRGRows(){

  // Building columns
  let number_of_alphabet = document.getElementById('input_left_side').value;

  let table = document.getElementById('rg_table');
  let thead = table.createTHead();
  let row = thead.insertRow();

  let first_th = document.createElement("th");
  first_th.className+="col-md-auto";
  let first_text = document.createTextNode("LeftSide");
  first_th.appendChild(first_text);
  row.appendChild(first_th);

  let th = document.createElement("th");
  th.className+="col-md-auto";
  let text = document.createTextNode("RightSide");
  th.appendChild(text);
  row.appendChild(th);   

  // Building rows
  for (let index = 0; index < number_of_alphabet; index++) {
      let row = table.insertRow(); 
      for (let j = 0; j < 2; j++) {
          let cell = row.insertCell();
          if(j == 0){
            text = document.createTextNode(index);
          } else {
            text = document.createTextNode("");
            cell.contentEditable = true;
          }
          cell.appendChild(text);
      }
  }
}

function saveRG() {
  let name = document.getElementById('input_name_rg').value;
  if(name.length == 0){
    alert("Don't forget to name your RG, please");
    return;
  }

  let table = document.getElementById('rg_table');
  let data = tableToJson(table);

  // Each "|" will have an own property on the RG_corrected array of objects
  let RG_corrected = correctRG(data);
  let DFA = transformRGIntoNDFA(RG_corrected);

  DFA = NDFA;

  array_all_FA.push(DFA);
  array_all_RG.push(RG_corrected);
  array_name.push(name);
  addToSelector();
  
  console.log(array_all_FA);
  console.log(array_all_RG);
  console.log(array_name);
}

// Cleans the RG -> Remove whitespaces and separate it on object properties
function correctRG(data){
  let corrected_rg = data;
  const length = document.getElementById("input_left_side").value;
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

function transformRGIntoNDFA(rg_corrected){
  let NDFA = [];
  let number_of_alphabet = document.getElementById("input_rg_alphabet").value;

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
// RG FUNCTIONS END

// RE FUNCTIONS BEGIN
function saveRE(){
  let RE = document.getElementById("input_regular_expression").value;
  let ret = parseSub(RE, 0, RE.length, true);
  if ( typeof ret == 'string'){
    alert(ret);
  } else {
    array_all_RE.push(RE);
  }
}

function parseSub(text, begin, end, first) {
    var i,
        sub,
        last = 0,
        node = {'begin': begin, 'end': end},
        virNode,
        tempNode,
        stack = 0,
        parts = [];
    if (text.length === 0) {
        return 'Error: empty input at ' + begin + '.';
    }
    if (first) {
        for (i = 0; i <= text.length; i += 1) {
            if (i === text.length || (text[i] === '|' && stack === 0)) {
                if (last === 0 && i === text.length) {
                    return parseSub(text, begin + last, begin + i, false);
                }
                sub = parseSub(text.substr(last, i - last), begin + last, begin + i, true);
                if (typeof sub === 'string') {
                    return sub;
                }
                parts.push(sub);
                last = i + 1;
            } else if (text[i] === '(') {
                stack += 1;
            } else if (text[i] === ')') {
                stack -= 1;
            }
        }
        if (parts.length === 1) {
            return parts[0];
        }
        node.type = 'or';
        node.parts = parts;
    } else {
        for (i = 0; i < text.length; i += 1) {
            if (text[i] === '(') {
                last = i + 1;
                i += 1;
                stack = 1;
                while (i < text.length && stack !== 0) {
                    if (text[i] === '(') {
                        stack += 1;
                    } else if (text[i] === ')') {
                        stack -= 1;
                    }
                    i += 1;
                }
                if (stack !== 0) {
                    return 'Error: missing right bracket for ' + (begin + last) + '.';
                }
                i -= 1;
                sub = parseSub(text.substr(last, i - last), begin + last, begin + i, true);
                if (typeof sub === 'string') {
                    return sub;
                }
                sub.begin -= 1;
                sub.end += 1;
                parts.push(sub);
            } else if (text[i] === '*') {
                if (parts.length === 0) {
                    return 'Error: unexpected * at ' + (begin + i) + '.';
                }
                tempNode = {'begin': parts[parts.length - 1].begin, 'end': parts[parts.length - 1].end + 1};
                tempNode.type = 'star';
                tempNode.sub = parts[parts.length - 1];
                parts[parts.length - 1] = tempNode;
            } else if (text[i] === '+') {
                if (parts.length === 0) {
                    return 'Error: unexpected + at ' + (begin + i) + '.';
                }
                virNode = {'begin': parts[parts.length - 1].begin, 'end': parts[parts.length - 1].end + 1};
                virNode.type = 'star';
                virNode.sub = parts[parts.length - 1];
                tempNode = {'begin': parts[parts.length - 1].begin, 'end': parts[parts.length - 1].end + 1};
                tempNode.type = 'cat';
                tempNode.parts = [parts[parts.length - 1], virNode];
                parts[parts.length - 1] = tempNode;
            } else if (text[i] === '?') {
                if (parts.length === 0) {
                    return 'Error: unexpected + at ' + (begin + i) + '.';
                }
                virNode = {'begin': parts[parts.length - 1].begin, 'end': parts[parts.length - 1].end + 1};
                virNode.type = 'empty';
                virNode.sub = parts[parts.length - 1];
                tempNode = {'begin': parts[parts.length - 1].begin, 'end': parts[parts.length - 1].end + 1};
                tempNode.type = 'or';
                tempNode.parts = [parts[parts.length - 1], virNode];
                parts[parts.length - 1] = tempNode;
            } else if (text[i] === 'ϵ') {
                tempNode = {'begin': begin + i, 'end': begin + i + 1};
                tempNode.type = 'empty';
                parts.push(tempNode);
            } else {
                tempNode = {'begin': begin + i, 'end': begin + i + 1};
                tempNode.type = 'text';
                tempNode.text = text[i];
                parts.push(tempNode);
            }
        }
        if (parts.length === 1) {
            return parts[0];
        }
        node.type = 'cat';
        node.parts = parts;
    }
    return node;
}
// RE FUNCTIONS END

// GENERAL FUNCTIONS BEGIN
function tableToJson(table) {
  var data = [];

  // first row needs to be headers
  var headers = [];
  for (var i=0; i<table.rows[0].cells.length; i++) {
      headers[i] = table.rows[0].cells[i].innerHTML.toLowerCase().replace(/ /gi,'');
  }

  // go through cells
  for (var i=1; i<table.rows.length; i++) {

      var tableRow = table.rows[i];
      var rowData = {};

      for (var j=0; j<tableRow.cells.length; j++) {

          var string = (tableRow.cells[j].innerHTML).replace("<br>","");
          rowData[ headers[j] ] = string;

      }

      data.push(rowData);
  }       

  return data;
}

function addToSelector(){
  addToSelectorName('dfa_to_be_minimized');
  addToSelectorName('dfa_recognize_sentence');
  addToSelectorName('dfa_union_1');
  addToSelectorName('dfa_union_2');
}

function addToSelectorName(nameOfSelector) {
  let select = document.getElementById(nameOfSelector);

  var opt = array_name[array_name.length-1];
  var el = document.createElement("option");
  el.textContent = opt;
  el.value = opt;
  select.appendChild(el);
}

// GENERAL FUNCTIONS END

// DFA MINIMIZATION BEGIN
function minimizeDFA(){
  let selector = document.getElementById('dfa_to_be_minimized');
  let selected = selector.selectedIndex;

  const dfa = array_all_FA[selected];

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

  array_all_FA.push(dfaAlive);
  array_name.push(array_name[selected] + "Minimized");
  addToSelector();

  return dfaAlive;
}
// DFA MINIMIZATION END

// DFA UNION BEGIN
function dfaUnion(dfa1 = undefined, dfa2 = undefined) {
  let selector1 = document.getElementById('dfa_union_1');
  let selector2 = document.getElementById('dfa_union_2');
  let selected1 = selector1.selectedIndex;
  let selected2 = selector2.selectedIndex;

  if(dfa1 == undefined){
    dfa1 = array_all_FA[selected1];
  }
  if(dfa2 == undefined){
    dfa2 = array_all_FA[selected2];
  }

  let number_of_alphabet1 = 0;
  let number_of_alphabet2 = 0;

  let leaderLength = (dfa1.length >= dfa2.length) ? dfa1.length : dfa2.length;

  for (var key in dfa1[0]) {
    if (dfa1[0].hasOwnProperty(key)) {
      if(key != 'statename' && key != 'final'){
        number_of_alphabet1++;
      }
    }
  }

  for (var key in dfa2[0]) {
    if (dfa2[0].hasOwnProperty(key)) {
      if(key != 'statename' && key != 'final'){
        number_of_alphabet2++;
      }
    }
  }

  let leaderNumberOfAlphabet;

  if (number_of_alphabet1 >= number_of_alphabet2) {
    leaderNumberOfAlphabet = number_of_alphabet1;

    let letter = '';
    for (let index = number_of_alphabet2; index < number_of_alphabet1; index++) {
      letter = alphabet[index];
      for (let inside_index = 0; inside_index < dfa2.length; inside_index++) {
        dfa2[inside_index] = { ...dfa2[inside_index], letter: ''};
      }
        
    }
  } else {
    leaderNumberOfAlphabet = number_of_alphabet2;

    let letter = '';
    for (let index = number_of_alphabet1; index < number_of_alphabet2; index++) {
      letter = alphabet[index];
      for (let inside_index = 0; inside_index < dfa1.length; inside_index++) {
        dfa1[inside_index] = { ...dfa1[inside_index], [letter]: ''};
      }   
    }
  }
  
  let union = [];
  for (let index = 0; index < (dfa1.length + dfa2.length + 1); index++) {
    union[index] = {};
    union[index]['statename'] = index;
    union[index]['final'] = false;
    for (let inside_index = 0; inside_index < leaderNumberOfAlphabet; inside_index++) {
      union[index][alphabet[inside_index]] = '';
    }
  }

  for (let index = 0; index < (leaderLength); index++) {
    if(dfa1[index]){  
      union[index+1] = dfa1[index]
    }
    if(dfa2[index]) {
      union[index+1+dfa1.length] = dfa2[index];
    }
  }

  for (var key in dfa1[0]) {
    if (dfa1[0].hasOwnProperty(key)) {
      if(key != 'statename'){
        if(key == 'final' && dfa1[0]['final']) {
          union[0]['final'] = 's';
        }0
        if(key != 'final') {
          union[0][key] = dfa1[0][key];
        }
      }
    }
  }

  for (var key in dfa2[0]) {
    if (dfa2[0].hasOwnProperty(key)) {
      if(key != 'statename'){
        if(key == 'final' && dfa2[0]['final']) {
          union[0]['final'] = 's';
        }
        if(key != 'final') {
          if(union[0][key]){
            union[0][key] += ',' + dfa2[0][key];
          } else {
            union[0][key] = dfa2[0][key];
          }
        }
      }
    }
  }

  array_all_FA.push(union);
  array_name.push(array_name[selected1] + "UnionWith" + array_name[selected2]);
  console.log("A");
  addToSelector();
  console.log("B");

  return union;
}
// DFA UNION END
// DFA INTERSECTION BEGIN
function dfaIntersection() {
  let selector1 = document.getElementById('dfa_union_1');
  let selector2 = document.getElementById('dfa_union_2');
  let selected1 = selector1.selectedIndex;
  let selected2 = selector2.selectedIndex;

  let dfa1 = array_all_FA[selected1];
  let dfa2 = array_all_FA[selected2];

  let number_of_alphabet1 = 0;
  let number_of_alphabet2 = 0;

  let leaderLength = (dfa1.length >= dfa2.length) ? dfa1.length : dfa2.length;

  for (var key in dfa1[0]) {
    if (dfa1[0].hasOwnProperty(key)) {
      if(key != 'statename' && key != 'final'){
        number_of_alphabet1++;
      }
    }
  }

  for (var key in dfa2[0]) {
    if (dfa2[0].hasOwnProperty(key)) {
      if(key != 'statename' && key != 'final'){
        number_of_alphabet2++;
      }
    }
  }

  let leaderNumberOfAlphabet;

  if (number_of_alphabet1 >= number_of_alphabet2) {
    leaderNumberOfAlphabet;

    let letter = '';
    for (let index = number_of_alphabet2; index < number_of_alphabet1; index++) {
      letter = alphabet[index];
      for (let inside_index = 0; inside_index < dfa2.length; inside_index++) {
        dfa2[inside_index] = { ...dfa2[inside_index], letter: ''};
      }
        
    }
  } else {
    leaderNumberOfAlphabet = number_of_alphabet2;

    let letter = '';
    for (let index = number_of_alphabet1; index < number_of_alphabet2; index++) {
      letter = alphabet[index];
      console.log(letter);
      for (let inside_index = 0; inside_index < dfa1.length; inside_index++) {
        dfa1[inside_index] = { ...dfa1[inside_index], [letter]: ''};
      }   
    }
  }

  number_of_alphabet1 = leaderNumberOfAlphabet;
  number_of_alphabet2 = leaderNumberOfAlphabet;

  let complementDfa1 = complement(dfa1, number_of_alphabet1);
  let complementDfa2 = complement(dfa2, number_of_alphabet2);
  // NOT WORKING BEYOND THIS, NEED TO TRANSFORM NDFA INTO DFA

  // let unionComplement = dfaUnion(complementDfa1, complementDfa2);
  // let unionComplementMinimized = minimizeDFA(unionComplement);

  // let intersection = complement(unionComplementMinimized);
  // NOT WORKING BEFORE THIS, NEED TO TRANSFORM NDFA INTO DFA

  console.log(intersection);
  // TODO TEST INTERSECTION

  // array_all_FA.push(intersection);
  // array_name.push(array_name[selected1] + "IntersectionWith" + array_name[selected2]);
  // addToSelector();

  // return intersection;
}
// DFA INTERSECTION END
// DFA COMPLEMENT BEGIN
function complement(fa, number_of_alphabet) {
  // @TODO Fazer um método para transformar de ndfa em dfa
    // dfa = transformNDFAToDFA(fa);
    dfa = fa;
  
  dfa = makeDFATotal(dfa, number_of_alphabet);

  for (let index = 0; index < dfa.length; index++) {
    if(dfa[index]['final'] != '') {
      dfa[index]['final'] = '';
    } else {
      dfa[index]['final'] = 's';
    }
  }

  return dfa;
}
// DFA COMPLEMENT END
// DFA TOTAL BEGIN
function makeDFATotal(dfa, number_of_alphabet) {
  let newStateCreated = false;
  let dfaPossibleNewStatePosition = dfa.length;

  for (let index = 0; index < dfa.length; index++) {
    
    for (var key in dfa[index]) {
      if (dfa[index].hasOwnProperty(key)) {
        if(key != 'statename' && key != 'final'){
          if(dfa[index][key] == '' && !newStateCreated) {

            dfa[dfaPossibleNewStatePosition] = {statename: ''+dfaPossibleNewStatePosition, final: ''};
            for (let inside_index = 0; inside_index < number_of_alphabet; inside_index++) {
              letter = alphabet[inside_index];
              dfa[dfaPossibleNewStatePosition] = { ...dfa[dfaPossibleNewStatePosition], [letter]: ''};
            }

            newStateCreated = true;
          }

          if(dfa[index][key] == '') {
            dfa[index][key] = dfa[dfaPossibleNewStatePosition]['statename'];
          }
        }
      }
    }
  }

  return dfa;
}
// DFA TOTAL END


// CGF FUNCTIONS BEGIN

// This functions create a visual table of an empty Context Free Grammar
function generateCFGRows(){

  // Building columns
  let number_of_alphabet = document.getElementById('input_left_side_cfg').value;

  let table = document.getElementById('cfg_table');
  let thead = table.createTHead();
  let row = thead.insertRow();

  let first_th = document.createElement("th");
  first_th.className+="col-md-auto";
  let first_text = document.createTextNode("LeftSideCFG");
  first_th.appendChild(first_text);
  row.appendChild(first_th);

  let th = document.createElement("th");
  th.className+="col-md-auto";
  let text = document.createTextNode("RightSideCFG");
  th.appendChild(text);
  row.appendChild(th);   

  // Building rows
  for (let index = 0; index < number_of_alphabet; index++) {
      let row = table.insertRow(); 
      for (let j = 0; j < 2; j++) {
          let cell = row.insertCell();
          if(j == 0){
            text = document.createTextNode(index);
          } else {
            text = document.createTextNode("");
            cell.contentEditable = true;
          }
          cell.appendChild(text);
      }
  }
}

function saveCFG() {
  let name = document.getElementById('input_name_cfg').value;
  if(name.length == 0){
    alert("Don't forget to name your CFG, please");
    return;
  }

  let table = document.getElementById('cfg_table');
  let data = tableToJson(table);

  // Each "|" will have an own property on the RG_corrected array of objects
  let CFG_corrected = correctCFG(data);
  // let PDA = transformCFGIntoPDA(CFG_corrected);


  array_all_CFG.push(CFG_corrected);
  array_name_CFG.push(name);
  addToSelectorCFG();

  console.log(CFG_corrected);
  console.log(array_all_CFG);
  console.log(array_name_CFG);
}

// Cleans the CFG -> Remove whitespaces and separate it on object properties
function correctCFG(data){
  let corrected_cfg = data;
  const length = document.getElementById("input_left_side_cfg").value;
  for (let index = 0; index < length; index++) {
    // Removing spaces
    let replace = data[index]["rightsidecfg"].replace(/\s/g,'');
    
    // Making properties out of the right site
    let replace_array = replace.split("|");
    for (let replace_index = 0; replace_index < replace_array.length; replace_index++) {
      corrected_cfg[index][replace_index.toString()] = replace_array[replace_index];
    }
    delete corrected_cfg[index]["rightsidecfg"];
  }

  return corrected_cfg;
}
// CGF FUNCTIONS END