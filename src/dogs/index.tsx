import * as React from "react"

import { Observable, Subscription, Subject, defer, AsyncSubject } from "rxjs"
import { switchMap, map, take, filter} from "rxjs/operators"

import { Store, Action, Reducer } from "reactive-state"
import { connect, ActionMap, MapStateToProps } from "reactive-state/react"

import { Dogs, DogsProps } from "./dogs"

// AppState for our container slice
interface DogsSlice {
    breedNames: string[]
    selectedBreed?: string
    breedSampleImageUrl?: string
}

// Use an observable as action to fetch a list of all available dog breeds
const fetchBreedNames = defer(() => fetch("https://dog.ceo/api/breeds/list")).pipe(
    switchMap(response => response.json()),
    map(body => body.message as string[]),
)

// use a Subject as Action that will trigger fetching an example image by a given breed name
const getSampleImage = new Subject<string>()

// the actual logic that will fetch the image
const fetchSampleImage = getSampleImage.pipe(
    switchMap(breedName => fetch(`https://dog.ceo/api/breed/${breedName}/images/random`)),
    switchMap(response => response.json()),
    map(body => body.message as string)
)


export default connect(Dogs, (store: Store<{ dogs: DogsSlice }>) => {

    // Note how we do not specifiy a cleanup state - this allows us to restore the breed & image when navigating away
    // TODO move slicing outside?
    const slice = store.createSlice("dogs", { breedNames: [] });

    const cleanup = new Subscription();
    cleanup.add(() => slice.destroy());

    // add reducers/action pairs - note that the string names are only for debugging purposes in devtools and
    // not required
    slice.addReducer(fetchBreedNames, (state, breedNames) => ({ ...state, breedNames }) , "FETCH_BREED_NAMES");
    slice.addReducer(fetchSampleImage, (state, imageUrl) => ({ ...state, breedSampleImageUrl: imageUrl }), "FETCH_SAMPLE_IMAGE")
    slice.addReducer(getSampleImage, (state, breedName) => ({ ...state, selectedBreed: breedName }), "SELECT_BREED_NAME")

    const mapStateToProps: MapStateToProps<Dogs> = () => {
        return slice.select().pipe(
            filter(state => state.breedNames.length > 0),
            map(state  => {
                return {
                    breedNames: state.breedNames,
                    selectedBreed: state.selectedBreed,
                    breedSampleImageUrl: state.breedSampleImageUrl
                }
            })
        );
    }

    const actionMap: ActionMap<Dogs> = {
        onGetNewSampleImage: getSampleImage
    }

    return {
        actionMap,
        cleanup,
        mapStateToProps,
    }
});

