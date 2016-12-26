import 'whatwg-fetch';
import React, { Component } from 'react';
import './App.css';

class Changeable extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            'editMode': false,
            'value': props.value
        };

        this.type = props.type;
        this.onChange = props.onChange;
        this.placeholder = <i className="glyphicon glyphicon-pencil"></i>;

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
        let element = null;

        if (this.state.editMode) {
            if (this.type === 'textarea') {
                element = (
                    <textarea className="form-control" onChange={this.handleChange} onBlur={this.done} value={this.state.value}></textarea>
                );
            } else {
                element = <input className="form-control" type={this.type} value={this.state.value} onChange={this.handleChange} onBlur={this.done} />
            }
            return (
                <span>
                {element}
                </span>
            );
        } else {
            let content = null;
            const value = "" + this.state.value;
            if (value.match(/^https?/)) {
                content = <a href={this.state.value} onClick={this.handleLinkClick}>{this.state.value}</a>;
            } else if (value.match(/^\s*$/)) {
                content = <i>{this.placeholder}</i>
            } else {
                content = this.state.value;
            }
            return (
                <span onClick={this.handleClick}>
                {content}
                </span>
            );
        }

    }
}

class Alternative extends Component {
    constructor(props) {
        super(props);
        
        this.props = props;

        this.state = {
            'name': props.data.name,
            'text': props.data.text,
            'price': props.data.price,
            'chosen': props.data.chosen,
        };

        this.id = props.data.id;

        this.set = this.set.bind(this);
        this.changeChosen = this.changeChosen.bind(this);
        this.changePrice = this.changePrice.bind(this);
        this.changeName = this.changeName.bind(this);
        this.changeText = this.changeText.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
    }

    set(field, value) {
        this.setState(state => {
            state[field] = value;            
            this.props.handleChange(this.id, state);
            return state;
        });
    }

    changeChosen(value) {
        this.set('chosen', !this.state.chosen);
    }

    changePrice(value) {
        this.set('price', value);
    }

    changeName(value) {
        this.set('name', value);
    }

    changeText(value) {
        this.set('text', value);
    }
    
    handleRemove() {
        this.props.handleRemove(this.id);
    }
    
    render() {
        return (
            <tr>
            <td className="col-xs-1"><input type="checkbox" value={this.state.chosen} onChange={this.changeChosen} checked={this.state.chosen} className="form-control" /></td>
            <td className="col-xs-2"><Changeable type="text" value={this.state.name} onChange={this.changeName} /></td>
            <td className="col-xs-1"><Changeable type="number" value={this.state.price} onChange={this.changePrice} /></td>
            <td className="col-xs-7"><Changeable type="textarea" value={this.state.text} onChange={this.changeText} /></td>
            <td className="col-xs-1"><button className="btn btn-default glyphicon glyphicon-trash form-control" onClick={this.handleRemove}></button></td>
            </tr>
        );
    }
}

class NewAlternative extends Component {
    constructor(props) {
        super(props);

        this.state = {
            'name': '',
            'text': '',
            'price': '',
            'chosen': false
        };

        this.props = props;
        this.placeholder = "Press to edit";

        this.handleSave = this.handleSave.bind(this);
        this.handleChosen = this.handleChosen.bind(this);
        this.handlePrice = this.handlePrice.bind(this);
        this.handleName = this.handleName.bind(this);
        this.handleText = this.handleText.bind(this);
        this.set = this.set.bind(this);
    }

