import React from 'react';
import { StyleSheet, Text, View, Button, KeyboardAvoidingView, Slider } from 'react-native';

import { vibrate } from './utils/index';
import Counter from './components/Counter';



export default class App extends React.Component {

  constructor () {
    super();
    // store 2 cycles as internal parameters
    this.longTime = 25;
    this.shortTime = 5;

    // transform to seconds
    this.calculateCycles();

    this.isPaused = false;

    this.state = {
      count: this.longCycle,
      isLongCycle: true,
      isChangeTimeOn: false
    }

  }

  calculateCycles () {
    this.longCycle = this.longTime * 60;
    this.shortCycle = this.shortTime * 60;
  }

  countDown () {

    this.countDownInterval = setInterval(() => {

      if (this.isPaused) {
        return;
      }
       
        this.setState(
          (prevState) => {
  
            let nextTime = --prevState.count;
            let nextCycle = prevState.isLongCycle;
  
            // we reach zero when any cycle ended
            // and it is time to switch
            if (nextTime === 0) {
  
              vibrate();
  
              // set time and type for next cycle
              if (prevState.isLongCycle) {
                nextTime = this.shortCycle; // seconds
                nextCycle = false; // type
              } else {
                nextTime = this.longCycle;
                nextCycle = true;
              }
            }
            
            return { count:  nextTime, isLongCycle: nextCycle }
          }
        );
     
    }, 1000);
  }

  parseTime = (seconds) => {
    const _minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
    const _seconds = (seconds % 60).toString().padStart(2, '0');
    return `${_minutes}:${_seconds}`;
  }

  stopCount = () => {
    this.isPaused = true;
  }

  startCount = () => {
    this.isPaused = false;
    this.setState({isChangeTimeOn: false});

    if (typeof this.countDownInterval === 'undefined') {
      this.countDown();
    }
    
  }

  resetCount = () => {
    this.isPaused = true;
    this.setState((prevState) => {
        return {
          count: (prevState.isLongCycle ? this.longCycle : this.shortCycle)
        }
    });
  }

  changeTime = () => {
    this.isPaused = true;
    this.setState((prevState) => {
      return {
        isChangeTimeOn: !prevState.isChangeTimeOn
      }
    });
  }

  setNewTime = (time) => {

    switch (time.type) {
      case 'long':
        this.longTime = time.payload;
      break;
      case 'short':
        this.shortTime = time.payload;
    }

    this.calculateCycles();

    this.setState((prevState) => {
      return {
        count: (prevState.isLongCycle ? this.longCycle : this.shortCycle)
      }
    });
  }

  render() {
    const { isLongCycle, isChangeTimeOn } = this.state;

    return (
      <View style={[styles.container, (isLongCycle ? styles.longBg : styles.shortBg)]}>

      {isChangeTimeOn && 
        <View style={{width: '90%'}}>
          <Text>Working cycle: {this.longTime}</Text>
          <Slider
            maximumValue={60}
            minimumValue={1}
            step={1}
            onSlidingComplete={(data)=>{
              this.setNewTime({
                type: 'long',
                payload: data
              });
            }}
            value={this.longTime}
          />
          <Text>Resting cycle {this.shortTime}</Text>
          <Slider
            maximumValue={60}
            minimumValue={1}
            step={1}
            onSlidingComplete={(data)=>{
              this.setNewTime({
                type: 'short',
                payload: data
              });
            }}
            value={this.shortTime}
          />
        </View>}
      
        <Text style={styles.legend}>{this.state.isLongCycle ? 'It\'s work time!' : 'Let\'s rest...'}</Text>
        <Counter count={this.parseTime(this.state.count)} />
          <View style={styles.menu}>
            <Button style={styles.button} title={'Start'} color={'#26a65b'} onPress={this.startCount}></Button>
            <Button style={styles.button} title={'Stop'} onPress={this.stopCount}></Button>
            <Button style={styles.button} title={'Reset'} color={'#f7ca18'} onPress={this.resetCount}></Button>
            <Button style={styles.button} title={'Set Time'} color={'#abb7b7'} onPress={this.changeTime}></Button>
          </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legend: {
    color: '#fff'
  },
  longBg: {
    backgroundColor: '#42c2f4',
  },
  shortBg: {
    backgroundColor: '#42f456',
  },
  menu: {
    display: 'flex',
    flexDirection: 'row',
  },
  button: {
    padding: 5,
  }
});
