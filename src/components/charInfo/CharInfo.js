import { Component } from 'react';
import PropTypes from 'prop-types'

import MarvelService from '../../services/MarvelService';
import Error from '../error/Error';
import Skeleton from '../skeleton/Skeleton';
import Spinner from '../spinner/Spinner';

import './charInfo.scss';


class CharInfo extends Component {
    state = {
        selectedChar: null,
        loading: false,
        error: false,
    }

    marvelService = new MarvelService();

    componentDidUpdate(prevProps) {
        if (this.props.charId !== prevProps.charId) {
            this.getChar()
        }
    }

    getChar = () => {
        const { charId } = this.props
        if (!charId) {
            return
        }
        this.setState({ loading: true })
        this.marvelService.getCharacter(charId).then(this.onCharLoaded).catch(this.onError)
        return
    }

    onCharLoaded = (selectedChar) => {
        this.setState({
            selectedChar,
            loading: false
        })
    }

    onError = () => {
        this.setState({
            error: true,
            loading: false
        })
    }

    render() {
        const { selectedChar, loading, error } = this.state

        const skeleton = loading || error || selectedChar ? null : <Skeleton />
        const errorMessage = error ? <Error /> : null
        const loadingSpinner = loading ? <Spinner /> : null
        const content = !(loading || error || !selectedChar) ? <VisChar selectedChar={selectedChar} /> : null

        return (
            <div className="char__info">
                {skeleton}
                {errorMessage}
                {loadingSpinner}
                {content}
            </div>
        )
    }
}

const VisChar = ({ selectedChar }) => {
    const { name, thumbnail, homepage, wiki, comics, description } = selectedChar

    let imgStyle = { 'objectFit': 'cover' };
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgStyle = { 'objectFit': 'unset' };
    }
    const renderComics = comics.map((item,i) => {
        // eslint-disable-next-line
        if (i >12) return
        return <li key={i} className="char__comics-item">
                    {item.name}
               </li>
    })

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt="abyss" style = {imgStyle}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length>0 ? null : 'Информации о комиксах нету'}
                {renderComics}
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    CharId: PropTypes.number
}

export default CharInfo;