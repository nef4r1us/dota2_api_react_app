import React, {Component} from 'react';
import CardFront from './CardFront'
import CardBack from './CardBack'

class HeroCard extends Component {
    state = {
        isCardFlipped: false,
        kdaStats: {}
    };
    handleClick = () =>  {
        const REQ_URL = `https://api.opendota.com`;
        const REQ_OPTIONS = {
            method: "GET",
            mode: "cors"
        };
        fetch(`${REQ_URL}/api/heroes/${this.props.id}/matches`, REQ_OPTIONS)
            .then(res => res.json())
            .then(heroMatches => {
                return heroMatches.map(match => ({kills: match.kills, deaths: match.deaths, assists: match.assists}))
                    .reduce((acc, val) => ({kills: acc.kills + val.kills, deaths: acc.deaths + val.deaths, assists: acc.assists + val.assists}))
            })
            .then(res => {
                this.setState((prevProps, props) => {
                    return {
                        isCardFlipped: !this.state.isCardFlipped,
                        kdaStats: {res}
                    }
                })
            })
    };
    render() {
        return (
            <div className='heroCard' onClick={this.handleClick}>
                    {
                        this.state.isCardFlipped ?
                            <CardBack
                                stats={this.state.kdaStats.res}
                            />
                            :
                            <CardFront
                                {...this.props}
                            />
                    }

                </div>
        );
    }
};

export default HeroCard;