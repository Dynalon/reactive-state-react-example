import * as React from "react";

// This file is a 'dumb' or 'presentational' component with no dependencies except for React itself

export interface DogsProps {
    breedNames: string[];
    selectedBreed?: string;
    breedSampleImageUrl?: string;
    onGetNewSampleImage: (breedName: string) => void;
}

export interface DogsState {
    selectedBreed?: string;
}

export const Dogs: React.FC<DogsProps> = (props) => {
    const [selectedBreed, setSelectedBreed] = React.useState<string | undefined>();

    React.useEffect(() => {
        setSelectedBreed(props.selectedBreed);
    }, [props.selectedBreed]);

    React.useEffect(() => {
        if (selectedBreed) {
            props.onGetNewSampleImage(selectedBreed);
        }
    }, [selectedBreed]);

    return (
        <div>
            <h1>Dog Breeds</h1>

            <span className="container">
                Breed:{" "}
                <select value={props.selectedBreed} onChange={(ev) => setSelectedBreed(ev.target.value)}>
                    {props.breedNames.map((breed) => {
                        return (
                            <option key={breed} value={breed}>
                                {breed}
                            </option>
                        );
                    })}
                </select>
            </span>

            <span className="container">
                <a href="javascript:" onClick={setToRandomBreed}>
                    Random Breed
                </a>{" "}
                |&nbsp;
                <a href="javascript:" onClick={fetchNewRandomImage}>
                    New random Pic of {selectedBreed}
                </a>
            </span>

            <div className="container">
                {props.breedSampleImageUrl && <img src={props.breedSampleImageUrl} style={{ maxWidth: "400px" }} />}
            </div>

            <div className="container">
                Dog images & REST API powered by{" "}
                <a href="http://dog.ceo" target="new" rel="noopener">
                    Dog.ceo
                </a>
            </div>
        </div>
    );

    function fetchNewRandomImage() {
        props.onGetNewSampleImage(selectedBreed!);
    }

    function setToRandomBreed() {
        const newBreed = props.breedNames[Math.floor(Math.random() * props.breedNames.length)];
        setSelectedBreed(newBreed);
    }
};

Dogs.defaultProps = {
    breedNames: [],
    onGetNewSampleImage: () => undefined,
};
