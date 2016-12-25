import React, { Component } from 'react';
import './App.css';

class ChangeableTd extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            'editMode': false,
            'value': props.value
        };

        this.type = props.type;
        this.onChange = props.onChange;

        this.handleClick = this.handleClick.bind(this);
        this.done = this.done.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleLinkClick = this.handleLinkClick.bind(this);
    }

    handleClick(event) {
        this.setState(state => {
            state.editMode = !state.editMode;
            return state;
        });
    }

    done() {
        this.setState(state => {
            state.editMode = false;
            return state;
        });
    }

    handleChange(event) {
        const value = event.target.value;
        this.setState(state => {
            state.value = value;
            this.onChange(value);
            return state;
        });
    }

    handleLinkClick(event) {
        event.preventDefault();
    }
    
    render() {

        if (this.state.editMode) {
            return (
                <td>
                <input type={this.type} value={this.state.value} onChange={this.handleChange} onBlur={this.done} />
                </td>
            );
        } else {
            let content = null;
            const value = "" + this.state.value;
            if (value.match(/^https?/)) {
                content = <a href={this.state.value} onClick={this.handleLinkClick}>{this.state.value}</a>;
            } else {
                content = this.state.value;
            }
            return (
                <td onClick={this.handleClick}>
                {content}
                </td>
            );
        }

    }
}

class Alternative extends Component {
    constructor(props) {
        super(props);
        
        this.props = props;

        this.state = {
            'url': props.url,
            'price': props.price,
            'chosen': props.chosen
        };

        this.set = this.set.bind(this);
        this.changeChosen = this.changeChosen.bind(this);
        this.changePrice = this.changePrice.bind(this);
        this.changeUrl = this.changeUrl.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
    }

    set(field, value) {
        this.setState(state => {
            state[field] = value;            
            this.props.handleChange(state.url, state);
            return state;
        });
    }

    changeChosen(value) {
        this.set('chosen', !this.state.chosen);
    }

    changePrice(value) {
        this.set('price', value);
    }

    changeUrl(value) {
        this.set('url', value);
    }

    handleRemove() {
        this.props.handleRemove(this.state.url);
    }
    
    render() {
        return (
            <tr>
            <td><input type="checkbox" value={this.state.chosen} onChange={this.changeChosen} /></td>
            <ChangeableTd type="number" value={this.state.price} onChange={this.changePrice} />
            <ChangeableTd type="text" value={this.state.url} onChange={this.changeUrl} />
            <td><a href="#" onClick={this.handleRemove}>X</a></td>
            </tr>
        );
    }
}

class NewAlternative extends Component {
    constructor(props) {
        super(props);

        this.state = {
            'url': '',
            'price': '',
            'chosen': false
        };

        this.props = props;

        this.handleSave = this.handleSave.bind(this);
        this.handleChosen = this.handleChosen.bind(this);
        this.handlePrice = this.handlePrice.bind(this);
        this.handleUrl = this.handleUrl.bind(this);
        this.set = this.set.bind(this);
    }

    handleSave() {
        this.props.handleSave({
            'url': this.state.url,
            'price': this.state.price,
            'chosen': this.state.chosen
        });
    }

    handleChosen(event) {
        const chosen = event.target.value;
        this.set('chosen', chosen);
    }

    handlePrice(price) {
        this.set('price', price);
    }

    handleUrl(url) {
        this.set('url', url);
    }

    set(field, value) {
        this.setState(state => {
            state[field] = value;
            return state;
        });
    }

    render() {
        return (
            <tr>
            <td><input type="checkbox" value={this.state.chosen} onChange={this.handleChosen} /></td>
            <ChangeableTd type="number" value={this.state.price} onChange={this.handlePrice} />
            <ChangeableTd type="text" value={this.state.url} onChange={this.handleUrl} />
            <td><button onClick={this.handleSave}>Lägg till</button></td>
            </tr>
        );
    }
}

class Thing extends Component {
    constructor(props) {
        super(props);

        this.state = {
            'name': props.name,
            'category': props.category,
            'alternatives': props.alternatives,
            'newKeyCounter': 0
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleNewAlternative = this.handleNewAlternative.bind(this);
        this.sum = this.sum.bind(this);
        this.save = this.save.bind(this);
        this.getNewKey = this.getNewKey.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
    }

    getNewKey() {
        return 'newKey' + this.state.newKeyCounter;
    }

    handleChange(url, changedAlternative) {
        this.setState(state => {
            state.alternatives = state.alternatives.map(alternative => {
                if (alternative.url === url) {
                    alternative.url = changedAlternative.url;
                    alternative.chosen = changedAlternative.chosen;
                    alternative.price = changedAlternative.price;
                }

                return alternative;
            });

            return state;
        });
    }

    handleRemove(url) {
        this.setState(state => {
            state.alternatives = state.alternatives.filter(function(alternative) {
                return alternative.url !== url;
            });
            return state;
        });
    }

    handleNewAlternative(alternative) {
        const a = alternative;
        this.setState(state => {
            state.alternatives.push(a);
            state.newKeyCounter++;
            return state;
        });
    }

    sum() {
        return this.state.alternatives
        .filter(alternative => alternative.chosen)
        .map(alternative => parseInt(alternative.price, 10))
        .map(price => (isNaN(price) ? 0 : price))
        .reduce((sumSoFar, price) => sumSoFar + price, 0);
    }        

    save() {
        console.log(JSON.stringify(this.state));
    }
    
    render() {
        const alternativeElements = this.state.alternatives.map((alternative) => 
            <Alternative key={alternative.url} url={alternative.url} price={alternative.price} chosen={alternative.chosen} handleChange={this.handleChange} handleRemove={this.handleRemove} />
        );
        
        return (
            <div>
            <h2>{this.state.name}</h2>
            <h3>{this.state.category}</h3>
            <table>
            <thead>
            <tr>
            <th>Välj</th>
            <th>Pris</th>
            <th>Länk</th>
            </tr>
            </thead>
            <tbody>
            {alternativeElements}
            <NewAlternative key={this.getNewKey()} handleSave={this.handleNewAlternative} />
            </tbody>
            <tbody>
            <tr>
            <td>&nbsp;</td>
            <td>Summa {this.sum()}</td>
            <td>&nbsp;</td>
            </tr>
            </tbody>
            </table>
            <button onClick={this.save}>Spara</button>
            </div>
        );
    }
}

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            alternatives: [
                {url: 'foo1', price: 1, chosen: false},
                {url: 'foo2', price: 2, chosen: false},
                {url: 'foo3', price: 3, chosen: false},
            ],
            value: "hej"
        };

    }

    render() {
        return (
            <div className="App">
            <table><tbody>
            <tr>
            </tr></tbody>
            </table>
            <Thing alternatives={this.state.alternatives} name="Lista1" category="cat" />
            </div>
        );
    }
}

export default App;
