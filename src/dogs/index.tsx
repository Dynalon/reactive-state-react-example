import * as React from "react"

import { Observable } from "rxjs/Observable"
import { Subscription } from "rxjs/Subscription"
import { Subject } from "rxjs/Subject"

import { Store, Action, Reducer } from "reactive-state"
import { connect, ActionMap } from "reactive-state/dist/react"

import { Dogs, DogsProps as DogsComponentProps } from "./dogs"

export interface DogProps {
    store: Store<any>
}

export interface DogState {
    secondsElapsed: number
}

// AppState for our container slice
interface DogsSlice {
    breedNames: string[]
    selectedBreed?: string
    breedSampleImage?: string
}


const mapStateToProps = (state: DogsSlice) => {
    return {
        breedNames: state.breedNames,
        selectedBreed: state.selectedBreed,
        breedSampleImage: state.breedSampleImage
    }
}

const ConnectedDogs = connect(Dogs, { mapStateToProps });

export default class extends React.Component<DogProps, {}> {

    store: Store<DogsSlice>
    actionMap: ActionMap<DogsComponentProps>

    componentWillMount() {

        // Note how we do not specifiy a cleanup state - this allows us to restore the breed & image when navigating away
        this.store = this.props.store.createSlice("dogs", { breedNames: [] });

        const fetchBreedNames = Observable.defer(() => fetch("http://dog.ceo/api/breeds/list"))
            .switchMap(response => response.json())
            .map(body => body.message as string[])

        const getSampleImage = new Subject<string>()

        const fetchSampleImage = getSampleImage
            .switchMap(breedName => fetch(`http://dog.ceo/api/breed/${breedName}/images/random`))
            .switchMap(response => response.json())
            .map(body => body.message as string)

        this.store.addReducer(fetchBreedNames, (state, breedNames) => ({ ...state, breedNames }))
        this.store.addReducer(fetchSampleImage, (state, imageUrl) => ({ ...state, breedSampleImage: imageUrl }))
        this.store.addReducer(getSampleImage, (state, breedName) => {
            return ({ ...state, selectedBreed: breedName })
        })

        this.actionMap = {
            onGetNewSampleImage: getSampleImage
        }
    }

    componentWillUnmount() {
        this.store.destroy()
    }

    render() {
        return (
            <ConnectedDogs store={this.store} actionMap={this.actionMap} />
        )
    }
}
