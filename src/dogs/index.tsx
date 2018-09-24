import { Store } from "reactive-state";
import { ActionMap, connect } from "reactive-state/react";
import { defer, Subject } from "rxjs";
import { filter, map, switchMap } from "rxjs/operators";
import { Dogs } from "./dogs";

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

// use a Subject that will trigger fetching an example image by a given breed name
const getSampleImage = new Subject<string>();

// the actual logic that will fetch the image when the action is dispatched
const fetchSampleImage = getSampleImage.pipe(
    switchMap(breedName => fetch(`https://dog.ceo/api/breed/${breedName}/images/random`)),
    switchMap(response => response.json()),
    map(body => body.message as string)
)

export default connect(Dogs, (store: Store<{ dogs: DogsSlice }>) => {

    const slice = store.createSlice("dogs", { breedNames: [] });

    // add reducers/action pairs - note that the string names are only for debugging purposes in devtools and
    // not required
    slice.addReducer(fetchBreedNames, (state, breedNames) => ({ ...state, breedNames }), "FETCH_BREED_NAMES");
    slice.addReducer(fetchSampleImage, (state, imageUrl) => ({ ...state, breedSampleImageUrl: imageUrl }), "FETCH_SAMPLE_IMAGE")
    slice.addReducer(getSampleImage, (state, breedName) => ({ ...state, selectedBreed: breedName }), "SELECT_BREED_NAME")

    const props = slice.watch().pipe(
        filter(state => state.breedNames.length > 0),
        map(state => {
            return {
                breedNames: state.breedNames,
                selectedBreed: state.selectedBreed,
                breedSampleImageUrl: state.breedSampleImageUrl
            }
        })
    );

    const actionMap: ActionMap<Dogs> = {
        onGetNewSampleImage: getSampleImage
    }

    // the store we got as 1st argument is a clone and automatically destroyed when the
    // connected component gets unmounted. Upon destroy, all action/reducer pairs that we added inside
    // this function become inactive. This also applies to all child/slice stores created from the clone -
    // they will be destroyed, too, upon umount. To show the auto-destroy feature, we log to the console:
    slice.destroyed.subscribe(() => console.info("Dog slice got destroyed, all action/reducer pairs on this slice were removed"))

    return {
        actionMap,
        props,
    }
});

