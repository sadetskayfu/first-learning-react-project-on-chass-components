import { Component, useState } from 'react';
import Spinner from '../spinner/Spinner';
import MarvelService from '../../services/MarvelService';
import Error from '../error/Error'
import './charList.scss';
import PropTypes from 'prop-types'

class CharList extends Component {

    state = {
        charList: [],
        loading: true,
        error: false,
        loadChar: 219,
        moreLoading: false,
        endChar: false,
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.marvelService.getAllCharacters().then(this.onCharListLoaded).catch(this.onError)
    }

    onMoreLoadedChar = () => {
        const { loadChar, charList, moreLoading } = this.state
        this.setState({
            moreLoading: true,
        })
        this.marvelService.getAllCharacters(loadChar).then(res => {
            this.endChar(res)
            this.setState({
                loadChar: loadChar + 9,
                charList: [...charList, ...res],
                moreLoading: false,
            })
        }).catch(this.onError)
    }

    endChar = (res) => {
        if (res.length < 9) {
            this.setState({
                endChar: true,
            })
        }
    }

    onCharListLoaded = (charList) => {
        this.setState({
            charList,
            loading: false
        })
    }

    onError = () => {
        this.setState({
            error: true,
            loading: false
        })
    }

    renderItems(arr) {
        const items = arr.map((item) => {
            let imgStyle = { 'objectFit': 'cover' };
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = { 'objectFit': 'unset' };
            }

            return (
                <li
                    className="char__item"
                    onClick={() => { this.props.onSelectedChar(item.id) }}
                    key={item.id}>
                    <img src={item.thumbnail} alt={item.name} style={imgStyle} />
                    <div className="char__name">{item.name}</div>
                </li>
            )
        });

        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    render() {

        const { charList, loading, error, moreLoading, endChar } = this.state;

        const items = this.renderItems(charList);

        const errorMessage = error ? <Error /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = !(loading || error) ? items : null;
        
        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                {moreLoading ? <Spinner /> : <button
                    style={{ 'display': endChar ? 'none' : 'block' }}
                    className="button button__main button__long">
                    <div onClick={this.onMoreLoadedChar} className="inner">load more</div>
                </button>}
            </div>
        )
    }
}

CharList.propTypes = {
    onSelectedChar: PropTypes.func.isRequired
}

export default CharList;