import React, {Component}from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import Button from './src/components/Button'
import Display from './src/components/Display'

const initialState ={
  displayValue: '0',
  //clearDisplay diz se o display precisa ser limpo no proximo numero digitado ou nn
  clearDisplay: false,
  operation: null,
  values: [0, 0],
  //current é o indice que aponta para o vetor values
  current: 0,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttons: {
    flexDirection: 'row',
    //wrap serve para quebrar a linha
    flexWrap: 'wrap',
  }
});

export default class App extends Component {
  state = { ...initialState  }

  addDigit = n => {
    // console.debug(typeof this.state.displayValue)
    
    //verificacao para impossibilitar colocar varios zeros
    const clearDisplay = this.state.displayValue === '0'
      || this.state.clearDisplay

    //verificacao para impossibilitar colcoar dois pontos
    if (n === '.' && !clearDisplay && this.state.displayValue.includes('.')){
      return
    }

    //se o display for limpo, o valor zera, senao seta o estado do valor que está no display
    const currentValue = clearDisplay ? '' : this.state.displayValue
    //o valor mostrado no display recebe o valor anterior junto com o novo valor digitado
    const displayValue = currentValue + n
    this.setState({displayValue, clearDisplay: false})

    if(n !== '.') {
      //parseFloat transforma uma string num float
      const newValue = parseFloat(displayValue)
      const values = [...this.state.values]
      values[this.state.current] = newValue
      this.setState({values})
    }
  }

  clearMemory = () => {
    this.setState({...initialState})
  }

  setOperation = operation => {
      if(this.state.current === 0) {
        this.setState({operation, current:1, clearDisplay: true})
      } else {
        const equals = operation === '='
        const values = [...this.state.values]
        try {
          //eval serve para avaliar certa operação
          values[0] = eval(`${values[0]} ${this.state.operation} ${values[1]}`)
        } catch (e) {
          //essa validacao serve para caso de algo errado o valor vai continuar o memso
          values[0] = this.state.values[0]
        }
        //zerando o valor de indice um para receber um novo valor
        values[1] = 0
        this.setState({
          displayValue: `${values[0]}`,
          //se a operacao for '=' seta operation como nulo
          operation: equals ? null : operation,
          //se a operacao for '=' current vai apontar para o indice zero do vetor
          current: equals ? 0 : 1,
          //limpa o display apos dar o resultado
          clearDisplay: true,
          values,
        })  
      }
  }
  render() {
    return (
      <View style={styles.container}>
        <Display value={this.state.displayValue} />
        <View style={styles.buttons}>
          <Button label='AC' triple onClick={this.clearMemory}/>
          <Button label='/' operation onClick={this.setOperation}/>
          <Button label='7' onClick={this.addDigit}/>
          <Button label='8' onClick={this.addDigit}/>
          <Button label='9' onClick={this.addDigit}/>
          <Button label='*' operation onClick={this.setOperation}/>
          <Button label='4' onClick={this.addDigit}/>
          <Button label='5' onClick={this.addDigit}/>
          <Button label='6' onClick={this.addDigit}/>
          <Button label='-' operation onClick={this.setOperation}/>
          <Button label='1' onClick={this.addDigit}/>
          <Button label='2' onClick={this.addDigit}/>
          <Button label='3' onClick={this.addDigit}/>
          <Button label='+' operation onClick={this.setOperation}/>
          <Button label='0' double onClick={this.addDigit}/>
          <Button label='.' onClick={this.addDigit}/>
          <Button label='=' operation onClick={this.setOperation}/>
        </View>
      </View>
    );
  };
}