    handleSave() {
        this.props.handleSave({
            'name': this.state.name,
            'text': this.state.text,
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

    handleName(name) {
        this.set('name', name);
    }
    
    handleText(text) {
        this.set('text', text);
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
            <td></td>
            <td><Changeable type="text"     value={this.state.name}  onChange={this.handleName}  placeholder={this.placeholder} /></td>
            <td><Changeable type="number"   value={this.state.price} onChange={this.handlePrice} placeholder={this.placeholder} /></td>
            <td><Changeable type="textarea" value={this.state.text}  onChange={this.handleText}  placeholder={this.placeholder} /></td>
            <td><button onClick={this.handleSave} className="btn btn-default">Lägg till</button></td>
            </tr>
        );
    }
}

class Thing extends Component {
    constructor(props) {
        super(props);

        this.state = {
            'name': props.data.name,
            'category': props.data.category,
            'alternatives': props.data.alternatives,
            'newKeyCounter': 0,
            'id': props.data.id
        };

        this.props = props;

        this.set = this.set.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleNewAlternative = this.handleNewAlternative.bind(this);
        this.sum = this.sum.bind(this);
        this.getNewKey = this.getNewKey.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
        this.handleName = this.handleName.bind(this);
        this.handleCategory = this.handleCategory.bind(this);
    }

    set(field, value) {
        this.setState(state => {
            state[field] = value;
            this.props.handleChange(state.id, state);
            return state;
        });
    }

    getNewKey() {
        return 'newKey' + this.state.newKeyCounter;
    }

    handleName(name) {
        this.set('name', name);
    }

    handleCategory(category) {
        this.set('category', category);
    }

    handleChange(alternativeId, changedAlternative) {
        this.set('alternatives', this.state.alternatives.map(alternative => {
            if (alternative.id === alternativeId) {
                alternative.name = changedAlternative.name;
                alternative.text = changedAlternative.text;
                alternative.chosen = changedAlternative.chosen;
                alternative.price = changedAlternative.price;
            }
            
            return alternative;
        }));
    }

    handleRemove(id) {
        this.setState(state => {
            state.alternatives = state.alternatives.filter(alternative => {
                return alternative.id !== id;
            });
            this.props.handleChange(state.id, state, true);
        });
    }

    handleNewAlternative(alternative) {
        this.setState(state => {
            alternative.id = "new" + state.newKeyCounter;
            state.alternatives.push(alternative);
            this.props.handleChange(state.id, state, true);
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

    render() {
        const alternativeElements =
        this.state.alternatives.map(
            alternative => 
            <Alternative key={alternative.id} data={alternative} handleChange={this.handleChange} handleRemove={this.handleRemove} />
        );

        const thead = (
                <thead>
            <tr>
            <th>Välj</th>
            <th>Vad</th>
            <th>Pris</th>
            <th>Text</th>
            <th>Ta bort</th>
            </tr>
            </thead>
        );
        
        const tbody = (
            <tbody>
            {alternativeElements}
            <NewAlternative key={this.getNewKey()} handleSave={this.handleNewAlternative} />
            </tbody>
        );

        const summation = (
            <tbody>
            <tr>
            <td colSpan="5">Summa: {this.sum()}</td>
            </tr>
            </tbody>
        );

        const table = (
            <table className="table table-striped">
            {thead}
            {tbody}
            {summation}
            </table>
        );
        
        
        return (
            <div>
            <h2><Changeable type="text" value={this.state.name} onChange={this.handleName} /></h2>
            <h3><Changeable type="text" value={this.state.category} onChange={this.handleCategory} /></h3>
            {table}
            </div>
        );
    }
}

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            things: []
        };

        this.latestEdit = undefined;
        this.timeoutid = undefined;

        this.totalSum = this.totalSum.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.eventuallySendToServer = this.eventuallySendToServer.bind(this);
        this.getData = this.getData.bind(this);
        
        this.getData();
    }

    getData() {
        fetch('http://localhost:3000/thing')
        .then(response => {
            return response.json();
        }).then(things => {
            this.setState(state => {
                state.things = things;
                return state;                    
            });
        });
    }

    saveThing(thing) {
        let thingId = thing.id;
        let url = "/thing/"+thingId;
        console.log("Posting to " + url);
        console.log(JSON.stringify(thing));
        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(thing)
        });
    }

    totalSum() {
        return this.state.things.map(thing => {
            return thing.alternatives
            .filter(alternative => alternative.chosen)
            .map(alternative => parseInt(alternative.price, 10))
            .map(price => (isNaN(price) ? 0 : price))
            .reduce((sumSoFar, price) => sumSoFar + price, 0);
        }).reduce((totalSum, currentSum) => totalSum + currentSum, 0);
    }

    eventuallySendToServer(thing, postNow) {
        if (typeof(postNow) === 'undefined') {
            postNow = false;
        }

        if (postNow === true) {
            this.saveThing(thing);
            this.latestEdit = undefined;
            this.timeoutid = undefined;
            return;
        }

        let now = Date.now();
        if (this.latestEdit === undefined) {
            this.latestEdit = now;
        }

        let diff = now - this.latestEdit;
        if (diff < 1000 && this.timeoutid === undefined) {
            this.timeoutid = window.setTimeout(this.eventuallySendToServer, 1000, thing);
        } else if (diff > 1000) {
            this.saveThing(thing);
            this.latestEdit = undefined;
            this.timeoutid = undefined;
        }
    }

    handleChange(thingId, newThing, postNow) {
        this.setState(state => {
            state.things = state.things.map(thing => {
                return (thing.id === thingId) ? newThing : thing;
            });

            return state;
        });
        this.eventuallySendToServer(newThing, postNow);
    }
    
    render() {
        let things = this.state.things.map(
            thing => <Thing key={thing.id} data={thing} handleChange={this.handleChange} />);
        
        return (
            <div className="col-md-8 col-xs-12 col-md-offset-2">
            {things}
            <div>Total summa: {this.totalSum()}</div>
            </div>
        );
    }
}

export default App;
