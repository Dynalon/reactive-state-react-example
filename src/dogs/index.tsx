import * as React from "react"

import {  Observable }  from "rxjs/Observable"
import { Subscription } from "rxjs/Subscription"
import { Subject } from "rxjs/Subject"

import {  Store, Action, Reducer } from "reactive-state"
import {  connect, ActionMap } from "reactive-state/react"

import {  Dogs, DogsProps as DogsComponentProps } from "./dogs"

export interface DogProps {
    store: Store<any>
}

// AppState for our container slice
interface DogsSlice {
    breedNames: string[]
    selectedBreed?: string
    breedSampleImageUrl?: string
}


const mapStateToProps = (state: DogsSlice) => {
    return {
        breedNames: state.breedNames,
        selectedBreed: state.selectedBreed,
        breedSampleImageUrl: state.breedSampleImageUrl
    }
}

const ConnectedDogs = connect(Dogs, {  mapStateToProps });

export default class extends React.Component<DogProps, {}> {

    store: Store<DogsSlice>
    actionMap: ActionMap<DogsComponentProps>

    componentWillMount() {

        // Note how we do not specifiy a cleanup state - this allows us to restore the breed & image when navigating away
        this.store = this.props.store.createSlice("dogs", { breedNames: [] });

        // Use an observable as action to fetch a list of all available dog breeds
        const fetchBreedNames = Observable.defer(() => fetch("http://dog.ceo/api/breeds/list"))
            .switchMap(response => response.json())
            .map(body => body.message as string[])

        // use a Subject as Action that will trigger fetching an example image by a given breed name
        const getSampleImage = new Subject<string>()

        // the actual logic that will fetch the image
        const fetchSampleImage = getSampleImage
            .switchMap(breedName => fetch(`http://dog.ceo/api/breed/${breedName}/images/random`))
            .switchMap(response => response.json())
            .map(body => body.message as string)

        // add reducers/action pairs - note that the string names are only for debugging purposes in devtools and
        // not required
        this.store.addReducer(fetchBreedNames, (state, breedNames) => ({ ...state, breedNames }), "FETCH_BREED_NAMES")
        this.store.addReducer(fetchSampleImage, (state, imageUrl) => ({ ...state, breedSampleImageUrl: imageUrl }), "FETCH_SAMPLE_IMAGE")
        this.store.addReducer(getSampleImage, (state, breedName) => {
            return ({ ...state, selectedBreed: breedName })
        }, "SELECT_BREED_NAME")

        // map the function callbacks from the dumb/presentational Dog component to our actions (just one in this case)
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
