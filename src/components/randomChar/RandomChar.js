import { Component } from 'react';

import MarvelService from '../../services/MarvelService';
import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';
import Spinner from '../spinner/Spinner';
import Error from '../error/Error';

class RandomChar extends Component {
    state = {
        char: {},
        loading: true,
        error: false,
    }

    marvelService = new MarvelService()

    componentDidMount(){
        this.updateChar()
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true,
        })
    }

    onCharLoaded = (char) => {
        this.setState({ char, loading: false })
    }

    updateChar = () => {
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000)
        this.marvelService.getCharacter(id).then(this.onCharLoaded).catch(this.onError)
    }

    onClickUpdateChar = () => {
        this.setState({loading:true,error:false})
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000)
        this.marvelService.getCharacter(id).then(this.onCharLoaded).catch(this.onError)
    }

    render() {
        const { char, char: { description }, loading, error } = this.state
        const limitDescription = (description = '') => {
            if (description.length > 200) {
                let str = description.slice(0, 197)
                str += '...'
                return str
            }
            return description
        }
        const str = limitDescription(description)
        const loadingSpinner = loading ? <Spinner /> : null
        const errorMessage = error ? <Error /> : null
        const content = !(loading || error) ? <RandomCharBlock char={char} str={str} /> : null

        return (
            <div className="randomchar">
                {loadingSpinner}
                {errorMessage}
                {content}
                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br />
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">
                        Or choose another one
                    </p>
                    <button className="button button__main">
                        <div onClick={this.onClickUpdateChar} className="inner">try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
                </div>
            </div>
        )
    }
}

const RandomCharBlock = ({ char, str }) => {
    const { name, homepage, wiki, thumbnail } = char
    return (
        <div className="randomchar__block">
            <img src={thumbnail} alt="Random character" className="randomchar__img" />
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {str == '' ? 'Информации об этом персонаже нету.' : str}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )
}
export default RandomChar;