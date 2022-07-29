import Option from "../Option";

class OptionOccupancy extends Option {
    constructor(props) {
        super(props)

        this.config = {
            ...this.config,
        }

        this.props = {
            ...this.props,
            type: this.saveSafePropertyProps(props, 'type', ''),
            singular: this.saveSafePropertyProps(props, 'singular', ''),
            plural: this.saveSafePropertyProps(props, 'plural', ''),
        }

        this.state = {
            ...this.state,
            search: this.saveSafePropertyProps(props, 'search', []),
        }

        this.update = {
            callbacks: {
                ...this.update.callbacks,
                OptionOccupancy: this.updateOptionOccupancyState.bind(this)
            }
        }

        // console.log(this);
    }

    updateOptionOccupancyState(props) {
        // console.log('I HAVE TO UPDATED THE SEARCH OPTION OCCUPANCY');
        this.state.search = this.saveSafePropertyProps(props, 'search', [])
    }

}

export default OptionOccupancy