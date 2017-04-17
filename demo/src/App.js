import React, { Component } from 'react';
import MonacoEditor from 'react-monaco-editor';
import BemjsonToJSX from '../..';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            jsx: `<Button text='Hello world' />`,
        }

        this.onBemjsonChange = this.onBemjsonChange.bind(this);
    }
    onBemjsonChange(newValue, e) {
        try {
            var bemjson = eval(newValue);
            var jsx = BemjsonToJSX().process(bemjson).JSX
            this.setState({jsx});
        } catch (err) {}
    }
    render() {
        const options = {
             scrollBeyondLastLine: false
        };
        const code =
`({
    block: 'button',
    text: 'Hello world'
})`;
        const jsx = this.state.jsx;
        return (
            <div className='App'>
                <span className='App__editor bemjson'>
                    <MonacoEditor {...{
                        language: 'javascript',
                        options: options,
                        onChange: this.onBemjsonChange,
                        defaultValue: code
                    }}/>
                </span>
                <span className='App__editor jsx'>
                    <MonacoEditor {...{
                        language: 'jsx',
                        options: options,
                        value: jsx
                    }}/>
                </span>
           </div>
       );
    }
}

export default App;
