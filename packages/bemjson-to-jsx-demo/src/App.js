import React, { Component } from 'react';
import MonacoEditor from 'react-monaco-editor';
import BemjsonToJSX from '../..';
import './App.css';

const defaultCode =
`({
    block: 'button',
    text: 'Hello world'
})`;
const defaultJSX = `<button text='Hello world' />`;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            jsx: undefined
        }

        this.onBemjsonChange = this.onBemjsonChange.bind(this);
    }
    onBemjsonChange(newValue, e) {
        try {
            // eslint-disable-next-line no-eval
            var bemjson = eval(newValue);
            var jsx = BemjsonToJSX().process(bemjson).JSX
            this.setState({jsx});
        } catch (err) {
            // eslint-disable-next-line no-empty
        }
    }
    render() {
        const options = {
             scrollBeyondLastLine: false
        };
        const jsx = this.state.jsx;
        return (
            <div className='App'>
                <span className='App__editor bemjson'>
                    <MonacoEditor {...{
                        language: 'javascript',
                        options: options,
                        onChange: this.onBemjsonChange,
                        defaultValue: defaultCode
                    }}/>
                </span>
                <span className='App__editor jsx'>
                    <MonacoEditor {...{
                        language: 'jsx',
                        options: options,
                        value: jsx,
                        defaultValue: defaultJSX
                    }}/>
                </span>
           </div>
       );
    }
}

export default App;
