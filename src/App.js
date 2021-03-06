import React, { Component } from 'react';
import { Client } from 'boardgame.io/client';
import { getScore, getFinalScore, getNumSpecial, countResourceCards } from './utils';
import { CardDisplay } from './components/CardDisplay';
import { TokenDisplay } from './components/token.js';
import { MoveButton } from './components/MoveButton.js';
import { GameOver } from './components/GameOver.js';
import { Jaipur } from './game';
import { Validation } from './validation';
import './App.css';
import './components/styles.css';

class JaipurBoard extends Component {
  render() {
    let player = this.props.G.players[this.props.playerID];
    let opponent = this.props.G.players[1 - this.props.playerID]

    let marketTable = [];
    let handTable = [];
    let p1Hand = this.props.G.players[0].hand;
    let p2Hand = this.props.G.players[1].hand;
    let maxSize = p1Hand.length;
    if (p2Hand.length > maxSize) maxSize = p2Hand.length;
    else if (this.props.G.market.length > maxSize) maxSize = this.props.G.market.length;

    let marketCards = [];
    let market = [];
    for (let i = 0; i < this.props.G.market.length; i++) {
      if (this.props.G.market[i]) {
        marketCards.push(
          <CardDisplay
            card={this.props.G.market[i]}
            key={this.props.G.market[i].id}
            onClick={() => this.props.moves.toggleMarketCard(i)}
          />);
        market.push(this.props.G.market[i]);
      }
    }
    marketTable.push(<tr key="market">{marketCards}</tr>);

    let hand = this.props.G.players[this.props.playerID].hand;
    let handCards = [];
    for (let i = 0; i < hand.length; i++) {
      handCards.push(
        <CardDisplay
          card={hand[i]}
          key={hand[i].id}
          onClick={() => this.props.moves.toggleHandCard(i)}
        />);
    }
    handTable.push(<tr key="hand">{handCards}</tr>);

    let tokenCells = [];
    let resourceNames = ['red', 'gold', 'silver', 'pink', 'green', 'brown'];
    let bonusNames = ['threes', 'fours', 'fives'];
    for (let i = 0; i < resourceNames.length; i++) {
      let key = resourceNames[i];
      tokenCells.push(<TokenDisplay tokenType={key} tokenValues={this.props.G.resourceTokens[key]} />)
    }
    for (let i = 0; i < bonusNames.length; i++) {
      let key = bonusNames[i];
      tokenCells.push(<TokenDisplay tokenType={key} tokenValues={this.props.G.bonusTokens[key]} hidden={true} />)
    }
    let yourTurn = this.props.playerID === this.props.ctx.currentPlayer;
    let youStyle = {};
    let oppStyle = {};
    let cardStyle = {};
    if (yourTurn) {
      youStyle.fontWeight = 'bold';
      oppStyle.fontWeight = 'normal';
    } else {
      oppStyle.fontWeight = 'bold';
      youStyle.fontWeight = 'normal';
    }
    cardStyle.fontStyle = 'italic';

    return (
    <div class="boardDiv">
      <div class="tokenDiv">
        <h1>Tokens</h1>
        {tokenCells}

      </div>
      <div class="handDiv">
        <h1>Market</h1>
        <table id="market">
          <tbody>{marketTable}</tbody>
        </table>

        <h1>Hand</h1>
        <table id="hand">
          <tbody>{handTable}</tbody>
        </table>
        
        <MoveButton disabled={!Validation.isValidPurchase(hand) || !yourTurn} onClick={() => {this.props.moves.buyTokens(); this.props.events.endTurn();}} moveName='Buy Tokens' />
        <MoveButton disabled={!Validation.isValidSingle(hand, market) || !yourTurn} onClick={() => {this.props.moves.pickUpSingle(); this.props.events.endTurn();}} moveName='Pick Up Single' />
        <MoveButton disabled={!Validation.isValidMultiple(hand, market) || !yourTurn} onClick={() => {this.props.moves.pickUpMultiple(); this.props.events.endTurn();}} moveName='Pick Up Multiple' />
        <MoveButton disabled={!Validation.isValidSpecial(market) || !yourTurn} onClick={() => {this.props.moves.pickUpSpecial(); this.props.events.endTurn();}} moveName='Pick Up Special' />
      </div>

      <div class="scoreDiv">
        <p style={cardStyle}> {countResourceCards(opponent.hand)} Cards </p>
        <p style={oppStyle}> Opponent: {getScore(opponent)} </p>
        <div class="card">
          {this.props.G.deck.length}
        </div>
        <p style={youStyle}> You: {getScore(player)} </p>
        <p style={cardStyle}> {countResourceCards(player.hand)} Cards </p>
      </div>

      {this.props.ctx.gameover &&
        <GameOver
          onClick={() => this.props.moves.restart()}
          score={getFinalScore(player, opponent)}
          oppScore={getFinalScore(opponent, player)}
        />
      }
    </div>
    );
  }
}

const Application = Client({debug: false, game:Jaipur, board:JaipurBoard, multiplayer:true})
export default Application;
