import * as React from "react"

export interface DogsProps {
    breedNames: string[]
    selectedBreed?: string
    breedSampleImage?: string
    onGetNewSampleImage: (breedName: string) => void
}

export interface DogsState {
    selectedBreed?: string
}

export class Dogs extends React.Component<DogsProps, DogsState> {

    static defaultProps: DogsProps = {
        breedNames: [],
        onGetNewSampleImage: () => undefined,
    }

    state: DogsState = {}

    componentWillMount() {
        if (this.props.selectedBreed) {
            this.setBreed(this.props.selectedBreed)
        }
    }

    componentDidUpdate(prevProps: DogsProps) {
        if (prevProps.breedNames !== this.props.breedNames) {
            if (this.props.selectedBreed) {
                this.setBreed(this.props.selectedBreed)
            } else if (this.props.breedNames.length > 0) {
                this.onBreedSelected(this.props.breedNames[0])
            }
        }
    }

    render() {
        return (
            <div>
                <h1>Dog Breeds</h1>

                <span className="container">
                    Breed: <select value={this.props.selectedBreed} onChange={(ev) => this.onBreedSelected(ev.target.value)}>
                        {
                            this.props.breedNames.map((breed, index) => {
                                return <option key={index} value={breed}>{breed}</option>
                            })
                        }
                    </select>
                </span>

                <span className="container">
                    <a href="javascript:" onClick={this.setToRandomBreed}>
                        Random Breed
                    </a> |&nbsp;
                    <a href="javascript:" onClick={this.fetchNewRandomImage}>
                        New random Pic of {this.state.selectedBreed}
                    </a>
                </span>

                <div className="container">
                    {this.props.breedSampleImage &&
                        <img src={this.props.breedSampleImage} style={{ maxWidth: "400px" }} />
                    }
                </div>

                <div className="container">
                    Dog images & REST API powered by <a href="http://dog.ceo" target="new" rel="noopener">Dog.ceo</a>
                </div>
            </div>
        )
    }

    private fetchNewRandomImage = () => {
        this.props.onGetNewSampleImage(this.state.selectedBreed!)
    }

    private setBreed(selectedBreed: string, updateImage: boolean = false) {
        const callback = () => updateImage && this.fetchNewRandomImage();
        this.setState(prevState => ({ ...prevState, selectedBreed }), callback)
    }

    private onBreedSelected(breedName: string) {
        this.setBreed(breedName, true)
    }

    private setToRandomBreed = () => {
        const newBreed = this.props.breedNames[Math.floor(Math.random() * this.props.breedNames.length)]
        this.onBreedSelected(newBreed)
    }
}
