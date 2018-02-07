import React, {Component} from 'react';
import HeroCard from './HeroCard';
import SearchBar from './SearchBar'
import HeroFilters from './HeroFilters'

class Heroes extends Component {
    state = {
        heroesList: [],
        filteredAttributes: ['str', 'agi', 'int'],
        searchedTerm: '',
        selectOptions: [],
        chosenRole: ''
    };
    componentDidMount() {
        this.fetchData();
    };
    clickHandler = e => {
        const abbrAttr = e.target.value.substr(0, 3).toLowerCase();
        let filteredArray;
        if(!e.target.checked)
            filteredArray = this.state.filteredAttributes.filter(attr => attr !== abbrAttr);
        else
            filteredArray = this.state.filteredAttributes.concat(abbrAttr);
        this.setState(() => {
            return {
                filteredAttributes: filteredArray
            }
        })
    };
    searchBarChangeHandler = e => {
      let searchTerm = e.target.value.trim();
        if(searchTerm) {
            this.setState(() => {
                return {searchedTerm: searchTerm}
            })
        } if(!searchTerm) {
            this.setState(() => {
                return {searchedTerm: ''}
            })
        }
    };
    handleRoleChange = e => {
        const chosenRole = e.target.value;
        const roleFilterArray = this.state.heroesList.filter(hero => hero.roles.some(role => role === chosenRole));
        console.log(roleFilterArray)
    };
    fetchData = () => {
        const selectOptionsArray = [];
        const REQ_URL = `https://api.opendota.com`;
        const REQ_OPTIONS = {
            method: "GET",
            mode: "cors"
        };
        fetch(`${REQ_URL}/api/heroStats`, REQ_OPTIONS).then(res => res.json()).then(data => {
            this.setState((prevState, props) => {
                return {heroesList: data}
            });
            data.map(hero => hero.roles.map(role => {
                if (selectOptionsArray.indexOf(role) === -1) {
                    selectOptionsArray.push(role)
                }
            }));
            this.setState(() => {
                return {selectOptions: selectOptionsArray}
            });
            console.log(this.state.selectOptions)
        })
    };
    appendHeroList = () => {
        let searchTerm = this.state.searchedTerm.toLowerCase();
        return this.state.heroesList
            .map(hero => {
                if(this.state.filteredAttributes.indexOf(hero.primary_attr) > -1 && hero.localized_name.toLowerCase().indexOf(searchTerm) > -1) {
                    return (
                        <HeroCard
                            key = {hero.id}
                            id = {hero.id}
                            avatarURL = {`https://api.opendota.com${hero.img}`}
                            name = {hero.localized_name}
                            str = {hero.base_str}
                            agi = {hero.base_agi}
                            int = {hero.base_int}
                            mainAttr = {hero.primary_attr}
                        />
                    )
                }
            })
        };
    render() {
        const heroList = this.appendHeroList();
        return(
            <div id="heroesWrapper">
                <div id="heroFilter">
                    <form id="attributeSelectorWrapper">
                        <HeroFilters
                            clickHandler={this.clickHandler}
                            roles={this.state.selectOptions}
                            handleRoleChange={this.handleRoleChange}
                        />
                    </form>
                    <SearchBar searchBarChangeHandler={this.searchBarChangeHandler}/>
                </div>
                {heroList}
            </div>
        )
    }
}

export default Heroes;

