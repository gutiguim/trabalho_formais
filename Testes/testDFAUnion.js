/*
Gustavo Ferreira Guimarães 
Matrícula: 11200638
*/


function dfaUnion(dfa1 = undefined, dfa2 = undefined) {
    var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n'];

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
      union[index]['statename'] = index.toString();
      union[index]['final'] = '';
      for (let inside_index = 0; inside_index < leaderNumberOfAlphabet; inside_index++) {
        union[index][alphabet[inside_index]] = '';
      }
    }
  
    for (let index = 0; index < (leaderLength); index++) {
      if(dfa1[index]){  
        union[index+1] = dfa1[index];

        for (var key in union[index+1]) {
            if (union[index+1].hasOwnProperty(key)) {
                if(key != 'statename' && key != 'final' && union[index+1][key].length != 0){
                    union[index+1][key] = (parseInt(union[index+1][key]) + 1).toString();
                }
            }
        }
      }
      if(dfa2[index]) {
        union[index+1+dfa1.length] = dfa2[index];
        for (var key in union[index+1+dfa1.length]) {
            if (union[index+1+dfa1.length].hasOwnProperty(key)) {
                if(key != 'statename' && key != 'final' && union[index+1+dfa1.length][key].length != 0){
                    union[index+1+dfa1.length][key] = (parseInt(union[index+1+dfa1.length][key]) + 1 + dfa1.length).toString();
                }
            }
        }
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
              if(dfa2[0][key]){
                union[0][key] += ',' + dfa2[0][key];
              }
            } else {
              union[0][key] = dfa2[0][key];
            }
          }
        }
      }
    }
  
    return union;
  }

  function testDFAUnion(){
    let aproved = false;
    
    let dfa1 = [
      { statename: '0', a: '1', b: '', final: ''},
      { statename: '1', a: '2', b: '', final: ''},
      { statename: '2', a: '2', b: '', final: 's'},
    ];

    let dfa2 = [
      { statename: '0', a: '', b: '1', final: ''},
      { statename: '1', a: '', b: '2', final: ''},
      { statename: '2', a: '', b: '2', final: 's'},
    ];
  
    let test_dfa_union = dfaUnion(dfa1, dfa2);
  
    let dfa_union = [
      { statename: '0', a: '2', b: '5', final: ''},
      { statename: '0', a: '2', b: '', final: ''},
      { statename: '1', a: '3', b: '', final: ''},
      { statename: '2', a: '3', b: '', final: 's'},
      { statename: '0', a: '', b: '5', final: ''},
      { statename: '1', a: '', b: '6', final: ''},
      { statename: '2', a: '', b: '6', final: 's'},
    ];

    console.log(dfa_union);
    console.log(test_dfa_union);
  
    aproved = Object.compare(test_dfa_union, dfa_union);
  
  
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